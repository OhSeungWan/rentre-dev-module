---
name: 'step-07-complete'
description: '완료 및 다음 단계 안내'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-07-complete.md'
workflowFile: '{workflow_path}/workflow.md'
step01File: '{workflow_path}/steps/step-01-input.md'
data_path: '{module_path}/data'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 7: 완료 및 다음 단계 안내

**Progress: Step 7 of 7** - Workflow Complete

## STEP GOAL:

워크플로우 완료를 요약하고 다음 단계를 안내합니다.

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

- 📖 CRITICAL: 준비 완료 요약을 명확하게 표시
- 🔄 CRITICAL: 다음 단계 옵션을 안내
- ✅ ALWAYS 호출 워크플로우로 결과 반환 (호출된 경우)

## CONTEXT FROM PREVIOUS STEPS:

All data collected throughout the workflow:

- `backlog_id`, `title`, `type` - Step 1
- `hierarchy` - Step 2
- `requirements`, `acceptance_criteria` - Step 3
- `context_notes` - Step 4
- `context_score`, `can_decompose` - Step 5
- `backlog_folder` (saved location) - Step 6

## YOUR TASK:

워크플로우 완료를 요약하고 다음 단계를 안내합니다.

---

## COMPLETION SEQUENCE:

### 1. 준비 완료 요약 표시

> "**✅ 백로그 준비 완료!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **백로그:** {backlog_type} - {backlog_title}
>
> **분석 결과:**
>
> - 요구사항: {req_count}개 (REQ-001 ~ REQ-{req_count})
> - 수용 기준: {ac_count}개 (AC-001 ~ AC-{ac_count})
> - 불명확 항목: {unclear_count}개
> - 컨텍스트 충족도: {context_score}%
>
> **컨텍스트:**
>
> - 상위 백로그: {parent_summary}
> - 기존 하위: {children_count}개
> - 피그마: {figma_status}
> - 참조 문서: {ref_count}개
>
> **저장 위치:** `{data_path}/{backlog_id}/`
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

### 2. 워크플로우 호출 시 결과 반환

```yaml
check: invoked_from_another_workflow == true
action:
  return:
    backlog_id: { backlog_id }
    backlog_info: { backlog_info_yaml }
    requirements: { requirements }
    acceptance_criteria: { acceptance_criteria }
    context_notes: { context_notes }
    context_score: { context_score }
    backlog_folder: '{data_path}/{backlog_id}'
  then: '호출 워크플로우로 제어 반환'
```

---

### 3. 독립 실행 시 다음 단계 안내

> "**다음 작업을 선택해 주세요:**
>
> 1. 📊 **코드베이스 분석** (`*analyze-code`) - 백로그 관련 코드 분석
> 2. 🔀 **백로그 분해** (`*decompose`) - 하위 백로그로 분해
> 3. 📋 **다른 백로그 준비** - 새 백로그 분석
> 4. ✅ **완료** - 워크플로우 종료"

**Wait for user selection.**

---

### 4. Present MENU OPTIONS

Display: **Select an Option:** [1] 코드베이스 분석 [2] 백로그 분해 [3] 다른 백로그 준비 [4] 완료

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF 1: Guide to analyze-codebase workflow (`*analyze-code`)
- IF 2: Guide to decompose-backlog workflow (`*decompose`)
- IF 3: Load {step01File} to start new backlog preparation
- IF 4: Display final completion message and end workflow
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 완료 요약 표시
- 호출 워크플로우로 결과 반환 (해당 시)
- 다음 단계 옵션 제시
- 사용자 선택에 따른 적절한 안내

### ❌ SYSTEM FAILURE:

- 요약 없이 종료
- 호출 워크플로우에 결과 미반환
- 다음 단계 안내 누락

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## WORKFLOW COMPLETE

**Final State:**

```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
status: completed
output: '{data_path}/{backlog_id}/backlog-info.yaml'
```

**Return Values (for invoking workflows):**

```yaml
backlog_id: { backlog_id }
backlog_info: { complete_yaml }
requirements: { requirements_list }
acceptance_criteria: { ac_list }
context_notes: { context_notes }
context_score: { score }
backlog_folder: { folder_path }
```
