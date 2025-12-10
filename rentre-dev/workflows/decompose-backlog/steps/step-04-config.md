---
name: 'step-04-config'
description: '분해 대상 유형 및 강도 선택'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-04-config.md'
nextStepFile: '{workflow_path}/steps/step-05-decompose.md'
previousStepFile: '{workflow_path}/steps/step-03-code-analysis.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'
---

# Step 4: 분해 대상 유형 및 강도 선택

**Progress: Step 4 of 8** - Next: 추적성 기반 백로그 분해

## STEP GOAL:

백로그 유형에 따른 적절한 하위 유형을 결정하고, 분해 강도를 선택합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 with configuration expertise
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 분해 전략 전문성, user brings 프로젝트 요구사항 및 선호도
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 하위 유형 및 분해 강도 설정
- 🚫 FORBIDDEN to 가이드에 없는 하위 유형 선택 허용
- 💬 Approach: 가이드 기반으로 적절한 하위 유형 제안
- 📋 RESPECT 사용자의 분해 강도 선택

## EXECUTION PROTOCOLS:

- 🎯 가이드에서 해당 백로그 유형의 하위 유형 로드
- 💾 사용자 선택 설정 저장
- 📖 분해 강도 옵션 설명
- 🚫 FORBIDDEN 사용자 확인 없이 기본값 적용

## CONTEXT BOUNDARIES:

- Available context: 백로그 정보, 요구사항, 수용 기준, 코드 분석 결과, 계층 구조 다이어그램
- Focus: 하위 유형 및 분해 강도 설정
- Limits: 실제 분해는 다음 스텝에서 수행
- Dependencies: 백로그 선택 및 코드 분석 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. decompose.yaml 로드 (CRITICAL - 컨텍스트 복원)

스텝 시작 시 `{decompose_state_file}` 로드:

```yaml
action:
  - {decompose_state_file} 로드
  - 이전 스텝 결과 확인:
    - backlog_id, stepsCompleted
    - guides (step 1)
    - selected_backlog (step 2) - backlog_type 참조
    - code_analysis (step 3)
  - 메모리에 컨텍스트 복원
```

### 1. 하위 유형 결정

가이드에서 `{backlog_type}`의 가능한 하위 유형 로드:

```yaml
Epic:
  child_types: [Story, Feature]
  default: Story

Story:
  child_types: [Task, Bug, Subtask]
  default: Task

Task:
  child_types: [Subtask]
  default: Subtask

Feature:
  child_types: [Story, Task]
  default: Story
```

**다중 하위 유형이 가능한 경우:**

사용자에게 질문:

> "**하위 유형 선택**
>
> **{backlog_type}: {backlog_title}**를 분해할 수 있는 유형:
>
> {child_types_options}
>
> (가이드 권장: **{default_child_type}**)
>
> 어떤 유형으로 분해하시겠습니까?"

**Wait for user response.**

### 2. 분해 강도 선택

사용자에게 표시:

> "**분해 강도 선택**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 현재 기본값: **{default_detail_level}**
>
> | 옵션             | 설명                    | 예상 하위 항목 수 |
> | ---------------- | ----------------------- | ----------------- |
> | **[h] high**     | 고수준 - 큰 단위        | 3-5개             |
> | **[s] standard** | 표준 - 중간 단위        | 5-8개             |
> | **[d] detailed** | 상세 - 파일/메서드 수준 | 8-15개            |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

사용자에게 질문:

> "분해 강도를 선택해 주세요:
>
> - [h] high - 큰 단위로 분해
> - [s] standard - 중간 단위로 분해 (기본값: {default_detail_level})
> - [d] detailed - 상세하게 분해
> - [enter] 기본값 사용"

**Wait for user response.**

### 3. 설정 확인

선택된 설정 저장 및 표시:

```yaml
target_child_type: { selected_child_type }
selected_detail_level: { selected_detail_level }
code_analysis_available: { true/false }
```

사용자에게 보고:

> "**분해 설정 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **상위 백로그:** {backlog_type} - {backlog_title}
> **하위 유형:** {target_child_type}
> **분해 강도:** {selected_detail_level}
> **코드 분석 반영:** {code_analysis_available}
>
> **예상 하위 항목 수:** {estimated_count}개
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 다음 단계에서 실제 분해를 수행합니다."

### 4. decompose.yaml 업데이트 (CRITICAL - 컨텍스트 유실 방지)

`{decompose_state_file}` 업데이트:

```yaml
action:
  - {decompose_state_file} 로드
  - config 섹션 추가/업데이트:
      target_child_type: "{selected_child_type}"
      detail_level: "{selected_detail_level}"
      estimated_children: {estimated_count}
      code_analysis_available: true/false
  - stepsCompleted: [1, 2, 3, 4] 업데이트
  - updated_at: "{timestamp}" 업데이트
  - 파일 저장

# decompose.yaml에 추가될 내용
config:
  target_child_type: "Task"
  detail_level: "standard"
  estimated_children: 5
  code_analysis_available: true
```

**저장 확인 메시지:**

> "✅ decompose.yaml 업데이트 완료 (step 4)"

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 분해 수행으로 진행 [R] Reconfigure - 설정 다시 선택 [B] Back - 코드 분석으로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Verify decompose.yaml saved with stepsCompleted: [1,2,3,4], then load, read entire file, then execute {nextStepFile}
- IF R: Re-execute from section 1
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

ONLY WHEN [C continue option] is selected and [하위 유형 및 분해 강도 선택 완료], will you then load and read fully `{nextStepFile}` to execute and begin 분해 수행 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 적절한 하위 유형 선택
- 분해 강도 결정
- 설정 정보 저장
- 사용자 확인 완료
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 가이드에 없는 하위 유형 선택 허용
- 사용자 확인 없이 기본값 적용
- 설정 정보 저장 누락
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
