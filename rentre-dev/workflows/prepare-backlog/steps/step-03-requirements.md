---
name: 'step-03-requirements'
description: '요구사항 및 수용기준 구조화'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-03-requirements.md'
nextStepFile: '{workflow_path}/steps/step-04-additional-context.md'
prevStepFile: '{workflow_path}/steps/step-02b-block-parsing.md' # 🆕 블록 파싱 단계에서 이동
workflowFile: '{workflow_path}/workflow.md'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/backlogs/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 3: 요구사항 및 수용기준 구조화

**Progress: Step 3 of 8** - Next: 추가 컨텍스트 수집

## STEP GOAL:

백로그의 요구사항과 수용기준을 구조화된 형식으로 추출하고 번호를 부여합니다.

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

- 📖 CRITICAL: 상위 백로그 정보를 포함하여 요구사항을 완전하게 구조화
- 🔄 CRITICAL: 모든 요구사항에 REQ-XXX, 수용기준에 AC-XXX 형식 부여
- ✅ ALWAYS 분해 시 추적성을 위한 기반 마련

## CONTEXT FROM PREVIOUS STEPS:

**prepare.yaml에서 이전 스텝 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01.backlog_id
  - step_01.title
  - step_01.type
  - step_02.hierarchy        # 계층 구조
  - step_02b.content_blocks  # 파싱된 블록들
```

- `backlog_id`, `title`, `type` - Step 1
- `hierarchy` (parent, children, connections) - Step 2
- `content_blocks` - Step 2b에서 파싱된 블록들 🆕

## YOUR TASK:

백로그의 요구사항과 수용기준을 구조화된 형식으로 추출하고 번호를 부여합니다.

---

## STRUCTURING SEQUENCE:

### 1. 요구사항 추출 및 번호 부여

**1.1 요구사항 파싱:**

🆕 **content_blocks에서 요구사항 추출** (Block-based Traceability):

```yaml
requirements:
  - id: REQ-001
    summary: '{요구사항 요약 - 1줄}'
    type: functional | non-functional | technical | business
    source: current | parent | inferred
    priority: high | medium | low
    # 🆕 블록 참조 - 정보 소실 방지의 핵심!
    source_blocks: ['BLK-001', 'BLK-002'] # 이 요구사항의 출처 블록들
    # 🆕 제약 조건 - constraint 타입 블록에서 추출
    constraints:
      - '새롭게 추가되는 것만'
      - '기존 수정 제외'

  - id: REQ-002
    summary: '{두 번째 요구사항}'
    type: functional
    source: current
    priority: medium
    source_blocks: ['BLK-003']
    constraints: []
```

**CRITICAL:** 각 요구사항은 반드시 `source_blocks`를 가져야 합니다!
이 참조가 분해 시 정보 소실을 방지하는 핵심입니다.

**추출 기준:**

- **기능적 요구사항**: 사용자가 할 수 있어야 하는 것
- **비기능적 요구사항**: 성능, 보안, 접근성 등
- **기술적 제약사항**: 특정 기술 사용, API 호환성 등
- **비즈니스 규칙**: 정책, 제한 등

---

### 2. 수용 기준 추출 및 번호 부여

**2.1 수용 기준 파싱:**

🆕 **content_blocks에서 수용 기준 추출** (Block-based Traceability):

```yaml
acceptance_criteria:
  - id: AC-001
    summary: '{수용 기준 요약 - 1줄}'
    testable: true
    related_requirements: [REQ-001, REQ-002]
    # 🆕 블록 참조 추가
    source_blocks: ['BLK-004'] # acceptance 타입 블록 참조

  - id: AC-002
    summary: '{두 번째 수용 기준}'
    testable: true
    related_requirements: [REQ-003]
    source_blocks: ['BLK-004'] # 같은 블록에서 여러 AC 추출 가능
```

**수용 기준이 명시적으로 없는 경우:**

- 요구사항에서 암묵적 수용 기준 도출
- `[INFERRED]` 태그 추가

---

### 3. 구조화 결과 표시

분석 결과를 사용자에게 표시:

> "**📋 요구사항 구조화 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **요구사항 ({req_count}개):**
>
> | ID      | 요약      | 유형       | 출처 블록        | 제약조건         |
> | ------- | --------- | ---------- | ---------------- | ---------------- |
> | REQ-001 | {summary} | functional | BLK-001, BLK-002 | 새것만, 수정제외 |
>
> {requirements_table}
>
> **수용 기준 ({ac_count}개):**
>
> | ID     | 요약      | 테스트 가능 | 출처 블록 | 관련 REQ |
> | ------ | --------- | ----------- | --------- | -------- |
> | AC-001 | {summary} | ✅          | BLK-004   | REQ-001  |
>
> {acceptance_criteria_table}
>
> **🔗 블록-요구사항 매핑:**
>
> | 블록 ID | 블록 내용 미리보기 | 매핑된 REQ/AC      |
> | ------- | ------------------ | ------------------ |
> | BLK-001 | 구조화 데이터...   | REQ-001            |
> | BLK-002 | 새롭게 추가...     | REQ-001 (제약조건) |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

### 4. 사용자 검토 및 수정

> "요구사항 분석이 정확한가요?
>
> 1. 정확함 - 계속 진행
> 2. 수정 필요 - 요구사항/수용기준 수정
> 3. 추가 필요 - 누락된 항목 추가"

**Wait for user response.**

**If option 2 or 3:**

> "수정/추가할 내용을 알려주세요:"

After user input:

- 요구사항/수용기준 업데이트
- 변경 내용 표시
- 다시 확인 요청

---

### 5. prepare.yaml에 Step 3 결과 저장

**prepare.yaml에 Step 3 결과 저장:**

```yaml
# {prepare_file} 업데이트
stepsCompleted: [1, 2, 2b, 3]
last_updated: {timestamp}

# Step 3 결과 추가
step_03:
  requirements:
    - id: 'REQ-001'
      summary: '요구사항 요약'
      type: functional
      priority: high
      source_blocks: ['BLK-001', 'BLK-002']
      constraints: ['제약 조건']
  acceptance_criteria:
    - id: 'AC-001'
      summary: '수용 기준 요약'
      source_blocks: ['BLK-004']
      testable: true
      related_requirements: ['REQ-001']
```

**CRITICAL:** 컨텍스트 초과 시에도 요구사항/수용기준 결과 보존

---

## SUCCESS METRICS:

✅ 모든 요구사항에 REQ-XXX ID 부여
✅ 모든 수용기준에 AC-XXX ID 부여
✅ 요구사항-수용기준 관계 매핑
✅ 사용자 검토 및 승인 완료
✅ 추적성을 위한 구조화 완료
✅ prepare.yaml에 결과 저장 완료

## FAILURE MODES:

❌ 요구사항 ID 없이 진행 - 추적성 불가
❌ 상위 백로그 요구사항 누락
❌ 수용기준 없이 진행 - 완료 검증 불가
❌ 사용자 확인 없이 자동 진행

---

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [M] Modify [D] Add [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save to {prepare_file} with `stepsCompleted: [1, 2, 2b, 3]` and step_03 results, then load, read entire file, then execute {nextStepFile}
- IF M: Allow modifications to requirements/acceptance criteria, then [Redisplay Menu Options](#5-present-menu-options)
- IF D: Allow additions to requirements/acceptance criteria, then [Redisplay Menu Options](#5-present-menu-options)
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 추가 컨텍스트 수집 단계.
