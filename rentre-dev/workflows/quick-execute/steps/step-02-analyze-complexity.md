---
name: 'step-02-analyze-complexity'
description: '백로그 복잡도를 분석하고 빠른 실행 적합 여부를 판단합니다'

# Path Definitions
workflow_path: '{module_path}/workflows/quick-execute'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-02-analyze-complexity.md'
nextStepFile: '{workflow_path}/steps/step-03-analyze-codebase.md'
workflowFile: '{workflow_path}/workflow.md'
workflowConfig: '{workflow_path}/workflow.yaml'

# Related Workflows
decomposeWorkflow: '{module_path}/workflows/decompose-backlog/workflow.md'
---

# Step 2: 복잡도 분석

## STEP GOAL:

백로그의 복잡도를 평가하여 빠른 실행(분해 없이 진행)에 적합한지 판단합니다. 복잡도가 높으면 사용자에게 분해 워크플로우 전환을 권장합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a complexity analyst evaluating work scope
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring estimation expertise, user brings implementation context

### Step-Specific Rules:

- 🎯 Focus only on complexity assessment
- 🚫 FORBIDDEN to start implementation or code analysis
- 💬 Approach: Objective and honest about complexity findings
- 📋 Use defined thresholds from workflow.yaml

## EXECUTION PROTOCOLS:

- 🎯 Apply complexity scoring algorithm
- 💾 Store complexity assessment results
- 📖 Provide clear reasoning for the score
- 🚫 Do not downplay complexity warnings

## CONTEXT BOUNDARIES:

- Available context: Backlog content from Step 1
- Focus: Complexity evaluation only
- Limits: No code analysis yet, no implementation planning
- Dependencies: Valid backlog content from previous step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Analyze Complexity Factors

Evaluate the backlog using these criteria:

**복잡도 평가 기준:**

1. **수용 기준 수**: `{acceptance_criteria_count}`개
   - ≤3: +1점 (낮음)
   - 4-5: +3점 (보통)
   - > 5: +5점 (높음)

2. **키워드 분석** - Check for warning keywords:
   - "대규모", "리팩토링", "마이그레이션", "아키텍처", "전체", "시스템"
   - Each found: +2점

3. **예상 작업 범위 분석**:
   - UI 변경 포함: +1점
   - 로직 변경 포함: +1점
   - DB 변경 포함: +2점
   - API 변경 포함: +1점

4. **종합 복잡도 점수**: Sum of all factors (1-10 scale, cap at 10)

### 2. Generate Assessment Report

Store analysis results:

- `{complexity_score}`: 1-10 점수
- `{warning_keywords_found}`: 발견된 경고 키워드 목록
- `{has_ui_changes}`: UI 변경 여부
- `{has_logic_changes}`: 로직 변경 여부
- `{has_db_changes}`: DB 변경 여부
- `{has_api_changes}`: API 변경 여부
- `{complexity_verdict}`: "적합" or "경고"

### 3. Display Assessment (Based on Score)

#### IF complexity_score > 7 (High Complexity):

Display warning:

"⚠️ **복잡도 경고**

이 백로그는 예상보다 복잡해 보입니다:

━━━━━━━━━━━━━━━━━━━━━━━

**복잡도 점수:** {complexity_score}/10

**발견된 경고 신호:**
{warning_signals_list}

**작업 범위:**

- UI 변경: {has_ui_changes}
- 로직 변경: {has_logic_changes}
- DB 변경: {has_db_changes}
- API 변경: {has_api_changes}

━━━━━━━━━━━━━━━━━━━━━━━

**권장 사항:**
`decompose-backlog` 워크플로우로 분해 후 진행을 권장합니다.
그래도 빠른 실행을 원하시면 계속 진행할 수 있습니다."

**Present Options:**

Display: "**어떻게 진행할까요?** [C] Continue (이대로 빠른 실행) [D] Decompose (분해로 전환) [X] Exit"

#### IF complexity_score <= 7 (Acceptable Complexity):

Display:

"✅ **복잡도 평가 완료**

━━━━━━━━━━━━━━━━━━━━━━━

**복잡도 점수:** {complexity_score}/10
**판정:** 빠른 실행 적합 ✓

**작업 범위:**

- UI 변경: {has_ui_changes}
- 로직 변경: {has_logic_changes}
- DB 변경: {has_db_changes}
- API 변경: {has_api_changes}

━━━━━━━━━━━━━━━━━━━━━━━

이 백로그는 분해 없이 바로 작업 가능합니다."

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue (코드베이스 분석 진행) [X] Exit"

#### Menu Handling Logic:

- IF C: Store complexity assessment, then load, read entire file, then execute {nextStepFile}
- IF D (only shown for high complexity): Inform user to run `decompose-backlog` workflow separately, then exit
- IF X: Exit workflow gracefully
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [complexity assessment is complete], will you then load and read fully `{nextStepFile}` to execute and begin codebase analysis.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complexity score calculated correctly using defined criteria
- Warning keywords properly detected
- Work scope factors evaluated
- Clear verdict provided to user
- High complexity properly flagged with decomposition recommendation
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Skipping complexity analysis
- Not detecting warning keywords
- Downplaying high complexity scores
- Proceeding without user acknowledgment of warnings
- Not offering decomposition option for complex backlogs

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
