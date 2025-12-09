---
name: 'step-01-load-guides'
description: '가이드 파일 로드 및 사전 조건 확인'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-01-load-guides.md'
nextStepFile: '{workflow_path}/steps/step-02-select-backlog.md'
continueStepFile: '{workflow_path}/steps/step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'

# Resource References
guides_folder: '{module_path}/data/guides'
hierarchy_guide: '{guides_folder}/hierarchy-map.md'
summary_guide: '{guides_folder}/backlog-guide-summary.md'
data_path: '{module_path}/data'
---

# Step 1: 가이드 파일 로드 및 사전 조건 확인

**Progress: Step 1 of 8** - Next: 백로그 선택 및 준비 상태 확인

## STEP GOAL:

가이드 파일을 로드하고 백로그 계층 구조를 파악하여 분해 준비를 완료합니다. 기존 워크플로우가 있으면 재개 처리로 전환합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 계층 구조 분석 전문성, user brings 도메인 지식
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 가이드 파일 로드와 계층 구조 파악
- 🚫 FORBIDDEN to 가이드 파일 없이 분해 진행
- 💬 Approach: 협력적 발견 과정으로 진행
- 📋 Detect existing workflow state and route to resume handling
- 🚪 Route to step-01b if existing workflow detected

## EXECUTION PROTOCOLS:

- 🎯 가이드 파일 존재 여부 먼저 확인
- 💾 계층 구조 다이어그램 표시
- 📖 다음 스텝 로드 전 frontmatter `stepsCompleted: [1]` 설정
- 🚫 FORBIDDEN 가이드 파일 없이 진행 금지

## CONTEXT BOUNDARIES:

- Available context: workflow.md의 변수들이 메모리에 있음
- Focus: 가이드 로드 및 계층 구조 파악
- Limits: 다른 스텝의 지식을 가정하지 않음
- Dependencies: config.yaml 로드 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. 기존 워크플로우 확인

먼저 출력 폴더에 기존 분해 작업이 있는지 확인:

- `{data_path}/backlogs` 내 분해 중인 백로그 폴더 확인
- 있으면 frontmatter의 `stepsCompleted` 확인
- 재개가 필요하면 `{continueStepFile}` 로드

### 2. 재개 처리 (문서 존재 시)

문서가 존재하고 frontmatter에 `stepsCompleted`가 있으면:

- **STOP** 여기서 멈추고 `{continueStepFile}` 즉시 로드
- 초기화 작업 진행하지 않음
- step-01b가 재개 로직 처리

### 3. 가이드 파일 확인 및 로드 (신규 워크플로우)

#### A. 가이드 파일 존재 확인

`{guides_folder}` 폴더 확인:

- `hierarchy-map.md` (필수)
- `backlog-guide-summary.md` (필수)
- `guide-*.md` (유형별 가이드)

**가이드 파일이 없는 경우:**

> "**⚠️ 백로그 가이드 파일이 없습니다.**
>
> 백로그 분해를 위해서는 계층 구조 가이드가 필요합니다.
> Navigator 에이전트의 `*analyze-db` 명령으로 먼저 가이드를 생성해 주세요."

사용자에게 질문:

> "Navigator 에이전트로 전환하시겠습니까? (y/n)"

**Wait for user response.**

- If **y**: Navigator 에이전트 로드
- If **n**: 워크플로우 종료

#### B. 가이드 파일 로드

가이드 파일이 존재하면:

1. Load `{hierarchy_guide}` - 계층 구조 파악
2. Load `{summary_guide}` - 전체 백로그 유형 및 관계
3. 가용한 백로그 유형 및 분해 경로 파악

#### C. 계층 구조 표시

사용자에게 보고:

> "**백로그 계층 구조 로드 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> {hierarchy_diagram}
>
> **사용 가능한 분해 경로:**
>
> - Epic → Story
> - Story → Task, Bug
> - Task → Subtask
> - ... (가이드에 따라)
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> 다음 단계에서 분해할 백로그를 선택합니다."

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 백로그 선택으로 진행 [R] Reload - 가이드 다시 로드 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Update frontmatter `stepsCompleted: [1]`, then load, read entire file, then execute {nextStepFile}
- IF R: Re-execute from section 3.A
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and redisplay menu

---

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [가이드 파일 로드 완료 및 계층 구조 표시됨], will you then load and read fully `{nextStepFile}` to execute and begin 백로그 선택 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 기존 워크플로우 감지 시 step-01b로 올바르게 핸드오프
- 가이드 파일 존재 확인 완료
- 계층 구조 다이어그램 표시
- 분해 경로 목록 파악
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 가이드 파일 없이 분해 진행 시도
- frontmatter 업데이트 없이 진행
- 계층 구조 파악 없이 다음 스텝 진행
- Proceeding without user input/selection
- **CRITICAL**: 스텝 파일 일부만 읽음 - 불완전한 이해와 잘못된 결정 초래

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
