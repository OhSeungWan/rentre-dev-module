---
name: 'step-05-decompose'
description: '추적성 기반 백로그 분해'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-05-decompose.md'
nextStepFile: '{workflow_path}/steps/step-06-verify.md'
previousStepFile: '{workflow_path}/steps/step-04-config.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'
---

# Step 5: 추적성 기반 백로그 분해

**Progress: Step 5 of 8** - Next: 추적성 검증

## STEP GOAL:

추적성을 유지하면서 백로그를 하위 항목으로 분해합니다. 각 하위 백로그에 담당하는 요구사항과 수용 기준을 명확히 매핑합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 with traceability expertise
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 추적성 관리 전문성, user brings 도메인 지식 및 우선순위
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 추적성 기반 분해 수행
- 🚫 FORBIDDEN to 추적성 정보 없이 하위 백로그 생성
- 💬 Approach: 각 하위 백로그가 상위 백로그의 어떤 요구사항/수용기준을 담당하는지 명확히 매핑
- 📋 PRESERVE 상위 백로그와의 연결 유지

## EXECUTION PROTOCOLS:

- 🎯 요구사항/수용 기준 기반 분해
- 💾 추적성 정보 포함하여 하위 백로그 생성
- 📖 커버리지 매트릭스 생성
- 🚫 FORBIDDEN 코드 분석 결과 미반영 (해당 시)

## CONTEXT BOUNDARIES:

- Available context: 백로그 정보, 🆕 content_blocks, 요구사항 (with source_blocks), 수용 기준, 하위 유형, 분해 강도, 코드 분석
- Focus: 🆕 블록 기반 추적성 분해 수행
- Limits: 검증은 다음 스텝에서 수행
- Dependencies: 분해 설정 완료, content_blocks 로드됨

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. decompose.yaml 로드 (CRITICAL - 컨텍스트 복원)

스텝 시작 시 `{decompose_state_file}` 로드:

```yaml
action:
  - {decompose_state_file} 로드
  - 이전 스텝 결과 확인:
    - backlog_id, stepsCompleted
    - selected_backlog (step 2) - content_blocks, requirements, acceptance_criteria
    - code_analysis (step 3) - target_files, implementation_notes
    - config (step 4) - target_child_type, detail_level
  - 메모리에 컨텍스트 복원
  - backlog-info.yaml에서 상세 데이터 로드 (content_blocks 등)
```

### 1. 분해 계획 수립

분해 전략 정리:

> "**분해 전략**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **선택된 강도:** {selected_detail_level}
> **하위 유형:** {target_child_type}
> **코드 분석 반영:** {code_analysis_available}
>
> **분해 기준:**
>
> - 요구사항 그룹핑
> - 기능적 응집도
> - 구현 독립성
> - 테스트 가능성
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 2. 하위 백로그 생성 (Block-based)

🆕 **핵심 원칙: 블록 기반 분해**

각 하위 백로그는 반드시 `covers` 필드에 담당하는 원본 블록을 명시해야 합니다.
이를 통해 정보 소실 없이 완전한 추적이 가능합니다.

**기본 정보:**

- Title: 명확하고 액션 지향적
- Type: {target_child_type}
- Description: 구체적인 범위와 목표
- Acceptance Criteria: 완료 조건

**🆕 📦 블록 커버리지 (CRITICAL - 정보 소실 방지의 핵심!):**

```yaml
covers:
  - block_id: 'BLK-001' # 이 하위 백로그가 담당하는 블록
    lines: [1, 5] # 원본 라인 범위
    coverage: 'full' # full | partial
  - block_id: 'BLK-002'
    lines: [6, 8]
    coverage: 'full'
```

**🆕 📝 상속된 컨텐츠 (원본 지시사항 전달):**

```yaml
inherited_content:
  - block_id: 'BLK-001'
    block_type: 'instruction'
    full_text: |
      원본 블록 내용 그대로 상속...
      - 새롭게 추가되는 구조화 데이터만 작업
      - 기존 수정은 제외
```

**📌 추적성 정보:**

- parent_id: {backlog_id}
- parent_title: {backlog_title}
- covered_requirements: [REQ-XXX, ...] (블록에서 자동 매핑)
- covered_acceptance_criteria: [AC-XXX, ...] (블록에서 자동 매핑)

**🆕 🔗 형제 관계:**

```yaml
siblings:
  - id: 'TASK-002'
    title: '헤딩 구조 정리'
    shared_blocks: [] # 공유 블록 없음
    relationship: 'independent' # independent | dependent | complementary
  - id: 'TASK-003'
    title: '구조화 데이터 검증'
    shared_blocks: ['BLK-001'] # ⚠️ 같은 블록 공유!
    relationship: 'dependent' # 이 태스크 완료 후 진행
```

**피그마 전파 (UI 관련 하위 백로그):**

```yaml
check: figma_url exists
  - figma_url: 상속
  - figma_node_id: 관련 노드
  - figma_inherited_from: {parent_title}
```

**코드 컨텍스트 (코드 분석 있는 경우):**

```yaml
check: code_analysis available
  - target_files: 관련 파일 목록
  - implementation_notes: 구현 주의사항
```

### 3. 분해 계획 표시

사용자에게 보고:

