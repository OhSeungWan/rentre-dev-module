---
name: 'step-01b-continue'
description: '기존 분석 상태에서 재개'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'

# Step Files for Routing
step02File: '{workflow_path}/steps/step-02-config.md'
step03File: '{workflow_path}/steps/step-03-analyze.md'
step04File: '{workflow_path}/steps/step-04-save.md'
step05File: '{workflow_path}/steps/step-05-complete.md'

# Data Paths
analysis_state_file: '{backlog_folder}/analysis.yaml'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 1b: 기존 분석 상태에서 재개

## STEP GOAL:

기존 analysis.yaml에서 진행 상태를 로드하고, 마지막 완료된 스텝 이후로 재개합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When routing to next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a code analysis specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You help user resume from where they left off
- ✅ User decides whether to continue or restart

### Step-Specific Rules:

- 🎯 Focus ONLY on loading state and routing to correct step
- 🚫 FORBIDDEN to modify analysis data in this step
- 💬 Show current state clearly to user
- 🚪 ROUTE to appropriate step based on stepsCompleted

## EXECUTION PROTOCOLS:

- 🎯 Load analysis.yaml and parse stepsCompleted
- 💾 Do NOT modify state in this step
- 📖 Display current progress to user
- 🚫 FORBIDDEN to skip routing logic

## CONTEXT BOUNDARIES:

- analysis.yaml exists and was detected in step-01
- Focus on state recovery, not analysis
- User confirms before resuming
- This is about continuation, not new analysis

## RESUME PROCESS:

### 1. Load analysis.yaml

`{backlog_folder}/analysis.yaml` 로드 및 파싱:

- `backlog_id`
- `stepsCompleted`
- `created_at`, `updated_at`
- 각 스텝별 저장된 데이터

### 2. Display Current State

현재 진행 상태 표시:

"**기존 분석 상태 발견:**

| 항목 | 값 |
|------|-----|
| 백로그 ID | {backlog_id} |
| 백로그 제목 | {init.backlog_title} |
| 생성일 | {created_at} |
| 마지막 업데이트 | {updated_at} |
| 완료된 스텝 | {stepsCompleted} |

**스텝별 진행 상황:**

| 스텝 | 이름 | 상태 |
|------|------|------|
| 1 | 초기화 | {1 in stepsCompleted ? '✅ 완료' : '⏳ 대기'} |
| 2 | 설정 | {2 in stepsCompleted ? '✅ 완료' : '⏳ 대기'} |
| 3 | 분석 | {3 in stepsCompleted ? '✅ 완료' : '⏳ 대기'} |
| 4 | 저장 | {4 in stepsCompleted ? '✅ 완료' : '⏳ 대기'} |
| 5 | 완료 | {5 in stepsCompleted ? '✅ 완료' : '⏳ 대기'} |

**저장된 데이터 요약:**

{IF 2 in stepsCompleted}
- 분석 깊이: {config.analysis_depth}
- 분석 범위: {config.scope_type}
{/IF}

{IF 3 in stepsCompleted}
- 분석된 파일: {analysis.files.relevant_count}개
- 기술 스택: {analysis.tech_stack.frameworks}
{/IF}"

### 3. Confirm Resume

사용자에게 재개 확인:

"다음 스텝({next_step_number})부터 이어서 진행하시겠습니까?

- [c] 계속 진행 - 다음 스텝으로 이동
- [r] 처음부터 다시 - 새 분석 시작 (기존 상태 덮어쓰기)
- [v] 상세 보기 - 저장된 데이터 전체 확인"

### 4. Route to Next Step

**stepsCompleted 기반 라우팅:**

```
stepsCompleted: [1]     → step-02-config.md
stepsCompleted: [1,2]   → step-03-analyze.md
stepsCompleted: [1,2,3] → step-04-save.md
stepsCompleted: [1,2,3,4] → step-05-complete.md
```

**IF 'c' (계속 진행):**

마지막 완료 스텝 기준 다음 스텝 파일 로드:

- IF stepsCompleted ends with 1 → load, read entire file, execute {step02File}
- IF stepsCompleted ends with 2 → load, read entire file, execute {step03File}
- IF stepsCompleted ends with 3 → load, read entire file, execute {step04File}
- IF stepsCompleted ends with 4 → load, read entire file, execute {step05File}

**IF 'r' (처음부터):**

"기존 분석 상태를 초기화하고 새로 시작합니다."
→ step-01-init.md의 섹션 1부터 진행 (analysis.yaml 덮어쓰기)

**IF 'v' (상세 보기):**

analysis.yaml 전체 내용 표시
→ 다시 섹션 3 메뉴로 복귀

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- analysis.yaml 로드 성공
- 현재 상태 명확히 표시
- 올바른 스텝으로 라우팅
- 사용자 확인 후 진행

### ❌ SYSTEM FAILURE:

- analysis.yaml 파싱 실패
- 잘못된 스텝으로 라우팅
- 사용자 확인 없이 진행
- 상태 데이터 손실

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
