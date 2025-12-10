---
name: 'step-04-additional-context'
description: '추가 컨텍스트 수집 (피그마, 참조 문서 등)'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-04-additional-context.md'
nextStepFile: '{workflow_path}/steps/step-05-context-verify.md'
prevStepFile: '{workflow_path}/steps/step-03-requirements.md'
workflowFile: '{workflow_path}/workflow.md'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/backlogs/{backlog_id}/prepare.yaml'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 4: 추가 컨텍스트 수집 (피그마, 참조 문서 등)

**Progress: Step 4 of 7** - Next: 컨텍스트 충족도 검증

## STEP GOAL:

피그마 링크, 참조 문서, 불명확한 항목 등 구현에 필요한 추가 컨텍스트를 수집합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a 백로그 분석 전문가
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 분석 전문성, user brings 도메인 지식, and together we produce something better

### Step-Specific Rules:

- 📖 CRITICAL: 구현에 필요한 모든 컨텍스트를 수집
- 🎨 CRITICAL: 피그마 링크 발견 시 파일 키와 노드 ID 추출
- ⚠️ CRITICAL: 불명확한 항목 식별하여 분해 전 해결

## CONTEXT FROM PREVIOUS STEPS:

**prepare.yaml에서 이전 스텝 결과 로드:**

```yaml
load_from: '{prepare_file}'
restore:
  - step_01.backlog_id
  - step_01.title
  - step_01.type
  - step_02.hierarchy
  - step_02b.content_blocks
  - step_03.requirements
  - step_03.acceptance_criteria
```

- `backlog_id`, `title`, `type` - Step 1
- `hierarchy` - Step 2
- `content_blocks` - Step 2b
- `requirements`, `acceptance_criteria` - Step 3

## YOUR TASK:

피그마 링크, 참조 문서, 불명확한 항목 등 구현에 필요한 추가 컨텍스트를 수집합니다.

---

## CONTEXT COLLECTION SEQUENCE:

### 1. 피그마 링크 감지 및 정보 추출

**1.1 피그마 링크 파싱:**

백로그 내용에서 다음 패턴 검색:

- `https://www.figma.com/file/{file_key}...`
- `https://www.figma.com/design/{file_key}...`
- `node-id={node_id}` 또는 `?node-id={node_id}`
- 직접 노드 ID: `{number}:{number}` 형식

**If figma links found:**

```yaml
figma:
  url: { full_figma_url }
  file_key: { extracted_file_key }
  node_id: { extracted_node_id }
  detected_in: description | acceptance_criteria | comment
```

> "**🎨 피그마 디자인 감지됨:**
>
> - URL: {figma_url}
> - 파일 키: {file_key}
> - 노드 ID: {node_id}
>
> → 이 정보는 하위 백로그에 자동 전파됩니다."

---

### 2. 참조 문서 및 링크 수집

**2.1 참조 문서 파싱:**

백로그 내용에서 참조 링크 검색:

- API 문서 링크
- 기술 스펙 문서
- 외부 서비스 문서
- 내부 위키/문서

```yaml
references:
  - type: api_doc
    url: { url }
    title: { title }

  - type: external_service
    url: { url }
    title: { title }
```

---

### 3. 불명확한 항목 식별

**3.1 불명확/모호한 부분 체크:**

요구사항과 수용기준에서 불명확한 부분 식별:

- "적절한", "빠른", "좋은" 등 모호한 표현
- 구체적 수치가 없는 성능 요구사항
- 정의되지 않은 용어나 개념
- 암묵적인 가정

**If unclear items found:**

```yaml
unclear_items:
  - item: REQ-003
    issue: '"적절한 응답 시간"이 구체적이지 않음'
    suggestion: '구체적인 ms 단위 지정 필요'

  - item: AC-002
    issue: '"사용자 친화적" 정의 필요'
    suggestion: '구체적인 UX 기준 명시 필요'
```

> "**⚠️ 불명확한 항목 발견:**
>
> | 항목 | 이슈 | 제안 |
> | ---- | ---- | ---- |
>
> {unclear_items_table}
>
> 이 항목들은 분해 전에 명확히 하는 것이 좋습니다."

---

### 4. 불명확 항목 처리

> "불명확한 항목을 어떻게 처리할까요?
>
> - [c] 명확화 - 지금 바로 명확하게 정의
> - [l] 나중에 - 분해 과정에서 처리
> - [s] 건너뛰기 - 현재 상태로 진행"

**If [c]:**

> "각 불명확한 항목에 대한 명확한 정의를 입력해 주세요:"

After user input:

- 요구사항/수용기준 업데이트
- unclear_items에서 제거

---

### 5. prepare.yaml에 Step 4 결과 저장

**prepare.yaml에 Step 4 결과 저장:**

```yaml
# {prepare_file} 업데이트
stepsCompleted: [1, 2, 2b, 3, 4]
last_updated: {timestamp}

# Step 4 결과 추가
step_04:
  figma:
    url: { figma_url }
    file_key: { figma_file_key }
    node_id: { figma_node_id }
  references:
    - type: api_doc
      url: { url }
      title: { title }
  unclear_items:
    - item: REQ-003
      issue: '불명확한 내용'
      suggestion: '제안'
```

**CRITICAL:** 컨텍스트 초과 시에도 추가 컨텍스트 결과 보존

> "**📚 추가 컨텍스트 수집 완료**
>
> ━━━━━━━━━━━━━━━━━━━━━━━
>
> - 🎨 피그마: {figma_status}
> - 📄 참조 문서: {ref_count}개
> - ⚠️ 불명확 항목: {unclear_count}개
>
> ━━━━━━━━━━━━━━━━━━━━━━━"

---

## SUCCESS METRICS:

✅ 피그마 링크 감지 및 파싱 완료
✅ 참조 문서 수집 완료
✅ 불명확 항목 식별 및 처리
✅ 컨텍스트 노트 구조화

## FAILURE MODES:

❌ 피그마 링크 누락 - 하위 백로그 전파 실패
❌ 불명확 항목 무시 - 분해 품질 저하
❌ 참조 문서 누락 - 구현 컨텍스트 부족

---

### 6. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue [F] Figma [R] Reference [U] Unclear [B] Back [X] Exit

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save to {prepare_file} with `stepsCompleted: [1, 2, 2b, 3, 4]` and step_04 results, then load, read entire file, then execute {nextStepFile}
- IF F: Add/modify Figma links, then [Redisplay Menu Options](#6-present-menu-options)
- IF R: Add reference documents, then [Redisplay Menu Options](#6-present-menu-options)
- IF U: Handle unclear items, then [Redisplay Menu Options](#6-present-menu-options)
- IF B: Load {prevStepFile}
- IF X: End workflow with summary
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to begin 컨텍스트 충족도 검증 단계.
