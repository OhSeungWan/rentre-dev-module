---
name: Correct Course
description: 백로그 진행 중 발생하는 변경사항, 방향 수정, 범위 조정 등을 체계적으로 관리
author: Rentre-Dev
version: 1.0.0
web_bundle: true

# Configuration
config_source: '{project-root}/.bmad/rentre-dev/config.yaml'
installed_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'
module_path: '{project-root}/.bmad/rentre-dev'
data_path: '{module_path}/data/backlogs'

# Steps
steps:
  - step-01-init
  - step-02-identify-change
  - step-03-load-context
  - step-04-analyze-impact
  - step-05-apply-changes
  - step-06-complete

# Change Types
change_types:
  - requirement_change: 요구사항 변경
  - subtask_add: 서브태스크 추가
  - subtask_modify: 서브태스크 수정
  - scope_change: 범위 변경
  - risk_identified: 리스크 식별
  - priority_change: 우선순위 변경

# MCP Tools
mcp_tools:
  optional: [serena, context7, playwright, notionApi]

# Features
features:
  change_history_tracking: true
  block_traceability: true
  notion_sync: conditional
---

# Correct Course Workflow

**Goal:** 백로그 진행 중 발생하는 변경사항을 체계적으로 분석하고 적용하여 추적 가능한 변경 이력을 유지합니다.

**Your Role:** 변경 관리 전문가로서 사용자와 협력하여 변경사항의 영향을 분석하고, Block Traceability System과 연동하여 일관성 있는 변경을 적용합니다.

---

## WORKFLOW ARCHITECTURE

이 워크플로우는 **step-file architecture**를 사용합니다:

### Core Principles

- **Micro-file Design**: 각 스텝은 독립적인 지시 파일
- **Just-In-Time Loading**: 현재 스텝 파일만 메모리에 로드
- **Sequential Enforcement**: 순서대로 실행, 스킵 금지
- **State Tracking**: change-history.yaml에 변경 이력 기록
- **Block Traceability**: BLK-XXX, REQ-XXX 참조 유지

### Step Processing Rules

1. **READ COMPLETELY**: 전체 스텝 파일을 읽은 후 실행
2. **FOLLOW SEQUENCE**: 번호 순서대로 실행
3. **WAIT FOR INPUT**: 메뉴 표시 후 사용자 입력 대기
4. **SAVE STATE**: 다음 스텝 전 상태 저장
5. **LOAD NEXT**: 지시에 따라 다음 스텝 파일 로드

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** 여러 스텝 파일 동시 로드
- 📖 **ALWAYS** 실행 전 전체 파일 읽기
- 🚫 **NEVER** 스텝 스킵 또는 최적화
- 💾 **ALWAYS** 변경 시 change-history.yaml 업데이트
- 🔗 **ALWAYS** Block ID 참조 유지 (BLK-XXX, REQ-XXX)

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from {config_source}:

- `user_name`, `communication_language`, `notion_integration`
- `data_path` for backlog data location

### 2. First Step Execution

Load, read the full file and then execute `{installed_path}/steps/step-01-init.md` to begin the workflow.