> "**{backlog_title} 분해 계획 (Block-based)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **상위:** {backlog_type} - {backlog_title}
> **하위 유형:** {target_child_type}
> **분해 강도:** {selected_detail_level}
> **하위 항목 수:** {child_count}개
>
> ---
>
> **1. {child_1_title}**
>
> - 설명: {child_1_description}
> - 🆕 📦 담당 블록: BLK-001, BLK-002
> - 📌 담당 요구사항: REQ-001, REQ-002 (블록에서 자동 매핑)
> - 📌 담당 수용기준: AC-001
> - 🔗 형제 관계: TASK-002 (independent)
> - 관련 파일: {child_1_files}
>
> **2. {child_2_title}**
>
> - 설명: {child_2_description}
> - 🆕 📦 담당 블록: BLK-003
> - 📌 담당 요구사항: REQ-003
> - 📌 담당 수용기준: AC-002, AC-003
> - 🔗 형제 관계: TASK-001 (independent)
> - 관련 파일: {child_2_files}
>
> ... (모든 하위 항목)
>
> ---
>
> **🆕 📦 블록 커버리지 매트릭스 (정보 소실 검증):**
>
> | 블록 ID | 블록 내용 미리보기 | 담당 하위 백로그   | 커버리지  |
> | ------- | ------------------ | ------------------ | --------- |
> | BLK-001 | 구조화 데이터...   | TASK-001           | ✅ full   |
> | BLK-002 | 새롭게 추가...     | TASK-001           | ✅ full   |
> | BLK-003 | 헤딩 구조...       | TASK-002           | ✅ full   |
> | BLK-004 | 수용 기준...       | TASK-001, TASK-002 | ⚠️ shared |
>
> **📊 전체 커버리지: {covered_blocks}/{total_blocks} = {coverage_percent}%**
>
> **📊 요구사항 커버리지 매트릭스:**
>
> | 요구사항 | 출처 블록        | 담당 하위 백로그 | 커버리지 |
> | -------- | ---------------- | ---------------- | -------- |
> | REQ-001  | BLK-001, BLK-002 | TASK-001         | ✅       |
> | REQ-002  | BLK-003          | TASK-002         | ✅       |
> | ...      | ...              | ...              | ...      |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 4. 하위 백로그 상세 내용 저장 (Block-based)

각 하위 백로그의 상세 정보를 메모리에 저장:

```yaml
children:
  - id: { child_1_id }
    title: { child_1_title }
    type: { target_child_type }
    description: { child_1_description }
    acceptance_criteria: [...]

    # 🆕 블록 커버리지
    covers:
      - block_id: 'BLK-001'
        lines: [1, 5]
        coverage: 'full'
      - block_id: 'BLK-002'
        lines: [6, 8]
        coverage: 'full'

    # 🆕 상속된 원본 컨텐츠
    inherited_content:
      - block_id: 'BLK-001'
        block_type: 'instruction'
        full_text: |
          원본 내용 그대로...

    # 🆕 형제 관계
    siblings:
      - id: 'TASK-002'
        shared_blocks: []
        relationship: 'independent'

    traceability:
      parent_id: { backlog_id }
      covered_requirements: [REQ-001, REQ-002]
      covered_acceptance_criteria: [AC-001]

    code_context:
      target_files: [...]
      implementation_notes: '...'

  - id: { child_2_id }
    # ... similar structure with covers, inherited_content, siblings
```

### 5. decompose.yaml 업데이트 (CRITICAL - 컨텍스트 유실 방지)

`{decompose_state_file}` 업데이트:

```yaml
action:
  - {decompose_state_file} 로드
  - children 섹션 추가/업데이트 (전체 하위 백로그 데이터)
  - stepsCompleted: [1, 2, 3, 4, 5] 업데이트
  - updated_at: "{timestamp}" 업데이트
  - 파일 저장

# decompose.yaml에 추가될 내용
children:
  - id: "TASK-001"
    title: "태스크 제목"
    type: "Task"
    description: "설명..."
    covers:
      - block_id: "BLK-001"
        coverage: "full"
    inherited_content:
      - block_id: "BLK-001"
        block_type: "instruction"
        full_text: "원본 내용..."
    siblings:
      - id: "TASK-002"
        relationship: "independent"
    traceability:
      requirements: [REQ-001]
      acceptance_criteria: [AC-001]
    code_context:
      target_files: ["src/..."]
  # ... 추가 children
```

**저장 확인 메시지:**

> "✅ decompose.yaml 업데이트 완료 (step 5) - {children_count}개 하위 백로그 저장됨"

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 추적성 검증으로 진행 [E] Edit - 특정 하위 백로그 수정 [A] Add - 하위 백로그 추가 [D] Delete - 하위 백로그 삭제 [R] Regenerate - 분해 다시 수행 [B] Back - 분해 설정으로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Verify decompose.yaml saved with stepsCompleted: [1,2,3,4,5], then load, read entire file, then execute {nextStepFile}
- IF E: Edit selected child backlog, then re-display
- IF A: Add new child backlog, then re-display
- IF D: Delete selected child backlog, then re-display
- IF R: Re-execute from section 2
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

ONLY WHEN [C continue option] is selected and [모든 하위 백로그에 추적성 정보 포함됨], will you then load and read fully `{nextStepFile}` to execute and begin 추적성 검증 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 하위 백로그에 추적성 정보 포함
- 요구사항/수용 기준 매핑 완료
- 커버리지 매트릭스 생성
- 코드 컨텍스트 전파 (해당 시)
- 피그마 URL 상속 (해당 시)
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 추적성 정보 누락
- 요구사항/수용 기준 미매핑 하위 백로그 생성
- 상위 백로그와의 연결 정보 누락
- 코드 분석 결과 미반영
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
