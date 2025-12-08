---
name: 'step-04-analyze-impact'
description: '변경사항의 영향 분석'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'

# File References
thisStepFile: '{workflow_path}/steps/step-04-analyze-impact.md'
nextStepFile: '{workflow_path}/steps/step-05-apply-changes.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
---

# Step 4: 영향 분석

## STEP GOAL

변경사항이 백로그의 블록, 요구사항, 서브태스크에 미치는 영향을 분석합니다.

## MANDATORY EXECUTION RULES

### Universal Rules

- 📖 CRITICAL: Block Traceability 기반 분석
- 🔗 모든 영향은 블록 ID로 추적

### Step-Specific Rules

- 🎯 영향 분석에만 집중
- 🚫 FORBIDDEN: 이 스텝에서 변경 적용
- 💬 분석 결과를 사용자와 확인

---

## EXECUTION SEQUENCE

### 1. 영향 분석 시작

"변경사항의 영향을 분석합니다.

변경 유형: {change_type}
설명: {change_description}"

### 2. 블록 영향 분석

변경 유형에 따른 블록 영향 파악:

```
🔍 영향받는 Content Blocks:

직접 영향:
  - BLK-{id}: {content_preview}
    영향: {impact_description}

간접 영향:
  - BLK-{id}: {content_preview}
    이유: {reason}
```

### 3. 요구사항 영향 분석

```
📋 영향받는 Requirements:

수정 필요:
  - REQ-{id}: {summary}
    현재: {current_state}
    변경: {proposed_change}

검토 필요:
  - REQ-{id}: {summary}
    이유: {review_reason}
```

### 4. 서브태스크 영향 분석

```
🔧 서브태스크 영향:

수정 필요:
  - {subtask_id}: {title}
    변경 내용: {change}

추가 필요:
  - 제안: {new_subtask_description}
    커버할 블록: [BLK-XXX, ...]

삭제/보류:
  - {subtask_id}: {title}
    이유: {reason}
```

### 5. 커버리지 영향

```
📊 커버리지 변화 예상:

현재: {current_coverage}%
변경 후: {expected_coverage}%

미커버 블록:
  - BLK-{id}: {reason}
```

### 6. 영향 요약

```
📝 영향 분석 요약:

영향받는 블록: {affected_blocks_count}개
영향받는 요구사항: {affected_reqs_count}개
영향받는 서브태스크: {affected_subtasks_count}개

심각도: {severity} (낮음/중간/높음)
권장 조치: {recommendation}
```

---

## MENU OPTIONS

`[A]` Advanced Elicitation - 심화 분석 (복잡한 변경 시)
`[C]` Continue - 변경 적용으로 진행
`[E]` Edit - 분석 결과 수정
`[B]` Back - 변경 유형 재정의

### Menu Handling Logic

- IF A: `{advancedElicitationTask}` 실행 후 메뉴로
- IF C: 분석 결과 저장 후 `{nextStepFile}` 로드
- IF E: 사용자와 분석 결과 수정
- IF B: step-02-identify-change.md 로드

---

## ANALYSIS VARIABLES

이 스텝에서 생성:

- `affected_blocks`: 영향받는 블록 목록
- `affected_requirements`: 영향받는 요구사항 목록
- `affected_subtasks`: 영향받는 서브태스크 목록
- `new_subtasks_proposed`: 제안된 새 서브태스크
- `impact_severity`: 영향 심각도
- `coverage_change`: 커버리지 변화 예상

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- 모든 영향 블록 ID로 추적
- 영향 범위 명확히 파악
- 사용자 확인 완료

### ❌ FAILURE

- 블록 ID 없는 영향 분석
- 불완전한 영향 파악
- 사용자 확인 없이 진행
