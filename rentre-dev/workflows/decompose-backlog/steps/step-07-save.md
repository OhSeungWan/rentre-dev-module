---
name: 'step-07-save'
description: '하위 백로그 저장 - decompose.yaml에서 children 읽어 파일 생성'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-07-save.md'
nextStepFile: '{workflow_path}/steps/step-08-complete.md'
previousStepFile: '{workflow_path}/steps/step-06-verify.md'
workflowFile: '{workflow_path}/workflow.md'

# Session State
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'
children_folder: '{backlog_folder}/children'
---

# Step 7: 하위 백로그 저장

**Progress: Step 7 of 8** - Next: 완료 요약 및 Dev handoff

## STEP GOAL:

🆕 **Block-based Traceability**: 분해된 하위 백로그를 로컬 파일 시스템 및/또는 노션에 저장합니다.
각 하위 백로그에는 `covers`, `inherited_content`, `siblings` 정보가 포함됩니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 with storage management expertise
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 데이터 저장 전문성, user brings 저장 위치 선호도 및 노션 설정
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 하위 백로그 저장
- 🚫 FORBIDDEN to 저장 위치 확인 없이 저장
- 💬 Approach: 사용자에게 저장 위치 선택권 제공
- 📋 ENSURE 추적성 정보 포함하여 저장

## EXECUTION PROTOCOLS:

- 🎯 저장 위치 선택 (로컬/노션/둘 다)
- 💾 추적성 정보 포함하여 저장
- 📖 계층 구조 (폴더/관계) 유지
- 🚫 FORBIDDEN 부분 저장 (일부만 성공)

## CONTEXT BOUNDARIES:

- Available context: 백로그 정보, 🆕 content_blocks, 분해된 하위 백로그 (with covers, inherited_content, siblings), 노션 페이지 ID
- Focus: 하위 백로그 저장 (Block-based 구조)
- Limits: 완료 요약은 다음 스텝에서 수행
- Dependencies: 블록 커버리지 검증 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. decompose.yaml 로드 (CRITICAL - 컨텍스트 복원)

스텝 시작 시 `{decompose_state_file}` 로드:

```yaml
action:
  - {decompose_state_file} 로드
  - 이전 스텝 결과 확인:
    - backlog_id, stepsCompleted
    - selected_backlog (step 2)
    - children (step 5) - 저장할 하위 백로그 데이터
    - verification (step 6) - 검증 통과 여부
  - 메모리에 컨텍스트 복원

check: verification.passed == true
  - true: 저장 진행
  - false: 경고 표시 후 사용자 확인 요청
```

### 1. 저장 위치 선택

사용자에게 질문:

> "**분해된 하위 백로그를 어디에 저장하시겠습니까?**
>
> - [l] **로컬 파일 시스템** - `{data_path}/{backlog_id}/children/`
> - [n] **노션** - 상위 백로그의 하위 페이지로 생성
> - [b] **둘 다** - 로컬과 노션 모두 저장"

**Wait for user response.**

### 2. 로컬 저장 (Option l 또는 b)

**폴더 구조 생성:**

```
{data_path}/{backlog_id}/
├── backlog-info.yaml (업데이트: 하위 백로그 정보 추가)
├── code-analysis.md (있는 경우)
└── children/
    ├── {child_1_id}/
    │   ├── backlog.md
    │   └── progress.yaml
    ├── {child_2_id}/
    │   ├── backlog.md
    │   └── progress.yaml
    └── ...
```

**각 하위 백로그 파일 생성 (Block-based 구조):**

```yaml
# backlog.md (v2.0 스키마)
---
id: {child_id}
title: {child_title}
type: {target_child_type}
status: ready
parent_id: {backlog_id}
parent_title: {backlog_title}
created_at: {timestamp}

# 🆕 📦 커버하는 블록 - 정보 소실 방지의 핵심!
covers:
  - block_id: "BLK-001"
    lines: [1, 5]
    coverage: "full"        # full | partial
  - block_id: "BLK-002"
    lines: [6, 8]
    coverage: "full"

# 🆕 🔗 형제 관계
siblings:
  - id: "TASK-002"
    title: "형제 태스크"
    shared_blocks: []
    relationship: "independent"  # independent | dependent | complementary

# 🆕 📝 상속된 원본 컨텐츠
inherited_content:
  - block_id: "BLK-001"
    block_type: "instruction"
    full_text: |
      원본 지시사항 전체 내용...

# 추적성
traceability:
  requirements: [REQ-XXX, ...]
  acceptance_criteria: [AC-XXX, ...]
---

# {child_title}

## 설명
{child_description}

## 🆕 원본 지시사항 (자동 상속)

> **BLK-001에서 상속:**
> {inherited_content_from_block}

## 수용 기준
{child_acceptance_criteria}

## 추적성
- 상위 백로그: {parent_title}
- 🆕 담당 블록: {covered_blocks}
- 담당 요구사항: {covered_requirements}
- 담당 수용 기준: {covered_acceptance_criteria}

## 코드 컨텍스트
{code_context}
```

