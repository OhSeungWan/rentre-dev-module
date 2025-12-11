---
name: 'step-06-verify'
description: '추적성 검증 - 블록 커버리지 검증'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-06-verify.md'
nextStepFile: '{workflow_path}/steps/step-07-save.md'
previousStepFile: '{workflow_path}/steps/step-05-decompose.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'
---

# Step 6: 추적성 검증 - 블록 커버리지 검증

**Progress: Step 6 of 8** - Next: 하위 백로그 저장

## STEP GOAL:

🆕 **Block-based Traceability 검증**: 분해 결과의 블록 커버리지를 검증합니다.
모든 원본 컨텐츠 블록이 최소 하나의 하위 백로그에 매핑되었는지 확인합니다.
이를 통해 **정보 소실 없는 분해**를 보장합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 with verification expertise
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 추적성 검증 전문성, user brings 비즈니스 우선순위 및 예외 판단
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 추적성 검증 및 누락 처리
- 🚫 FORBIDDEN to 누락된 항목 무시하고 진행
- 💬 Approach: 모든 요구사항과 수용기준이 하위 백로그에 매핑되었는지 검증
- 📋 ENSURE 100% 커버리지 달성 또는 의도적 제외 기록

## EXECUTION PROTOCOLS:

- 🎯 모든 요구사항/수용 기준 커버리지 확인
- 💾 누락 항목 처리 옵션 제공
- 📖 최종 승인 획득
- 🚫 FORBIDDEN 사용자 승인 없이 진행

## CONTEXT BOUNDARIES:

- Available context: 백로그 정보, 요구사항, 수용 기준, 분해된 하위 백로그
- Focus: 추적성 검증 및 누락 처리
- Limits: 저장은 다음 스텝에서 수행
- Dependencies: 분해 수행 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. decompose.yaml 로드 (CRITICAL - 컨텍스트 복원)

스텝 시작 시 `{decompose_state_file}` 로드:

```yaml
action:
  - {decompose_state_file} 로드
  - 이전 스텝 결과 확인:
    - backlog_id, stepsCompleted
    - selected_backlog (step 2) - content_blocks 정보
    - children (step 5) - 분해된 하위 백로그들
  - 메모리에 컨텍스트 복원
  - backlog-info.yaml에서 content_blocks, requirements, acceptance_criteria 로드
```

### 1. 블록 커버리지 검증 (핵심!)

🆕 **모든 원본 컨텐츠 블록의 커버리지 검사:**

```yaml
# 1단계: 블록 커버리지 검증 (정보 소실 방지의 핵심)
all_blocks = parent.content_blocks.map(b => b.id)
covered_blocks = []

for each child in children:
  for each cover in child.covers:
    covered_blocks.add(cover.block_id)

uncovered_blocks = all_blocks - covered_blocks
shared_blocks = find_duplicates(covered_blocks)

# 2단계: 요구사항 커버리지 (블록 기반)
for each REQ-XXX in requirements:
  check: at least one child has REQ-XXX in covered_requirements
  if not: add to unmapped_requirements

# 3단계: 수용 기준 커버리지
for each AC-XXX in acceptance_criteria:
  check: at least one child has AC-XXX in covered_acceptance_criteria
  if not: add to unmapped_criteria
```

### 1b. 🚨 inherited_content 완전성 검증 (CRITICAL - 정보 소실 방지)

**모든 하위 백로그의 inherited_content가 원본을 완전히 포함하는지 검증:**

```yaml
# inherited_content 검증 알고리즘
inherited_content_errors = []

for each child in children:
  for each inherited in child.inherited_content:
    # 1. 원본 블록 찾기
    source_block = content_blocks.find(b => b.id == inherited.block_id)

    # 2. full_text 완전성 검증
    if inherited.full_text != source_block.content:
      # ⚠️ 내용이 다름 - 정보 소실 발생!
      inherited_content_errors.push({
        child_id: child.id,
        block_id: inherited.block_id,
        issue: "content_mismatch",
        original_length: source_block.content.length,
        inherited_length: inherited.full_text.length,
        original_preview: source_block.content.substring(0, 100),
        inherited_preview: inherited.full_text.substring(0, 100)
      })

    # 3. 길이 검증 (요약 감지)
    if inherited.full_text.length < source_block.content.length * 0.9:
      # ⚠️ 90% 미만이면 요약되었을 가능성 높음
      inherited_content_errors.push({
        child_id: child.id,
        block_id: inherited.block_id,
        issue: "possible_truncation",
        original_length: source_block.content.length,
        inherited_length: inherited.full_text.length
      })

# 검증 결과
inherited_content_valid = (inherited_content_errors.length == 0)
```

