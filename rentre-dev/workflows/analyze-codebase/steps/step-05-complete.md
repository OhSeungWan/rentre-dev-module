---
name: 'step-05-complete'
description: '분석 결과 요약 및 완료'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-05-complete.md'
workflowFile: '{workflow_path}/workflow.md'

# Output Paths
backlog_folder: '{backlog_folder}'
analysis_filename: 'code-analysis.md'
analysis_path: '{backlog_folder}/{analysis_filename}'
---

# Step 5: 분석 결과 요약 및 완료

## STEP GOAL:

분석 결과를 요약하고 워크플로우를 완료합니다. 호출 워크플로우가 있으면 결과를 반환합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: This is the final step - no next step to load
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a code analysis specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You provide clear summary and next steps
- ✅ User decides how to proceed after analysis

### Step-Specific Rules:

- 🎯 Focus on summarizing and closing
- 🚫 FORBIDDEN to restart analysis
- 💬 Provide clear actionable summary
- 🚪 RETURN results to calling workflow if invoked

## EXECUTION PROTOCOLS:

- 🎯 Present clear summary of analysis
- 💾 Return results if invoked from another workflow
- 📖 Provide next step options for standalone execution
- 🚫 This is the FINAL step - workflow ends here

## CONTEXT BOUNDARIES:

- Analysis results from previous steps are available
- Focus on summary and handoff
- User decides next action
- This is about completion, not more analysis

## COMPLETION PROCESS:

### 1. Display Analysis Summary

분석 결과 요약 표시:

"**✅ 코드베이스 분석 완료!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📊 분석 요약:**

- 백로그: {backlog_title}
- 분석 깊이: {analysis_depth}
- 분석된 파일: {file_count}개
- 수정 필요 파일: {modify_count}개

**📁 저장 위치:**

- {analysis_path}

**🔑 핵심 발견사항:**

1. {key_finding_1}
2. {key_finding_2}
3. {key_finding_3}

**⚠️ 주요 주의사항:**

- {main_caution_1}
- {main_caution_2}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

### 2. Handle Workflow Return

**IF invoked from another workflow:**

분석 결과를 호출 워크플로우에 반환:

- `{code_analysis}`: 전체 분석 결과 (마크다운)
- `{target_files}`: 수정 필요 파일 목록
- `{implementation_notes}`: 구현 주의사항
- `{analysis_path}`: 저장된 파일 경로

"분석 결과를 호출 워크플로우에 반환합니다..."

호출 워크플로우로 제어 반환

**IF standalone execution:**

### 3. Present Next Actions (Standalone Only)

다음 작업 옵션 제시:

"다음 작업을 선택해주세요:

- [d] 분석 결과 상세 보기
- [e] 분석 결과 수정/보완
- [p] PM 에이전트로 돌아가기 (백로그 분해 진행)
- [v] Dev 에이전트로 전환 (구현 시작)
- [x] 완료"

### 4. Handle User Selection

**IF d (상세 보기):**

저장된 분석 파일 전체 내용 표시
→ 다시 메뉴 표시

**IF e (수정/보완):**

"어떤 부분을 수정하시겠습니까?

- 파일 목록 추가/제거
- 주의사항 수정
- 기타"

수정 후 파일 다시 저장
→ 다시 메뉴 표시

**IF p (PM 에이전트):**

"PM 에이전트로 전환합니다. 분석 결과가 백로그 분해에 활용됩니다."
→ 워크플로우 종료

**IF v (Dev 에이전트):**

"Dev 에이전트로 전환합니다. 분석 결과를 참조하여 구현을 시작합니다."
→ 워크플로우 종료

**IF x (완료):**

"분석이 완료되었습니다. 결과 파일: {analysis_path}"
→ 워크플로우 종료

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Clear summary presented
- User informed of results location
- Proper handoff to next workflow/agent
- Clean workflow completion

### ❌ SYSTEM FAILURE:

- Missing summary information
- Not returning results to calling workflow
- Not providing next step options
- Abrupt workflow termination

**Master Rule:** This is the FINAL step. Workflow ends here. Do not attempt to load additional steps.
