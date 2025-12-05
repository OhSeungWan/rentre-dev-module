---
name: 'step-04-gather-context'
description: '추가 컨텍스트를 선택적으로 수집합니다 (피그마, 추가 조사 등)'

# Path Definitions
workflow_path: '{module_path}/workflows/quick-execute'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-04-gather-context.md'
nextStepFile: '{workflow_path}/steps/step-05-create-handoff.md'
workflowFile: '{workflow_path}/workflow.md'
workflowConfig: '{workflow_path}/workflow.yaml'

# Related Tasks
gatherContextTask: '{module_path}/tasks/gather-context.md'

# Output Paths
backlogs_output: '{module_path}/data/backlogs'
---

# Step 4: 추가 컨텍스트 수집 (선택)

## STEP GOAL:

필요한 경우 추가 컨텍스트를 수집합니다. 피그마 디자인 확인, 추가 조사 등을 선택적으로 진행합니다. 이 단계는 선택적이며 건너뛸 수 있습니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a context gatherer enriching the backlog with additional information
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring research skills, user brings knowledge of what's needed

### Step-Specific Rules:

- 🎯 This step is OPTIONAL - user can skip directly to handoff
- 🚫 FORBIDDEN to start implementation
- 💬 Approach: Offer options, don't force additional work
- 📋 Only gather context user explicitly requests

## EXECUTION PROTOCOLS:

- 🎯 Present context gathering options clearly
- 💾 Store any gathered context for handoff
- 📖 Figma MCP integration if available
- 🚫 Do not proceed without user choice

## CONTEXT BOUNDARIES:

- Available context: Backlog, complexity, code analysis
- Focus: Optional enrichment only
- Limits: Don't overload with unnecessary information
- Dependencies: Code analysis from Step 3

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present Current Status

Determine `{figma_status}` based on whether `{figma_url}` exists:

- If exists: "✅ 피그마 URL 있음"
- If not: "➖ 피그마 없음"

Display:

"**추가 컨텍스트 수집이 필요한가요?**

━━━━━━━━━━━━━━━━━━━━━━━

**현재 상태:**

- 백로그 내용: ✅ 확보
- 코드 분석: ✅ 완료
- 피그마 디자인: {figma_status}

━━━━━━━━━━━━━━━━━━━━━━━"

### 2. Present MENU OPTIONS

Display: "**옵션을 선택하세요:**

[C] **바로 작업 시작** - 현재 정보로 충분
[G] **컨텍스트 수집** - 추가 정보 수집 (gather-context 실행)
[F] **피그마 확인** - 피그마 디자인 스펙 조회 (피그마 URL 있는 경우)
[X] **Exit** - 워크플로우 종료"

#### Menu Handling Logic:

##### IF C (Continue):

- Skip additional context gathering
- Load, read entire file, then execute {nextStepFile}

##### IF G (Gather Context):

- Execute gather-context task:
  - Load `{gatherContextTask}`
  - Pass `{backlog_content}` and `{code_analysis}`
  - Collect additional context from user
- Store result as `{additional_context}`
- Display gathered context summary
- Return to menu

##### IF F (Figma):

- Check if `{figma_url}` exists

**IF figma_url exists:**

- Use Figma MCP to get design specs:
  - `mcp__figma-dev-mode-mcp-server__get_screenshot` for visual preview
  - `mcp__figma-dev-mode-mcp-server__get_metadata` for specs
  - `mcp__figma-dev-mode-mcp-server__get_code` for code hints (if available)
- Store as `{figma_context}`
- Display Figma information summary
- Save to `{backlogs_output}/{backlog_id}/figma-context.md`
- Return to menu

**IF figma_url does NOT exist:**

- Display: "피그마 URL이 없습니다. 백로그에 피그마 URL을 추가하시겠습니까?"
- If user provides URL: Store and process
- If user declines: Return to menu

##### IF X (Exit):

- Exit workflow gracefully (progress is preserved)

##### IF Any other comments or queries:

- Help user respond
- Redisplay menu options

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

### 3. Display Gathered Context (if any)

If `{additional_context}` or `{figma_context}` was gathered, display:

"**📋 수집된 추가 컨텍스트**

━━━━━━━━━━━━━━━━━━━━━━━

{context_summary}

━━━━━━━━━━━━━━━━━━━━━━━"

Then return to menu for user to continue or gather more.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected, will you then load and read fully `{nextStepFile}` to execute and create the handoff document.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Options clearly presented to user
- User choice respected (including skip option)
- Figma integration works when URL is available
- Additional context properly stored
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Forcing unnecessary context gathering
- Proceeding without user choice
- Failing to handle Figma MCP when URL is available
- Not returning to menu after gathering context
- Losing gathered context before handoff

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
