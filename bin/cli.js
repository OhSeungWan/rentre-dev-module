#!/usr/bin/env node

/**
 * rentre-dev CLI
 * 개발 워크플로우 자동화 모듈 설치 도구
 *
 * Usage:
 *   npx rentre-dev [command]
 *
 * Commands:
 *   install     모듈 설치 (기본)
 *   uninstall   모듈 제거
 *   status      설치 상태 확인
 *   help        도움말 표시
 */

const chalk = require('chalk');
const { install, uninstall, status } = require('../lib/installer');

const command = process.argv[2] || 'install';
const useDefaults = process.argv.includes('--yes') || process.argv.includes('-y') || process.argv.includes('--default');

function showHelp() {
  console.log(`
${chalk.cyan.bold('rentre-dev')} - 개발 워크플로우 자동화 모듈

${chalk.yellow('Usage:')}
  npx rentre-dev [command]

${chalk.yellow('Commands:')}
  ${chalk.green('install')}     모듈 설치 (기본)
  ${chalk.green('uninstall')}   모듈 제거
  ${chalk.green('status')}      설치 상태 확인
  ${chalk.green('help')}        도움말 표시

${chalk.yellow('Examples:')}
  ${chalk.dim('# 프로젝트에 rentre-dev 설치')}
  npx rentre-dev install

  ${chalk.dim('# 기본값으로 설치 (프롬프트 생략)')}
  npx rentre-dev install --yes

${chalk.yellow('Installation:')}
  - 항상 프로젝트 루트의 rentre-dev/ 에 설치

${chalk.yellow('Features:')}
  - 4 Agents: PM, Dev, QA, Navigator
  - 10+ Workflows: prepare-backlog, decompose-backlog, dev-backlog 등
  - Block-based Traceability System
  - 노션 연동 지원
`);
}

async function main() {
  try {
    switch (command) {
      case 'install':
        await install({ useDefaults });
        break;
      case 'uninstall':
        await uninstall();
        break;
      case 'status':
        await status();
        break;
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
      default:
        console.log(chalk.red(`Unknown command: ${command}`));
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
