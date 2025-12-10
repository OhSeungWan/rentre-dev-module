---
name: 'step-08-complete'
description: '완료 요약 및 Dev handoff'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-08-complete.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'

# Step References for Re-decompose
step02File: '{workflow_path}/steps/step-02-select-backlog.md'
---

# Step 8: 완료 요약 및 Dev handoff

**Progress: Step 8 of 8** - Final Step

## STEP GOAL:

🆕 **Block-based Traceability**: 분해 워크플로우 완료를 요약하고, 블록 커버리지 결과를 표시합니다.
다음 작업 옵션을 제시하고 Dev 에이전트로의 핸드오프를 지원합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 completing the workflow
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 워크플로우 완료 및 핸드오프 전문성, user brings 다음 작업 결정
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 완료 요약 및 다음 작업 옵션 제시
- 🚫 FORBIDDEN to 완료 요약 누락
- 💬 Approach: 명확한 완료 요약 및 Dev 에이전트 핸드오프 정보 제공
- 📋 OFFER 다음 작업 선택지 제공

## EXECUTION PROTOCOLS:

- 🎯 완료 요약 표시
- 💾 다음 작업 옵션 제시
- 📖 Dev 에이전트 핸드오프 정보 제공
- 🚫 FORBIDDEN 핸드오프 컨텍스트 정보 부족

## CONTEXT BOUNDARIES:

- Available context: 전체 분해 결과, 추적성 정보, 저장 위치
- Focus: 완료 요약 및 다음 작업 옵션
- Limits: 이 스텝이 마지막
- Dependencies: 저장 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. decompose.yaml 로드 (CRITICAL - 최종 컨텍스트 복원)

스텝 시작 시 `{decompose_state_file}` 로드:

```yaml
action:
  - {decompose_state_file} 로드
  - 전체 워크플로우 결과 확인:
    - backlog_id, stepsCompleted
    - selected_backlog (step 2)
    - children (step 5) - 생성된 하위 백로그
    - verification (step 6) - 커버리지 메트릭
    - save_result (step 7) - 저장 위치
  - 메모리에 컨텍스트 복원
```

### 1. 완료 요약 표시

> "**✅ 백로그 분해 완료! (Block-based Traceability)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **상위 백로그:** {backlog_type} - {backlog_title}
> **생성된 하위 백로그:** {child_count}개 ({target_child_type})
> **분해 강도:** {selected_detail_level}
>
> **계층 구조 (블록 기반):**
>
> ```
> {backlog_title} ({backlog_type})
> ├── {child_1_title} - 📦 BLK-001, BLK-002
> ├── {child_2_title} - 📦 BLK-003
> ├── {child_3_title} - 📦 BLK-004, BLK-005
> └── ...
> ```
>
> **🆕 📦 블록 커버리지 (정보 소실 방지):**
>
> | 메트릭      | 값                  | 상태               |
> | ----------- | ------------------- | ------------------ |
> | 전체 블록   | {total_blocks}개    | -                  |
> | 커버된 블록 | {covered_blocks}개  | ✅                 |
> | 커버리지    | {coverage_percent}% | {coverage_status}  |
> | 미커버 블록 | {uncovered_count}개 | {uncovered_status} |
> | 공유 블록   | {shared_count}개    | ℹ️                 |
>
> **📊 추적성 요약:**
>
> - 요구사항 커버리지: {req_coverage}%
> - 수용 기준 커버리지: {ac_coverage}%
>
> **저장 위치:**
>
> - 로컬: `{local_path}`
> - 노션: {notion_status}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 2. 다음 작업 선택

사용자에게 질문:

> "**다음 작업을 선택해 주세요:**
>
> 1. 🚀 **Dev 에이전트로 전환** - 바로 구현 시작
> 2. 🔄 **하위 백로그 다시 분해** - 예: Story → Task
> 3. 📋 **다른 백로그 분해** - 새 백로그 선택
> 4. 📊 **추적성 매트릭스 상세 보기**
> 5. ✅ **완료** - 워크플로우 종료"

**Wait for user response.**

### 3. 선택지 처리

#### Option 1 - Dev 에이전트 전환

