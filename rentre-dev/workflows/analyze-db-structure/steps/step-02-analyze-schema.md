---
name: 'step-02-analyze-schema'
description: 'Notion MCP로 데이터베이스 스키마 분석'

# Path Definitions
workflow_path: '{module_path}/workflows/analyze-db-structure'

# File References
thisStepFile: '{workflow_path}/steps/step-02-analyze-schema.md'
nextStepFile: '{workflow_path}/steps/step-03-map-hierarchy.md'
workflowFile: '{workflow_path}/workflow.md'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Template References
# (analysis step - no templates used)
---

# Step 2: 데이터베이스 스키마 분석

**Progress: Step 2 of 5** - Next: 계층 구조 매핑

## STEP GOAL:

Notion MCP를 사용하여 데이터베이스 스키마를 분석하고, 모든 속성(properties)과 그 유형을 파악합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 데이터베이스 분석 전문가
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 데이터 구조 분석 전문성, user brings 도메인 지식

### Step-Specific Rules:

- 🎯 Focus only on 스키마 분석 - 계층 매핑은 다음 스텝
- 🚫 FORBIDDEN to generate guides in this step
- 💬 Show analysis results and ask for confirmation
- 🔍 Categorize all properties systematically

## EXECUTION PROTOCOLS:

- 🎯 Notion MCP API 호출로 스키마 조회
- 💾 분석 결과를 메모리에 저장
- 📖 사용자에게 분석 결과 표시 후 확인 받기
- 🚫 FORBIDDEN API 실패 시 무시하고 진행 금지

## CONTEXT BOUNDARIES:

- Available context: database_id, notion_db_url from step 1
- Focus: 스키마 분석 및 속성 분류
- Limits: 계층 매핑은 다음 스텝에서 수행
- Dependencies: step-01 완료, database_id 유효

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. 데이터베이스 스키마 조회

Notion MCP를 사용하여 스키마 조회:

```yaml
action:
  tool: mcp__notionApi__API-retrieve-a-database
  params:
    database_id: { database_id }
```

**If API call fails:**

> "**⚠️ 데이터베이스 조회 실패**
>
> 오류: {error_message}
>
> 가능한 원인:
>
> - 데이터베이스 ID가 올바르지 않음
> - Notion API 권한이 없음
> - 네트워크 연결 문제
>
> 다시 시도하시겠습니까?"

**→ [R] Retry 옵션 제시**

### 2. 속성(Properties) 분석

스키마에서 모든 속성을 추출하고 분류:

#### A. 속성 유형별 분류

```yaml
property_categories:
  type_property:
    description: '백로그 유형 (Epic, Story, Task, Bug, Subtask 등)'
    identify_by: 'select type with backlog type values'

  status_property:
    description: '상태 (To Do, In Progress, Done 등)'
    identify_by: 'select/status type with workflow states'

  relation_properties:
    parent_relations: '상위 백로그 연결'
    child_relations: '하위 백로그 연결'
    linked_relations: '연결된 백로그'
    identify_by: 'relation type properties'

  core_fields:
    - title: '제목'
    - rich_text: '설명'
    - people: '담당자'
    - date: '기한'

  custom_fields:
    description: '팀 특화 필드'
    identify_by: '기타 모든 속성'
```

#### B. 분석 결과 정리

각 속성에 대해 다음 정보 수집:

- 속성 이름 (name)
- 속성 유형 (type)
- 속성 ID (id)
- 옵션 값들 (select/multi-select의 경우)
- 연결 대상 (relation의 경우)

### 3. 샘플 데이터 조회

실제 사용 패턴 파악을 위해 샘플 조회:

```yaml
action:
  tool: mcp__notionApi__API-post-database-query
  params:
    database_id: { database_id }
    page_size: 20
```

샘플에서 파악할 내용:

- 어떤 유형(Type)들이 실제로 사용되는지
- 관계(Relation) 속성이 어떻게 활용되는지
- 필드별 사용 빈도 및 패턴

### 4. 분석 결과 표시

사용자에게 분석 결과 보고:

> "**📊 데이터베이스 스키마 분석 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **데이터베이스:** {database_name}
> **전체 속성 수:** {total_properties}개
>
> ---
>
> **🏷️ 유형(Type) 속성:**
>
> - 속성명: {type_property_name}
> - 옵션: {type_options_list}
>
> **📌 상태(Status) 속성:**
>
> - 속성명: {status_property_name}
> - 옵션: {status_options_list}
>
> **🔗 관계(Relation) 속성:**
> {relation_properties_table}
>
> **📝 핵심 필드:**
> {core_fields_table}
>
> **⚙️ 커스텀 필드:**
> {custom_fields_table}
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **샘플 데이터 분석:**
>
> - 발견된 백로그 유형: {found_types}
> - 활성 관계 패턴: {relation_patterns}"

### 5. 사용자 확인

질문:

> "분석 결과가 정확한가요?
>
> - 백로그 유형(Type) 속성이 올바르게 식별되었나요?
> - 빠진 중요한 속성이 있나요?
> - 추가 설명이 필요한 속성이 있나요?"

**Wait for user response.**

사용자 피드백을 반영하여 분석 결과 업데이트.

---

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [C] Continue - 계층 구조 매핑 [R] Re-analyze - 다시 분석 [X] Exit - 종료"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF C: Load, read entire file, then execute {nextStepFile}
- IF R: Re-execute from section 1
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

---

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [스키마 분석이 완료되고 사용자가 확인함], will you then load and read fully `{nextStepFile}` to execute and begin 계층 구조 매핑 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Notion MCP API 호출 성공
- 모든 속성 유형별 분류 완료
- Type/Status/Relation 속성 식별
- 샘플 데이터로 사용 패턴 파악
- 사용자 확인 완료

### ❌ SYSTEM FAILURE:

- API 호출 실패 무시하고 진행
- 속성 분류 없이 다음 스텝 진행
- Type 속성 미식별 상태로 진행
- 사용자 확인 없이 진행
- **CRITICAL**: 스텝 파일 일부만 읽음

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
