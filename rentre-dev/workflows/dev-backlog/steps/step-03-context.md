---
name: 'step-03-context'
description: '구현에 필요한 컨텍스트 수집'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-03-context.md'
nextStepFile: '{workflow_path}/steps/step-04-implement.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
session_state_file: '{data_path}/{backlog_id}/session-state.yaml'
---

# Step 3: 컨텍스트 준비

## STEP GOAL:

🆕 **Block-based Traceability**: 선택된 서브태스크 구현에 필요한 모든 컨텍스트를 수집합니다.
`inherited_content`로 상속된 원본 지시사항, 코드분석, Figma 디자인, API 문서 등을 포함합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Gather context efficiently before implementation

### Step-Specific Rules:

- 🎯 Focus ONLY on context gathering
- 🚫 FORBIDDEN to start implementation
- 💬 Load relevant context based on subtask type
- 🚪 Present context summary and wait for confirmation

## EXECUTION PROTOCOLS:

- 🎯 Load code analysis if available
- 💾 Fetch Figma design for UI tasks
- 📖 Query Context-7 for API documentation
- 🚫 FORBIDDEN to skip context for complex tasks

## SEQUENCE OF INSTRUCTIONS:

### 1. 서브태스크 상세 표시

**📋 현재 서브태스크: {current_subtask_title}**

<action>서브태스크 파일 전체 내용 로드 및 표시</action>

**작업 목적:**
{subtask_purpose}

**작업 단계:**
{subtask_steps_with_checkboxes}

**완료 기준:**
{completion_criteria}

**관련 파일:**
{related_files}

### 1b. 🆕 상속된 원본 지시사항 표시 (Block-based Traceability)

<check if="inherited_content exists in subtask">
**📝 원본 지시사항 (상위 백로그에서 상속됨)**

⚠️ **CRITICAL: 이 지시사항은 원본 백로그에서 그대로 가져온 것입니다. 반드시 준수하세요!**

<action>서브태스크의 inherited_content 필드에서 원본 블록 내용 로드</action>

| 블록 ID    | 타입         | 원본 내용           |
| ---------- | ------------ | ------------------- |
| {block_id} | {block_type} | {full_text_preview} |

**🔗 출처 블록 상세:**

> **{block_id}** ({block_type})
>
> ```
> {full_text_from_inherited_content}
> ```

**📌 핵심 제약조건 (constraint 타입 블록에서 추출):**

- ⚠️ {constraint_1_from_block}
- ⚠️ {constraint_2_from_block}
- ...

</check>

<check if="inherited_content not exists">
**ℹ️ 상속된 원본 지시사항 없음** - v1.0 스키마 또는 직접 생성된 태스크
</check>

### 2. 코드 분석 로드 (있는 경우)

<check if="code_analysis exists">
<action>코드 분석 파일 로드: {data_path}/{backlog_id}/code-analysis.md</action>

**📊 코드베이스 분석:**

**이 서브태스크 관련 파일:**
{matched_files_from_analysis}

**구현 시 주의사항:**
{implementation_notes}

**참조할 기존 패턴:**
{existing_patterns}
</check>

<check if="code_analysis not exists">
**ℹ️ 코드 분석 결과 없음**

Serena MCP로 실시간 분석을 시도합니다...

<action if="serena available">
mcp__serena__find_symbol 또는 mcp__serena__search_for_pattern으로 관련 코드 검색
</action>
</check>

### 3. Figma 디자인 로드 (디자인 태스크인 경우)

<check if="subtask has figma_url or is UI related">
**🎨 Figma 디자인 로드**

<action if="figma mcp available">
1. mcp__figma-dev-mode-mcp-server__get_screenshot으로 디자인 미리보기
2. mcp__figma-dev-mode-mcp-server__get_metadata로 스펙 추출
3. mcp__figma-dev-mode-mcp-server__get_code로 코드 힌트 확인
</action>

**디자인 스펙:**

- 컬러: {colors}
- 사이즈: {dimensions}
- 스페이싱: {spacing}
  </check>

<check if="subtask not UI related">
**ℹ️ 디자인 참조 불필요** - UI 관련 태스크 아님
</check>

### 4. API/라이브러리 문서 로드 (필요시)

<check if="subtask involves external API or library">
<action if="context7 available">
1. mcp__context7__resolve-library-id로 라이브러리 ID 확인
2. mcp__context7__get-library-docs로 관련 문서 로드
</action>

**📚 API 문서:**
{api_documentation_summary}
</check>

### 5. 컨텍스트 요약

**✅ 컨텍스트 준비 완료**

| 항목               | 상태                       |
| ------------------ | -------------------------- |
| 서브태스크 상세    | ✅ 로드됨                  |
| 🆕 상속된 지시사항 | {inherited_content_status} |
| 코드 분석          | {code_analysis_status}     |
| Figma 디자인       | {figma_status}             |
| API 문서           | {api_docs_status}          |

<check if="inherited_content exists">
**⚠️ 원본 지시사항 요약:**

{inherited_constraints_summary}

**🚨 구현 시 위 제약조건을 반드시 확인하세요!**
</check>

### 6. Present MENU OPTIONS

Display: **컨텍스트 확인 완료.** [C] 구현 시작 | [I] 🆕 상속된 지시사항 상세 | [F] Figma 상세 보기 | [A] 코드분석 상세 보기 | [B] 뒤로

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to implementation when user selects 'C'
- After viewing details, return to this menu

#### Menu Handling Logic:

- IF C:
  1. 🆕 Update {session_state_file}: `stepsCompleted: [1, 2, 3]`
  2. Load {nextStepFile} to start implementation
- IF I: 🆕 상속된 원본 지시사항 전체 표시 후 메뉴 재표시
- IF F: Figma 디자인 상세 표시 후 메뉴 재표시
- IF A: 코드 분석 전체 표시 후 메뉴 재표시
- IF B: Step 2로 돌아가기
- IF Any other: 응답 후 메뉴 재표시

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected will you load {nextStepFile} to begin implementation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 서브태스크 상세 표시됨
- 관련 컨텍스트 수집됨
- MCP 도구 적절히 활용됨
- 사용자 확인 후 구현 진행

### ❌ SYSTEM FAILURE:

- 컨텍스트 없이 구현 시작
- MCP 도구 사용 가능한데 미사용
- 사용자 확인 없이 진행

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
