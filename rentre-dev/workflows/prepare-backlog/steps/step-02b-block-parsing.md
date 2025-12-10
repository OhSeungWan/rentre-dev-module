---
name: 'step-02b-block-parsing'
description: '원본 컨텐츠를 추적 가능한 블록으로 분할'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-02b-block-parsing.md'
nextStepFile: '{workflow_path}/steps/step-03-requirements.md'
prevStepFile: '{workflow_path}/steps/step-02-context-analysis.md'
workflowFile: '{workflow_path}/workflow.md'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/backlogs/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Schema References
schemaDoc: '{module_path}/docs/block-traceability-schema.md'
---

# Step 2b: 블록 파싱 (Block-based Traceability)

**Progress: Step 2b of 7** - Next: 요구사항 및 수용기준 구조화

## STEP GOAL:

원본 백로그 컨텐츠를 추적 가능한 논리적 블록(content_blocks)으로 분할합니다.
이 블록들은 분해 시 하위 백로그로 매핑되며, 정보 소실 없는 추적을 가능하게 합니다.

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

- 📦 CRITICAL: 원본 컨텐츠를 논리적 블록으로 분할
- 🔢 ALWAYS 각 블록에 고유 ID (BLK-XXX) 부여
- 📍 ALWAYS 라인 번호 범위 기록
- 🏷️ ALWAYS 블록 타입 및 태그 분류
- 🚫 FORBIDDEN 원본 내용 수정 또는 요약 - 있는 그대로 저장

## CONTEXT FROM PREVIOUS STEPS:

**prepare.yaml에서 이전 스텝 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01.backlog_id
  - step_01.title
  - step_01.type
  - step_01.raw_blocks      # 원본 블록 데이터
  - step_02.hierarchy       # 계층 구조
```

- `backlog_id`, `title`, `type` - Step 1에서 수집
- `raw_blocks` - Step 1에서 수집한 원본 블록들
- `hierarchy` - Step 2에서 분석한 계층 구조

## YOUR TASK:

원본 컨텐츠를 content_blocks 배열로 변환합니다.

---

## BLOCK PARSING SEQUENCE:

### 1. 원본 블록 확인

Step 1에서 수집한 `raw_blocks` 확인:

> "**📦 원본 블록 분석**
>
> 수집된 원본 블록: {raw_blocks_count}개
>
> | #   | 타입   | 출처     | 내용 미리보기        |
> | --- | ------ | -------- | -------------------- | --- |
> | 1   | {type} | {source} | {preview_30chars}... |
> | 2   | ...    | ...      | ...                  | "   |

### 2. 블록 분할 알고리즘

각 raw_block에 대해:

```yaml
algorithm:
  input: raw_blocks[]
  output: content_blocks[]

  for each raw_block:
    # 1. 블록 ID 생성
    block_id: "BLK-{sequential_number:03d}"

    # 2. 라인 번호 계산
    lines: [start_line, end_line]

    # 3. 블록 타입 분류
    type: classify_block_type(raw_block)
      - "description": 일반 설명, 배경 정보
      - "instruction": 작업 지시사항 (~하세요, ~합니다, 다음과 같이)
      - "constraint": 제약 조건 (만, 제외, 않음, 금지)
      - "acceptance": 수용 기준 (완료 조건, 검증 항목)

    # 4. 태그 추출
    tags: extract_tags(raw_block.content)
      - 키워드 기반: structured-data, heading, ui, api, etc.
      - 제약 키워드: constraint, scope-limit
      - 기술 키워드: json-ld, schema, etc.

    # 5. 출처 보존
    source: raw_block.source  # notion_description | notion_toggle | notion_callout | manual
    toggle_title: raw_block.toggle_title  # if toggle

    # 6. 원본 내용 그대로 저장 (수정/요약 금지!)
    content: raw_block.content  # EXACT original content