**inherited_content 검증 결과 표시:**

**검증 통과 시:**

> "**✅ inherited_content 완전성 검증 통과!**
>
> 모든 하위 백로그의 inherited_content가 원본 블록의 내용을 완전히 포함합니다.
>
> | 하위 백로그 | 상속 블록 수 | 총 문자 수 | 상태 |
> |------------|--------------|-----------|------|
> | {child_1}  | {count}개    | {chars}자 | ✅   |
> | {child_2}  | {count}개    | {chars}자 | ✅   |"

**검증 실패 시:**

> "**❌ inherited_content 정보 소실 감지!**
>
> ⚠️ 일부 하위 백로그의 inherited_content가 원본과 다릅니다.
> 이대로 진행하면 원본 지시사항이 Dev 에이전트에게 제대로 전달되지 않습니다!
>
> | 하위 백로그 | 블록 ID | 문제           | 원본 길이 | 상속 길이 |
> |------------|---------|---------------|----------|----------|
> | {child_id} | BLK-XXX | 내용 불일치    | {orig}자 | {inh}자  |
> | {child_id} | BLK-YYY | 요약/축약 의심 | {orig}자 | {inh}자  |
>
> **🔧 수정 필요:** [F] Fix 선택하여 inherited_content 재생성"

### 2. 검증 결과 표시

**모든 항목이 매핑된 경우:**

> "**✅ Block-based Traceability 검증 완료!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **🆕 📦 블록 커버리지:** {covered_block_count}/{total_block_count} (100%) ✅
> **🆕 📝 inherited_content 완전성:** {valid_count}/{total_count} (100%) ✅
> **요구사항 커버리지:** {req_count}/{req_count} (100%)
> **수용 기준 커버리지:** {ac_count}/{ac_count} (100%)
>
> **🆕 블록 커버리지 상세:**
>
> | 블록 ID | 블록 내용 미리보기 | 담당 하위 백로그   | 상태      |
> | ------- | ------------------ | ------------------ | --------- |
> | BLK-001 | 구조화 데이터...   | TASK-001           | ✅        |
> | BLK-002 | 새롭게 추가...     | TASK-001           | ✅        |
> | BLK-003 | 헤딩 구조...       | TASK-002           | ✅        |
> | BLK-004 | 수용 기준...       | TASK-001, TASK-002 | ⚠️ shared |
>
> **공유 블록:** {shared_block_count}개 (형제 관계 설정됨)
>
> **요구사항 커버리지 상세:**
>
> | 요구사항 | 출처 블록        | 담당 백로그 | 상태 |
> | -------- | ---------------- | ----------- | ---- |
> | REQ-001  | BLK-001, BLK-002 | TASK-001    | ✅   |
> | REQ-002  | BLK-003          | TASK-002    | ✅   |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

**누락된 항목이 있는 경우:**

> "**⚠️ Block-based Traceability 검증 결과: 정보 소실 위험!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **🆕 📦 블록 커버리지:** {covered_block_count}/{total_block_count} ({block_coverage}%) ⚠️
> **요구사항 커버리지:** {mapped_req_count}/{req_count} ({req_coverage}%)
> **수용 기준 커버리지:** {mapped_ac_count}/{ac_count} ({ac_coverage}%)
>
> **🆕 ❌ 커버되지 않은 블록 (정보 소실 위험!):**
>
> | 블록 ID | 블록 내용                  | 담당 백로그 |
> | ------- | -------------------------- | ----------- |
> | BLK-003 | 헤딩 구조는 다음과 같이... | ❌ 없음     |
>
> **⚠️ 위 블록의 내용이 어떤 하위 백로그에도 할당되지 않았습니다!**
> **이대로 진행하면 해당 정보가 소실됩니다.**
>
> **❌ 매핑되지 않은 요구사항:**
> {unmapped_requirements_list}
>
> **❌ 매핑되지 않은 수용 기준:**
> {unmapped_criteria_list}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 3. 누락 항목 처리 (해당 시)

