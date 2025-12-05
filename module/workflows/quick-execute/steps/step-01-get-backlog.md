---
name: 'step-01-get-backlog'
description: '백로그 입력을 받아 파싱하고 저장합니다'

# Path Definitions
workflow_path: '{module_path}/workflows/quick-execute'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-01-get-backlog.md'
nextStepFile: '{workflow_path}/steps/step-02-analyze-complexity.md'
workflowFile: '{workflow_path}/workflow.md'
workflowConfig: '{workflow_path}/workflow.yaml'

# Output Paths
backlogs_output: '{module_path}/data/backlogs'
---

# Step 1: 백로그 입력 받기

## STEP GOAL:

사용자로부터 실행할 백로그를 입력받아 파싱하고, 후속 분석을 위한 기본 정보를 추출합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a backlog analyst helping to understand and structure the work
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring backlog analysis expertise, user brings domain knowledge

### Step-Specific Rules:

- 🎯 Focus only on collecting and parsing backlog information
- 🚫 FORBIDDEN to analyze complexity or codebase in this step
- 💬 Approach: Helpful and clarifying, ensure all required fields are captured
- 📋 Extract: title, description, acceptance_criteria, optional figma_url

## EXECUTION PROTOCOLS:

- 🎯 Present clear input options to user
- 💾 Store parsed backlog content for next steps
- 📖 Validate required fields are present
- 🚫 Do not proceed without valid backlog content

## CONTEXT BOUNDARIES:

- Available context: Workflow configuration from workflow.yaml
- Focus: Backlog input collection and validation
- Limits: No complexity analysis, no code analysis
- Dependencies: User must provide backlog content

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present Input Options

Display to user:

"**빠르게 실행할 백로그를 입력해 주세요.**

**입력 방식:**

1. **노션 URL** - 노션 백로그 페이지 URL 붙여넣기
2. **직접 입력** - 백로그 내용 직접 작성
3. **검색** - 노션에서 백로그 검색 (notion_integration: auto 필요)"

### 2. Handle Input Based on Type

#### IF Option 1 - Notion URL:

Check `{notion_integration}` setting:

- **IF `auto`**:
  - Extract page ID from URL
  - Use Notion MCP to fetch backlog:
    - `mcp__notionApi__API-retrieve-a-page` with page_id
    - Extract: title, description, acceptance_criteria, status, priority
    - Check for figma_url, figma_node_id in properties
  - Display retrieved content for confirmation

- **IF NOT `auto`**:
  - Inform: "노션 URL을 감지했지만 직접 연동이 비활성화되어 있습니다."
  - Ask: "백로그 내용을 직접 붙여넣어 주세요."

#### IF Option 2 - Direct Input:

Ask user:

"**백로그 내용을 입력해 주세요:**

**필수 정보:**

- 제목
- 설명 (무엇을 해야 하는지)
- 수용 기준 (완료 조건)

**선택 정보:**

- 피그마 URL (UI 작업인 경우)
- 관련 파일/경로 힌트"

#### IF Option 3 - Search:

- **IF `notion_integration` is NOT `auto`**:
  - Inform: "검색 기능은 노션 MCP 연동이 필요합니다. 직접 입력으로 전환합니다."
  - Go back to Option 2

- **IF `notion_integration` is `auto`**:
  - Ask: "검색할 백로그 키워드를 입력해 주세요:"
  - Use `mcp__notionApi__API-post-search` to search
  - Display results as numbered list
  - Ask: "목록에서 선택해 주세요 (번호 입력):"

### 3. Parse and Validate Backlog

Extract and store:

- `{backlog_title}`: 백로그 제목
- `{backlog_description}`: 상세 설명
- `{acceptance_criteria}`: 수용 기준 목록
- `{acceptance_criteria_count}`: 수용 기준 개수
- `{figma_url}`: 피그마 URL (있는 경우)
- `{notion_url}`: 노션 URL (있는 경우)
- `{backlog_id}`: 제목에서 생성한 ID (sanitized, kebab-case)

Validate:

- ✅ Title is present
- ✅ Description is present
- ✅ At least one acceptance criterion exists

**IF validation fails:** Ask user to provide missing information.

### 4. Display Confirmation

Display:

"**✅ 백로그 로드 완료**

━━━━━━━━━━━━━━━━━━━━━━━

**제목:** {backlog_title}
**ID:** {backlog_id}

**설명:**
{backlog_description}

**수용 기준:** {acceptance_criteria_count}개
{acceptance_criteria_list}

**피그마:** {figma_status}
**노션:** {notion_status}

━━━━━━━━━━━━━━━━━━━━━━━"

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [E] Edit (정보 수정) [C] Continue (복잡도 분석 진행) [X] Exit"

#### Menu Handling Logic:

- IF E: Allow user to modify backlog information, then redisplay confirmation
- IF C: Store backlog content, then load, read entire file, then execute {nextStepFile}
- IF X: Exit workflow gracefully
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [backlog content is validated and stored], will you then load and read fully `{nextStepFile}` to execute and begin complexity analysis.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User provides valid backlog content (title, description, acceptance criteria)
- Backlog information is parsed and stored correctly
- User confirms the loaded information
- Backlog ID is generated correctly
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Proceeding without valid backlog content
- Missing required fields (title, description, or acceptance criteria)
- Not waiting for user confirmation
- Proceeding to next step without 'C' selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
