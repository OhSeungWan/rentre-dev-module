---
name: 'step-02-config'
description: '분석 깊이 및 범위 선택'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-02-config.md'
nextStepFile: '{workflow_path}/steps/step-03-analyze.md'
workflowFile: '{workflow_path}/workflow.md'

# Config References
config_source: '{project-root}/.bmad/rentre-dev/config.yaml'
max_files_quick: '{config_source}:code_analysis.max_files_quick'
max_files_standard: '{config_source}:code_analysis.max_files_standard'
max_files_deep: '{config_source}:code_analysis.max_files_deep'
max_files_comprehensive: '{config_source}:code_analysis.max_files_comprehensive'
default_depth: '{config_source}:code_analysis.default_depth'

# State File
analysis_state_file: '{backlog_folder}/analysis.yaml'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: 분석 깊이 및 범위 선택

## STEP GOAL:

분석 깊이와 범위를 선택하여 코드베이스 분석의 상세 수준을 결정합니다.

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
- ✅ You help user choose appropriate analysis depth
- ✅ User decides based on their time and needs

### Step-Specific Rules:

- 🎯 Focus ONLY on configuring analysis parameters
- 🚫 FORBIDDEN to start analysis in this step
- 💬 Explain each option clearly
- 🚪 RESPECT user's choice even if you'd recommend different

## EXECUTION PROTOCOLS:

- 🎯 Present analysis depth options clearly
- 💾 Store configuration for next step
- 📖 Explain implications of each choice
- 🚫 FORBIDDEN to load next step until configuration is confirmed

## CONTEXT BOUNDARIES:

- Backlog info from step 1 is available
- Focus on configuration, not execution
- Help user make informed decision
- This is about setup, not analysis

## CONFIGURATION PROCESS:

### 0. Load analysis.yaml

`{analysis_state_file}` 로드하여 컨텍스트 복원:

- `backlog_id`, `backlog_folder` 확인
- `init` 섹션에서 이전 스텝 결과 로드
- stepsCompleted 확인 (현재 [1]이어야 함)

### 1. Select Analysis Depth

**IF analysis_depth already provided (from invocation):**

설정된 분석 깊이 확인 및 표시

**IF analysis_depth not provided:**

분석 깊이 옵션 표시:

"코드베이스 분석 깊이를 선택해주세요:

| 옵션                  | 설명                                     | 예상 파일 수                 | 소요 시간 |
| --------------------- | ---------------------------------------- | ---------------------------- | --------- |
| **[q] quick**         | 빠른 탐색 - 키워드 검색, 파일 목록       | ~{max_files_quick}개         | ~1분      |
| **[s] standard**      | 표준 분석 - + 의존성 맵, 아키텍처 패턴   | ~{max_files_standard}개      | ~3분      |
| **[d] deep**          | 심층 분석 - + 함수/클래스 레벨 분석      | ~{max_files_deep}개          | ~5분      |
| **[c] comprehensive** | 종합 분석 - + 테스트 범위, 리팩토링 제안 | ~{max_files_comprehensive}개 | ~10분     |

(기본값: {default_depth})"

### 2. Apply Depth Settings

선택된 깊이에 따른 설정 적용:

**Quick 모드:**

- 최대 파일 수: {max_files_quick}
- 의존성 분석: 아니오
- 테스트 분석: 아니오
- 함수 레벨 분석: 아니오
- 리팩토링 제안: 아니오

**Standard 모드:**

- 최대 파일 수: {max_files_standard}
- 의존성 분석: 예
- 테스트 분석: 아니오
- 함수 레벨 분석: 아니오
- 리팩토링 제안: 아니오

**Deep 모드:**

- 최대 파일 수: {max_files_deep}
- 의존성 분석: 예
- 테스트 분석: 아니오
- 함수 레벨 분석: 예
- 리팩토링 제안: 아니오

**Comprehensive 모드:**

- 최대 파일 수: {max_files_comprehensive}
- 의존성 분석: 예
- 테스트 분석: 예
- 함수 레벨 분석: 예
- 리팩토링 제안: 예

설정 내용 표시:

"**{analysis_depth} 모드 설정:**

- 최대 파일 수: {max_files_for_depth}
- 의존성 분석: {include_deps_for_depth}
- 테스트 분석: {include_tests_for_depth}
- 함수 레벨 분석: {include_function_level}
- 리팩토링 제안: {include_refactoring}"

### 3. Select Analysis Scope

분석 범위 선택:

"분석 범위를 선택해주세요:

- [a] 자동 탐색 (키워드 기반 전체 탐색) - 권장
- [p] 경로 지정 (특정 경로만 분석)
- [b] 둘 다 (자동 탐색 + 특정 경로)"

**IF response == 'p' OR response == 'b':**

"분석할 경로를 입력해주세요 (쉼표로 구분):
예: src/features/user, src/components, src/api"

입력된 경로를 `{custom_paths}`에 저장

### 4. Confirm Configuration

설정 확인:

"**분석 설정 확인:**

- 백로그: {backlog_title}
- 분석 깊이: {analysis_depth}
- 분석 범위: {scope_type}
- 최대 파일 수: {max_files_for_depth}
- 커스텀 경로: {custom_paths} (있는 경우)

이 설정으로 분석을 시작할까요?"

### 5. Save config to analysis.yaml

`{analysis_state_file}` 업데이트:

```yaml
# 기존 내용 유지 + config 섹션 추가
stepsCompleted: [1, 2]
updated_at: "{current_date}"

# Step 2 결과: 설정
config:
  analysis_depth: "{analysis_depth}"
  scope_type: "{scope_type}"
  custom_paths: [{custom_paths}]
  max_files: {max_files_for_depth}
  include_dependencies: {include_deps_for_depth}
  include_tests: {include_tests_for_depth}
  include_function_level: {include_function_level}
  include_refactoring: {include_refactoring}
```

### 6. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C:
  1. analysis.yaml에 `config` 섹션 및 `stepsCompleted: [1, 2]` 저장 확인
  2. load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and analysis.yaml is saved with stepsCompleted: [1, 2], will you then load, read entire file, then execute {nextStepFile} to begin the actual codebase analysis.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Analysis depth selected appropriately
- Scope configuration completed
- User confirmed settings
- Ready to proceed with analysis

### ❌ SYSTEM FAILURE:

- Starting analysis without configuration
- Ignoring user's depth preference
- Not explaining options clearly
- Proceeding without user confirmation

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
