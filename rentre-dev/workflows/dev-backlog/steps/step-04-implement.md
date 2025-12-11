---
name: 'step-04-implement'
description: '코드 구현 및 vitest 테스트 작성'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-04-implement.md'
nextStepFile: '{workflow_path}/steps/step-05-verify.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
session_state_file: '{data_path}/{backlog_id}/session-state.yaml'

# 🆕 Progress Tracking
progress_file: '{data_path}/{backlog_id}/subtasks/{current_subtask_id}/progress.yaml'
progress_template: '{workflow_path}/templates/progress.yaml'

# 🆕 Context Reference (from Step 3)
context_file: '{data_path}/{backlog_id}/subtasks/{current_subtask_id}/context.yaml'
---

# Step 4: 구현 + 테스트

## STEP GOAL:

🆕 **Block-based Traceability**: 서브태스크의 코드를 구현하고, vitest 단위 테스트를 작성합니다.
상속된 원본 지시사항(`inherited_content`)을 참조하여 정보 소실 없이 정확하게 구현합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Write clean, testable code with proper tests

### Step-Specific Rules:

- 🎯 Focus on implementation AND testing
- 🚫 FORBIDDEN to skip test writing
- 💬 Explain changes as you implement
- 🚪 Complete both code and tests before proceeding
- 🆕 💾 **AUTO-SAVE**: Save progress to {progress_file} after each action

## EXECUTION PROTOCOLS:

- 🎯 Implement code following existing patterns
- 💾 Write vitest tests for new code
- 📖 Update checklist items as completed
- 🚫 FORBIDDEN to proceed without tests
- 🆕 💾 **CRITICAL**: Update {progress_file} after every checklist completion, file change, or test written

---

## 🆕 SECTION 0: Progress State Management

### 0a. Load or Create Progress File

<action>
1. Check if {progress_file} exists
2. IF exists: Load progress and restore state
3. IF not exists: Create from {progress_template}
</action>

<check if="progress_file exists">
**🔄 이전 진행 상태 복원**

```yaml
# Loaded from {progress_file}
subtask_id: {current_subtask_id}
status: {status}
checklist:
  completed: {completed_items}
  current: {current_item}
files_changed: {files_changed_count}개
tests_written: {tests_count}개
```

**이어서 진행합니다: 체크리스트 항목 {current_item}부터**
</check>

<check if="progress_file not exists">
<action>
Create {progress_file} from template:

```yaml
subtask_id: "{current_subtask_id}"
subtask_title: "{current_subtask_title}"
status: "in_progress"
checklist:
  total: {checklist_total}
  completed: []
  current: 1
files_changed: []
tests:
  written: []
  passed: false
  last_run: ""
started_at: "{timestamp}"
last_updated: "{timestamp}"
save_reason: "step_started"
```
</action>

**🆕 새 구현 시작**
</check>

### 0b. Load Context from Step 3

<check if="context_file exists">
<action>Load {context_file} for implementation reference</action>

**📋 Step 3에서 수집된 컨텍스트:**

| 항목 | 상태 |
|------|------|
| 상속된 지시사항 | {context.status_summary.inherited_content} |
| 코드 분석 | {context.status_summary.code_analysis} |
| Figma 스펙 | {context.status_summary.figma} |
| API 문서 | {context.status_summary.api_docs} |

<check if="context.inherited_content.exists">
**⚠️ 원본 지시사항 제약조건:**
{context.inherited_content.constraints}
</check>

</check>

<check if="context_file not exists">
**⚠️ Step 3 컨텍스트 파일 없음** - 서브태스크 파일에서 직접 컨텍스트 참조
</check>

### 0c. Auto-Save Protocol

**🔄 자동 저장 트리거:**

| 트리거 | 저장 내용 | 저장 이유 |
|--------|-----------|-----------|
| 체크리스트 항목 완료 | `checklist.completed` 업데이트 | `checklist_complete` |
| 파일 변경 (Edit/Write) | `files_changed` 배열에 추가 | `file_changed` |
| 테스트 파일 작성 | `tests.written` 배열에 추가 | `test_written` |
| 사용자 [S] 선택 | 전체 상태 저장 | `user_request` |

---

## SEQUENCE OF INSTRUCTIONS:

### 1. 구현 계획 확인

**🔨 구현 시작: {current_subtask_title}**

**작업 단계 체크리스트:**
{steps_with_checkboxes}

각 단계를 순서대로 진행합니다.

### 1b. 🆕 원본 지시사항 재확인 (Block-based Traceability)

<check if="inherited_content exists">
**⚠️ 구현 전 원본 지시사항 확인!**

> **📝 상속된 지시사항:**
>
> ```
> {inherited_content_summary}
> ```

**🚨 핵심 제약조건:**

