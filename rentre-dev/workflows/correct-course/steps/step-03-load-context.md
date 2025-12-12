---
name: 'step-03-load-context'
description: '백로그 관련 데이터 로드'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'
backlog_path: '{data_path}/{backlog_id}'

# File References
thisStepFile: '{workflow_path}/steps/step-03-load-context.md'
nextStepFile: '{workflow_path}/steps/step-04-analyze-impact.md'
---

# Step 3: 컨텍스트 로드

## STEP GOAL

변경 영향 분석을 위해 필요한 백로그 관련 데이터를 로드합니다.

## MANDATORY EXECUTION RULES

### Universal Rules

- 📖 CRITICAL: 필요한 파일만 로드 (Just-In-Time)
- 🔗 Block Traceability 정보 유지

### Step-Specific Rules

- 🎯 데이터 로드에만 집중
- 🚫 FORBIDDEN: 이 스텝에서 분석 시작
- 💾 로드된 데이터 요약 표시

---

## EXECUTION SEQUENCE

### 1. 필수 파일 로드

**backlog-info.yaml** (필수):

```
파일: {backlog_path}/backlog-info.yaml
내용:
  - 기본 메타정보 (title, type, status)
  - content_blocks (BLK-XXX)
  - requirements (REQ-XXX)
  - acceptance_criteria (AC-XXX)
  - coverage metrics
```

### 2. 관련 파일 확인 및 로드

**서브태스크** (있는 경우):

```
위치: {backlog_path}/subtasks/
파일: *.yaml 또는 *.md
```

**코드 분석 결과** (있는 경우):

```
파일: {backlog_path}/code-analysis.md
```

**세션 상태** (있는 경우):

```
파일: {backlog_path}/session-state.yaml
```

### 3. 로드된 데이터 요약

```
📦 로드된 컨텍스트:

백로그: {backlog_title}
상태: {status}

📋 Content Blocks: {block_count}개
  - BLK-001: {block_summary}
  - BLK-002: {block_summary}
  ...

📝 Requirements: {req_count}개
  - REQ-001: {req_summary}
  ...

✅ Acceptance Criteria: {ac_count}개

📊 Coverage: {coverage_percent}%

🔧 서브태스크: {subtask_count}개
```

### 4. 변경 관련 블록 사전 식별

변경 유형에 따라 관련 블록 하이라이트:

**요구사항 변경 시**:

- 관련 REQ-XXX 블록 표시
- 해당 요구사항을 참조하는 서브태스크 표시

**서브태스크 추가 시**:

- 커버되지 않은 블록 표시
- 관련 BLK-XXX 제안

---

## MENU OPTIONS

`[C]` Continue - 영향 분석으로 진행
`[V]` View Details - 특정 블록/요구사항 상세 보기
`[B]` Back - 변경 유형 재선택

### Menu Handling Logic

- IF C: `{nextStepFile}` 로드
- IF V: 사용자가 요청한 항목 상세 표시 후 메뉴로
- IF B: step-02-identify-change.md 로드

---

## CONTEXT VARIABLES

### 이전 스텝 결과 로드

스텝 시작 시 `{session_path}/step-02-change.yaml` 로드:

- `change_type`, `change_description`, `change_reason`, `change_topic`

### 이 스텝에서 로드

- `backlog_info`: 전체 backlog-info.yaml 내용
- `content_blocks`: BLK-XXX 블록 목록
- `requirements`: REQ-XXX 요구사항 목록
- `subtasks`: 서브태스크 목록
- `code_analysis`: 코드 분석 결과 (있는 경우)

### 스텝 완료 시 저장

1. `{session_path}/step-03-context.yaml` 저장:
   ```yaml
   backlog_title: "{title}"
   backlog_status: "{status}"
   content_blocks_count: {count}
   content_blocks_summary:
     - id: BLK-001
       type: "{type}"
       preview: "{preview}"
   requirements_count: {count}
   requirements_summary:
     - id: REQ-001
       summary: "{summary}"
   subtasks_count: {count}
   coverage_percent: {percent}
   ```
2. `session-state.yaml` 업데이트:
   ```yaml
   stepsCompleted: [1, 2, 3]
   last_updated: {timestamp}
   ```

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- 필수 파일 로드 완료
- 데이터 요약 표시
- 컨텍스트 변수 설정

### ❌ FAILURE

- backlog-info.yaml 로드 실패
- 불완전한 데이터로 진행
