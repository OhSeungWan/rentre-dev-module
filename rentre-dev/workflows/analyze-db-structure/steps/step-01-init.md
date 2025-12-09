---
name: 'step-01-init'
description: '전제조건 확인 및 데이터베이스 URL 수집'

# Path Definitions
workflow_path: '{module_path}/workflows/analyze-db-structure'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-analyze-schema.md'
workflowFile: '{workflow_path}/workflow.md'

# Task References
# (init step - no task references needed)

# Template References
# (init step - no templates used)

# Output References
guides_folder: '{module_path}/data/guides'
---

# Step 1: 전제조건 확인 및 데이터베이스 URL 수집

**Progress: Step 1 of 5** - Next: 데이터베이스 스키마 분석

## STEP GOAL:

Notion MCP 연동 상태를 확인하고, 분석할 데이터베이스 URL을 수집합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 데이터베이스 분석 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 데이터 구조 분석 전문성, user brings 노션 데이터베이스 컨텍스트

### Step-Specific Rules:

- 🎯 Focus only on 전제조건 확인과 URL 수집
- 🚫 FORBIDDEN to proceed without valid database URL
- 💬 Approach: 협력적 발견 과정으로 진행
- 🔍 Validate notion_integration setting before proceeding

## EXECUTION PROTOCOLS:

- 🎯 notion_integration 설정 먼저 확인
- 💾 database_id 추출 및 저장
- 📖 다음 스텝 로드 전 URL 유효성 확인
- 🚫 FORBIDDEN Notion MCP 없이 진행 금지

## CONTEXT BOUNDARIES:

- Available context: workflow.md의 변수들이 메모리에 있음
- Focus: 전제조건 확인 및 URL 수집
- Limits: 다른 스텝의 지식을 가정하지 않음
- Dependencies: config.yaml 로드 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Notion MCP 연동 확인

config.yaml에서 `notion_integration` 값 확인:

**If notion_integration != "auto":**

사용자에게 안내:

> "**⚠️ Notion MCP 연동이 필요합니다**
>
> 이 워크플로우는 Notion MCP 서버가 필요합니다.
> config.yaml에서 `notion_integration`을 'auto'로 설정해 주세요.
>
> 설정 후 다시 실행해 주세요."

**→ 워크플로우 종료**

**If notion_integration == "auto":**

> "✅ Notion MCP 연동 확인됨"

### 2. 데이터베이스 URL 수집

사용자에게 질문:

> "**{user_name}**님, 분석할 노션 백로그 데이터베이스의 URL을 입력해 주세요.
>
> **예시:**
>
> ```
> https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
> ```
>
> (데이터베이스 페이지를 열고 URL을 복사해 주세요)"

**Wait for user response.**

### 3. URL 유효성 검증

입력받은 URL 처리:

#### A. URL 파싱

```yaml
action:
  - Extract database ID from URL (32-character hex string)
  - Store as {database_id}
  - Store full URL as {notion_db_url}
```

#### B. 유효성 검증

**If URL format invalid:**

> "**⚠️ 올바른 노션 URL 형식이 아닙니다**
>
> 노션 데이터베이스 페이지를 열고 URL을 다시 복사해 주세요.
> URL에 32자리 ID가 포함되어야 합니다."

**→ Section 2로 돌아가기**

**If URL format valid:**

> "**✅ URL 확인됨**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **데이터베이스 ID:** {database_id}
> **전체 URL:** {notion_db_url}
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 다음 단계에서 데이터베이스 스키마를 분석합니다."

---

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 스키마 분석 진행 [R] Retry - URL 다시 입력 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute {nextStepFile}
- IF R: Re-execute from section 2
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and redisplay menu

---

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [database_id가 유효하게 추출됨], will you then load and read fully `{nextStepFile}` to execute and begin 스키마 분석 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- notion_integration 설정 확인 완료
- 유효한 데이터베이스 URL 수집
- database_id 추출 성공
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Notion MCP 없이 진행 시도
- 유효하지 않은 URL로 진행 시도
- database_id 추출 없이 다음 스텝 진행
- Proceeding without user input/selection
- **CRITICAL**: 스텝 파일 일부만 읽음

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
