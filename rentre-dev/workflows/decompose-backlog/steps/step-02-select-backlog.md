---
name: 'step-02-select-backlog'
description: '백로그 선택 및 준비 상태 확인 + decompose.yaml 생성'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-02-select-backlog.md'
nextStepFile: '{workflow_path}/steps/step-03-code-analysis.md'
previousStepFile: '{workflow_path}/steps/step-01-load-guides.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State (backlog_id 결정 후 설정)
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'

# Workflow References
prepare_backlog_workflow: '{module_path}/workflows/prepare-backlog/workflow.yaml'
---

# Step 2: 백로그 선택 및 준비 상태 확인

**Progress: Step 2 of 8** - Next: 코드베이스 분석 (선택적)

## STEP GOAL:

분해할 백로그를 선택하고, 준비 상태를 확인합니다. 준비되지 않은 백로그는 prepare-backlog 워크플로우를 먼저 실행합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 백로그 준비 상태 분석 전문성, user brings 백로그 선택 및 컨텍스트
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 백로그 선택 및 준비 상태 확인
- 🚫 FORBIDDEN to 준비되지 않은 백로그로 분해 진행
- 💬 Approach: 백로그 준비 상태 확인 후 분해 진행
- 📋 Invoke prepare-backlog if backlog is not ready

## EXECUTION PROTOCOLS:

- 🎯 백로그 선택 방식 안내
- 💾 백로그 준비 상태 확인 (requirements, acceptance_criteria)
- 📖 필요 시 prepare-backlog 워크플로우 호출
- 🚫 FORBIDDEN 요구사항/수용기준 없이 진행

## CONTEXT BOUNDARIES:

- Available context: 계층 구조 다이어그램, 분해 경로 목록
- Focus: 백로그 선택 및 준비 상태 확인
- Limits: 분해 작업은 다음 스텝에서 수행
- Dependencies: 가이드 파일 로드 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. 백로그 입력 방식 안내

사용자에게 질문:

> "**분해할 백로그를 선택해 주세요:**
>
> **입력 방식:**
>
> 1. 이미 준비된 백로그 폴더 경로 (예: `data/backlogs/12345`)
> 2. 새 백로그 입력 (prepare-backlog 자동 호출)
> 3. 노션에서 백로그 검색"

**Wait for user response.**

### 2. 입력 처리

#### Option 1 - 준비된 백로그 폴더

```yaml
action:
  - 백로그 폴더에서 backlog-info.yaml 로드
  - 🆕 스키마 버전 확인 (schema_version: "2.0" 필요)
  - 준비된 데이터 확인:
    - backlog_id, title, type
    - 🆕 content_blocks (BLK-XXX) - 원본 블록들
    - requirements (REQ-XXX) with source_blocks
    - acceptance_criteria (AC-XXX) with source_blocks
    - context (figma, references)

check: backlog-info.yaml not found OR incomplete OR schema_version != "2.0"
  - Inform: "백로그가 준비되지 않았거나 v2.0 스키마가 아닙니다. prepare-backlog를 먼저 실행합니다."
  - invoke-workflow: {prepare_backlog_workflow}
    params:
      backlog_source: folder
      skip_save: true
```

#### Option 2 - 새 백로그

```yaml
action:
  - prepare-backlog 워크플로우 호출하여 백로그 준비
  - invoke-workflow: { prepare_backlog_workflow }
    params:
      backlog_source: direct_input

result:
  - 반환된 결과 저장:
      - backlog_id, backlog_info
      - requirements, acceptance_criteria
      - context_notes, backlog_folder
```

#### Option 3 - 노션 검색

```yaml
action:
  - invoke-workflow: { prepare_backlog_workflow }
    params:
      backlog_source: search
```

### 3. 준비된 백로그 정보 표시

사용자에게 보고:

> "**분해할 백로그 준비 완료 (v2.0 스키마)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **{backlog_type}: {backlog_title}**
>
> **🆕 컨텐츠 블록:** {block_count}개
>
> | ID      | 타입        | 내용 미리보기    |
> | ------- | ----------- | ---------------- |
> | BLK-001 | instruction | 구조화 데이터... |
> | BLK-002 | constraint  | 새롭게 추가...   |
> | ...     | ...         | ...              |
>
> **요구사항:** {req_count}개 (블록 참조 포함)
>
> | ID      | 요약      | 출처 블록        |
> | ------- | --------- | ---------------- |
> | REQ-001 | {summary} | BLK-001, BLK-002 |
> | ...     | ...       | ...              |
>
> **수용 기준:** {ac_count}개
>
> | ID     | 요약      | 출처 블록 |
> | ------ | --------- | --------- |
> | AC-001 | {summary} | BLK-004   |
> | ...    | ...       | ...       |
>
> **피그마:** {figma_status}
> **상위 백로그:** {parent_summary}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 4. decompose.yaml 생성/업데이트 (CRITICAL - 컨텍스트 유실 방지)

백로그 선택 완료 후, `{decompose_state_file}` 생성 또는 업데이트:

```yaml
# {decompose_state_file} 생성
---
backlog_id: "{backlog_id}"
stepsCompleted: [1, 2]
created_at: "{timestamp}"
updated_at: "{timestamp}"

# Step 1 결과: 가이드 로드 (step-01에서 수집)
guides:
  hierarchy_loaded: true
  hierarchy_path: "{guides_folder}/hierarchy-map.md"
  summary_path: "{guides_folder}/backlog-guide-summary.md"
  available_decompose_paths:
    - Epic → Story
    - Story → Task, Bug
    - Task → Subtask

# Step 2 결과: 백로그 선택
selected_backlog:
  id: "{backlog_id}"
  title: "{backlog_title}"
  type: "{backlog_type}"
  schema_version: "2.0"
  content_blocks_count: {block_count}
  requirements_count: {req_count}
  acceptance_criteria_count: {ac_count}
  figma_url: "{figma_url}"
  parent_id: "{parent_id}"
```

**저장 확인 메시지:**

> "✅ decompose.yaml 저장 완료: `{decompose_state_file}`
> 컨텍스트가 유실되어도 이 파일에서 복원할 수 있습니다."

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 코드 분석으로 진행 [P] Prepare - 백로그 다시 준비 [B] Back - 가이드 로드로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Verify decompose.yaml saved, then load, read entire file, then execute {nextStepFile}
- IF P: Re-execute from section 2
- IF B: Load, read entire file, then execute {previousStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and redisplay menu

---

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [백로그 선택 완료 및 준비 상태 확인됨], will you then load and read fully `{nextStepFile}` to execute and begin 코드베이스 분석 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 백로그 선택 완료
- 준비 상태 확인 (requirements, acceptance_criteria)
- 필요 시 prepare-backlog 워크플로우 호출
- 백로그 정보 구조화 완료
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 준비되지 않은 백로그로 분해 진행 시도
- 요구사항/수용기준 없이 진행
- 백로그 유형 미확인
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
