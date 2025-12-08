/**
 * rentre-dev-module Installer
 * BMAD 확장 모듈 설치/제거/상태 확인 로직
 * - 에이전트 컴파일 (.agent.yaml → .md)
 * - Claude Code 명령 생성 (.claude/commands/bmad/rentre-dev/)
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ora = require('ora');

const MODULE_NAME = 'rentre-dev';

// ============================================================================
// AGENT COMPILER (from bmad-method compiler logic)
// ============================================================================

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  if (!text) return '';
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * Build frontmatter for agent
 */
function buildFrontmatter(metadata, agentName) {
  const nameFromFile = agentName.replaceAll('-', ' ');
  const description = metadata.title || 'BMAD Agent';

  return `---
name: "${nameFromFile}"
description: "${description}"
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

`;
}

/**
 * Build simple activation block
 */
function buildSimpleActivation(criticalActions = [], menuItems = []) {
  let activation = '<activation critical="MANDATORY">\n';
  let stepNum = 1;

  activation += `  <step n="${stepNum++}">Load persona from this current agent file (already in context)</step>\n`;
  activation += `  <step n="${stepNum++}">Load and read {project-root}/{bmad_folder}/rentre-dev/config.yaml to get {user_name}, {communication_language}</step>\n`;
  activation += `  <step n="${stepNum++}">Remember: user's name is {user_name}</step>\n`;

  for (const action of criticalActions) {
    activation += `  <step n="${stepNum++}">${action}</step>\n`;
  }

  activation += `  <step n="${stepNum++}">ALWAYS communicate in {communication_language}</step>\n`;
  activation += `  <step n="${stepNum++}">Show greeting using {user_name} from config, communicate in {communication_language}, then display numbered list of ALL menu items from menu section</step>\n`;
  activation += `  <step n="${stepNum++}">STOP and WAIT for user input - do NOT execute menu items automatically - accept number or cmd trigger or fuzzy command match</step>\n`;
  activation += `  <step n="${stepNum++}">On user input: Number → execute menu item[n] | Text → case-insensitive substring match | Multiple matches → ask user to clarify | No match → show "Not recognized"</step>\n`;

  const usedHandlers = new Set();
  for (const item of menuItems) {
    if (item.action) usedHandlers.add('action');
    if (item.workflow) usedHandlers.add('workflow');
    if (item.exec) usedHandlers.add('exec');
    if (item.tmpl) usedHandlers.add('tmpl');
    if (item.data) usedHandlers.add('data');
  }

  if (usedHandlers.size > 0) {
    activation += `  <step n="${stepNum++}">When executing a menu item: Check menu-handlers section below - extract any attributes from the selected menu item and follow the corresponding handler instructions</step>\n`;
    activation += `\n  <menu-handlers>\n    <handlers>\n`;

    if (usedHandlers.has('action')) {
      activation += `      <handler type="action">
        When menu item has: action="#id" → Find prompt with id="id" in current agent XML, execute its content
        When menu item has: action="text" → Execute the text directly as an inline instruction
      </handler>\n`;
    }

    if (usedHandlers.has('workflow')) {
      activation += `      <handler type="workflow">
        When menu item has: workflow="path/to/workflow.yaml"
        1. CRITICAL: Always LOAD {project-root}/{bmad_folder}/core/tasks/workflow.xml
        2. Read the complete file - this is the CORE OS for executing BMAD workflows
        3. Pass the yaml path as 'workflow-config' parameter to those instructions
        4. Execute workflow.xml instructions precisely following all steps
        5. Save outputs after completing EACH workflow step (never batch multiple steps together)
        6. If workflow.yaml path is "todo", inform user the workflow hasn't been implemented yet
      </handler>\n`;
    }

    if (usedHandlers.has('exec')) {
      activation += `      <handler type="exec">
        When menu item has: exec="command" → Execute the command directly
      </handler>\n`;
    }

    if (usedHandlers.has('tmpl')) {
      activation += `      <handler type="tmpl">
        When menu item has: tmpl="template-path" → Load and apply the template
      </handler>\n`;
    }

    if (usedHandlers.has('data')) {
      activation += `      <handler type="data">
        When menu item has: data="path/to/x.json|yaml|yml"
        Load the file, parse as JSON/YAML, make available as {data} to subsequent operations
      </handler>\n`;
    }

    activation += `    </handlers>\n  </menu-handlers>\n`;
  }

  activation += `
  <rules>
    - ALWAYS communicate in {communication_language} UNLESS contradicted by communication_style
    - Stay in character until exit selected
    - Menu triggers use asterisk (*) - NOT markdown, display exactly as shown
    - Number all lists, use letters for sub-options
    - Load files ONLY when executing menu items or a workflow or command requires it. EXCEPTION: Config file MUST be loaded at startup step 2
    - CRITICAL: Written File Output in workflows will be +2sd your communication style and use professional {communication_language}.
  </rules>
</activation>\n`;

  return activation;
}

