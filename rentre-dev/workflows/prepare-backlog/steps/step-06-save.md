---
name: 'step-06-save'
description: '백로그 정보 저장'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-06-save.md'
nextStepFile: '{workflow_path}/steps/step-07-complete.md'
prevStepFile: '{workflow_path}/steps/step-05-context-verify.md'
workflowFile: '{workflow_path}/workflow.md'
data_path: '{module_path}/data'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 6: 백로그 정보 저장

**Progress: Step 6 of 8** - Next: 완료 및 다음 단계 안내

## STEP GOAL:

수집된 모든 백로그 정보를 파일 시스템에 저장합니다.

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

- 📖 CRITICAL: 수집된 모든 정보를 구조화된 형식으로 저장
- 💾 CRITICAL: backlog-info.yaml 파일 생성
- ✅ ALWAYS 저장 전 내용 확인

## CONTEXT FROM PREVIOUS STEPS:

**prepare.yaml에서 모든 스텝 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01 (backlog_id, title, type, notion_id, raw_blocks)
  - step_02 (hierarchy)
  - step_02b (content_blocks)
  - step_03 (requirements, acceptance_criteria)
  - step_04 (figma, references, unclear_items)
  - step_05 (context_score, can_decompose)
```

- `backlog_id`, `title`, `type`, `notion_id` - Step 1
- `hierarchy` - Step 2
- `content_blocks` - Step 2b에서 파싱된 블록들 🆕
- `requirements`, `acceptance_criteria` (with source_blocks) - Step 3 🆕
- `figma`, `references`, `unclear_items` - Step 4
- `context_score`, `can_decompose` - Step 5

## YOUR TASK:

수집된 모든 백로그 정보를 파일 시스템에 저장합니다.

---

## SAVE SEQUENCE:

### 1. 저장 건너뛰기 확인 (워크플로우 호출 시)

```yaml
check: skip_save == true
action:
  - '저장 건너뛰기 - 호출 워크플로우에서 처리'
  - goto: step-07-complete.md
```

---

### 2. prepare.yaml → backlog-info.yaml 통합

**prepare.yaml의 모든 중간 결과를 backlog-info.yaml로 통합:**

```yaml
# prepare.yaml의 step_XX 데이터를 backlog-info.yaml 스키마로 변환
transform:
  step_01 → backlog_id, title, type, status, notion_id
  step_01.raw_blocks → raw.blocks
  step_02.hierarchy → hierarchy
  step_02b.content_blocks → content_blocks
  step_03.requirements → requirements
  step_03.acceptance_criteria → acceptance_criteria
  step_04 → context (figma, references, unclear_items)
  step_05 → preparation (context_score, can_decompose)
```

---

### 3. backlog-info.yaml 저장 (v2.0 스키마)

**파일 내용 - Block-based Traceability 스키마:**

```yaml
# 백로그 메타정보 - Prepared by prepare-backlog workflow
# 🆕 Schema Version 2.0 - Block-based Traceability
schema_version: '2.0'

backlog_id: { backlog_id }
title: { backlog_title }
type: { backlog_type }
status: prepared
notion_id: { notion_page_id }
created_at: { date }
prepared_at: { date }

# 📊 준비 상태
preparation:
  context_score: { context_score }
  can_decompose: { can_decompose }
  stepsCompleted: [1, 2, 2b, 3, 4, 5, 6]

# 🆕 📦 원본 컨텐츠 블록 - 정보 소실 방지의 핵심!
content_blocks:
  - id: 'BLK-001'
    type: 'instruction' # description | instruction | acceptance | constraint
    lines: [1, 5]
    source: 'notion_toggle' # notion_description | notion_toggle | notion_callout | manual
    toggle_title: '상세 작업 지침'
    content: |
      원본 내용 그대로...
    tags: ['structured-data']
  # ... 모든 블록

# 🏗️ 계층 정보
hierarchy:
  parent:
    id: { parent_id }
    title: { parent_title }
    type: { parent_type }
    notion_id: { parent_notion_id }
  children: [] # 분해 후 채워짐
  connections:
    blocking: { blocking_list }
    blocked_by: { blocked_by_list }
    related: { related_list }

# 🆕 📋 구조화된 요구사항 (블록 참조 포함)
requirements:
  - id: 'REQ-001'
    summary: '요구사항 요약'
    type: functional
    priority: high
    source_blocks: ['BLK-001', 'BLK-002'] # 🆕 출처 블록 참조
    constraints:
      - '제약 조건 1'
      - '제약 조건 2'
  # ... 모든 요구사항

# 🆕 ✅ 구조화된 수용 기준 (블록 참조 포함)
acceptance_criteria:
  - id: 'AC-001'
    summary: '수용 기준 요약'
    source_blocks: ['BLK-004'] # 🆕 출처 블록 참조
    testable: true
    related_requirements: ['REQ-001']
  # ... 모든 수용 기준

# 🆕 📊 커버리지 메트릭 (분해 후 자동 계산)
coverage:
  total_blocks: { content_blocks.length }
  covered_blocks: 0
  coverage_percent: 0
  uncovered_blocks: [] # 분해 후 채워짐
  shared_blocks: []
  validation_passed: false

# 🎨 컨텍스트
context:
  figma:
    url: { figma_url }
    file_key: { figma_file_key }
    node_id: { figma_node_id }
  references: { references_yaml }
  unclear_items: { unclear_items_yaml }
  gathered: { gathered_context }

# 📝 원본 데이터 (하위 호환성)
raw:
  description: |
    {raw_description}
  acceptance_criteria: |
    {raw_acceptance_criteria}
```

---

### 4. 저장 완료 확인

> "**✅ 백로그 정보 저장 완료 (v2.0 스키마)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **저장 위치:** `{data_path}/{backlog_id}/`
>
> **저장된 파일:**
>
> - `backlog-info.yaml` - Block-based Traceability 스키마 v2.0
>
> **저장된 내용:**
>
> - 🆕 컨텐츠 블록: {block_count}개
> - 요구사항: {req_count}개 (블록 참조 포함)
> - 수용 기준: {ac_count}개 (블록 참조 포함)
> - 컨텍스트 충족도: {context_score}%
>
> **🔗 블록-요구사항 매핑:**
>
> | 블록    | 매핑된 REQ/AC  |
> | ------- | -------------- |
> | BLK-001 | REQ-001        |
> | BLK-002 | REQ-001 (제약) |
> | ...     | ...            |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

## SUCCESS METRICS:

✅ 백로그 폴더 생성 완료
✅ backlog-info.yaml 저장 완료
✅ 모든 구조화된 데이터 포함
✅ 저장 위치 사용자에게 표시

## FAILURE MODES:

❌ 폴더 생성 실패
❌ 파일 저장 실패
❌ 데이터 누락
❌ 잘못된 YAML 형식

---

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [V] View [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save backlog-info.yaml (merged from {prepare_file}), update {prepare_file} with `stepsCompleted: [1, 2, 2b, 3, 4, 5, 6]`, then load, read entire file, then execute {nextStepFile}
- IF V: Display saved backlog-info.yaml content, then [Redisplay Menu Options](#5-present-menu-options)
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 완료 및 다음 단계 안내.
