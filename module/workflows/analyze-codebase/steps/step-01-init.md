---
name: 'step-01-init'
description: '백로그 정보 확인 및 기존 분석 체크'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-config.md'
workflowFile: '{workflow_path}/workflow.md'

# Data Paths
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'
tasks_folder: '{data_path}/tasks'
analysis_filename: 'code-analysis.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 1: 백로그 정보 확인 및 기존 분석 체크

## STEP GOAL:

백로그 정보를 확인하고, 기존 분석 결과가 있는지 체크하여 분석 진행 방식을 결정합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a code analysis specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring codebase analysis expertise and pattern recognition skills
- ✅ User brings domain knowledge and project context

### Step-Specific Rules:

- 🎯 Focus ONLY on gathering backlog information and checking existing analysis
- 🚫 FORBIDDEN to start analysis in this step
- 💬 Ask questions to understand the backlog context
- 🚪 DETECT if this is invoked from another workflow or standalone

## EXECUTION PROTOCOLS:

- 🎯 Gather backlog information systematically
- 💾 Store backlog info for next steps
- 📖 Check for existing analysis before proceeding
- 🚫 FORBIDDEN to load next step until backlog info is confirmed

## CONTEXT BOUNDARIES:

- Check if invoked from another workflow (parameters provided)
- If standalone, gather backlog info from user
- Determine if existing analysis can be reused
- This is about setup, not analysis

## INITIALIZATION PROCESS:

### 1. Check Invocation Context

**IF invoked from another workflow:**

전달받은 파라미터를 확인합니다:

- `backlog_id`: {backlog_id}
- `backlog_content`: {backlog_content}
- `backlog_folder`: {backlog_folder}
- `analysis_depth`: {analysis_depth} (없으면 기본값 사용)
- `force_new`: {force_new} (없으면 false)

파라미터가 모두 확인되면 → 섹션 3으로 이동

**IF standalone execution:**

사용자에게 입력 방식을 안내합니다:

"분석할 백로그 정보를 입력해주세요:

**입력 방식:**

1. 기존 백로그 폴더 경로 입력 (예: data/backlogs/12345, data/tasks/12345)
2. 새 백로그 내용 직접 입력"

### 2. Process User Input

**IF 옵션 1 - 기존 폴더:**

- 백로그 폴더에서 `backlog-info.yaml` 로드
- 백로그 ID 및 내용 추출
- `backlog_folder` 경로 설정

**IF 옵션 2 - 새 백로그:**

사용자에게 요청:
"백로그 내용을 입력해주세요:

- 제목
- 설명/요구사항
- 관련 키워드 (있다면)"

- 백로그 ID 자동 생성: {YYYYMMDD}-{HHMMSS}
- 저장 폴더 선택 요청:

"분석 결과를 저장할 폴더를 선택해주세요:

- [b] backlogs 폴더 ({backlogs_folder})
- [t] tasks 폴더 ({tasks_folder})
- [c] 커스텀 경로 입력"

### 3. Check Existing Analysis

기존 분석 결과 확인: `{backlog_folder}/{analysis_filename}`

**IF 기존 분석 발견 AND force_new != true:**

기존 분석 정보를 표시:

"**기존 코드 분석 발견:**

- 위치: {backlog_folder}/{analysis_filename}
- 생성일: {analysis_created_date}
- 분석 깊이: {previous_analysis_depth}
- 분석된 파일 수: {previous_file_count}개"

사용자에게 처리 방식 질문:

"기존 분석을 어떻게 처리할까요?

- [r] 재사용 - 기존 분석 결과 그대로 사용
- [u] 업데이트 - 기존 분석에 추가 분석 병합
- [n] 새로 분석 - 기존 분석 무시하고 처음부터"

**IF response == 'r':**

- 기존 분석 결과를 `{code_analysis}` 변수에 로드
- 분석 결과 요약 표시
- step-05-complete.md로 바로 이동

**IF response == 'u':**

- 기존 분석 결과를 `{existing_analysis}` 변수에 로드
- 업데이트 모드로 진행

**IF 기존 분석 없음 OR force_new == true:**

새 분석 진행 안내

### 4. Confirm Setup

설정 내용 확인:

"**분석 설정 확인:**

- 백로그 ID: {backlog_id}
- 백로그 제목: {backlog_title}
- 저장 폴더: {backlog_folder}
- 분석 모드: {analysis_mode} (새 분석 / 업데이트)

이 설정으로 진행할까요?"

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Confirm setup, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and backlog info is confirmed, will you then load, read entire file, then execute {nextStepFile} to begin analysis depth and scope selection.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Backlog information gathered correctly
- Existing analysis checked
- User confirmed setup
- Ready to proceed with analysis configuration

### ❌ SYSTEM FAILURE:

- Starting analysis without backlog info
- Skipping existing analysis check
- Not confirming setup with user
- Proceeding without user selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