누락된 항목이 있는 경우, 사용자에게 질문:

> "누락된 항목을 어떻게 처리할까요?
>
> 1. **기존 하위 백로그에 추가** - 적절한 하위 백로그 선택
> 2. **새 하위 백로그 생성** - 누락 항목을 위한 새 백로그
> 3. **의도적 제외** - 이유 기록 후 진행
> 4. **분해 재검토** - Step 5로 돌아가기"

**Wait for user response.**

**Option 1 - 기존 백로그에 추가:**

> "어떤 하위 백로그에 추가하시겠습니까?
>
> {children_list_with_numbers}"

**Option 2 - 새 백로그 생성:**

> "새 하위 백로그의 정보를 입력해 주세요:
>
> - 제목
> - 설명
> - 담당할 누락 항목 선택"

**Option 3 - 의도적 제외:**

> "제외 이유를 기록해 주세요:
> (예: 다음 스프린트에서 처리, 범위 외, 별도 백로그로 처리 등)"

### 4. 최종 승인

검증 통과 또는 누락 처리 완료 후:

> "**분해 계획 최종 확인**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **상위 백로그:** {backlog_type} - {backlog_title}
> **하위 백로그 수:** {child_count}개
>
> **추적성 상태:**
>
> - 요구사항: {req_coverage}% 커버
> - 수용 기준: {ac_coverage}% 커버
> - 제외된 항목: {excluded_count}개
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

사용자에게 질문:

> "분해 계획을 승인하시겠습니까?
>
> 1. **승인** - 저장 진행
> 2. **수정** - 특정 항목 수정
> 3. **재분해** - 처음부터 다시"

**Wait for user response.**

### 5. decompose.yaml 업데이트 (CRITICAL - 컨텍스트 유실 방지)

`{decompose_state_file}` 업데이트:

```yaml
action:
  - {decompose_state_file} 로드
  - verification 섹션 추가/업데이트
  - stepsCompleted: [1, 2, 3, 4, 5, 6] 업데이트
  - updated_at: "{timestamp}" 업데이트
  - 파일 저장

# decompose.yaml에 추가될 내용
verification:
  block_coverage:
    total: 5
    covered: 5
    percent: 100
    uncovered: []
    shared: ["BLK-004"]
  # 🆕 inherited_content 완전성 검증 결과
  inherited_content_validation:
    total_items: 8           # 총 상속 항목 수
    valid_items: 8           # 완전히 복사된 항목 수
    percent: 100
    errors: []               # 오류 목록 (있는 경우)
    # 오류 예시:
    # - child_id: "TASK-001"
    #   block_id: "BLK-001"
    #   issue: "content_mismatch"
    #   original_length: 500
    #   inherited_length: 120
  requirements_coverage:
    total: 3
    covered: 3
    percent: 100
  acceptance_criteria_coverage:
    total: 4
    covered: 4
    percent: 100
  passed: true              # block_coverage AND inherited_content_validation 모두 통과해야 true
  excluded_items: []
```

**저장 확인 메시지:**

> "✅ decompose.yaml 업데이트 완료 (step 6) - 검증 결과 저장됨"

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 저장으로 진행 [F] Fix - 누락 항목 처리 [E] Edit - 하위 백로그 수정 [R] Regenerate - 분해 다시 수행 [B] Back - 분해 단계로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Verify decompose.yaml saved with stepsCompleted: [1,2,3,4,5,6], then load, read entire file, then execute {nextStepFile}
- IF F: Execute section 3
- IF E: Edit selected child backlog, then re-verify
- IF R: Load, read entire file, then execute {previousStepFile}
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

ONLY WHEN [C continue option] is selected and [사용자 최종 승인 획득], will you then load and read fully `{nextStepFile}` to execute and begin 저장 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 블록 커버리지 확인 (100%)
- 🆕 모든 inherited_content 완전성 검증 통과
- 모든 요구사항 커버리지 확인
- 모든 수용 기준 커버리지 확인
- 누락 항목 처리 완료
- 사용자 최종 승인 획득
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 누락된 항목 무시하고 진행
- 커버리지 계산 오류
- 🆕 inherited_content 불완전 (요약/축약됨)한 상태로 진행
- 🆕 inherited_content 검증 스킵
- 사용자 승인 없이 진행
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
