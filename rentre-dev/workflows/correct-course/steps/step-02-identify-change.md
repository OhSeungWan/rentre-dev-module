---
name: 'step-02-identify-change'
description: '변경 유형 및 트리거 파악'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'

# File References
thisStepFile: '{workflow_path}/steps/step-02-identify-change.md'
nextStepFile: '{workflow_path}/steps/step-03-load-context.md'
---

# Step 2: 변경 유형 파악

## STEP GOAL

발생한 변경사항의 유형과 트리거를 파악하여 분류합니다.

## MANDATORY EXECUTION RULES

### Universal Rules

- 🛑 NEVER 사용자 입력 없이 변경 유형 결정
- 📖 CRITICAL: 사용자 설명을 충분히 듣기
- 📋 대화를 통해 변경 내용 명확화

### Step-Specific Rules

- 🎯 변경 유형 분류에만 집중
- 🚫 FORBIDDEN: 이 스텝에서 영향 분석 시작
- 💬 왜 변경이 필요한지 이해

---

## EXECUTION SEQUENCE

### 1. 변경 내용 질문

"어떤 변경이 발생했나요? 자세히 설명해 주세요.

예시:

- 구현 중 새로운 요구사항 발견
- 기술적 제약으로 접근 방식 변경 필요
- 추가 작업 항목 발생
- 리스크 또는 이슈 식별"

### 2. 변경 유형 분류

사용자 설명을 바탕으로 변경 유형 제안:

```
📋 변경 유형 분류:

[R] 요구사항 변경 - 기존 요구사항 수정 또는 새 요구사항 추가
[S] 서브태스크 추가/수정 - 작업 항목 변경
[P] 우선순위 변경 - 작업 순서 재조정
[K] 리스크 식별 - 새로운 리스크 발견
[O] 범위 변경 - 백로그 범위 확대/축소
[M] 복합 변경 - 여러 유형 동시 발생
```

### 3. 변경 상세 기록

선택된 유형에 따라 추가 정보 수집:

**요구사항 변경 (R)**:

- 어떤 요구사항이 변경되나요?
- 변경 전/후 내용은?

**서브태스크 (S)**:

- 추가할 서브태스크 내용은?
- 기존 서브태스크 수정 시 어떤 항목?

**우선순위 (P)**:

- 어떤 항목의 우선순위를 변경?
- 변경 이유는?

**리스크 (K)**:

- 발견된 리스크 내용은?
- 예상 영향과 대응 방안은?

**범위 변경 (O)**:

- 확대/축소 내용은?
- 이유는?

### 4. 변경 요약 확인

```
📝 변경 요약:

유형: {change_type}
설명: {change_description}
이유: {change_reason}

이 내용이 맞습니까?
```

---

## MENU OPTIONS

`[C]` Continue - 컨텍스트 로드로 진행
`[E]` Edit - 변경 내용 수정
`[B]` Back - 백로그 다시 선택

### Menu Handling Logic

- IF C: 변경 정보 저장 후 `{nextStepFile}` 로드
- IF E: 변경 내용 수정으로 돌아가기
- IF B: step-01-init.md 로드

---

## SESSION VARIABLES

이 스텝에서 설정:

- `change_type`: 변경 유형 코드
- `change_description`: 변경 설명
- `change_reason`: 변경 이유

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- 변경 유형 명확히 분류
- 변경 내용 상세 기록
- 사용자 확인 완료

### ❌ FAILURE

- 변경 유형 미분류
- 불명확한 변경 설명으로 진행
