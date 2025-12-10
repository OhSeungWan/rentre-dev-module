---
name: 'step-01b-continue'
description: '이전 세션에서 중단된 워크플로우 재개'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
data_path: '{module_path}/data'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Routing Step Files
step02File: '{workflow_path}/steps/step-02-context-analysis.md'
step02bFile: '{workflow_path}/steps/step-02b-block-parsing.md'
step03File: '{workflow_path}/steps/step-03-requirements.md'
step04File: '{workflow_path}/steps/step-04-additional-context.md'
step05File: '{workflow_path}/steps/step-05-context-verify.md'
step06File: '{workflow_path}/steps/step-06-save.md'
step07File: '{workflow_path}/steps/step-07-complete.md'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 1b: 워크플로우 재개

**Progress: Continuation** - Resuming from previous session

## STEP GOAL:

이전 세션에서 중단된 워크플로우를 재개합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분석 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 분석 전문성, user brings 도메인 지식, and together we produce something better

### Step-Specific Rules:

- 📖 CRITICAL: 이전 세션의 컨텍스트를 완전히 복원
- 🔄 CRITICAL: 마지막으로 완료된 스텝부터 재개
- ✅ ALWAYS 사용자에게 현재 상태 명확히 표시

## YOUR TASK:

이전 세션에서 중단된 워크플로우를 재개합니다.

---

## CONTINUATION SEQUENCE:

### 1. 상태 복원

**prepare.yaml에서 진행 상태 및 중간 결과물 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - stepsCompleted          # 완료된 스텝 목록
  - step_01                 # Step 1 결과 (backlog_id, title, type, raw_blocks)
  - step_02 (if exists)     # Step 2 결과 (hierarchy)
  - step_02b (if exists)    # Step 2b 결과 (content_blocks)
  - step_03 (if exists)     # Step 3 결과 (requirements, acceptance_criteria)
  - step_04 (if exists)     # Step 4 결과 (figma, references, unclear_items)
  - step_05 (if exists)     # Step 5 결과 (context_score, can_decompose)
```

**CRITICAL:** prepare.yaml의 모든 중간 결과물을 메모리에 복원하여 컨텍스트 연속성 보장

### 2. 진행 상태 표시

사용자에게 현재 상태 보고:

> "**기존 워크플로우 발견!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **백로그:** {backlog_type} - {backlog_title}
> **완료된 스텝:** {stepsCompleted}
> **마지막 업데이트:** {last_updated}
> **진행 파일:** `{prepare_file}`
>
> **복원된 데이터:**
> - Step 1: ✅ 기본 정보 (raw_blocks: {raw_blocks_count}개)
> - Step 2: {step_02_status} 계층 분석
> - Step 2b: {step_02b_status} 블록 파싱
> - Step 3: {step_03_status} 요구사항 구조화
> - Step 4: {step_04_status} 추가 컨텍스트
> - Step 5: {step_05_status} 컨텍스트 검증
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 3. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [R] Restart [V] View [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Route to appropriate step based on `stepsCompleted` (see ROUTING below)
- IF R: Load {step01File} to restart from beginning
- IF V: Display current collected information summary
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#3-present-menu-options)

---

## ROUTING:

Based on `stepsCompleted` array in prepare.yaml, route to appropriate step:

| Last Completed          | Next Step File  |
| ----------------------- | --------------- |
| [1]                     | {step02File}    |
| [1, 2]                  | {step02bFile}   |
| [1, 2, 2b]              | {step03File}    |
| [1, 2, 2b, 3]           | {step04File}    |
| [1, 2, 2b, 3, 4]        | {step05File}    |
| [1, 2, 2b, 3, 4, 5]     | {step06File}    |
| [1, 2, 2b, 3, 4, 5, 6]  | {step07File}    |

**CRITICAL:** 라우팅 전 prepare.yaml의 해당 스텝까지의 모든 데이터가 메모리에 로드되어야 함

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected, will you then load, read entire file, then execute the appropriate step file based on ROUTING table.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 이전 상태 완전히 복원
- 사용자에게 현재 상태 명확히 표시
- 올바른 스텝으로 라우팅

### ❌ SYSTEM FAILURE:

- 상태 복원 없이 진행
- 잘못된 스텝으로 라우팅
- 사용자 확인 없이 자동 재개

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
