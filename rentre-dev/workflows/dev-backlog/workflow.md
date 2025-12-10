---
name: Dev Backlog
description: Dev 에이전트가 PM의 서브태스크를 실제 코드로 구현하는 워크플로우
author: Rentre-Dev
version: 1.0.0

# Configuration
config_source: '{project-root}/.bmad/rentre-dev/config.yaml'
installed_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'
module_path: '{project-root}/.bmad/rentre-dev'
data_path: '{module_path}/data/backlogs'

# Steps
steps:
  - step-01-init
  - step-02-select
  - step-03-context
  - step-04-implement
  - step-05-verify
  - step-06-complete

# MCP Tools
mcp_tools:
  optional: [figma-dev-mode-mcp-server, context7, playwright, serena]

# Features
features:
  sub_agent_mode: true
  vitest_testing: true
  parallel_execution: true

# Memory
memory:
  type: sidecar-file
  location: '{data_path}/{backlog_id}/session-state.yaml'
---

# Dev Backlog - 서브태스크 구현 워크플로우

**Goal:** PM 에이전트가 생성한 서브태스크를 실제 코드로 구현하고, 테스트를 작성하며, 진행상황을 추적합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 실용적인 풀스택 개발자 collaborating with a PM/개발자. This is a partnership, not a client-vendor relationship. You bring 코드 구현, 테스트 작성, 피그마 디자인 구현 전문성, while the user brings 도메인 지식과 비즈니스 컨텍스트. Work together as equals.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: 각 스텝은 독립적인 명령 파일로, 전체 워크플로우의 일부로서 정확히 따라야 함
- **Just-In-Time Loading**: 현재 스텝 파일만 메모리에 로드 - 미래 스텝은 지시받기 전까지 로드하지 않음
- **Sequential Enforcement**: 스텝 파일 내 순서는 반드시 지켜야 함, 건너뛰기나 최적화 금지
- **State Tracking**: session-state.yaml에 진행 상태 추적
- **Sidecar Persistence**: 세션 간 작업 이어가기 지원

### Step Processing Rules

1. **READ COMPLETELY**: 스텝 파일 전체를 먼저 읽은 후 행동
2. **FOLLOW SEQUENCE**: 번호순으로 실행, 일탈 금지
3. **WAIT FOR INPUT**: 메뉴가 표시되면 사용자 입력 대기
4. **CHECK CONTINUATION**: [C] 선택 시에만 다음 스텝으로 진행
5. **SAVE STATE**: 다음 스텝 로드 전 상태 저장
6. **LOAD NEXT**: 지시받으면 다음 스텝 파일을 로드하고 전체를 읽은 후 실행

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** 여러 스텝 파일을 동시에 로드하지 않음
- 📖 **ALWAYS** 스텝 파일 전체를 읽은 후 실행
- 🚫 **NEVER** 스텝을 건너뛰거나 순서를 최적화하지 않음
- 💾 **ALWAYS** 세션 상태 파일 업데이트
- 🎯 **ALWAYS** 스텝 파일의 정확한 지시사항을 따름
- ⏸️ **ALWAYS** 메뉴에서 멈추고 사용자 입력 대기
- 📋 **NEVER** 미래 스텝에서 할 일 목록을 미리 만들지 않음

---

## WORKFLOW OVERVIEW

```
Step 1: 초기화 → MCP 체크, 세션 로드
Step 2: 서브태스크 선택 → 작업할 태스크 선택 (Sub-agent 모드 옵션)
Step 3: 컨텍스트 준비 → 코드분석, Figma, API 문서 로드
Step 4: 구현 + 테스트 → 코드 작성 및 vitest 테스트
Step 5: 검증 → 테스트 실행, 체크리스트 확인
Step 6: 완료 → 상태 업데이트, 다음 태스크로
```

---

## KEY FEATURES

### Sub-agent 모드

Step 2에서 [S] 선택 시 여러 서브태스크를 병렬로 처리할 수 있습니다.

### MCP 통합

- **Figma MCP**: 디자인 스펙 참조
- **Serena**: 코드베이스 시맨틱 분석
- **Context-7**: API/라이브러리 문서
- **Playwright**: E2E 테스트

### 세션 지속성

Sidecar 파일로 진행상황이 저장되어 세션 간에 작업을 이어갈 수 있습니다.

---

## SESSION MANAGEMENT

컨텍스트 한계에 도달하기 전에 세션을 저장할 수 있습니다.

### 스텝 완료 시 (자동)

- **위치**: `{data_path}/{backlog_id}/session-state.yaml`
- **방식**: 각 스텝 완료 시 자동으로 `completed_subtasks`, `current_subtask` 업데이트
- **복원**: 다음 세션에서 Step 1 (init)이 자동으로 이전 상태 로드

### 스텝 중간 저장 (컨텍스트 보호)

컨텍스트가 부족해지거나 작업 중단 시:

#### 자동 경고

- **트리거**: 컨텍스트 사용량 90% 초과 시 (남은 용량 10% 미만)
- **표시**: Step 4 (구현) 진행 중 경고 메시지 + 선택지 제공
- **선택지**: `[S]` 세션 저장 후 종료 / `[I]` 무시하고 계속

#### 수동 저장

- **방법**: Step 4 메뉴에서 `[S] 세션 저장` 선택
- **저장 내용**:
  - `current_step`: 현재 실행 중인 스텝
  - `checkpoint`: 저장 시간, 이유, 남은 컨텍스트
  - `step_progress`: 완료된 체크리스트, 변경된 파일, 작성된 테스트

#### 복원

- **방법**: 다음 세션에서 워크플로우 실행 → Step 1에서 자동 감지
- **선택지**: `[R]` 저장 지점에서 이어서 작업 / `[N]` 처음부터 새로 시작
- **복원 시**: 저장된 스텝으로 직접 이동 (Step 2, 3 스킵 가능)

> ⚠️ **권장**: 긴 구현 작업 중 컨텍스트 경고가 표시되면 `[S]` 저장 실행

---

## INPUT REQUIREMENTS

- **필수**: 서브태스크 목록 (`data/backlogs/{backlog_id}/subtasks/`)
- **권장**: 코드 분석 결과 (`data/backlogs/{backlog_id}/code-analysis.md`)
- **선택**: Figma 디자인 (디자인 관련 태스크 시)

---

## OUTPUT

- 구현된 코드
- vitest 테스트 파일
- 업데이트된 서브태스크 상태
- 세션 상태 파일

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`, `auto_sync`

### 2. First Step Execution

Load, read the full file and then execute `{installed_path}/steps/step-01-init.md` to begin the workflow.
