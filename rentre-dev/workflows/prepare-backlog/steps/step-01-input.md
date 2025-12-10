---
name: 'step-01-input'
description: '백로그 입력 및 기본 정보 수집'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-01-input.md'
nextStepFile: '{workflow_path}/steps/step-02-context-analysis.md'
workflowFile: '{workflow_path}/workflow.md'
continueStepFile: '{workflow_path}/steps/step-01b-continue.md'
data_path: '{module_path}/data'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 1: 백로그 입력 및 기본 정보 수집

**Progress: Step 1 of 7** - Next: 상위/하위/연결 백로그 분석

## STEP GOAL:

백로그 입력을 받고 기본 정보를 수집하여 워크플로우를 초기화합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분석 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 분석 전문성, user brings 도메인 지식, and together we produce something better

### Step-Specific Rules:

- 🛑 NEVER 사용자 입력 없이 콘텐츠 생성하지 않음
- 📖 CRITICAL: 행동하기 전 스텝 파일 전체를 읽음
- 🔄 CRITICAL: [C]로 다음 스텝 로드 시, 파일 전체를 읽고 이해한 후 진행
- ✅ ALWAYS 협력적 발견 과정으로 진행
- 📋 YOU ARE A FACILITATOR, 콘텐츠 생성기가 아님
- 💬 FOCUS 초기화와 설정에만 집중 - 미래 스텝을 미리 보지 않음
- 🚪 DETECT 기존 워크플로우 상태를 감지하고 재개 처리

## EXECUTION PROTOCOLS:

- 🎯 행동하기 전 분석 내용 표시
- 💾 문서 초기화 및 frontmatter 업데이트
- 📖 다음 스텝 로드 전 frontmatter `stepsCompleted: [1]` 설정
- 🚫 FORBIDDEN 설정 완료 전 다음 스텝 로드 금지

## CONTEXT BOUNDARIES:

- workflow.md의 변수들이 메모리에 있음
- 이전 컨텍스트 = 출력 문서 + frontmatter의 내용
- 다른 스텝의 지식을 가정하지 않음

## YOUR TASK:

백로그 입력을 받고 기본 정보를 수집하여 워크플로우를 초기화합니다.

---

## INITIALIZATION SEQUENCE:

### 1. 기존 워크플로우 확인

먼저 출력 폴더에 기존 작업이 있는지 확인:

- `{data_path}/` 내 백로그 폴더 확인
- 있으면 frontmatter의 `stepsCompleted` 확인
- 재개가 필요하면 `./step-01b-continue.md` 로드

### 2. 재개 처리 (문서 존재 시)

문서가 존재하고 frontmatter에 `stepsCompleted`가 있으면:

- **STOP** 여기서 멈추고 `./step-01b-continue.md` 즉시 로드
- 초기화 작업 진행하지 않음
- step-01b가 재개 로직 처리

### 3. 신규 워크플로우 설정 (문서 없음)

문서가 없거나 frontmatter에 `stepsCompleted`가 없으면:

#### A. 백로그 입력 방식 안내

사용자에게 질문:

> "**{user_name}**님, 분석할 백로그를 제공해 주세요.
>
> **입력 방식:**
>
> 1. 노션 URL 입력 (auto 모드에서 직접 로드)
> 2. 백로그 내용 직접 붙여넣기
> 3. 노션에서 백로그 검색"

**Wait for user response.**

#### B. 입력 처리

**Option 1 - 노션 URL:**

```yaml
check: notion_integration == "auto"
action:
  - Extract page ID from URL
  - Use Notion MCP to retrieve page (mcp__notionApi__API-retrieve-a-page)
  - Extract title, properties from page
  - Identify backlog type from "Type" property
  - Store notion_page_id for later reference

  # 🆕 Block-based Traceability: 모든 블록 컨텐츠 로드
  - Use Notion MCP to get ALL block children (mcp__notionApi__API-get-block-children)
  - CRITICAL: Recursively load nested blocks (toggles, callouts, etc.)
  - For each toggle block:
      - Store toggle title
      - Load toggle children (nested content)
      - Mark source as "notion_toggle"
  - For each callout block:
      - Store callout icon and content
      - Mark source as "notion_callout"
  - Store ALL content with block type markers for later parsing

fallback:
  - Inform: '노션 MCP 연동이 필요합니다. 내용을 직접 붙여넣어 주세요.'
  - Re-ask for input
```

