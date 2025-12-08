---
name: 'step-01-init'
description: '워크플로우 초기화 및 대상 백로그 선택'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'
module_path: '{project-root}/.bmad/rentre-dev'
data_path: '{module_path}/data/backlogs'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-identify-change.md'
---

# Step 1: 초기화 및 백로그 선택

## STEP GOAL

워크플로우를 초기화하고 변경사항을 적용할 대상 백로그를 선택합니다.

## MANDATORY EXECUTION RULES

### Universal Rules

- 🛑 NEVER 사용자 입력 없이 진행
- 📖 CRITICAL: 전체 스텝 파일을 읽은 후 실행
- 📋 협력적 대화로 진행

### Step-Specific Rules

- 🎯 백로그 선택에만 집중
- 🚫 FORBIDDEN: 이 스텝에서 변경 분석 시작
- 💬 사용자와 대화하며 백로그 확인

---

## EXECUTION SEQUENCE

### 1. 환영 메시지

"{user_name}님, Correct Course 워크플로우를 시작합니다.

백로그 진행 중 발생한 변경사항을 체계적으로 관리하겠습니다."

### 2. 백로그 목록 확인

`{data_path}` 폴더를 스캔하여 사용 가능한 백로그 목록을 표시:

```
📋 사용 가능한 백로그:

1. [백로그 ID] - [제목] (상태: prepared/in_progress)
2. ...

또는 백로그 ID를 직접 입력하세요.
```

### 3. 백로그 선택

사용자가 선택한 백로그의 존재 여부 확인:

- `{data_path}/{backlog_id}/backlog-info.yaml` 파일 확인
- 없으면 오류 메시지 표시

### 4. 세션 상태 초기화

선택된 백로그에 대해 세션 변수 설정:

- `backlog_id`: 선택된 백로그 ID
- `backlog_path`: `{data_path}/{backlog_id}`
- `session_start`: 현재 시간

### 5. 기존 변경 이력 확인

`{backlog_path}/change-history.yaml` 파일 존재 여부 확인:

- 있으면: "이전 변경 이력이 있습니다. 계속 진행합니다."
- 없으면: 새 파일 생성 준비

---

## MENU OPTIONS

**백로그를 선택하셨습니다: [{backlog_id}] {backlog_title}**

`[C]` Continue - 변경 유형 파악으로 진행
`[R]` Reselect - 다른 백로그 선택

### Menu Handling Logic

- IF C: Load and execute `{nextStepFile}`
- IF R: 백로그 목록으로 돌아가기

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- 백로그 선택 완료
- 백로그 파일 존재 확인
- 세션 변수 초기화

### ❌ FAILURE

- 존재하지 않는 백로그 선택
- 백로그 선택 없이 다음 단계 진행
