---
name: 'step-03-code-analysis'
description: '코드베이스 분석 (선택적)'

# Path Definitions
workflow_path: '{module_path}/workflows/decompose-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-03-code-analysis.md'
nextStepFile: '{workflow_path}/steps/step-04-config.md'
previousStepFile: '{workflow_path}/steps/step-02-select-backlog.md'
workflowFile: '{workflow_path}/workflow.md'

# Workflow References
analyze_codebase_workflow: '{module_path}/workflows/analyze-codebase/workflow.yaml'
---

# Step 3: 코드베이스 분석 (선택적)

**Progress: Step 3 of 8** - Next: 분해 대상 유형 및 강도 선택

## STEP GOAL:

코드베이스를 분석하여 백로그 구현에 관련된 파일과 패턴을 파악합니다. 이 정보는 더 정확한 분해에 활용됩니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분해 전문가 with code analysis capabilities
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 코드 분석 전문성, user brings 도메인 지식 및 코드베이스 컨텍스트
- ✅ Maintain collaborative 협력적 tone throughout

### Step-Specific Rules:

- 🎯 Focus only on 코드 분석 및 관련 파일 파악
- 🚫 FORBIDDEN to 사용자 선택 없이 분석 강제 수행
- 💬 Approach: 사용자에게 코드 분석 여부 선택권 제공
- 📋 OPTIONAL 이 스텝은 선택적이지만, 분해 품질 향상에 도움

## EXECUTION PROTOCOLS:

- 🎯 기존 코드 분석 결과 존재 여부 확인
- 💾 분석 결과 저장 (수행한 경우)
- 📖 분석 결과를 분해에 활용할 컨텍스트로 저장
- 🚫 FORBIDDEN 이전 분석 결과 덮어쓰기 (사용자 확인 없이)

## CONTEXT BOUNDARIES:

- Available context: 백로그 정보, 요구사항, 수용 기준, 백로그 폴더
- Focus: 코드 분석 및 관련 파일/패턴 파악
- Limits: 실제 분해는 다음 스텝에서 수행
- Dependencies: 백로그 선택 및 준비 완료

---

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. 기존 코드 분석 결과 확인

`{backlog_folder}/code-analysis.md` 존재 여부 확인:

**기존 분석이 있는 경우:**

> "**📊 기존 코드 분석 결과 발견**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **분석 일시:** {analysis_date}
> **분석 범위:** {analysis_scope}
>
> **관련 파일:**
> {target_files_summary}
>
> **구현 노트:**
> {implementation_notes_summary}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

사용자에게 질문:

> "기존 코드 분석을 어떻게 처리할까요?
>
> - [r] 재사용 - 기존 분석 결과 사용
> - [u] 업데이트 - 추가 분석 병합
> - [n] 새로 분석
> - [s] 건너뛰기 - 코드 분석 없이 진행"

**Wait for user response.**

### 2. 신규 분석 여부 결정 (기존 분석 없는 경우)

사용자에게 질문:

> "**코드베이스 분석**
>
> 코드 분석을 수행하면 더 정확한 분해가 가능합니다:
>
> - 관련 파일 및 컴포넌트 파악
> - 기존 패턴 및 구조 이해
> - 구현 복잡도 예측
>
> 코드베이스를 분석하시겠습니까?
>
> - [y] 예 - 코드 분석 후 분해 (권장)
> - [n] 아니오 - 바로 분해 진행"

**Wait for user response.**

### 3. 코드 분석 실행 (요청된 경우)

**Option y - 분석 수행:**

```yaml
invoke-workflow: {analyze_codebase_workflow}
  params:
    backlog_id: {backlog_id}
    backlog_content: {backlog_info}
    backlog_folder: {backlog_folder}

result:
  - code_analysis: 분석 결과
  - target_files: 관련 파일 목록
  - implementation_notes: 구현 주의사항
```

**🔧 Serena MCP 도구 활용 (analyze-codebase 내부에서):**

```yaml
# 관련 코드 패턴 검색
tool: mcp__serena__search_for_pattern
params:
  substring_pattern: "{backlog_keywords}"
  context_lines_before: 2
  context_lines_after: 2

# 프로젝트 컨텍스트 참조
tool: mcp__serena__read_memory
params:
  memory_file_name: "architecture"  # 또는 관련 메모리

# 분석 결과 저장 (선택적)
tool: mcp__serena__write_memory
params:
  memory_name: "backlog-{backlog_id}-analysis"
  content: "{analysis_summary}"
```

분석 결과 표시:

> "**✅ 코드 분석 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> **관련 파일:** {file_count}개
> {target_files_list}
>
> **구현 패턴:**
> {patterns_found}
>
> **예상 복잡도:** {complexity_estimate}
>
> **구현 노트:**
> {implementation_notes}
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

### 4. 분석 결과 저장

코드 분석 결과를 `{backlog_folder}/code-analysis.md`에 저장

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue - 분해 설정으로 진행 [A] Analyze - 코드 분석 (재)수행 [B] Back - 백로그 선택으로 돌아가기 [X] Exit - 종료"

#### Menu Handling Logic:

- IF C: Update frontmatter `stepsCompleted: [1, 2, 3]`, then load, read entire file, then execute {nextStepFile}
- IF A: Re-execute from section 3
- IF B: Load, read entire file, then execute {previousStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and redisplay menu

---

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [코드 분석 완료 또는 건너뛰기 선택됨], will you then load and read fully `{nextStepFile}` to execute and begin 분해 설정 단계.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 사용자에게 코드 분석 옵션 제공
- 기존 분석 재사용 또는 신규 분석 수행
- 분석 결과 저장 (수행한 경우)
- 분해에 활용할 컨텍스트 수집
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- 사용자 선택 없이 분석 강제 수행
- 분석 결과 저장 누락
- 이전 분석 결과 덮어쓰기 (사용자 확인 없이)
- Proceeding without user input/selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
