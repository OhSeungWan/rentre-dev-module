---
name: 'step-05-context-verify'
description: '컨텍스트 충족도 검증'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-05-context-verify.md'
nextStepFile: '{workflow_path}/steps/step-06-save.md'
prevStepFile: '{workflow_path}/steps/step-04-additional-context.md'
workflowFile: '{workflow_path}/workflow.md'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
gatherContextTask: '{project-root}/{bmad_folder}/rentre-dev/tasks/gather-context.md'
---

# Step 5: 컨텍스트 충족도 검증

**Progress: Step 5 of 7** - Next: 백로그 정보 저장

## STEP GOAL:

gather-context 태스크를 실행하여 컨텍스트 충족도를 검증하고, 부족한 정보를 수집합니다.

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

- 📖 CRITICAL: 분해에 필요한 필수 컨텍스트가 충분한지 검증
- 🔄 CRITICAL: 부족한 경우 적극적으로 요청
- ✅ ALWAYS 컨텍스트 점수를 계산하여 분해 준비 상태 판단

## CONTEXT FROM PREVIOUS STEPS:

**prepare.yaml에서 이전 스텝 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01 (backlog_id, title, type)
  - step_02 (hierarchy)
  - step_02b (content_blocks)
  - step_03 (requirements, acceptance_criteria)
  - step_04 (figma, references, unclear_items)
```

- `backlog_id`, `title`, `type` - Step 1
- `hierarchy` - Step 2
- `content_blocks` - Step 2b
- `requirements`, `acceptance_criteria` - Step 3
- `figma`, `references`, `unclear_items` - Step 4

## YOUR TASK:

gather-context 태스크를 실행하여 컨텍스트 충족도를 검증하고, 부족한 정보를 수집합니다.

---

## VERIFICATION SEQUENCE:

### 1. gather-context 태스크 실행

**태스크 호출:**

```yaml
invoke_task: '{module_path}/tasks/gather-context.md'
params:
  backlog_type: { backlog_type }
  backlog_title: { backlog_title }
  requirements: { requirements }
  acceptance_criteria: { acceptance_criteria }
  existing_context:
    figma: { figma_info }
    references: { references_list }
    parent_info: { parent_summary }
```

**태스크 결과 저장:**

```yaml
context_score: { 0-100 }
can_decompose: { true|false }
missing_required: { list }
missing_recommended: { list }
gathered_context: { additional_info }
```

---

### 2. 충족도 결과 표시

**If context_score < 50:**

> "**⚠️ 컨텍스트 충족도 낮음: {context_score}%**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **필수 누락 항목:**
> {missing_required_list}
>
> **권장 누락 항목:**
> {missing_recommended_list}
>
> 필수 정보가 많이 부족합니다. 분해 전에 추가 정보 수집을 **강력히 권장**합니다.
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

**If context_score >= 50 AND < 80:**

> "**ℹ️ 컨텍스트 충족도: {context_score}%**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **권장 누락 항목:**
> {missing_recommended_list}
>
> 일부 정보가 부족하지만 분해는 가능합니다. 가정이 필요할 수 있습니다.
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

**If context_score >= 80:**

> "**✅ 컨텍스트 충족도: {context_score}%**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 분해에 필요한 정보가 충분히 수집되었습니다.
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

### 3. prepare.yaml에 Step 5 결과 저장

**prepare.yaml에 Step 5 결과 저장:**

```yaml
# {prepare_file} 업데이트
stepsCompleted: [1, 2, 2b, 3, 4, 5]
last_updated: {timestamp}

# Step 5 결과 추가
step_05:
  context_score: { 0-100 }
  can_decompose: { true|false }
  missing_required: { list }
  missing_recommended: { list }
  gathered_context: { additional_info }
```

**CRITICAL:** 컨텍스트 초과 시에도 검증 결과 보존

---

### 4. 분해 준비 상태 확인

> "**분해 준비 상태:**
>
> - 컨텍스트 충족도: {context_score}%
> - 분해 가능: {can_decompose ? '✅ 예' : '❌ 아니오'}
> - 요구사항: {req_count}개
> - 수용 기준: {ac_count}개"

---

## SUCCESS METRICS:

✅ gather-context 태스크 실행 완료
✅ 컨텍스트 점수 계산 완료
✅ 누락 항목 식별 완료
✅ 추가 컨텍스트 병합 완료
✅ 분해 준비 상태 판단 완료

## FAILURE MODES:

❌ 컨텍스트 검증 없이 분해 진행 - 품질 저하
❌ 필수 정보 누락 무시 - 불완전한 분해
❌ 낮은 점수에서 경고 없이 진행

---

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [G] Gather [S] Skip [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C:
  - Check if context_score >= 50, if not warn and confirm
  - Save to {prepare_file} with `stepsCompleted: [1, 2, 2b, 3, 4, 5]` and step_05 results
  - Then load, read entire file, then execute {nextStepFile}
- IF G: Re-run {gatherContextTask} with updated parameters, then [Redisplay Menu Options](#5-present-menu-options)
- IF S: Proceed despite low score (with warning logged), same as C
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 백로그 정보 저장 단계.
