---
name: 'step-02-context-analysis'
description: '상위/하위/연결 백로그 종합 분석'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-02-context-analysis.md'
nextStepFile: '{workflow_path}/steps/step-02b-block-parsing.md' # 🆕 블록 파싱 단계 추가
prevStepFile: '{workflow_path}/steps/step-01-input.md'
workflowFile: '{workflow_path}/workflow.md'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 2: 상위/하위/연결 백로그 종합 분석

**Progress: Step 2 of 8** - Next: 블록 파싱 (Block-based Traceability)

## STEP GOAL:

백로그의 계층 구조(상위/하위)와 연결 관계를 종합적으로 분석합니다.

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

- 📖 CRITICAL: 백로그를 고립된 단위가 아닌 전체 컨텍스트에서 이해
- 🔄 CRITICAL: 상위 백로그의 요구사항 범위를 파악하여 누락 방지
- ✅ ALWAYS 계층 구조와 연결 관계를 명확히 문서화

## CONTEXT FROM PREVIOUS STEP:

**prepare.yaml에서 Step 1 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01.backlog_id
  - step_01.title
  - step_01.type
  - step_01.notion_id
  - step_01.raw_blocks
```

- `backlog_id`, `title`, `type` - Step 1에서 수집
- `notion_id` - 노션 연동 시
- `raw_blocks` - 원본 블록 데이터

## YOUR TASK:

백로그의 계층 구조(상위/하위)와 연결 관계를 종합적으로 분석합니다.

---

## ANALYSIS SEQUENCE:

### 1. 상위 백로그 탐색

**1.1 노션에서 상위 백로그 조회 (auto 모드):**

```yaml
check: notion_integration == "auto" AND notion_id exists
action:
  - Query Parent relation property
  - If parent exists, load:
      - 상위 백로그 제목, 유형, 설명 요약
      - 상위 백로그의 전체 요구사항 범위
      - 상위 백로그의 수용 기준
```

**1.2 수동 입력 (auto 모드 아니거나 parent 없음):**

> "상위 백로그 정보가 있나요?
>
> - [y] 예 - 상위 백로그 정보 입력
> - [n] 아니오 - 최상위 백로그임"

If **y**:

> "상위 백로그 정보를 입력해 주세요:
>
> - 제목
> - 유형
> - 핵심 요구사항 요약"

---

### 2. 하위 백로그 탐색

**2.1 기존 하위 백로그 조회:**

```yaml
check: notion_integration == "auto" AND notion_id exists
action:
  - Query Children relation property
  - If children exist, load list:
      - 각 하위 백로그의 제목, 유형, 상태
      - 이미 완료된 항목 표시
      - 진행 중인 항목 표시
```

**2.2 기존 하위 백로그 표시 (있는 경우):**

> "**기존 하위 백로그 ({child_count}개):**
>
> | #   | 유형 | 제목 | 상태 |
> | --- | ---- | ---- | ---- |
>
> {children_table}
>
> ⚠️ 기존 하위 백로그가 있습니다. 추가 분해 시 중복에 주의하세요."

---

### 3. 연결된 백로그 탐색

**3.1 관계 속성 조회 (auto 모드):**

```yaml
check: notion_integration == "auto"
action:
  - Query relation properties:
      - Blocks / Blocked By (차단 관계)
      - Related (연관 관계)
      - Dependencies (의존 관계)
```

**3.2 연결 관계 표시 (있는 경우):**

> "**연결된 백로그:**
>
> - **차단됨:** {blocking_items}
> - **차단 중:** {blocked_by_items}
> - **연관:** {related_items}
> - **의존:** {dependency_items}"

---

### 4. 종합 컨텍스트 요약 생성

분석 결과를 종합하여 표시:

> "**📊 백로그 컨텍스트 분석 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **현재 백로그:**
>
> - {backlog_type}: {backlog_title}
>
> **계층 구조:**
>
> ```
> {parent_title} ({parent_type})  ← 상위
> └── {backlog_title} ({backlog_type})  ← 현재
>     └── {existing_children_summary}  ← 기존 하위
> ```
>
> **연결 관계:**
> {connection_summary}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

### 5. 컨텍스트 데이터 저장

**prepare.yaml에 Step 2 결과 저장:**

```yaml
# {prepare_file} 업데이트
stepsCompleted: [1, 2]
last_updated: {timestamp}

# Step 2 결과 추가
step_02:
  hierarchy:
    parent:
      id: { parent_id }
      title: { parent_title }
      type: { parent_type }
      notion_id: { parent_notion_id }
      requirements_summary: { parent_requirements }
    existing_children:
      count: { children_count }
      items: { children_list }
    connections:
      blocking: { blocking_list }
      blocked_by: { blocked_by_list }
      related: { related_list }
```

**CRITICAL:** 컨텍스트 초과 시에도 계층 분석 결과 보존

**🔧 Serena MCP로 프로젝트 컨텍스트 참조 (선택적):**

```yaml
# 프로젝트 메모리 목록 확인
tool: mcp__serena__list_memories

# 관련 컨텍스트 로드 (있는 경우)
tool: mcp__serena__read_memory
params:
  memory_file_name: "architecture"  # 프로젝트 구조
  # 또는 "conventions"  # 코딩 컨벤션
  # 또는 "patterns"     # 디자인 패턴
```

> **💡 Tip:** Serena 메모리에 프로젝트 아키텍처 정보가 있으면 백로그 분석에 활용 가능

---

## SUCCESS METRICS:

✅ 상위 백로그 정보 수집 (있는 경우)
✅ 기존 하위 백로그 목록 파악
✅ 연결 관계 파악
✅ 계층 구조 시각화
✅ 컨텍스트 데이터 구조화

## FAILURE MODES:

❌ 상위 백로그 없이 요구사항 범위 파악 누락
❌ 기존 하위 백로그 무시하고 중복 분해
❌ 차단 관계 무시하고 진행

---

### 6. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [E] Expand [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save to {prepare_file} with `stepsCompleted: [1, 2]` and step_02 results, then load, read entire file, then execute {nextStepFile}
- IF E: Show detailed info for selected backlog, then [Redisplay Menu Options](#6-present-menu-options)
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 요구사항 및 수용기준 구조화 단계.
