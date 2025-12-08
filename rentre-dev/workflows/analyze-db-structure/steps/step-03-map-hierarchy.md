---
name: 'step-03-map-hierarchy'
description: '백로그 계층 구조 및 관계 매핑'

# Path Definitions
workflow_path: '{module_path}/workflows/analyze-db-structure'

# File References
thisStepFile: '{workflow_path}/steps/step-03-map-hierarchy.md'
nextStepFile: '{workflow_path}/steps/step-04-generate-guides.md'
workflowFile: '{workflow_path}/workflow.md'
---

# Step 3: 백로그 계층 구조 및 관계 매핑

**Progress: Step 3 of 5** - Next: 가이드 문서 생성

## STEP GOAL:

스키마 분석 결과를 바탕으로 백로그 유형 간의 계층 구조와 관계를 매핑합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 데이터베이스 분석 전문가
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 계층 구조 분석 전문성, user brings 팀 워크플로우 지식

### Step-Specific Rules:

- 🎯 Focus only on 계층 매핑 - 문서 생성은 다음 스텝
- 🚫 FORBIDDEN to generate guide files in this step
- 💬 Show hierarchy diagram and ask for confirmation
- 🔍 Identify parent-child relationships between types

## EXECUTION PROTOCOLS:

- 🎯 Relation 속성 분석으로 계층 파악
- 💾 계층 다이어그램 생성
- 📖 사용자 확인 후 진행
- 🚫 FORBIDDEN 계층 확정 없이 문서 생성 진행 금지

## CONTEXT BOUNDARIES:

- Available context: 스키마 분석 결과 from step 2
- Focus: 계층 구조 및 관계 매핑
- Limits: 문서 생성은 다음 스텝에서 수행
- Dependencies: step-02 완료, 속성 분류 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Relation 속성 분석

Step 2에서 식별한 Relation 속성들을 분석:

#### A. 관계 방향 파악

각 Relation 속성에 대해:

- **속성 이름**에서 방향 추론
  - "상위", "Parent", "부모" → 상위 관계
  - "하위", "Child", "자식" → 하위 관계
  - "연결", "Related", "링크" → 연결 관계

- **실제 데이터**에서 패턴 확인
  - Epic이 주로 어떤 유형과 연결되는지
  - Story가 어떤 관계를 갖는지
  - Task/Subtask의 계층 위치

#### B. 계층 관계 정리

```yaml
hierarchy_mapping:
  parent_child_relations:
    - parent_type: Epic
      child_type: Story
      relation_property: '{parent_relation_name}'

    - parent_type: Story
      child_type: Task
      relation_property: '{parent_relation_name}'

    - parent_type: Task
      child_type: Subtask
      relation_property: '{parent_relation_name}'

  cross_type_relations:
    - from_type: Bug
      to_type: Story
      relation_type: '연결'
      relation_property: '{linked_relation_name}'
```

### 2. 계층 다이어그램 생성

ASCII 아트로 계층 구조 시각화:

```
백로그 계층 구조
================

Epic
├── Story
│   ├── Task
│   │   └── Subtask
│   └── Bug (연결)
└── (직접 Task - 있는 경우)

관계 화살표:
  │ = 상위-하위 관계 (Parent-Child)
  ─ = 연결 관계 (Linked)
```

### 3. 네비게이션 패턴 정의

각 백로그 유형별 탐색 방법 정리:

#### A. 유형별 네비게이션

```yaml
navigation_patterns:
  Epic:
    find_items: "Filter: Type = 'Epic'"
    find_children: 'Query: {parent_relation} contains Epic ID'
    required_fields: [title, description, status]
    optional_fields: [assignee, due_date, priority]

  Story:
    find_items: "Filter: Type = 'Story'"
    find_parent: 'Get {parent_relation} property'
    find_children: 'Query: {parent_relation} contains Story ID'
    required_fields: [title, description, status, parent]
    optional_fields: [assignee, story_points, sprint]

  Task:
    find_items: "Filter: Type = 'Task'"
    find_parent: 'Get {parent_relation} property'
    find_children: 'Query: {parent_relation} contains Task ID'
    required_fields: [title, status, parent]
    optional_fields: [assignee, estimate, due_date]

  # ... 기타 유형
```

#### B. 상태 전이 워크플로우

```yaml
status_workflow:
  common_states:
    - "To Do" → "In Progress" → "Done"

  type_specific:
    Bug:
      - "Open" → "In Progress" → "Resolved" → "Closed"
```

### 4. 분석 결과 표시

사용자에게 계층 구조 보고:

> "**🏗️ 백로그 계층 구조 분석 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **계층 다이어그램:**
>
> ```
> {hierarchy_diagram}
> ```
>
> ---
>
> **📊 관계 매핑:**
>
> | 상위 유형 | 하위 유형 | 관계 속성 |
> | --------- | --------- | --------- |
>
> {parent_child_table}
>
> ---
>
> **🔗 연결 관계:**
>
> | From | To  | 관계 유형 |
> | ---- | --- | --------- |
>
> {cross_type_table}
>
> ---
>
> **🧭 네비게이션 패턴:**
>
> {navigation_patterns_summary}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 5. 사용자 확인

질문:

> "계층 구조가 팀의 실제 워크플로우와 일치하나요?
>
> - 상위-하위 관계가 올바른가요?
> - 빠진 유형이나 관계가 있나요?
> - 네비게이션 패턴이 적절한가요?"

**Wait for user response.**

사용자 피드백을 반영하여 계층 구조 업데이트.

---

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 가이드 문서 생성 [R] Re-map - 다시 매핑 [X] Exit - 종료"

#### Menu Handling Logic:

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

ONLY WHEN [C continue option] is selected and [계층 구조가 사용자에게 확인됨], will you then load and read fully `{nextStepFile}` to execute and begin 가이드 문서 생성 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Relation 속성으로 계층 파악 완료
- 계층 다이어그램 생성
- 네비게이션 패턴 정의
- 사용자 확인 완료

### ❌ SYSTEM FAILURE:

- 계층 분석 없이 문서 생성 진행
- 사용자 확인 없이 진행
- Relation 속성 분석 누락
- **CRITICAL**: 스텝 파일 일부만 읽음

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
