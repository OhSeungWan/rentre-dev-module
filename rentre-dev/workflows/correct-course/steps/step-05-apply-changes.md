---
name: 'step-05-apply-changes'
description: '변경사항 적용 및 이력 기록'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/correct-course'
backlog_path: '{data_path}/{backlog_id}'

# File References
thisStepFile: '{workflow_path}/steps/step-05-apply-changes.md'
nextStepFile: '{workflow_path}/steps/step-06-complete.md'
---

# Step 5: 변경 적용

## STEP GOAL

분석된 변경사항을 실제 파일에 적용하고 변경 이력을 기록합니다.

## MANDATORY EXECUTION RULES

### Universal Rules

- 📖 CRITICAL: 모든 변경은 이력으로 기록
- 🔗 Block ID 참조 유지
- 💾 변경 전 상태 스냅샷 저장

### Step-Specific Rules

- 🎯 승인된 변경만 적용
- 🚫 FORBIDDEN: 사용자 확인 없이 파일 수정
- ⚠️ 롤백 가능하도록 before/after 기록

---

## EXECUTION SEQUENCE

### 1. 적용할 변경 확인

```
📝 적용할 변경사항:

1. backlog-info.yaml 수정:
   - {change_item_1}
   - {change_item_2}

2. 서브태스크 변경:
   - 추가: {new_subtask_count}개
   - 수정: {modified_subtask_count}개

3. 변경 이력 기록:
   - CHG-{next_id} 생성

이 변경을 적용하시겠습니까?
```

### 2. 변경 이력 ID 생성

```yaml
# change-history.yaml에 추가할 항목
- id: CHG-{timestamp}
  timestamp: { current_datetime }
  type: { change_type }
  description: { change_description }
  reason: { change_reason }
  affected_blocks:
    - BLK-{id}
    - ...
  affected_requirements:
    - REQ-{id}
    - ...
  before:
    # 변경 전 상태 스냅샷
  after:
    # 변경 후 상태
  approved_by: user
```

### 3. backlog-info.yaml 수정

변경 유형에 따른 수정:

**요구사항 변경 시**:

```yaml
requirements:
  - id: REQ-{id}
    summary: { updated_summary }
    source_blocks: [BLK-XXX, ...]
    # 변경된 내용
```

**블록 추가 시**:

```yaml
content_blocks:
  - id: BLK-{new_id}
    type: { block_type }
    content: { new_content }
    source: manual
```

### 4. 서브태스크 파일 처리

**새 서브태스크 생성**:

```
파일: {backlog_path}/subtasks/{subtask_id}.yaml
내용:
  id: {subtask_id}
  title: {title}
  covers:
    - block_id: BLK-XXX
      coverage: full
  traceability:
    requirements: [REQ-XXX]
    source_change: CHG-{id}
```

**기존 서브태스크 수정**:

```
파일: {backlog_path}/subtasks/{subtask_id}.yaml
수정: {modification_details}
```

### 5. 커버리지 재계산

```yaml
coverage:
  total_blocks: { total }
  covered_blocks: { covered }
  coverage_percent: { percent }
  uncovered_blocks: [BLK-XXX, ...]
  last_updated: { timestamp }
```

### 6. 변경 적용 결과

```
✅ 변경 적용 완료:

변경 ID: CHG-{id}
적용 시간: {timestamp}

수정된 파일:
  - backlog-info.yaml
  - change-history.yaml
  - subtasks/{subtask_id}.yaml (x{count})

커버리지: {before}% → {after}%
```

---

## MENU OPTIONS

`[Y]` Yes - 변경 적용
`[N]` No - 변경 취소
`[E]` Edit - 변경 내용 수정
`[P]` Preview - 변경될 파일 미리보기

### Menu Handling Logic

- IF Y: 변경 적용 후 `{nextStepFile}` 로드
- IF N: "변경이 취소되었습니다" 메시지 후 워크플로우 종료
- IF E: 변경 내용 수정으로 돌아가기
- IF P: 변경될 파일 내용 미리보기 후 메뉴로

---

## OUTPUT FILES

이 스텝에서 수정/생성:

- `{backlog_path}/backlog-info.yaml` (수정)
- `{backlog_path}/change-history.yaml` (추가)
- `{backlog_path}/subtasks/*.yaml` (추가/수정)

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- 모든 변경 사용자 승인 후 적용
- change-history.yaml에 이력 기록
- before/after 스냅샷 저장
- 커버리지 재계산 완료

### ❌ FAILURE

- 승인 없이 파일 수정
- 이력 기록 누락
- 블록 ID 참조 깨짐
