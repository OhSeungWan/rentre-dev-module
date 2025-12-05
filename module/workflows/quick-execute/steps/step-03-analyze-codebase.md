---
name: 'step-03-analyze-codebase'
description: '백로그 관련 코드베이스를 분석하여 구현에 필요한 정보를 수집합니다'

# Path Definitions
workflow_path: '{module_path}/workflows/quick-execute'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-03-analyze-codebase.md'
nextStepFile: '{workflow_path}/steps/step-04-gather-context.md'
workflowFile: '{workflow_path}/workflow.md'
workflowConfig: '{workflow_path}/workflow.yaml'

# Related Workflows
analyzeCodebaseWorkflow: '{module_path}/workflows/analyze-codebase/workflow.yaml'

# Output Paths
backlogs_output: '{module_path}/data/backlogs'
---

# Step 3: 코드베이스 분석

## STEP GOAL:

백로그 내용을 기반으로 관련 코드베이스를 분석하여 구현에 필요한 파일, 의존성, 기술 스택 정보를 수집합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a code analyst identifying relevant code for the backlog
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring code analysis skills, user brings domain context

### Step-Specific Rules:

- 🎯 Focus only on code discovery and analysis
- 🚫 FORBIDDEN to start implementation or make changes
- 💬 Approach: Thorough but focused on relevant files only
- 📋 Use code_analysis_depth setting from config

## EXECUTION PROTOCOLS:

- 🎯 Invoke analyze-codebase workflow or perform inline analysis
- 💾 Store analysis results for handoff document
- 📖 Identify files to modify and dependencies
- 🚫 Do not modify any code in this step

## CONTEXT BOUNDARIES:

- Available context: Backlog content, complexity assessment
- Focus: Code discovery and relationship mapping
- Limits: Read-only analysis, no modifications
- Dependencies: Valid backlog from Step 1, complexity from Step 2

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Announce Analysis Start

Display:

"**코드베이스 분석을 시작합니다.**

백로그 내용을 기반으로 관련 코드를 분석합니다.

**분석 항목:**

- 관련 파일 탐색
- 기술 스택 확인
- 의존성 매핑
- 수정 대상 파일 식별"

### 2. Perform Code Analysis

Execute code analysis based on `{code_analysis_depth}` setting:

#### Analysis Steps:

1. **기술 스택 확인**
   - Check package.json, tsconfig.json, etc.
   - Identify frameworks (React, Next.js, etc.)
   - Note relevant dependencies

2. **관련 파일 탐색**
   - Search for files matching backlog keywords
   - Use Glob and Grep to find relevant code
   - Consider: components, pages, API routes, utilities, styles

3. **수정 대상 파일 식별**
   - Based on acceptance criteria, identify files needing changes
   - Categorize: new files vs. existing file modifications

4. **의존성 매핑**
   - Identify imports/exports between relevant files
   - Note shared utilities or components

Store results:

- `{tech_stack}`: 기술 스택 요약
- `{relevant_files}`: 관련 파일 목록
- `{file_count}`: 관련 파일 수
- `{files_to_modify}`: 수정 대상 파일 목록
- `{dependencies}`: 주요 의존성
- `{implementation_notes}`: 구현 시 주의사항

### 3. Save Analysis to Backlog Folder

Create folder: `{backlogs_output}/{backlog_id}/`

Save analysis file: `{backlogs_output}/{backlog_id}/code-analysis.md`

Content:

```markdown
---
backlog_id: { backlog_id }
analyzed_at: { timestamp }
depth: { code_analysis_depth }
---

# 코드 분석 결과: {backlog_title}

## 기술 스택

{tech_stack}

## 관련 파일 ({file_count}개)

{relevant_files_list}

## 수정 대상 파일

{files_to_modify_list}

## 의존성

{dependencies_list}

## 구현 시 주의사항

{implementation_notes}
```

### 4. Display Analysis Summary

Display:

"**📂 코드 분석 결과**

━━━━━━━━━━━━━━━━━━━━━━━

**기술 스택:** {tech_stack}

**관련 파일 ({file_count}개):**
{relevant_files_summary}

**수정이 필요한 파일:**
{files_to_modify_summary}

**의존성:**
{dependencies_summary}

**구현 시 주의사항:**
{implementation_notes_summary}

━━━━━━━━━━━━━━━━━━━━━━━

**저장됨:** `{backlogs_output}/{backlog_id}/code-analysis.md`"

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [R] Re-analyze (재분석) [C] Continue (컨텍스트 수집) [X] Exit"

#### Menu Handling Logic:

- IF R: Re-run analysis with user feedback, then redisplay results
- IF C: Confirm analysis stored, then load, read entire file, then execute {nextStepFile}
- IF X: Exit workflow gracefully (analysis file is preserved)
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [code analysis is saved to file], will you then load and read fully `{nextStepFile}` to execute and begin optional context gathering.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Code analysis completed based on backlog content
- Relevant files identified and categorized
- Files to modify clearly listed
- Dependencies mapped
- Analysis saved to backlog folder
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Skipping code analysis
- Not saving analysis to file
- Starting implementation during analysis
- Modifying any files
- Missing key dependencies or related files

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
