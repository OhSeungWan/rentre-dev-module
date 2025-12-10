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
session_state_file: '{data_path}/{backlog_id}/session-state.yaml'
session_state_template: '{workflow_path}/templates/session-state.yaml'
progress_template: '{workflow_path}/templates/progress.yaml'
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
- 🆕 💾 Use stepsCompleted array for session resumption

## EXECUTION PROTOCOLS:

- 🎯 Check MCP installation status
- 💾 Load or create session state
- 🆕 📖 Use stepsCompleted to determine resume point
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

<action>세션 상태 파일 확인: {session_state_file}</action>

<check if="session state exists">
<action>기존 세션 상태 로드</action>

**📋 이전 세션 발견:**

| 항목 | 값 |
|------|-----|
| 백로그 | {backlog_id} |
| 현재 서브태스크 | {current_subtask}/{total_subtasks} |
| 완료된 서브태스크 | {completed_subtasks.length}개 |
| 마지막 작업 | {last_updated} |
</check>

<check if="session state not exists">
<action>새 세션 상태 생성 from {session_state_template}</action>

**🆕 새 세션 시작:**

- 백로그: {backlog_id}
</check>

### 4b. 🆕 세션 복원 분기 (stepsCompleted 기반)

<action>
Load session state and check:
1. stepsCompleted array
2. session.can_resume flag
3. session.current_subtask_id
</action>

<check if="stepsCompleted.length > 1 OR session.can_resume == true">
**🔄 이전 세션 진행 상태 발견!**

| 항목 | 값 |
|------|-----|
| 🆕 완료된 스텝 | {stepsCompleted} |
| 마지막 스텝 | {session.last_step} |
| 현재 서브태스크 | {session.current_subtask_id} |
| 중간 저장 | {session.can_resume ? "있음" : "없음"} |

<check if="session.can_resume == true">
**💾 구현 중간 진행 상태 발견!**

progress.yaml 위치: `{data_path}/{backlog_id}/subtasks/{session.current_subtask_id}/progress.yaml`

<action>Load progress.yaml and display:</action>

| 항목 | 값 |
|------|-----|
| 서브태스크 | {subtask_title} |
| 체크리스트 진행 | {checklist.completed.length}/{checklist.total} |
| 변경된 파일 | {files_changed.length}개 |
| 작성된 테스트 | {tests.written.length}개 |
</check>

**선택하세요:**

| 옵션 | 설명 |
|------|------|
| **[R]** | 저장 지점에서 이어서 작업 (권장) |
| **[N]** | 처음부터 새로 시작 |

<action if="R">
🆕 stepsCompleted 기반 라우팅:

```yaml
routing:
  stepsCompleted: [1] → step-02-select.md
  stepsCompleted: [1,2] → step-03-context.md
  stepsCompleted: [1,2,3] → step-04-implement.md (progress.yaml 복원)
  stepsCompleted: [1,2,3,4] → step-05-verify.md
  stepsCompleted: [1,2,3,4,5] → step-06-complete.md
```

마지막 완료 스텝 기준으로 다음 스텝 로드
</action>

<action if="N">
세션 상태 초기화:

```yaml
stepsCompleted: [1]
session:
  last_step: ""
  can_resume: false
  current_subtask_id: ""
```

이후 정상 플로우 (Step 2)로 진행
</action>
</check>

<check if="stepsCompleted.length <= 1 AND session.can_resume == false">
**ℹ️ 이전 진행 상태 없음** - 정상 플로우로 진행
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

| 항목 | 값 |
|------|-----|
| 백로그 | {backlog_id} |
| 서브태스크 | {total_subtasks}개 |
| MCP 도구 | {available_mcp_count}/{total_mcp_count}개 사용 가능 |
| 🆕 stepsCompleted | {stepsCompleted} |

<action>
Update {session_state_file}:

```yaml
stepsCompleted: [1]  # Step 1 완료
last_updated: "{timestamp}"
```
</action>

#### Menu Handling Logic:

<check if="user selected R in Section 4b (resume)">
**🔄 저장 지점에서 복원 중...**

🆕 **stepsCompleted 기반 라우팅:**

| stepsCompleted | 다음 스텝 | 설명 |
|----------------|-----------|------|
| [1] | step-02-select | 서브태스크 선택 |
| [1,2] | step-03-context | 컨텍스트 준비 |
| [1,2,3] | step-04-implement | 구현 (progress.yaml 복원) |
| [1,2,3,4] | step-05-verify | 검증 |
| [1,2,3,4,5] | step-06-complete | 완료 처리 |

<action>
마지막 완료 스텝 확인 후 다음 스텝 파일 로드:

IF stepsCompleted includes 4 AND session.can_resume:
  - step-04-implement.md 로드
  - progress.yaml에서 체크리스트 진행 상태 복원
ELSE:
  - stepsCompleted 기반 다음 스텝 로드
</action>
</check>

<check if="user selected N in Section 4b OR no previous session">
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
- 🆕 stepsCompleted 배열 확인 및 업데이트
- 🆕 session.can_resume 확인
- 복원 시: stepsCompleted 기반 올바른 스텝으로 라우팅
- 정상 진행: Step 2로 이동

### ❌ SYSTEM FAILURE:

- MCP 체크 없이 진행
- 서브태스크 없이 진행
- 세션 상태 처리 누락
- 🆕 stepsCompleted 무시
- 🆕 progress.yaml 복원 실패 (can_resume 시)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
