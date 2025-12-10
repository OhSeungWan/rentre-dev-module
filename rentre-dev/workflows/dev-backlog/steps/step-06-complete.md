---
name: 'step-06-complete'
description: '서브태스크 완료 처리 및 다음 진행 결정'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-06-complete.md'
selectStepFile: '{workflow_path}/steps/step-02-select.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
session_state_file: '{data_path}/{backlog_id}/session-state.yaml'
progress_file: '{data_path}/{backlog_id}/subtasks/{current_subtask_id}/progress.yaml'
---

# Step 6: 완료 처리

## STEP GOAL:

서브태스크를 완료 처리하고, 세션 상태를 저장하며, 다음 작업을 결정합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Properly close out completed work

### Step-Specific Rules:

- 🎯 Focus on completion and state management
- 🚫 FORBIDDEN to skip state saving
- 💬 Summarize what was accomplished
- 🚪 Offer next steps clearly

## EXECUTION PROTOCOLS:

- 🎯 Update subtask status to completed
- 💾 Save session state with sidecar
- 📖 Present next action options
- 🚫 FORBIDDEN to exit without saving

## SEQUENCE OF INSTRUCTIONS:

### 1. 서브태스크 완료 처리

**✅ 서브태스크 완료: {current_subtask_title}**

<action>
1. 서브태스크 파일 업데이트:
   - 모든 체크리스트 항목 [x] 완료 표시
   - status: completed 설정
   - completed_at: {current_timestamp} 추가
   - completed_by: dev-agent 추가

2. 완료 요약 추가:
   - 변경된 파일 목록
   - 작성된 테스트 목록
   - 특이사항
     </action>

**서브태스크 파일 업데이트됨:** {subtask_file_path}

### 2. 세션 상태 저장

<action>
1. Update {progress_file}:

```yaml
status: "completed"
last_updated: "{timestamp}"
save_reason: "subtask_complete"
```

2. Update {session_state_file}:

```yaml
backlog_id: '{backlog_id}'
stepsCompleted: [1, 2, 3, 4, 5, 6]  # 🆕 Full cycle complete
current_subtask: {next_subtask_number}
completed_subtasks: [{completed_list}]
total_subtasks: {total_count}
last_updated: '{current_timestamp}'
last_completed: '{current_subtask_id}'
session:
  last_step: ""           # 🆕 Reset for next subtask
  can_resume: false       # 🆕 No mid-step progress
  current_subtask_id: ""  # 🆕 Clear current
```
</action>

**세션 상태 저장됨**

### 3. 진행 현황 업데이트

**📊 백로그 진행 현황:**

| 상태      | 개수                  | 변화 |
| --------- | --------------------- | ---- |
| ✅ 완료   | {new_completed_count} | +1   |
| 🔄 진행중 | {in_progress_count}   |      |
| ⏳ 대기   | {new_pending_count}   | -1   |
| **총계**  | **{total_count}**     |      |

**진행률:** {progress_percentage}% ({completed_count}/{total_count})

### 4. 완료 요약

**🎉 완료된 작업 요약:**

**서브태스크:** {current_subtask_title}

**변경 사항:**

- 수정된 파일: {changed_files_list}
- 추가된 테스트: {test_files_list}
- 라인 변경: +{lines_added} / -{lines_removed}

**소요 시간:** {elapsed_time} (추정)

### 5. 노션 동기화 (활성화된 경우)

<check if="auto_sync enabled">
<action>
노션 동기화 트리거:
- 서브태스크 상태 업데이트
- 진행률 업데이트
- 완료 타임스탬프 기록
</action>

**📤 노션 동기화 완료**
</check>

<check if="auto_sync disabled">
**ℹ️ 노션 동기화 비활성화** - 수동 동기화 필요시 `*sync` 명령 사용
</check>

### 6. 다음 작업 결정

<check if="more subtasks remaining">
**📋 남은 서브태스크: {remaining_count}개**

다음에 작업할 서브태스크:

- [{next_subtask_number}] {next_subtask_title}
  </check>

<check if="all subtasks completed">
**🎊 모든 서브태스크 완료!**

백로그 {backlog_id}의 모든 작업이 완료되었습니다.

**다음 단계 추천:**

- PR 요약 생성
- QA 에이전트에게 검토 요청
  </check>

### 7. Present MENU OPTIONS

<check if="more subtasks remaining">
Display: **다음 작업:** [N] 다음 서브태스크 | [P] PR 요약 생성 | [Q] 종료
</check>

<check if="all subtasks completed">
Display: **백로그 완료!** [P] PR 요약 생성 | [A] QA 에이전트 호출 | [Q] 종료
</check>

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- Ensure state is saved before any navigation
- Properly handle workflow completion

#### Menu Handling Logic:

- IF N:
  1. 🆕 Reset {session_state_file}: `stepsCompleted: [1]` (다음 서브태스크용)
  2. Load {selectStepFile} to select next subtask
- IF P: PR 요약 워크플로우 실행
- IF A: QA 에이전트 로드
- IF Q: 최종 저장 확인 후 워크플로우 종료
- IF Any other: 응답 후 메뉴 재표시

## WORKFLOW COMPLETION (Q 선택 시)

<check if="user selects Q">
**워크플로우 종료**

**세션 요약:**

- 완료된 서브태스크: {session_completed_count}개
- 변경된 파일: {total_changed_files}개
- 작성된 테스트: {total_test_files}개

세션 상태가 저장되었습니다.
다음에 이 워크플로우를 실행하면 이어서 작업할 수 있습니다.

**수고하셨습니다! 👋**
</check>

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 서브태스크 상태 업데이트됨
- 세션 상태 저장됨
- 진행 현황 정확히 표시됨
- 다음 작업 옵션 제공됨

### ❌ SYSTEM FAILURE:

- 상태 업데이트 누락
- 세션 저장 실패
- 잘못된 진행률 표시

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