- ⚠️ {constraint_1}
- ⚠️ {constraint_2}
- ...

**📌 이 제약조건들을 반드시 준수하며 구현하세요!**

</check>

### 2. 코드 구현 (with Auto-Save)

각 체크리스트 항목에 대해:

<action>
1. 관련 파일 읽기 (Read 또는 **Serena MCP** 사용)
2. 기존 코드 패턴 파악
3. 수정/추가 코드 작성 (Edit/Write 또는 **Serena MCP** 사용)
4. 🆕 **파일 변경 시 즉시 progress.yaml 업데이트**
5. 체크리스트 항목 완료 표시
6. 🆕 **체크리스트 완료 시 즉시 progress.yaml 업데이트**
</action>

#### 🆕 파일 변경 후 자동 저장

<action after="file edit/write">
Update {progress_file}:

```yaml
files_changed:
  - path: "{changed_file_path}"
    action: "{created|modified|deleted}"
    timestamp: "{timestamp}"
last_updated: "{timestamp}"
save_reason: "file_changed"
```
</action>

#### 🆕 체크리스트 항목 완료 후 자동 저장

<action after="checklist item complete">
Update {progress_file}:

```yaml
checklist:
  completed: [{updated_completed_list}]
  current: {next_item_number}
last_updated: "{timestamp}"
save_reason: "checklist_complete"
```
</action>

**🔧 Serena MCP 도구 활용 (권장):**

```yaml
# 1. 파일 구조 파악
tool: mcp__serena__get_symbols_overview
params:
  relative_path: "{target_file}"

# 2. 수정할 심볼 찾기 + 소스 확인
tool: mcp__serena__find_symbol
params:
  name_path: "{function_or_class_name}"
  relative_path: "{file_path}"
  include_body: true  # 소스 코드 포함

# 3. 영향 범위 분석 (수정 전)
tool: mcp__serena__find_referencing_symbols
params:
  name_path: "{symbol_to_modify}"
  relative_path: "{file_path}"

# 4. 심볼 단위 코드 수정
tool: mcp__serena__replace_symbol_body
params:
  name_path: "{symbol_name}"
  relative_path: "{file_path}"
  body: "{new_implementation}"

# 5. 새 코드 추가 (함수/클래스/import)
tool: mcp__serena__insert_after_symbol  # 또는 insert_before_symbol
params:
  name_path: "{reference_symbol}"
  relative_path: "{file_path}"
  body: "{new_code}"
```

**⚠️ Serena 사용 시 주의:**
- 프로젝트가 활성화되어 있어야 함
- `replace_symbol_body`는 심볼 전체를 교체함
- 변경 전 `find_referencing_symbols`로 영향 범위 확인 권장

**구현 원칙:**

- 기존 코드 스타일 따르기
- 최소한의 변경으로 목표 달성
- 명확한 변수명과 함수명 사용
- 필요한 곳에 주석 추가
- 🆕 **상속된 원본 지시사항의 제약조건 준수**

### 3. vitest 테스트 작성 (with Auto-Save)

**🧪 테스트 작성**

<action>
1. 테스트 파일 위치 결정: {related_file}.test.ts 또는 {related_file}.spec.ts
2. 테스트 케이스 작성:
   - 정상 동작 테스트
   - 엣지 케이스 테스트
   - 에러 핸들링 테스트
3. 🆕 **테스트 파일 작성 후 즉시 progress.yaml 업데이트**
</action>

#### 🆕 테스트 작성 후 자동 저장

<action after="test file written">
Update {progress_file}:

```yaml
tests:
  written:
    - "{test_file_path}"
  passed: false
  last_run: ""
last_updated: "{timestamp}"
save_reason: "test_written"
```
</action>

**테스트 템플릿:**

```typescript
import { describe, it, expect } from 'vitest'
import { functionName } from './module'

describe('functionName', () => {
  it('should do something', () => {
    // Arrange
    const input = ...

    // Act
    const result = functionName(input)

    // Assert
    expect(result).toBe(expected)
  })

  it('should handle edge case', () => {
    // ...
  })
})
```

### 4. 구현 진행 상황 표시

**📊 진행 상황:**

| 단계         | 상태      |
| ------------ | --------- |
| 체크리스트 1 | ✅ 완료   |
| 체크리스트 2 | 🔄 진행중 |
| 체크리스트 3 | ⏳ 대기   |
| 테스트 작성  | ⏳ 대기   |

**🆕 progress.yaml 상태:**
- 마지막 저장: {last_updated}
- 저장 이유: {save_reason}

### 5. 도움 요청 처리 (H 선택 시)

<check if="user needs help">
**❓ 어떤 도움이 필요하신가요?**