```

### 3. 블록 타입 분류 기준

| 타입          | 판별 키워드                         | 예시                                 |
| ------------- | ----------------------------------- | ------------------------------------ |
| `description` | 배경, 목적, ~입니다                 | "이 기능은 사용자 경험을 개선합니다" |
| `instruction` | ~하세요, ~합니다, 다음과 같이, 작업 | "JSON-LD 형식으로 구현하세요"        |
| `constraint`  | 만, 제외, 않음, 금지, ~만 해당      | "새로 추가되는 것만 작업"            |
| `acceptance`  | 완료, 검증, 확인, 테스트, 되어야    | "모든 페이지에 적용되어야 함"        |

### 4. 파싱 결과 표시

사용자에게 파싱 결과 표시:

> "**📦 블록 파싱 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **생성된 블록:** {block_count}개
>
> | ID      | 타입        | 라인 | 출처          | 태그            | 내용 미리보기      |
> | ------- | ----------- | ---- | ------------- | --------------- | ------------------ |
> | BLK-001 | instruction | 1-5  | notion_toggle | structured-data | 구조화 데이터를... |
> | BLK-002 | constraint  | 6-8  | notion_toggle | constraint      | 새롭게 추가되는... |
> | BLK-003 | instruction | 9-15 | notion_toggle | heading, ui     | 헤딩 구조는...     |
> | ...     | ...         | ...  | ...           | ...             | ...                |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 5. 블록 내용 상세 확인

각 블록의 전체 내용을 표시:

> "**📋 블록 상세 내용**
>
> ---
>
> **BLK-001** (instruction, notion_toggle)
>
> ```
> {full_block_content}
> ```
>
> 태그: `structured-data`
>
> ---
>
> **BLK-002** (constraint, notion_toggle)
>
> ```
> {full_block_content}
> ```
>
> 태그: `constraint`, `scope-limit`
>
> ---
>
> ..."

### 6. 사용자 검토 및 수정

> "블록 분할이 올바른가요?
>
> 1. 정확함 - 계속 진행
> 2. 블록 병합 - 두 블록을 하나로 합침
> 3. 블록 분리 - 하나의 블록을 둘로 나눔
> 4. 타입 변경 - 블록 타입 수정
> 5. 태그 추가/삭제"

**Wait for user response.**

**If option 2-5:**

- 요청된 수정 적용
- 수정 결과 표시
- 다시 확인 요청

### 7. content_blocks 저장

**prepare.yaml에 Step 2b 결과 저장:**

```yaml
# {prepare_file} 업데이트
stepsCompleted: [1, 2, 2b]
last_updated: {timestamp}

# Step 2b 결과 추가
step_02b:
  content_blocks:
    - id: 'BLK-001'
      type: 'instruction'
      lines: [1, 5]
      source: 'notion_toggle'
      toggle_title: '구조화 데이터 작업 지침'
      content: |
        - 새롭게 추가되는 구조화 데이터만 작업
        - 기존 구조화 데이터 수정은 제외
        - JSON-LD 형식 사용
      tags: ['structured-data', 'constraint']

    - id: 'BLK-002'
      type: 'instruction'
      lines: [6, 12]
      source: 'notion_toggle'
      toggle_title: '헤딩 구조 작업 지침'
      content: |
        - H1은 제목으로만 사용
        - H2는 섹션 구분용
        - H3 이하는 내용 구조화
      tags: ['heading', 'ui-structure']
```

**CRITICAL:** 컨텍스트 초과 시에도 블록 파싱 결과 보존

---

## SUCCESS METRICS:

✅ 모든 원본 컨텐츠가 블록으로 분할됨 (누락 없음)
✅ 각 블록에 고유 ID 부여됨
✅ 라인 번호 범위가 정확함
✅ 블록 타입이 올바르게 분류됨
✅ 원본 내용이 수정/요약 없이 그대로 저장됨
✅ 사용자 검토 및 승인 완료

## FAILURE MODES:

❌ 원본 컨텐츠 일부 누락
❌ 블록 ID 중복
❌ 원본 내용 수정 또는 요약
❌ 블록 타입 미분류
❌ 사용자 확인 없이 자동 진행

---

### 8. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [M] Merge Blocks [S] Split Block [T] Change Type [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save to {prepare_file} with `stepsCompleted: [1, 2, 2b]` and step_02b results, then load, read entire file, then execute {nextStepFile}
- IF M: Merge selected blocks, then [Redisplay Menu Options](#8-present-menu-options)
- IF S: Split selected block, then [Redisplay Menu Options](#8-present-menu-options)
- IF T: Change block type, then [Redisplay Menu Options](#8-present-menu-options)
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content_blocks are saved, will you then load, read entire file, then execute {nextStepFile} to begin 요구사항 및 수용기준 구조화 단계.