/**
 * Build persona XML section
 */
function buildPersonaXml(persona) {
  if (!persona) return '';

  let xml = '  <persona>\n';

  if (persona.role) {
    const roleText = persona.role.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <role>${escapeXml(roleText)}</role>\n`;
  }

  if (persona.identity) {
    const identityText = persona.identity.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <identity>${escapeXml(identityText)}</identity>\n`;
  }

  if (persona.communication_style) {
    const styleText = persona.communication_style.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <communication_style>${escapeXml(styleText)}</communication_style>\n`;
  }

  if (persona.principles) {
    let principlesText;
    if (Array.isArray(persona.principles)) {
      principlesText = persona.principles.join(' ');
    } else {
      principlesText = persona.principles.trim().replaceAll(/\n+/g, ' ');
    }
    xml += `    <principles>${escapeXml(principlesText)}</principles>\n`;
  }

  xml += '  </persona>\n';

  return xml;
}

/**
 * Build prompts XML section
 */
function buildPromptsXml(prompts) {
  if (!prompts || prompts.length === 0) return '';

  let xml = '  <prompts>\n';

  for (const prompt of prompts) {
    xml += `    <prompt id="${prompt.id || ''}">\n`;
    xml += `      <content>\n`;
    xml += `${prompt.content || ''}\n`;
    xml += `      </content>\n`;
    xml += `    </prompt>\n`;
  }

  xml += '  </prompts>\n';

  return xml;
}

/**
 * Build menu XML section
 */
function buildMenuXml(menuItems) {
  let xml = '  <menu>\n';
  xml += `    <item cmd="*menu">[M] Redisplay Menu Options</item>\n`;

  if (menuItems && menuItems.length > 0) {
    for (const item of menuItems) {
      if (item.trigger) {
        let trigger = item.trigger || '';
        if (!trigger.startsWith('*')) {
          trigger = '*' + trigger;
        }

        const attrs = [`cmd="${trigger}"`];
        if (item.workflow) attrs.push(`workflow="${item.workflow}"`);
        if (item.exec) attrs.push(`exec="${item.exec}"`);
        if (item.tmpl) attrs.push(`tmpl="${item.tmpl}"`);
        if (item.data) attrs.push(`data="${item.data}"`);
        if (item.action) attrs.push(`action="${item.action}"`);

        xml += `    <item ${attrs.join(' ')}>${escapeXml(item.description || '')}</item>\n`;
      }
    }
  }

  xml += `    <item cmd="*dismiss">[D] Dismiss Agent</item>\n`;
  xml += '  </menu>\n';

  return xml;
}

/**
 * Compile agent YAML to MD format
 */
function compileAgentYaml(yamlContent, agentName) {
  const agentYaml = yaml.load(yamlContent);
  const agent = agentYaml.agent;
  const meta = agent.metadata;

  let xml = '';
  xml += buildFrontmatter(meta, agentName || meta.name || 'agent');
  xml += '```xml\n';

  const agentAttrs = [
    `id="${MODULE_NAME}/${agentName}"`,
    `name="${meta.name || ''}"`,
    `title="${meta.title || ''}"`,
    `icon="${meta.icon || '🤖'}"`,
  ];

  xml += `<agent ${agentAttrs.join(' ')}>\n`;
  xml += buildSimpleActivation(agent.critical_actions || [], agent.menu || []);
  xml += buildPersonaXml(agent.persona);

  if (agent.prompts && agent.prompts.length > 0) {
    xml += buildPromptsXml(agent.prompts);
  }

  xml += buildMenuXml(agent.menu || []);
  xml += '</agent>\n';
  xml += '```\n';

  return xml;
}

// ============================================================================
// CLAUDE CODE COMMAND GENERATORS
// ============================================================================

/**
 * Agent launcher template
 */
function getAgentLauncherTemplate(agentName, moduleName, bmadFolderName) {
  return `---
name: '${agentName}'
description: '${agentName} agent'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${bmadFolderName}/${moduleName}/agents/${agentName}.md
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. Execute ALL activation steps exactly as written in the agent file
4. Follow the agent's persona and menu system precisely
5. Stay in character throughout the session
</agent-activation>
`;
}

/**
 * Workflow command template
 */
function getWorkflowCommandTemplate(workflow, bmadFolderName) {
  return `---
description: '${workflow.description || workflow.name}'
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @${bmadFolderName}/core/tasks/workflow.xml
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @${workflow.path}
3. Pass the yaml path ${workflow.path} as 'workflow-config' parameter to the workflow.xml instructions
4. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
`;
}

/**
 * Task command template
 */
function getTaskCommandTemplate(task, bmadFolderName) {
  return `---
description: '${task.description || task.name}'
---

Load @${bmadFolderName}/${MODULE_NAME}/tasks/${task.name}.md and follow the instructions.
`;
}

// ============================================================================
// INSTALLATION LOGIC
// ============================================================================

/**
 * BMAD 설치 디렉토리 찾기
 */
async function findBmadDir(projectDir) {
  try {
    const entries = await fs.readdir(projectDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const manifestPath = path.join(projectDir, entry.name, '_cfg', 'manifest.yaml');
        if (await fs.pathExists(manifestPath)) {
          return {
            path: path.join(projectDir, entry.name),
            folderName: entry.name,
          };
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return null;
}

/**
 * install-config.yaml 파싱하여 프롬프트 생성
 */
async function loadInstallConfig() {
  const configPath = path.join(__dirname, '..', 'rentre-dev', '_module-installer', 'install-config.yaml');
  if (await fs.pathExists(configPath)) {
    const content = await fs.readFile(configPath, 'utf8');
    return yaml.load(content);
  }
  return null;
}

/**
 * 기본 설정값 추출
 */
function getDefaultConfig(installConfig) {
  if (!installConfig) return {};

  const config = {};
  const selectFields = [
    'notion_integration',
    'subtask_detail_level',
    'auto_sync',
    'default_save_location',
    'code_analysis_depth',
    'include_dependencies',
    'include_tests',
  ];

  for (const fieldName of selectFields) {
    const field = installConfig[fieldName];
    if (field && field.default) {
      config[fieldName] = field.default;
    }
  }

  return config;
}

/**
 * 설정 프롬프트 생성
 */
async function promptConfig(installConfig) {
  if (!installConfig) return {};

  const questions = [];
  const selectFields = [
    'notion_integration',
    'subtask_detail_level',
    'auto_sync',
    'default_save_location',
    'code_analysis_depth',
    'include_dependencies',
    'include_tests',
  ];

  for (const fieldName of selectFields) {
    const field = installConfig[fieldName];
    if (field && field['single-select']) {
      questions.push({
        type: 'list',
        name: fieldName,
        message: Array.isArray(field.prompt) ? field.prompt[0] : field.prompt,
        choices: field['single-select'].map((opt) => ({
          name: opt.label,
          value: opt.value,
        })),
        default: field.default,
      });
    }
  }

  if (questions.length === 0) {
    return {};
  }

  console.log(chalk.cyan('\n📋 모듈 설정\n'));
  return await inquirer.prompt(questions);
}

/**
 * 플레이스홀더 치환
 */
function replacePlaceholders(content, bmadFolderName, projectRoot) {
  let result = content;
  result = result.replace(/\{bmad_folder\}/g, bmadFolderName);
  result = result.replace(/\{project-root\}/g, projectRoot);
  return result;
}

/**
 * 디렉토리 복사 (플레이스홀더 치환 포함)
 */
async function copyWithPlaceholders(src, dest, bmadFolderName, projectRoot) {
  const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json', '.js', '.ts', '.html', '.css', '.sh'];

  await fs.ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // _module-installer 제외
    if (entry.name === '_module-installer') {
      continue;
    }

    if (entry.isDirectory()) {
      await copyWithPlaceholders(srcPath, destPath, bmadFolderName, projectRoot);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (textExtensions.includes(ext)) {
        try {
          let content = await fs.readFile(srcPath, 'utf8');
          content = replacePlaceholders(content, bmadFolderName, projectRoot);
          await fs.writeFile(destPath, content, 'utf8');
        } catch {
          await fs.copy(srcPath, destPath);
        }
      } else {
        await fs.copy(srcPath, destPath);
      }
    }
  }
}

/**
 * 에이전트 컴파일 및 복사
 */
async function compileAndCopyAgents(moduleSource, targetDir, bmadFolderName) {
  const agentsSource = path.join(moduleSource, 'agents');
  const agentsTarget = path.join(targetDir, 'agents');
  const compiledAgents = [];

  if (!(await fs.pathExists(agentsSource))) {
    return compiledAgents;
  }

  await fs.ensureDir(agentsTarget);
  const files = await fs.readdir(agentsSource);

  for (const file of files) {
    if (!file.endsWith('.agent.yaml')) continue;

    const srcPath = path.join(agentsSource, file);
    const agentName = file.replace('.agent.yaml', '');

    try {
      let yamlContent = await fs.readFile(srcPath, 'utf8');
      yamlContent = replacePlaceholders(yamlContent, bmadFolderName, '{project-root}');

      const compiledContent = compileAgentYaml(yamlContent, agentName);
      const destPath = path.join(agentsTarget, `${agentName}.md`);

      await fs.writeFile(destPath, compiledContent, 'utf8');
      compiledAgents.push({
        name: agentName,
        path: destPath,
      });
    } catch (error) {
      console.log(chalk.yellow(`  ⚠ 에이전트 컴파일 실패: ${file} - ${error.message}`));
    }
  }

  return compiledAgents;
}

/**
 * 워크플로우 정보 수집
 */
async function collectWorkflows(targetDir, bmadFolderName) {
  const workflowsDir = path.join(targetDir, 'workflows');
  const workflows = [];

  if (!(await fs.pathExists(workflowsDir))) {
    return workflows;
  }

  const entries = await fs.readdir(workflowsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const workflowDir = path.join(workflowsDir, entry.name);

    // workflow.yaml 또는 workflow.md 확인
    const yamlPath = path.join(workflowDir, 'workflow.yaml');
    const mdPath = path.join(workflowDir, 'workflow.md');

    let workflowConfig = null;
    let workflowPath = null;

    if (await fs.pathExists(yamlPath)) {
      try {
        const content = await fs.readFile(yamlPath, 'utf8');
        workflowConfig = yaml.load(content);
        workflowPath = `${bmadFolderName}/${MODULE_NAME}/workflows/${entry.name}/workflow.yaml`;
      } catch (error) {
        // Ignore parse errors
      }
    }

    // workflow.md가 있으면 path 오버라이드 (step-file architecture)
    if (await fs.pathExists(mdPath)) {
      workflowPath = `${bmadFolderName}/${MODULE_NAME}/workflows/${entry.name}/workflow.md`;

      if (!workflowConfig) {
        // workflow.md의 frontmatter에서 description 추출 시도
        try {
          const mdContent = await fs.readFile(mdPath, 'utf8');
          const frontmatterMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = yaml.load(frontmatterMatch[1]);
            workflowConfig = {
              name: entry.name,
              description: frontmatter.description || entry.name,
              standalone: true,
            };
          }
        } catch (error) {
          // Ignore
        }
      }
    }

    if (workflowConfig && (workflowConfig.standalone === true || workflowConfig.standalone === 'true')) {
      workflows.push({
        name: entry.name,
        description: workflowConfig.description || entry.name,
        path: workflowPath,
        standalone: true,
      });
    } else if (workflowPath) {
      // standalone이 명시되지 않았지만 workflow 파일이 있으면 추가
      workflows.push({
        name: entry.name,
        description: workflowConfig?.description || entry.name,
        path: workflowPath,
        standalone: workflowConfig?.standalone !== false,
      });
    }
  }

  return workflows;
}

/**
 * Task 정보 수집
 */
async function collectTasks(targetDir, bmadFolderName) {
  const tasksDir = path.join(targetDir, 'tasks');
  const tasks = [];

  if (!(await fs.pathExists(tasksDir))) {
    return tasks;
  }

  const files = await fs.readdir(tasksDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const taskName = file.replace('.md', '');

    // 파일에서 description 추출 시도
    let description = taskName;
    try {
      const content = await fs.readFile(path.join(tasksDir, file), 'utf8');
      const firstLine = content.split('\n').find((line) => line.startsWith('#'));
      if (firstLine) {
        description = firstLine.replace(/^#+\s*/, '').trim();
      }
    } catch (error) {
      // Ignore
    }

    tasks.push({
      name: taskName,
      description,
    });
  }

  return tasks;
}

/**
 * Claude Code 명령 생성
 */
async function generateClaudeCommands(projectDir, bmadFolderName, agents, workflows, tasks) {
  const commandsBaseDir = path.join(projectDir, '.claude', 'commands', 'bmad', MODULE_NAME);

  // 기존 명령 디렉토리 정리
  if (await fs.pathExists(commandsBaseDir)) {
    await fs.remove(commandsBaseDir);
  }

  // 1. Agent launchers
  const agentsCommandDir = path.join(commandsBaseDir, 'agents');
  await fs.ensureDir(agentsCommandDir);

  for (const agent of agents) {
    const launcherContent = getAgentLauncherTemplate(agent.name, MODULE_NAME, bmadFolderName);
    await fs.writeFile(path.join(agentsCommandDir, `${agent.name}.md`), launcherContent);
  }

  // 2. Workflow commands
  const workflowsCommandDir = path.join(commandsBaseDir, 'workflows');
  await fs.ensureDir(workflowsCommandDir);

  for (const workflow of workflows) {
    if (workflow.standalone !== false) {
      const commandContent = getWorkflowCommandTemplate(workflow, bmadFolderName);
      await fs.writeFile(path.join(workflowsCommandDir, `${workflow.name}.md`), commandContent);
    }
  }

  // 3. Task commands
  if (tasks.length > 0) {
    const tasksCommandDir = path.join(commandsBaseDir, 'tasks');
    await fs.ensureDir(tasksCommandDir);

    for (const task of tasks) {
      const commandContent = getTaskCommandTemplate(task, bmadFolderName);
      await fs.writeFile(path.join(tasksCommandDir, `${task.name}.md`), commandContent);
    }
  }

  return {
    agents: agents.length,
    workflows: workflows.filter((w) => w.standalone !== false).length,
    tasks: tasks.length,
  };
}

/**
 * 모듈 설치
 * @param {Object} options - 설치 옵션
 * @param {boolean} options.useDefaults - 기본값 사용 여부
 */
async function install(options = {}) {
  const { useDefaults = false } = options;
  console.log(chalk.cyan.bold('\n🚀 rentre-dev 모듈 설치\n'));

  // 1. 설치 경로 설정 (항상 프로젝트 루트에 설치)
  const spinner = ora('설치 환경 확인 중...').start();
  const installBasePath = process.cwd();
  const bmadFolderName = MODULE_NAME; // 'rentre-dev'
  spinner.succeed(`설치 경로: ${chalk.bold(path.join(installBasePath, MODULE_NAME))}`)

  // 2. 이미 설치되어 있는지 확인
  const targetDir = path.join(installBasePath, MODULE_NAME);
  if (await fs.pathExists(targetDir)) {
    let overwrite = useDefaults;
    if (!useDefaults) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow('rentre-dev 모듈이 이미 설치되어 있습니다. 덮어쓰시겠습니까?'),
          default: false,
        },
      ]);
      overwrite = answer.overwrite;
    }

    if (!overwrite) {
      console.log(chalk.yellow('\n설치 취소됨\n'));
      return;
    }

    const removeSpinner = ora('기존 모듈 제거 중...').start();
    await fs.remove(targetDir);

    // Claude commands도 제거
    const commandsDir = path.join(process.cwd(), '.claude', 'commands', 'bmad', MODULE_NAME);
    if (await fs.pathExists(commandsDir)) {
      await fs.remove(commandsDir);
    }

    removeSpinner.succeed('기존 모듈 제거 완료');
  }

  // 3. 설정 수집
  const installConfig = await loadInstallConfig();
  const userConfig = useDefaults ? getDefaultConfig(installConfig) : await promptConfig(installConfig);

  // 4. 모듈 복사 (agents 제외)
  const copySpinner = ora('모듈 파일 복사 중...').start();
  const moduleSource = path.join(__dirname, '..', 'rentre-dev');

  // agents 제외하고 복사
  await fs.ensureDir(targetDir);
  const entries = await fs.readdir(moduleSource, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '_module-installer' || entry.name === 'agents') continue;

    const srcPath = path.join(moduleSource, entry.name);
    const destPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyWithPlaceholders(srcPath, destPath, bmadInfo.folderName, '{project-root}');
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json'];

      if (textExtensions.includes(ext)) {
        let content = await fs.readFile(srcPath, 'utf8');
        content = replacePlaceholders(content, bmadInfo.folderName, '{project-root}');
        await fs.writeFile(destPath, content, 'utf8');
      } else {
        await fs.copy(srcPath, destPath);
      }
    }
  }

  copySpinner.succeed('모듈 파일 복사 완료');

  // 5. 에이전트 컴파일
  const compileSpinner = ora('에이전트 컴파일 중...').start();
  const compiledAgents = await compileAndCopyAgents(moduleSource, targetDir, bmadInfo.folderName);
  compileSpinner.succeed(`에이전트 컴파일 완료 (${compiledAgents.length}개)`);

  // 6. 워크플로우/Task 정보 수집
  const collectSpinner = ora('워크플로우 정보 수집 중...').start();
  const workflows = await collectWorkflows(targetDir, bmadInfo.folderName);
  const tasks = await collectTasks(targetDir, bmadInfo.folderName);
  collectSpinner.succeed(`워크플로우 ${workflows.length}개, Task ${tasks.length}개 발견`);

  // 7. Claude Code 명령 생성
  const claudeSpinner = ora('Claude Code 명령 생성 중...').start();
  const commandCounts = await generateClaudeCommands(process.cwd(), bmadInfo.folderName, compiledAgents, workflows, tasks);
  claudeSpinner.succeed(`Claude Code 명령 생성 완료`);

  // 8. config.yaml 생성
  const configSpinner = ora('설정 파일 생성 중...').start();
  const moduleConfig = {
    code: MODULE_NAME,
    name: 'Rentre-Dev',
    version: '1.0.0',
    ...userConfig,
    data_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data`,
    tasks_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/tasks`,
    backlogs_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/backlogs`,
    reports_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/reports`,
    guides_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/guides`,
  };

  await fs.writeFile(path.join(targetDir, 'config.yaml'), yaml.dump(moduleConfig, { lineWidth: -1 }), 'utf8');
  configSpinner.succeed('설정 파일 생성 완료');

  // 9. 데이터 디렉토리 생성
  const dataSpinner = ora('데이터 디렉토리 생성 중...').start();
  const dataDirs = ['data/tasks', 'data/backlogs', 'data/reports', 'data/guides'];
  for (const dir of dataDirs) {
    await fs.ensureDir(path.join(targetDir, dir));
  }
  dataSpinner.succeed('데이터 디렉토리 생성 완료');

  // 완료 메시지
  console.log(chalk.green.bold('\n✅ rentre-dev 모듈이 설치되었습니다!\n'));
  console.log(chalk.dim(`   모듈 경로: ${targetDir}`));
  console.log(chalk.dim(`   명령 경로: .claude/commands/bmad/${MODULE_NAME}/\n`));

  console.log(chalk.cyan('설치된 구성요소:'));
  console.log(chalk.dim(`  - 에이전트: ${commandCounts.agents}개`));
  console.log(chalk.dim(`  - 워크플로우 명령: ${commandCounts.workflows}개`));
  console.log(chalk.dim(`  - Task 명령: ${commandCounts.tasks}개\n`));

  console.log(chalk.cyan('사용 가능한 에이전트:'));
  for (const agent of compiledAgents) {
    console.log(chalk.dim(`  /bmad:${MODULE_NAME}:agents:${agent.name}`));
  }

  console.log(chalk.cyan('\n주요 워크플로우:'));
  for (const workflow of workflows.slice(0, 5)) {
    console.log(chalk.dim(`  /bmad:${MODULE_NAME}:workflows:${workflow.name}`));
  }
  if (workflows.length > 5) {
    console.log(chalk.dim(`  ... 외 ${workflows.length - 5}개 더\n`));
  } else {
    console.log('');
  }
}

/**
 * 모듈 제거
 */
async function uninstall() {
  console.log(chalk.cyan.bold('\n🗑️  rentre-dev 모듈 제거\n'));

  // 항상 프로젝트 루트에서 rentre-dev 폴더 찾기
  const targetDir = path.join(process.cwd(), MODULE_NAME);

  if (!(await fs.pathExists(targetDir))) {
    console.log(chalk.yellow('⚠️  rentre-dev 모듈이 설치되어 있지 않습니다.\n'));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.red('정말로 rentre-dev 모듈을 제거하시겠습니까? (데이터도 삭제됩니다)'),
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n제거 취소됨\n'));
    return;
  }

  const spinner = ora('모듈 제거 중...').start();
  await fs.remove(targetDir);

  // Claude commands도 제거
  const commandsDir = path.join(process.cwd(), '.claude', 'commands', 'bmad', MODULE_NAME);
  if (await fs.pathExists(commandsDir)) {
    await fs.remove(commandsDir);
  }

  spinner.succeed('모듈 제거 완료');

  console.log(chalk.green('\n✅ rentre-dev 모듈이 제거되었습니다.\n'));
}

/**
 * 설치 상태 확인
 */
async function status() {
  console.log(chalk.cyan.bold('\n📊 rentre-dev 모듈 상태\n'));

  // 항상 프로젝트 루트에서 rentre-dev 폴더 찾기
  const targetDir = path.join(process.cwd(), MODULE_NAME);

  if (!(await fs.pathExists(targetDir))) {
    console.log(chalk.yellow('✗ rentre-dev:'), '설치되지 않음');
    console.log(chalk.dim('\n  설치하려면: npx rentre-dev install\n'));
    return;
  }

  console.log(chalk.green('✓ rentre-dev:'), targetDir);

  // config.yaml 읽기
  const configPath = path.join(targetDir, 'config.yaml');
  if (await fs.pathExists(configPath)) {
    const config = yaml.load(await fs.readFile(configPath, 'utf8'));
    console.log(chalk.dim('\n설정:'));
    console.log(chalk.dim(`  - 노션 연동: ${config.notion_integration || 'auto'}`));
    console.log(chalk.dim(`  - 서브태스크 상세도: ${config.subtask_detail_level || 'standard'}`));
    console.log(chalk.dim(`  - 자동 동기화: ${config.auto_sync || 'enabled'}`));
  }

  // 에이전트 확인
  const agentsDir = path.join(targetDir, 'agents');
  if (await fs.pathExists(agentsDir)) {
    const agents = await fs.readdir(agentsDir);
    const agentCount = agents.filter((f) => f.endsWith('.md')).length;
    console.log(chalk.dim(`\n컴파일된 에이전트: ${agentCount}개`));
  }

  // 워크플로우 확인
  const workflowsDir = path.join(targetDir, 'workflows');
  if (await fs.pathExists(workflowsDir)) {
    const workflows = await fs.readdir(workflowsDir);
    console.log(chalk.dim(`워크플로우: ${workflows.length}개`));
  }

  // Claude commands 확인
  const commandsDir = path.join(process.cwd(), '.claude', 'commands', 'bmad', MODULE_NAME);
  if (await fs.pathExists(commandsDir)) {
    console.log(chalk.green('\n✓ Claude Code 명령:'), commandsDir);

    const agentCommands = path.join(commandsDir, 'agents');
    const workflowCommands = path.join(commandsDir, 'workflows');
    const taskCommands = path.join(commandsDir, 'tasks');

    if (await fs.pathExists(agentCommands)) {
      const files = await fs.readdir(agentCommands);
      console.log(chalk.dim(`  - 에이전트 런처: ${files.length}개`));
    }

    if (await fs.pathExists(workflowCommands)) {
      const files = await fs.readdir(workflowCommands);
      console.log(chalk.dim(`  - 워크플로우 명령: ${files.length}개`));
    }

    if (await fs.pathExists(taskCommands)) {
      const files = await fs.readdir(taskCommands);
      console.log(chalk.dim(`  - Task 명령: ${files.length}개`));
    }
  } else {
    console.log(chalk.yellow('\n⚠ Claude Code 명령이 생성되지 않았습니다.'));
    console.log(chalk.dim('  재설치를 권장합니다: npx rentre-dev install'));
  }

  console.log('');
}

module.exports = { install, uninstall, status, findBmadDir };