저장 결과 표시:

> "**✅ 로컬 저장 완료 (Block-based v2.0)**
>
> 저장 위치: `{data_path}/{backlog_id}/children/`
>
> 생성된 파일:
>
> | 파일                    | 담당 블록        | 상속된 컨텐츠 |
> | ----------------------- | ---------------- | ------------- | --- |
> | {child_1_id}/backlog.md | BLK-001, BLK-002 | ✅ 포함       |
> | {child_2_id}/backlog.md | BLK-003          | ✅ 포함       |
> | ...                     | ...              | ...           | "   |

### 3. 노션 저장 (Option n 또는 b)

**저장 전 확인:**

> "**노션 저장 대상 확인**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **대상 데이터베이스:** {database_name}
> **상위 백로그:** {backlog_title} (ID: {notion_page_id})
> **생성할 하위 백로그:** {child_count}개
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

사용자에게 질문:

> "이 위치에 저장하시겠습니까? (y/n)"

**Wait for user response.**

**Option y - 노션 저장 수행:**

```yaml
for each child in children:
  action:
    - Create page in {database_name}
    - Set properties:
        - Title: { child_title }
        - Type: { target_child_type }
        - Status: Ready
        - Parent: { notion_page_id }
    - Add content blocks:
        - Description
        - Acceptance Criteria
        - Traceability info
    - Store created page_id

action:
  - Update parent page's Children relation
  - Add all child page_ids to relation
```

저장 결과 표시:

> "**✅ 노션 저장 완료**
>
> 생성된 페이지:
>
> - {child_1_title} (ID: {child_1_notion_id})
> - {child_2_title} (ID: {child_2_notion_id})
> - ...
>
> 상위 백로그 Children 관계 업데이트 완료"

### 4. 부모 백로그 업데이트

🆕 **Block-based Traceability**: 부모 백로그의 커버리지 메트릭 업데이트

```yaml
action:
  - 부모 backlog-info.yaml 열기
  - hierarchy.children 업데이트:
      - 모든 하위 백로그 ID, title, type 추가
  - coverage 메트릭 업데이트:
      - total_blocks: content_blocks.length
      - covered_blocks: 커버된 블록 수
      - coverage_percent: (covered / total) * 100
      - uncovered_blocks: 미커버 블록 ID 목록
      - shared_blocks: 공유 블록 ID 목록
      - validation_passed: true (if 100%)
```

### 5. 저장 완료 확인

> "**💾 저장 완료 (Block-based v2.0)**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **로컬:** {local_save_status}
> **노션:** {notion_save_status}
>
> **생성된 하위 백로그:** {child_count}개
>
> **🆕 블록 커버리지:**
>
> | 메트릭      | 값                  |
> | ----------- | ------------------- |
> | 전체 블록   | {total_blocks}개    |
> | 커버된 블록 | {covered_blocks}개  |
> | 커버리지    | {coverage_percent}% |
> | 미커버      | {uncovered_count}개 |
> | 공유 블록   | {shared_count}개    |
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 6. decompose.yaml 최종 업데이트 (CRITICAL)

`{decompose_state_file}` 업데이트:

```yaml
action:
  - {decompose_state_file} 로드
  - save_result 섹션 추가:
      local_saved: true/false
      local_path: "{children_folder}"
      notion_saved: true/false
      notion_page_ids: [...]
      saved_at: "{timestamp}"
  - stepsCompleted: [1, 2, 3, 4, 5, 6, 7] 업데이트
  - updated_at: "{timestamp}" 업데이트
  - 파일 저장

# decompose.yaml에 추가될 내용
save_result:
  local_saved: true
  local_path: "{backlog_folder}/children"
  notion_saved: false
  saved_at: "2025-12-10"
```

**저장 확인 메시지:**

> "✅ decompose.yaml 최종 업데이트 완료 (step 7)"

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 완료 요약으로 진행 [V] Verify - 저장된 파일 확인 [S] Save Again - 다른 위치에 추가 저장 [B] Back - 검증 단계로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Verify decompose.yaml saved with stepsCompleted: [1,2,3,4,5,6,7], then load, read entire file, then execute {nextStepFile}
- IF V: Display saved files content
- IF S: Re-execute from section 1
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

ONLY WHEN [C continue option] is selected and [저장 완료 확인됨], will you then load and read fully `{nextStepFile}` to execute and begin 완료 및 핸드오프 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 사용자 선택 저장 위치에 저장 완료
- 추적성 정보 포함 저장
- 계층 구조 (폴더/관계) 유지
- 노션 관계 업데이트 (해당 시)
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 저장 위치 확인 없이 저장
- 추적성 정보 누락
- 노션 관계 업데이트 실패
- 부분 저장 (일부만 성공)
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