**Option 2 - 직접 붙여넣기:**

> "백로그 내용을 붙여넣어 주세요:
>
> - 제목
> - 유형 (Epic/Story/Task/Bug 등)
> - 설명/요구사항
> - 수용 기준 (있다면)
> - 상위 백로그 정보 (있다면)
> - 연결된 백로그 (있다면)"

**Option 3 - 검색:**

```yaml
action:
  - Use Notion MCP to search
  - POST /search with user's query
  - Display matching backlogs with type and status
  - Let user select one
```

#### C. 기본 정보 파싱

백로그 정보를 구조화:

```yaml
backlog_id: { notion_page_id OR auto-generated YYYYMMDD-HHMMSS }
title: { backlog_title }
type: { backlog_type } # Epic, Story, Task, Bug, etc.
status: { current_status }
notion_id: { notion_page_id } # if from Notion
description: { raw_description }
acceptance_criteria_raw: { raw_acceptance_criteria }

# 🆕 Block-based Traceability: 원본 블록 정보 저장
raw_blocks:
  - type: 'paragraph' # paragraph | toggle | callout | heading | bulleted_list
    source: 'notion_description'
    content: '...'
  - type: 'toggle'
    source: 'notion_toggle'
    toggle_title: '상세 작업 지침'
    content: |
      - 토글 내부 내용 전체...
  - type: 'callout'
    source: 'notion_callout'
    icon: '⚠️'
    content: '주의사항...'
```

**CRITICAL:** `raw_blocks`는 다음 스텝(step-02b-block-parsing)에서 `content_blocks`로 변환됩니다.

#### D. 백로그 폴더 및 prepare.yaml 초기화

**폴더 생성:**

```bash
mkdir -p {data_path}/{backlog_id}
```

**prepare.yaml 초기화 저장:**

```yaml
# {prepare_file}
# Prepare Backlog Workflow - 진행 상태 및 중간 결과물
stepsCompleted: [1]
last_updated: {timestamp}

# Step 1 결과
step_01:
  backlog_id: {backlog_id}
  title: {backlog_title}
  type: {backlog_type}
  status: {current_status}
  notion_id: {notion_page_id}  # if from Notion
  raw_blocks: {raw_blocks}     # 원본 블록 정보
```

#### E. 초기화 완료 보고

사용자에게 보고:

> "**백로그 기본 정보 수집 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **백로그:** {backlog_type} - {backlog_title}
> **ID:** {backlog_id}
> **노션 연동:** {notion_status}
> **진행 상태 저장:** `{prepare_file}`
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 다음 단계에서 상위/하위/연결 백로그를 분석합니다."

---

## SUCCESS METRICS:

✅ 기존 워크플로우 감지 시 step-01b로 올바르게 핸드오프
✅ 신규 워크플로우 초기화 완료
✅ 백로그 기본 정보 수집 및 구조화
✅ 사용자가 문서 설정 확인 후 진행 가능

## FAILURE MODES:

❌ 기존 워크플로우 존재 시 신규 초기화 진행
❌ frontmatter 업데이트 없이 진행
❌ 백로그 정보 없이 다음 스텝 진행
❌ **CRITICAL**: 스텝 파일 일부만 읽음 - 불완전한 이해와 잘못된 결정 초래

---

### 4. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [R] Retry [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save to {prepare_file} with `stepsCompleted: [1]`, then load, read entire file, then execute {nextStepFile}
- IF R: Re-execute from section 3.A (백로그 입력 방식 안내)
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 상위/하위/연결 백로그 분석 단계.
