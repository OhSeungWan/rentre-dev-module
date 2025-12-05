#!/usr/bin/env node

/**
 * rentre-dev-module CLI
 * BMAD 확장 모듈 설치 도구
 *
 * Usage:
 *   npx github:oseung-wan/rentre-dev-module [command]
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

function showHelp() {
  console.log(`
${chalk.cyan.bold('rentre-dev-module')} - BMAD 확장 모듈

${chalk.yellow('Usage:')}
  npx github:oseung-wan/rentre-dev-module [command]

${chalk.yellow('Commands:')}
  ${chalk.green('install')}     모듈 설치 (기본)
  ${chalk.green('uninstall')}   모듈 제거
  ${chalk.green('status')}      설치 상태 확인
  ${chalk.green('help')}        도움말 표시

${chalk.yellow('Examples:')}
  ${chalk.dim('# BMAD가 설치된 프로젝트에서 실행')}
  npx github:oseung-wan/rentre-dev-module

  ${chalk.dim('# 특정 버전 설치')}
  npx github:oseung-wan/rentre-dev-module#v1.0.0

${chalk.yellow('Requirements:')}
  - BMAD Core가 먼저 설치되어 있어야 합니다
  - npx bmad-method install 로 설치

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
        await install();
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