> "**🚀 Dev 에이전트로 전환합니다!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **전달할 컨텍스트:**
>
> - **백로그:** {backlog_title}
> - **하위 백로그:** {child_count}개
> - **코드 분석:** {code_analysis_status}
> - **작업 폴더:** {backlog_folder}
>
> **🆕 Block-based Traceability 정보:**
>
> - **블록 커버리지:** {coverage_percent}%
> - **각 태스크에 inherited_content 포함** ✅
> - **원본 지시사항 자동 표시** ✅
>
> **Dev 에이전트에서 사용 가능한 명령:**
>
> - `*continue` - 작업 이어서 진행
> - `*execute [child_id]` - 특정 하위 백로그 구현
> - `*status` - 전체 진행 상태 확인
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

Dev 에이전트 로드 안내 또는 자동 전환

#### Option 2 - 하위 백로그 다시 분해

> "**어떤 하위 백로그를 분해하시겠습니까?**
>
> {children_list_with_numbers}"

**Wait for user response.**

선택된 하위 백로그를 source_backlog로 설정하고 Step 2로 이동:

```yaml
action:
  - Set selected child as new source_backlog
  - Reset stepsCompleted to [1]
  - goto: { step02File }
```

#### Option 3 - 다른 백로그 분해

Step 2로 이동하여 새 백로그 선택:

```yaml
action:
  - Clear current backlog context
  - Reset stepsCompleted to [1]
  - goto: { step02File }
```

#### Option 4 - 추적성 매트릭스 상세

> "**📊 추적성 매트릭스 상세 (Block-based)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **🆕 블록 → 하위 백로그 매핑:**
>
> | 블록 ID | 블록 내용 미리보기 | 담당 백로그                      | 상태      |
> | ------- | ------------------ | -------------------------------- | --------- |
> | BLK-001 | 구조화 데이터...   | {child_1_title}                  | ✅        |
> | BLK-002 | 새롭게 추가...     | {child_1_title}                  | ✅        |
> | BLK-003 | 헤딩 구조...       | {child_2_title}                  | ✅        |
> | BLK-004 | 수용 기준...       | {child_1_title}, {child_2_title} | ⚠️ shared |
> | ...     | ...                | ...                              | ...       |
>
> **요구사항 → 하위 백로그 매핑:**
>
> | 요구사항 | 출처 블록        | 담당 백로그     |
> | -------- | ---------------- | --------------- |
> | REQ-001  | BLK-001, BLK-002 | {child_1_title} |
> | REQ-002  | BLK-003          | {child_2_title} |
> | ...      | ...              | ...             |
>
> **수용 기준 → 하위 백로그 매핑:**
>
> | 수용 기준 | 출처 블록 | 담당 백로그     |
> | --------- | --------- | --------------- |
> | AC-001    | BLK-004   | {child_1_title} |
> | AC-002    | BLK-004   | {child_2_title} |
> | ...       | ...       | ...             |
>
> **🆕 하위 백로그별 상속된 컨텐츠:**
>
> | 하위 백로그     | 담당 블록        | 상속된 컨텐츠 |
> | --------------- | ---------------- | ------------- |
> | {child_1_title} | BLK-001, BLK-002 | ✅ 포함됨     |
> | {child_2_title} | BLK-003          | ✅ 포함됨     |
> | ...             | ...              | ...           |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

다시 다음 작업 선택으로 돌아감

#### Option 5 - 완료

> "**🎉 백로그 분해 워크플로우를 완료합니다!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **작업 요약:**
>
> - 분해된 백로그: {backlog_title}
> - 생성된 하위 백로그: {child_count}개
> - 추적성: 100% 커버
>
> **저장된 위치:**
>
> - 로컬: `{local_path}`
> - 노션: {notion_status}
>
> 감사합니다! 🙏
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

워크플로우 종료

---

## CRITICAL STEP COMPLETION NOTE

decompose.yaml 최종 업데이트:

```yaml
action:
  - {decompose_state_file} 로드
  - stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8] 업데이트
  - status: "completed" 추가
  - completed_at: "{timestamp}" 추가
  - updated_at: "{timestamp}" 업데이트
  - 파일 저장

# decompose.yaml 최종 상태
status: "completed"
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
completed_at: "2025-12-10"
```

This is the final step of the decompose-backlog workflow. The workflow ends here unless the user chooses to continue with another decomposition or Dev handoff.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 완료 요약 표시
- 다음 작업 옵션 제공
- Dev 에이전트 핸드오프 정보 제공
- 추적성 매트릭스 상세 보기 가능
- User's next action choice handled correctly

### ❌ SYSTEM FAILURE:

- 완료 요약 누락
- 핸드오프 컨텍스트 정보 부족
- 다음 작업 옵션 미제공
- Not respecting user's choice

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
