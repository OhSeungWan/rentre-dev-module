/**
 * rentre-dev-module Installer
 * BMAD 확장 모듈 설치/제거/상태 확인 로직
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ora = require('ora');

const MODULE_NAME = 'rentre-dev';

/**
 * BMAD 설치 디렉토리 찾기
 * V6+ 설치는 _cfg/manifest.yaml 로 식별
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
  const configPath = path.join(__dirname, '..', 'module', '_module-installer', 'install-config.yaml');
  if (await fs.pathExists(configPath)) {
    const content = await fs.readFile(configPath, 'utf8');
    return yaml.load(content);
  }
  return null;
}

/**
 * 설정 프롬프트 생성
 */
async function promptConfig(installConfig) {
  if (!installConfig) return {};

  const questions = [];

  // single-select 필드들 처리
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
 * 모듈 설치
 */
async function install() {
  console.log(chalk.cyan.bold('\n🚀 rentre-dev 모듈 설치\n'));

  // 1. BMAD 설치 찾기
  const spinner = ora('BMAD 설치 확인 중...').start();
  const bmadInfo = await findBmadDir(process.cwd());

  if (!bmadInfo) {
    spinner.fail('BMAD 설치를 찾을 수 없습니다.');
    console.log(chalk.dim('\n먼저 BMAD Core를 설치하세요:'));
    console.log(chalk.green('  npx bmad-method install\n'));
    process.exit(1);
  }

  spinner.succeed(`BMAD 발견: ${chalk.bold(bmadInfo.path)}`);

  // 2. 이미 설치되어 있는지 확인
  const targetDir = path.join(bmadInfo.path, MODULE_NAME);
  if (await fs.pathExists(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: chalk.yellow('rentre-dev 모듈이 이미 설치되어 있습니다. 덮어쓰시겠습니까?'),
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('\n설치 취소됨\n'));
      return;
    }

    const removeSpinner = ora('기존 모듈 제거 중...').start();
    await fs.remove(targetDir);
    removeSpinner.succeed('기존 모듈 제거 완료');
  }

  // 3. 설정 수집
  const installConfig = await loadInstallConfig();
  const userConfig = await promptConfig(installConfig);

  // 4. 모듈 복사
  const copySpinner = ora('모듈 파일 복사 중...').start();
  const moduleSource = path.join(__dirname, '..', 'module');

  await copyWithPlaceholders(moduleSource, targetDir, bmadInfo.folderName, '{project-root}');
  copySpinner.succeed('모듈 파일 복사 완료');

  // 5. config.yaml 생성
  const configSpinner = ora('설정 파일 생성 중...').start();
  const moduleConfig = {
    code: MODULE_NAME,
    name: 'Rentre-Dev',
    version: '1.0.0',
    ...userConfig,
    // 정적 경로 설정
    data_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data`,
    tasks_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/tasks`,
    backlogs_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/backlogs`,
    reports_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/reports`,
    guides_path: `{project-root}/${bmadInfo.folderName}/${MODULE_NAME}/data/guides`,
  };

  await fs.writeFile(path.join(targetDir, 'config.yaml'), yaml.dump(moduleConfig, { lineWidth: -1 }), 'utf8');
  configSpinner.succeed('설정 파일 생성 완료');

  // 6. 데이터 디렉토리 생성
  const dataSpinner = ora('데이터 디렉토리 생성 중...').start();
  const dataDirs = ['data/tasks', 'data/backlogs', 'data/reports', 'data/guides'];
  for (const dir of dataDirs) {
    await fs.ensureDir(path.join(targetDir, dir));
  }
  dataSpinner.succeed('데이터 디렉토리 생성 완료');

  // 완료 메시지
  console.log(chalk.green.bold('\n✅ rentre-dev 모듈이 설치되었습니다!\n'));
  console.log(chalk.dim(`   경로: ${targetDir}`));
  console.log(chalk.dim(`   설정: ${path.join(targetDir, 'config.yaml')}\n`));

  console.log(chalk.cyan('사용 가능한 에이전트:'));
  console.log(chalk.dim('  - PM (Pilot): 백로그 관리 및 분해'));
  console.log(chalk.dim('  - Dev (Coder): 개발 작업 실행'));
  console.log(chalk.dim('  - QA (Inspector): 품질 검증'));
  console.log(chalk.dim('  - Navigator: 백로그 구조 분석\n'));

  console.log(chalk.cyan('주요 워크플로우:'));
  console.log(chalk.dim('  - prepare-backlog: 백로그 준비'));
  console.log(chalk.dim('  - decompose-backlog: 서브태스크 분해'));
  console.log(chalk.dim('  - dev-backlog: 개발 실행'));
  console.log(chalk.dim('  - quick-execute: 빠른 실행\n'));
}

/**
 * 모듈 제거
 */
async function uninstall() {
  console.log(chalk.cyan.bold('\n🗑️  rentre-dev 모듈 제거\n'));

  // BMAD 설치 찾기
  const bmadInfo = await findBmadDir(process.cwd());
  if (!bmadInfo) {
    console.log(chalk.red('❌ BMAD 설치를 찾을 수 없습니다.\n'));
    process.exit(1);
  }

  const targetDir = path.join(bmadInfo.path, MODULE_NAME);
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
  spinner.succeed('모듈 제거 완료');

  console.log(chalk.green('\n✅ rentre-dev 모듈이 제거되었습니다.\n'));
}

/**
 * 설치 상태 확인
 */
async function status() {
  console.log(chalk.cyan.bold('\n📊 rentre-dev 모듈 상태\n'));

  // BMAD 설치 찾기
  const bmadInfo = await findBmadDir(process.cwd());
  if (!bmadInfo) {
    console.log(chalk.red('❌ BMAD 설치를 찾을 수 없습니다.'));
    console.log(chalk.dim('   npx bmad-method install 로 먼저 설치하세요.\n'));
    return;
  }

  console.log(chalk.green('✓ BMAD 설치:'), bmadInfo.path);

  const targetDir = path.join(bmadInfo.path, MODULE_NAME);
  if (!(await fs.pathExists(targetDir))) {
    console.log(chalk.yellow('✗ rentre-dev:'), '설치되지 않음');
    console.log(chalk.dim('\n  설치하려면: npx github:oseung-wan/rentre-dev-module\n'));
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
    const agentCount = agents.filter((f) => f.endsWith('.agent.yaml')).length;
    console.log(chalk.dim(`\n에이전트: ${agentCount}개`));
  }

  // 워크플로우 확인
  const workflowsDir = path.join(targetDir, 'workflows');
  if (await fs.pathExists(workflowsDir)) {
    const workflows = await fs.readdir(workflowsDir);
    console.log(chalk.dim(`워크플로우: ${workflows.length}개`));
  }

  console.log('');
}

module.exports = { install, uninstall, status, findBmadDir };
