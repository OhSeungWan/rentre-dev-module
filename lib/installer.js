/**
 * rentre-dev-module Installer
 * rentre-dev 모듈 설치/제거/상태 확인 로직
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ora = require('ora');

const MODULE_NAME = 'rentre-dev';
const DEFAULT_INSTALL_PATH = '.';

/**
 * 모듈 설치
 * @param {Object} options - 설치 옵션
 * @param {boolean} options.useDefaults - 기본값 사용 여부
 */
async function install(options = {}) {
  const { useDefaults = false } = options;
  console.log(chalk.cyan.bold('\n🚀 rentre-dev 모듈 설치\n'));

  // 1. 설치 경로 입력받기
  const projectRoot = process.cwd();

  let installPath = DEFAULT_INSTALL_PATH;
  if (!useDefaults) {
    const { inputPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputPath',
        message: 'rentre-dev 설치 경로를 입력하세요:',
        default: DEFAULT_INSTALL_PATH,
      },
    ]);
    installPath = inputPath.trim() || DEFAULT_INSTALL_PATH;
  }

  const targetDir = path.join(projectRoot, installPath, MODULE_NAME);

  // 2. 이미 설치되어 있는지 확인
  if (await fs.pathExists(targetDir)) {
    let overwrite = useDefaults;
    if (!useDefaults) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow('rentre-dev 폴더가 이미 존재합니다. 덮어쓰시겠습니까?'),
          default: false,
        },
      ]);
      overwrite = answer.overwrite;
    }

    if (!overwrite) {
      console.log(chalk.yellow('\n설치 취소됨\n'));
      return;
    }

    const removeSpinner = ora('기존 폴더 제거 중...').start();
    await fs.remove(targetDir);
    removeSpinner.succeed('기존 폴더 제거 완료');
  }

  // 3. 모듈 복사 (rentre-dev 폴더 전체)
  const copySpinner = ora('모듈 파일 복사 중...').start();
  const moduleSource = path.join(__dirname, '..', 'rentre-dev');

  // _module-installer 제외하고 전체 복사
  await fs.ensureDir(targetDir);
  const entries = await fs.readdir(moduleSource, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '_module-installer') continue;

    const srcPath = path.join(moduleSource, entry.name);
    const destPath = path.join(targetDir, entry.name);

    await fs.copy(srcPath, destPath);
  }

  copySpinner.succeed('모듈 파일 복사 완료');

  // 완료 메시지
  console.log(chalk.green.bold('\n✅ rentre-dev 모듈이 설치되었습니다!\n'));
  console.log(chalk.dim(`   모듈 경로: ${targetDir}\n`));
}

/**
 * 설치된 rentre-dev 모듈 찾기
 */
async function findInstalledModule(projectRoot) {
  // 가능한 위치들 확인
  const possiblePaths = [
    path.join(projectRoot, MODULE_NAME),
    path.join(projectRoot, '.bmad', MODULE_NAME),
    path.join(projectRoot, 'bmad', MODULE_NAME),
  ];

  for (const targetDir of possiblePaths) {
    if (await fs.pathExists(targetDir)) {
      const parentDir = path.dirname(targetDir);
      const relativePath = path.relative(projectRoot, parentDir);
      return { targetDir, parentDir: relativePath || '.' };
    }
  }

  // 루트 디렉토리에서 rentre-dev 직접 찾기
  try {
    const entries = await fs.readdir(projectRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const targetDir = path.join(projectRoot, entry.name, MODULE_NAME);
        if (await fs.pathExists(targetDir)) {
          return { targetDir, parentDir: entry.name };
        }
      }
    }
  } catch (error) {
    // Ignore
  }

  return null;
}

/**
 * 모듈 제거
 */
async function uninstall() {
  console.log(chalk.cyan.bold('\n🗑️  rentre-dev 모듈 제거\n'));

  const projectRoot = process.cwd();
  const installed = await findInstalledModule(projectRoot);

  if (!installed) {
    console.log(chalk.yellow('⚠️  rentre-dev 모듈이 설치되어 있지 않습니다.\n'));
    return;
  }

  const { targetDir } = installed;

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.red('정말로 rentre-dev 폴더를 제거하시겠습니까?'),
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

  const projectRoot = process.cwd();
  const installed = await findInstalledModule(projectRoot);

  if (!installed) {
    console.log(chalk.yellow('✗ rentre-dev:'), '설치되지 않음');
    console.log(chalk.dim('\n  설치하려면: npx rentre-dev install\n'));
    return;
  }

  const { targetDir, parentDir } = installed;
  console.log(chalk.green('✓ rentre-dev:'), targetDir);
  console.log(chalk.dim(`  설치 경로: ${parentDir}`));

  // module.yaml 읽기
  const moduleYamlPath = path.join(targetDir, 'module.yaml');
  if (await fs.pathExists(moduleYamlPath)) {
    try {
      const moduleConfig = yaml.load(await fs.readFile(moduleYamlPath, 'utf8'));
      if (moduleConfig) {
        console.log(chalk.dim(`\n모듈 정보:`));
        console.log(chalk.dim(`  - 이름: ${moduleConfig.name || MODULE_NAME}`));
        console.log(chalk.dim(`  - 버전: ${moduleConfig.version || 'N/A'}`));
      }
    } catch (error) {
      // Ignore parse errors
    }
  }

  // 에이전트 확인
  const agentsDir = path.join(targetDir, 'agents');
  if (await fs.pathExists(agentsDir)) {
    const agents = await fs.readdir(agentsDir);
    console.log(chalk.dim(`\n에이전트: ${agents.length}개`));
  }

  // 워크플로우 확인
  const workflowsDir = path.join(targetDir, 'workflows');
  if (await fs.pathExists(workflowsDir)) {
    const workflows = await fs.readdir(workflowsDir);
    console.log(chalk.dim(`워크플로우: ${workflows.length}개`));
  }

  // 템플릿 확인
  const templatesDir = path.join(targetDir, 'templates');
  if (await fs.pathExists(templatesDir)) {
    const templates = await fs.readdir(templatesDir);
    console.log(chalk.dim(`템플릿: ${templates.length}개`));
  }

  // 태스크 확인
  const tasksDir = path.join(targetDir, 'tasks');
  if (await fs.pathExists(tasksDir)) {
    const tasks = await fs.readdir(tasksDir);
    console.log(chalk.dim(`태스크: ${tasks.length}개`));
  }

  console.log('');
}

module.exports = { install, uninstall, status };
