---
name: 'step-05-complete'
description: '완료 및 검증'

# Path Definitions
workflow_path: '{module_path}/workflows/analyze-db-structure'

# File References
thisStepFile: '{workflow_path}/steps/step-05-complete.md'
workflowFile: '{workflow_path}/workflow.md'

# Task References
# (final step - no task references needed)

# Template References
# (final step - no templates used)

# Output References
guides_folder: '{module_path}/data/guides'
---

# Step 5: 완료 및 검증

**Progress: Step 5 of 5** - Final Step

## STEP GOAL:

생성된 가이드 문서들을 검증하고, 워크플로우 완료를 보고합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 데이터베이스 분석 전문가
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Final step - ensure quality and user satisfaction

### Step-Specific Rules:

- 🎯 Focus on 검증 및 완료 보고
- 🚫 FORBIDDEN to skip verification
- 💬 Provide clear summary and next steps
- ✅ Ensure all deliverables are accounted for

## EXECUTION PROTOCOLS:

- 🎯 생성된 모든 파일 확인
- 💾 파일 존재 및 내용 검증
- 📖 사용자에게 완료 보고
- ✅ 다음 단계 안내

## CONTEXT BOUNDARIES:

- Available context: 모든 이전 스텝 결과
- Focus: 검증 및 완료
- Limits: 이 스텝에서 새로운 분석 없음
- Dependencies: step-01 ~ step-04 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. 생성된 파일 검증

`{guides_folder}` 폴더 내 파일 확인:

#### A. 필수 파일 체크

```yaml
required_files:
  - backlog-guide-summary.md
  - hierarchy-map.md

type_specific_files:
  - guide-{type}.md for each identified type
```

#### B. 파일 존재 확인

각 파일에 대해:

- 파일 존재 여부 확인
- 파일 크기 확인 (비어있지 않은지)
- 기본 구조 검증 (frontmatter, 섹션 등)

**If any file missing or empty:**

> "**⚠️ 검증 실패**
>
> 누락/비어있는 파일:
>
> - {missing_files_list}
>
> 다시 생성하시겠습니까?"

**→ [R] Regenerate 옵션 제시 (step-04로 돌아가기)**

### 2. 분석 결과 요약

검증 완료 후 전체 요약 제시:

> "**✅ 백로그 가이드 생성 완료!**
>
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
>
> **📊 분석 결과:**
>
> | 항목               | 값                             |
> | ------------------ | ------------------------------ |
> | 데이터베이스       | {database_name}                |
> | 발견된 백로그 유형 | {types_count}개 ({types_list}) |
> | 관계 속성          | {relations_count}개            |
> | 전체 속성          | {properties_count}개           |
>
> ---
>
> **📁 생성된 파일:**
>
> | 파일                       | 설명                   |
> | -------------------------- | ---------------------- |
> | `backlog-guide-summary.md` | 전체 요약 및 빠른 참조 |
> | `hierarchy-map.md`         | 계층 구조 및 관계 맵   |
>
> {type_guides_table}
>
> **경로:** `{guides_folder}/`
>
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

### 3. 다음 단계 안내

사용자에게 다음 단계 안내:

> "**🚀 다음 단계:**
>
> 1. **가이드 수정이 필요하면:**
>    - `*edit-guide` 명령으로 가이드 수정 가능
> 2. **백로그 구조 확인:**
>    - `*show-structure` 명령으로 구조 확인 가능
> 3. **다른 에이전트 활용:**
>    - 이제 다른 에이전트들이 이 가이드를 참조하여 백로그를 탐색/수정할 수 있습니다
>    - `*prepare-backlog`: 백로그 준비
>    - `*decompose-backlog`: 백로그 분해
>
> ---
>
> 가이드가 팀의 워크플로우에 맞게 잘 생성되었나요?
> 추가로 수정하거나 확인할 내용이 있으신가요?"

**Wait for user response.**

### 4. 최종 확인 및 종료

사용자 피드백 처리:

- **추가 작업 필요:** 해당 작업 안내 또는 수행
- **만족:** 워크플로우 종료

---

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [E] Edit Guide - 가이드 수정 [V] View Files - 파일 확인 [D] Done - 완료 [R] Re-run - 처음부터 다시"

#### Menu Handling Logic:

- IF E: Inform user to use `*edit-guide` command, end this workflow
- IF V: List files, let user select one to view
- IF D: End workflow with success message
- IF R: Restart from step-01
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- D option ends the workflow successfully
- After other menu items execution, return to this menu

---

## WORKFLOW COMPLETION

When user selects [D] Done:

> "**🎉 워크플로우 완료**
>
> 백로그 데이터베이스 분석 및 가이드 생성이 성공적으로 완료되었습니다.
>
> 생성된 가이드는 다른 Rentre-Dev 에이전트들이 참조하여
> 백로그를 효과적으로 탐색하고 관리하는 데 사용됩니다.
>
> 감사합니다, {user_name}님! 🚀"

**→ 워크플로우 종료**

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 필수 파일 검증 완료
- 분석 결과 요약 제시
- 다음 단계 안내 완료
- 사용자 만족 확인
- 워크플로우 정상 종료

### ❌ SYSTEM FAILURE:

- 파일 검증 없이 완료 보고
- 누락된 파일 무시
- 사용자 확인 없이 종료
- **CRITICAL**: 스텝 파일 일부만 읽음

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