1. 기술적 문제 해결
2. 코드 패턴 조언
3. 테스트 작성 가이드
4. API 문서 조회 (Context-7)
5. 코드베이스 검색 (Serena)

<action>도움 제공 후 구현 계속</action>
</check>

### 6. 세션 저장 처리 (S 또는 P 선택 시)

<check if="user selects S or P">
**💾 세션 저장**

<action>
1. Update {progress_file} with full state:

```yaml
subtask_id: "{current_subtask_id}"
subtask_title: "{current_subtask_title}"
status: "in_progress"
checklist:
  total: {total_items}
  completed: [{completed_item_numbers}]
  current: {current_item}
files_changed:
  {files_changed_list}
tests:
  written: [{test_files_list}]
  passed: false
  last_run: ""
started_at: "{started_at}"
last_updated: "{timestamp}"
save_reason: "user_request"
notes:
  - "{any_notes}"
```

2. Update {session_state_file}:

```yaml
session:
  last_step: "step-04-implement"
  can_resume: true
  current_subtask_id: "{current_subtask_id}"
last_updated: "{timestamp}"
```
</action>

**✅ 세션이 저장되었습니다.**

**저장된 정보:**
| 항목 | 값 |
|------|-----|
| 현재 스텝 | step-04-implement |
| 서브태스크 | {current_subtask_id} |
| 체크리스트 | {completed_count}/{total_items} 완료 |
| 변경된 파일 | {files_changed_count}개 |
| 작성된 테스트 | {tests_written_count}개 |
| 저장 위치 | {progress_file} |

다음 세션에서 `dev-backlog` 워크플로우 실행 시 이 지점에서 이어서 작업합니다.

<check if="S selected">
**종료하시겠습니까?** [Y] 종료 | [N] 계속 작업

<action if="Y">워크플로우 종료</action>
<action if="N">구현 계속, 메뉴 재표시</action>
</check>

<check if="P selected">
**⏸️ 워크플로우 일시 정지**

다음에 이 워크플로우를 다시 실행하면 이어서 작업할 수 있습니다.
<action>워크플로우 종료</action>
</check>
</check>

### 7. 구현 완료 확인

<check if="all checklist items completed AND tests written">
**✅ 구현 완료**

**완료된 작업:**

- 코드 변경: {changed_files_count}개 파일
- 테스트 추가: {test_files_count}개 파일
- 체크리스트: {completed_items}/{total_items} 완료

<check if="inherited_content exists">
**🆕 원본 지시사항 준수 확인:**

| 제약조건       | 준수 여부 |
| -------------- | --------- |
| {constraint_1} | ✅ / ❌   |
| {constraint_2} | ✅ / ❌   |
| ...            | ...       |

⚠️ **모든 제약조건이 준수되었는지 확인하세요!**
</check>

🆕 **progress.yaml 최종 업데이트:**

<action>
Update {progress_file}:

```yaml
status: "pending_verification"
last_updated: "{timestamp}"
save_reason: "implementation_complete"
```
</action>
</check>

<check if="implementation incomplete">
**⚠️ 아직 완료되지 않은 항목이 있습니다:**
{incomplete_items}

계속 진행하시겠습니까?
</check>

### 8. Present MENU OPTIONS

Display: **구현 상태:** [C] 검증으로 진행 | [S] 세션 저장 | [H] 도움 요청 | [P] 일시 정지

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- Check implementation completeness before allowing C
- After help, save, or pause, return to implementation or exit as appropriate
- 🆕 Progress is auto-saved, so user can safely exit anytime

#### Menu Handling Logic:

- IF C:
  1. 🆕 Update {session_state_file}: `stepsCompleted: [1, 2, 3, 4]`
  2. 🆕 Update {progress_file}: `status: "pending_verification"`
  3. Load {nextStepFile}
- IF S: 세션 저장 처리 (Section 6) 실행, 종료 여부 확인
- IF H: 도움 제공 후 구현 계속, 메뉴 재표시
- IF P: 세션 저장 후 워크플로우 일시 정지
- IF Any other: 응답 후 메뉴 재표시

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected AND implementation is complete (code + tests) will you:
1. 🆕 Update {session_state_file} with `stepsCompleted: [1, 2, 3, 4]`
2. 🆕 Update {progress_file} with `status: "pending_verification"`
3. Load {nextStepFile} for verification.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 체크리스트 항목 구현됨
- vitest 테스트 작성됨
- 기존 코드 패턴 준수
- 🆕 progress.yaml에 진행상황 자동 저장됨
- 🆕 stepsCompleted 업데이트됨

### ❌ SYSTEM FAILURE:

- 테스트 없이 진행
- 체크리스트 무시
- 기존 패턴 무시
- 🆕 progress.yaml 저장 누락
- 🆕 stepsCompleted 업데이트 누락

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
