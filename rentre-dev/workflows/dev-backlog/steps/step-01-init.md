---
name: 'step-01-init'
description: '환경 설정 및 세션 복원'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-select.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
session_state_template: '{workflow_path}/templates/session-state.yaml'
---

# Step 1: 초기화

## STEP GOAL:

환경을 설정하고, MCP 도구 설치 상태를 확인하며, 이전 세션이 있으면 복원합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Focus on getting things done efficiently

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and environment setup
- 🚫 FORBIDDEN to start implementation in this step
- 💬 Check MCP tools and session state
- 🚪 Auto-proceed to next step after setup

## EXECUTION PROTOCOLS:

- 🎯 Check MCP installation status
- 💾 Load or create session state
- 📖 Auto-proceed to step 2 after initialization
- 🚫 FORBIDDEN to skip MCP check

## SEQUENCE OF INSTRUCTIONS:

### 1. MCP 설치 상태 확인

다음 MCP 도구의 설치 상태를 확인합니다:

| MCP 도구   | 확인 방법                                               |
| ---------- | ------------------------------------------------------- |
| Figma MCP  | `mcp__figma-dev-mode-mcp-server__*` 도구 사용 가능 여부 |
| Context-7  | `mcp__context7__*` 도구 사용 가능 여부                  |
| Playwright | `mcp__playwright__*` 도구 사용 가능 여부                |
| Serena     | `mcp__serena__*` 도구 사용 가능 여부                    |

### 2. 미설치 도구 처리

<check if="any MCP tool not installed">
**⚠️ 다음 MCP 도구가 설치되지 않았습니다:**
{{missing_tools}}

해당 기능 없이 계속 진행하시겠습니까? [Y/N]

<action if="Y">해당 MCP 기능 비활성화 후 진행</action>
<action if="N">설치 안내 표시 후 워크플로우 종료</action>
</check>

### 3. 백로그 ID 확인

<check if="backlog_id in session context">
<action>세션에서 backlog_id 로드</action>
</check>

<check if="backlog_id not in context">
<ask>작업할 백로그 ID를 입력해주세요:</ask>
</check>

### 4. 세션 상태 로드 또는 생성

<action>세션 상태 파일 확인: {data_path}/{backlog_id}/session-state.yaml</action>

<check if="session state exists">
<action>기존 세션 상태 로드</action>

**📋 이전 세션 복원:**

- 백로그: {backlog_id}
- 현재 서브태스크: {current_subtask}/{total_subtasks}
- 완료된 백로그: {completed_count}개
- 마지막 작업: {last_updated}
  </check>

<check if="session state not exists">
<action>새 세션 상태 생성</action>

**🆕 새 세션 시작:**

- 백로그: {backlog_id}
  </check>

### 4b. 세션 복원 분기 (Checkpoint Restoration)

<check if="session state has current_step AND current_step is not empty">
**🔄 이전 세션 체크포인트 발견!**

| 항목 | 값 |
|------|-----|
| 저장된 스텝 | {current_step} |
| 저장 시간 | {checkpoint.saved_at} |
| 저장 이유 | {checkpoint.reason} |
| 진행상황 | {step_progress.checklist_completed}/{step_progress.checklist_total} |

<check if="checkpoint.reason == 'context_low'">
**⚠️ 이전 세션은 컨텍스트 부족으로 저장되었습니다.**
</check>

**선택하세요:**
| 옵션 | 설명 |
|------|------|
| **[R]** | 저장 지점에서 이어서 작업 (권장) |
| **[N]** | 처음부터 새로 시작 |

<action if="R">
체크포인트 정보를 유지하고, Section 5-6 완료 후 {current_step} 파일로 직접 이동
(Step 2 스킵)
</action>

<action if="N">
checkpoint 정보 초기화:
- current_step: ""
- checkpoint: 모두 비움
- step_progress: 모두 비움
이후 정상 플로우 (Step 2)로 진행
</action>
</check>

<check if="no current_step OR current_step is empty">
**ℹ️ 체크포인트 없음** - 정상 플로우로 진행
</check>

### 5. 서브태스크 목록 로드

<action>서브태스크 폴더 확인: {data_path}/{backlog_id}/subtasks/</action>

<check if="subtasks folder exists">
<action>서브태스크 목록 로드 및 카운트</action>
</check>

<check if="subtasks folder not exists">
**❌ 서브태스크를 찾을 수 없습니다.**

PM 에이전트에서 `*decompose` 명령으로 백로그를 분해해주세요.
<action>워크플로우 종료</action>
</check>

### 6. 코드 분석 결과 확인

<action>코드 분석 파일 확인: {data_path}/{backlog_id}/code-analysis.md</action>

<check if="code analysis exists">
**✅ 코드 분석 결과 발견** - Step 3에서 활용 가능
</check>

<check if="code analysis not exists">
**ℹ️ 코드 분석 결과 없음** - PM에서 `*analyze-code`로 생성 가능
</check>

### 7. 초기화 완료 및 진행

**✅ 초기화 완료**

- 백로그: {backlog_id}
- 서브태스크: {total_subtasks}개
- MCP 도구: {available_mcp_count}/{total_mcp_count}개 사용 가능

#### Menu Handling Logic:

<check if="user selected R in Section 4b (checkpoint restoration)">
**🔄 체크포인트에서 복원 중...**

저장된 스텝: {current_step}
진행상황: 체크리스트 {step_progress.checklist_completed} 완료

**저장 지점으로 이동합니다...**

<action>
{workflow_path}/steps/{current_step}.md 로드 및 실행
(Step 2, 3 스킵)
</action>
</check>

<check if="user selected N in Section 4b OR no checkpoint exists">
**서브태스크 선택 단계로 진행합니다...**

<action>
{nextStepFile} 로드 및 실행
</action>
</check>

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- MCP 설치 상태 확인 완료
- 백로그 ID 확인됨
- 서브태스크 목록 로드됨
- 세션 상태 로드/생성됨
- 체크포인트 존재 시: 사용자 선택에 따라 복원 또는 새 시작
- 정상 진행: Step 2로 이동 / 복원 진행: 저장된 스텝으로 직접 이동

### ❌ SYSTEM FAILURE:

- MCP 체크 없이 진행
- 서브태스크 없이 진행
- 세션 상태 처리 누락

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
