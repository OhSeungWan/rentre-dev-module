---
name: 'step-05-verify'
description: '구현 결과 검증 및 테스트 실행'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-05-verify.md'
nextStepFile: '{workflow_path}/steps/step-06-complete.md'
prevStepFile: '{workflow_path}/steps/step-04-implement.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
session_state_file: '{data_path}/{backlog_id}/session-state.yaml'
progress_file: '{data_path}/{backlog_id}/subtasks/{current_subtask_id}/progress.yaml'
---

# Step 5: 검증

## STEP GOAL:

구현된 코드를 검증합니다: vitest 실행, 완료 기준 확인, (선택적) E2E 테스트.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Ensure quality before marking complete

### Step-Specific Rules:

- 🎯 Focus ONLY on verification
- 🚫 FORBIDDEN to skip test execution
- 💬 Report test results clearly
- 🚪 Allow re-implementation if tests fail

## EXECUTION PROTOCOLS:

- 🎯 Run vitest for unit tests
- 💾 Check completion criteria
- 📖 Run E2E tests if applicable
- 🚫 FORBIDDEN to complete without passing tests

## SEQUENCE OF INSTRUCTIONS:

### 1. vitest 실행

**🧪 단위 테스트 실행**

<action>
npx vitest run {test_files} --reporter=verbose
</action>

**테스트 결과:**

<check if="all tests pass">
```
✅ 테스트 통과: {passed_count}/{total_count}

PASS src/module.test.ts
✓ should do something (5ms)
✓ should handle edge case (3ms)

```
</check>

<check if="some tests fail">
```

❌ 테스트 실패: {failed_count}/{total_count}

FAIL src/module.test.ts
✗ should do something
Expected: true
Received: false

```

**실패한 테스트:**
{failed_test_details}

재구현이 필요합니다.
</check>

### 2. 완료 기준 확인

**📋 완료 기준 체크리스트:**

<action>서브태스크의 completion_criteria 로드</action>

| 기준         | 상태  |
| ------------ | ----- |
| {criteria_1} | ✅ / ❌ |
| {criteria_2} | ✅ / ❌ |
| {criteria_3} | ✅ / ❌ |

<check if="all criteria met">
**✅ 모든 완료 기준 충족**
</check>

<check if="some criteria not met">
**⚠️ 충족되지 않은 기준:**
{unmet_criteria}

재구현 또는 강제 완료를 선택할 수 있습니다.
</check>

### 3. E2E 테스트 (선택적)

<check if="playwright available AND subtask is UI related">
**🌐 E2E 테스트 실행**

<action if="user wants e2e">
1. mcp__playwright__browser_navigate로 페이지 이동
2. mcp__playwright__browser_snapshot으로 상태 확인
3. mcp__playwright__browser_click 등으로 상호작용 테스트
</action>

**E2E 결과:**
{e2e_result}
</check>

<check if="e2e not applicable">
**ℹ️ E2E 테스트 해당 없음** - UI 관련 태스크 아니거나 Playwright 미설치
</check>

### 4. 검증 요약

**📊 검증 결과 요약:**

| 항목               | 결과              |
| ------------------ | ----------------- |
| vitest 단위 테스트 | {vitest_result}   |
| 완료 기준          | {criteria_result} |
| E2E 테스트         | {e2e_result}      |

### 5. 재구현 처리 (R 선택 시)

<check if="user selects R">
**🔄 재구현으로 돌아갑니다**

실패한 부분:
{failure_details}

<action>load {prevStepFile} to re-implement</action>
</check>

### 6. 강제 완료 처리 (F 선택 시)

<check if="user selects F">
**⚠️ 강제 완료**

다음 항목이 미완료 상태로 완료 처리됩니다:
{incomplete_items}

정말 강제 완료하시겠습니까? [Y/N]

<action if="Y">
세션 상태에 forced_complete 플래그 추가
완료 처리로 진행
</action>
</check>

### 7. Present MENU OPTIONS

<check if="all verifications pass">
Display: **✅ 검증 통과!** [C] 완료 처리 | [E] E2E 추가 실행 | [R] 재구현
</check>

<check if="some verifications fail">
Display: **⚠️ 검증 실패** [R] 재구현 | [F] 강제 완료 | [E] E2E 테스트
</check>

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to completion when verification passes or forced
- Allow re-implementation loop

#### Menu Handling Logic:
- IF C:
  1. 검증 통과 확인
  2. 🆕 Update {progress_file}: `status: "verified"`, `tests.passed: true`
  3. 🆕 Update {session_state_file}: `stepsCompleted: [1, 2, 3, 4, 5]`
  4. Load {nextStepFile}
- IF R: load {prevStepFile} for re-implementation
- IF F:
  1. 강제 완료 확인
  2. 🆕 Update {progress_file}: `status: "force_completed"`
  3. 🆕 Update {session_state_file}: `stepsCompleted: [1, 2, 3, 4, 5]`
  4. Load {nextStepFile}
- IF E: E2E 테스트 실행 후 메뉴 재표시
- IF Any other: 응답 후 메뉴 재표시

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected (with passing tests) OR F is confirmed will you load {nextStepFile} for completion.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- vitest 실행됨
- 완료 기준 확인됨
- 결과 명확히 보고됨
- 적절한 옵션 제공됨

### ❌ SYSTEM FAILURE:
- 테스트 실행 없이 완료
- 실패 무시하고 진행
- 결과 보고 누락

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```
