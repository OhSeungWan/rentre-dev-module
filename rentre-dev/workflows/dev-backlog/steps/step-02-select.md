---
name: 'step-02-select'
description: '작업할 서브태스크 선택'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-02-select.md'
nextStepFile: '{workflow_path}/steps/step-03-context.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
---

# Step 2: 서브태스크 선택

## STEP GOAL:

작업할 서브태스크를 선택하거나, Sub-agent 모드로 여러 태스크를 병렬 처리합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Present options clearly and wait for selection

### Step-Specific Rules:

- 🎯 Focus ONLY on task selection
- 🚫 FORBIDDEN to start implementation
- 💬 Present subtask list and wait for user choice
- 🚪 HALT at menu and wait for user input

## EXECUTION PROTOCOLS:

- 🎯 Display subtask list with status
- 💾 Record selected subtask(s)
- 📖 Wait for user selection before proceeding
- 🚫 FORBIDDEN to auto-select tasks

## SEQUENCE OF INSTRUCTIONS:

### 1. 진행 현황 표시

**📊 백로그 진행 현황: {backlog_id}**

| 상태      | 개수                |
| --------- | ------------------- |
| ✅ 완료   | {completed_count}   |
| 🔄 진행중 | {in_progress_count} |
| ⏳ 대기   | {pending_count}     |
| **총계**  | **{total_count}**   |

### 2. 서브태스크 목록 표시

**📋 서브태스크 목록:**

<action>각 서브태스크 파일을 읽어 목록 생성</action>

```
[1] ⏳ {subtask_1_title}
    - 예상 작업: {subtask_1_summary}

[2] ⏳ {subtask_2_title}
    - 예상 작업: {subtask_2_summary}

[3] ✅ {subtask_3_title} (완료)

...
```

### 3. 메뉴 옵션 표시

**선택하세요:**

| 옵션       | 설명                       |
| ---------- | -------------------------- |
| **[번호]** | 해당 서브태스크 선택       |
| **[S]**    | Sub-agent 모드 (병렬 처리) |
| **[R]**    | 진행 현황 새로고침         |
| **[Q]**    | 워크플로우 종료            |

### 4. Sub-agent 모드 처리 (S 선택 시)

<check if="user selects S">
**🚀 Sub-agent 모드**

병렬로 처리할 서브태스크를 선택하세요 (쉼표로 구분):
예: 1, 2, 4

<ask>선택할 서브태스크 번호들:</ask>

<action>
1. 선택된 서브태스크들 검증
2. 각 서브태스크별 Sub-agent 생성 준비
3. 병렬 실행 컨텍스트 설정
</action>

**선택된 서브태스크:** {selected_subtasks}

병렬 처리를 시작합니다. 각 Sub-agent가 Step 3-5를 독립적으로 실행합니다.

<action>Sub-agent 병렬 실행 후 Step 6으로 이동</action>
</check>

### 5. 단일 태스크 선택 처리 (번호 선택 시)

<check if="user selects number">
<action>선택된 서브태스크 로드</action>

**✅ 선택된 서브태스크: [{number}] {subtask_title}**

<action>세션 상태에 current_subtask 저장</action>
<action>Step 3으로 진행</action>
</check>

### 6. Present MENU OPTIONS

Display: **서브태스크를 선택하세요:** [번호] 선택 | [S] Sub-agent 모드 | [R] 새로고침 | [Q] 종료

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed when user makes a valid selection
- After invalid input, redisplay menu

#### Menu Handling Logic:

- IF [번호]: 해당 서브태스크 선택 후 load {nextStepFile}
- IF S: Sub-agent 모드 실행 후 step-06-complete.md로 이동
- IF R: 서브태스크 목록 새로고침 후 메뉴 재표시
- IF Q: 세션 저장 후 워크플로우 종료
- IF invalid: "유효한 옵션을 선택해주세요" 후 메뉴 재표시

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN user selects a valid subtask number will you load {nextStepFile} to prepare context for implementation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 서브태스크 목록 명확하게 표시
- 사용자 선택 대기
- 유효한 선택 시 다음 단계로 진행
- Sub-agent 모드 정상 처리

### ❌ SYSTEM FAILURE:

- 목록 없이 진행
- 사용자 입력 없이 자동 선택
- 잘못된 선택 무시

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
