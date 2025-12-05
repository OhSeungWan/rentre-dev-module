---
name: 'step-04-save'
description: '분석 결과 정리 및 저장'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-04-save.md'
nextStepFile: '{workflow_path}/steps/step-05-complete.md'
workflowFile: '{workflow_path}/workflow.md'

# Output Paths
backlog_folder: '{backlog_folder}'
analysis_filename: 'code-analysis.md'
outputFile: '{backlog_folder}/{analysis_filename}'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: 분석 결과 정리 및 저장

## STEP GOAL:

분석 결과를 표준 형식으로 정리하고 파일로 저장합니다.

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
- ✅ You organize findings into actionable documentation
- ✅ User validates and approves the output

### Step-Specific Rules:

- 🎯 Focus on formatting and saving results
- 🚫 FORBIDDEN to modify analysis findings without user approval
- 💬 Present formatted output for review
- 🚪 SAVE to correct location with proper format

## EXECUTION PROTOCOLS:

- 🎯 Format analysis results according to template
- 💾 Save to {outputFile}
- 📖 Update backlog-info.yaml with code_context
- 🚫 FORBIDDEN to load next step until files are saved

## CONTEXT BOUNDARIES:

- Analysis results from step 3 are available
- Focus on formatting and saving
- User reviews before final save
- This is about documentation, not analysis

## SAVE PROCESS:

### 1. Format Analysis Results

분석 결과를 표준 형식으로 정리:

```markdown
# 코드베이스 분석 결과

**백로그:** {backlog_title}
**분석일:** {date}
**분석 깊이:** {analysis_depth}
**분석된 파일:** {file_count}개

---

## 1. 기술 스택

| 카테고리        | 기술                   |
| --------------- | ---------------------- |
| 언어            | {languages}            |
| 프레임워크      | {frameworks}           |
| 주요 라이브러리 | {libraries}            |
| 아키텍처 패턴   | {architecture_pattern} |

## 2. 관련 파일 목록

| #   | 파일 경로     | 역할     | 수정 필요  | 우선순위     |
| --- | ------------- | -------- | ---------- | ------------ |
| 1   | {file_path_1} | {role_1} | {modify_1} | {priority_1} |
| 2   | {file_path_2} | {role_2} | {modify_2} | {priority_2} |
| ... | ...           | ...      | ...        | ...          |

## 3. 의존성 맵

{dependency_diagram}

**주요 의존 관계:**

- {file_a} → {file_b}: {relationship_description}
- ...

## 4. 아키텍처 분석

### 현재 구조

{current_architecture_description}

### 관련 레이어/모듈

- **{layer_1}**: {layer_1_description}
- **{layer_2}**: {layer_2_description}

## 5. 구현 시 주의사항

### 기존 패턴 준수

- {pattern_1}: {pattern_1_description}
- {pattern_2}: {pattern_2_description}

### 잠재적 충돌 영역

- {conflict_area_1}
- {conflict_area_2}

### 테스트 필요 범위

- {test_scope_1}
- {test_scope_2}
```

**IF analysis_depth == 'deep' OR analysis_depth == 'comprehensive':**

추가 섹션:

```markdown
## 6. 상세 분석

### 주요 함수/클래스

| 이름       | 위치         | 역할     | 수정 가능성           |
| ---------- | ------------ | -------- | --------------------- |
| {symbol_1} | {location_1} | {role_1} | {modify_likelihood_1} |
| ...        | ...          | ...      | ...                   |

### 호출 흐름

{call_flow_diagram}
```

**IF analysis_depth == 'comprehensive':**

추가 섹션:

```markdown
## 7. 품질 및 개선 제안

### 테스트 현황

- 관련 테스트 파일: {test_files_count}개
- 예상 커버리지: {estimated_coverage}%

### 리팩토링 기회

- {refactoring_opportunity_1}
- {refactoring_opportunity_2}

### 기술 부채

- {tech_debt_1}
- {tech_debt_2}
```

공통 마무리 섹션:

```markdown
---

## Dev 에이전트 참고사항

**작업 시작 전 확인:**

1. {checklist_item_1}
2. {checklist_item_2}
3. {checklist_item_3}

**권장 작업 순서:**

1. {recommended_order_1}
2. {recommended_order_2}
3. {recommended_order_3}

**참조할 기존 구현:**

- {reference_implementation_1}
- {reference_implementation_2}
```

### 2. Present for Review

포맷된 결과를 사용자에게 표시:

"**분석 결과 미리보기:**

[위의 포맷된 마크다운 표시]

이 내용으로 저장할까요? 수정이 필요한 부분이 있으면 알려주세요."

### 3. Save Analysis File

분석 결과 저장: `{backlog_folder}/{analysis_filename}`

### 4. Update backlog-info.yaml

backlog-info.yaml 업데이트 (code_context 섹션 추가/갱신):

```yaml
code_context:
  analysis_date: { date }
  analysis_depth: { analysis_depth }
  file_count: { file_count }
  target_files:
    - { file_1 }
    - { file_2 }
  architecture_pattern: { architecture_pattern }
  tech_stack:
    languages: [{ languages }]
    frameworks: [{ frameworks }]
  implementation_notes:
    - { note_1 }
    - { note_2 }
```

### 5. Confirm Save

저장 완료 확인:

"**저장 완료:**

- 분석 결과: {backlog_folder}/{analysis_filename}
- backlog-info.yaml 업데이트됨

파일을 확인해보시겠습니까?"

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
- IF C: Confirm files saved, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and files are saved, will you then load, read entire file, then execute {nextStepFile} to complete the workflow.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Analysis formatted correctly
- User reviewed and approved
- File saved to correct location
- backlog-info.yaml updated
- Ready to complete workflow

### ❌ SYSTEM FAILURE:

- Saving without user review
- Wrong file location
- Missing required sections
- Not updating backlog-info.yaml

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
