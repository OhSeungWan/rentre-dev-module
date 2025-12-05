# Block-based Traceability System Schema

**Version:** 2.0
**Date:** 2024-12-05
**Status:** Active

## Overview

이 문서는 백로그 정보 소실 없는 분해 및 추적을 위한 Block-based Traceability System의 데이터 스키마를 정의합니다.

## Core Principles

1. **가역성 (Reversibility)**: `Sum(Children Blocks) = Parent Blocks`
2. **추적성 (Traceability)**: 모든 하위 백로그는 원본 블록 ID 보유
3. **연결성 (Connectivity)**: 형제 간 공유 블록 명시
4. **검증성 (Verifiability)**: 분해 시 자동 커버리지 체크

---

## Schema Definitions

### 1. Content Block

원본 백로그의 내용을 논리적 단위로 분할한 블록입니다.

```yaml
content_block:
  id: string # BLK-XXX 형식
  type: enum # description | instruction | acceptance | constraint
  lines: [int, int] # 원본 라인 범위 [시작, 끝]
  source: string # 출처 (notion_description | notion_toggle | notion_property | manual)
  toggle_title: string # 토글 블록인 경우 제목 (선택)
  content: string # 블록 내용 (원본 그대로)
  tags: string[] # 태그 목록
```

#### Block Types

| Type          | 설명                 | 예시                                 |
| ------------- | -------------------- | ------------------------------------ |
| `description` | 일반 설명, 배경 정보 | "이 기능은 사용자 경험을 개선합니다" |
| `instruction` | 작업 지시사항        | "JSON-LD 형식으로 구현하세요"        |
| `acceptance`  | 수용 기준            | "모든 페이지에 적용되어야 함"        |
| `constraint`  | 제약 조건, 범위 제한 | "새로 추가되는 것만 작업"            |

#### Source Types

| Source               | 설명                               |
| -------------------- | ---------------------------------- |
| `notion_description` | 노션 페이지 Description 필드       |
| `notion_toggle`      | 노션 토글 블록 내용                |
| `notion_property`    | 노션 속성 (Acceptance Criteria 등) |
| `notion_callout`     | 노션 콜아웃 블록                   |
| `manual`             | 사용자가 직접 입력                 |

---

### 2. Requirement (Enhanced)

블록 참조가 추가된 요구사항 구조입니다.

```yaml
requirement:
  id: string # REQ-XXX 형식
  summary: string # 요구사항 요약 (1줄)
  type: enum # functional | non-functional | technical | business
  priority: enum # high | medium | low
  source_blocks: string[] # 참조하는 블록 ID 목록
  constraints: string[] # 제약 조건 목록 (블록에서 추출)
```

---

### 3. Acceptance Criteria (Enhanced)

블록 참조가 추가된 수용 기준 구조입니다.

```yaml
acceptance_criteria:
  id: string # AC-XXX 형식
  summary: string # 수용 기준 요약
  source_blocks: string[] # 참조하는 블록 ID 목록
  testable: boolean # 테스트 가능 여부
  related_requirements: string[] # 관련 요구사항 ID 목록
```

---

### 4. Block Coverage

하위 백로그가 커버하는 블록 정보입니다.

```yaml
block_coverage:
  block_id: string # 커버하는 블록 ID
  lines: [int, int] # 원본 라인 범위
  coverage: enum # full | partial
  partial_lines: [int, int] # partial인 경우 부분 라인 범위 (선택)
```

---

### 5. Sibling Relationship

형제 백로그 간 관계 정보입니다.

```yaml
sibling_relationship:
  id: string # 형제 백로그 ID
  title: string # 형제 백로그 제목
  shared_blocks: string[] # 공유하는 블록 ID 목록
  relationship: enum # independent | dependent | complementary
```

#### Relationship Types

| Type            | 설명                        | 실행 순서            |
| --------------- | --------------------------- | -------------------- |
| `independent`   | 독립적, 공유 블록 없음      | 병렬 가능            |
| `dependent`     | 의존적, 선행 태스크 필요    | 순차 실행            |
| `complementary` | 보완적, 같은 블록 다른 측면 | 병렬 가능, 통합 필요 |

---

### 6. Coverage Metrics

분해 후 커버리지 측정 결과입니다.

```yaml
coverage_metrics:
  total_blocks: int # 전체 블록 수
  covered_blocks: int # 커버된 블록 수
  coverage_percent: float # 커버리지 퍼센트
  uncovered_blocks: string[] # 미커버 블록 ID 목록
  shared_blocks: string[] # 공유 블록 ID 목록
  validation_passed: boolean # 검증 통과 여부
```

---

## File Schemas

### backlog-info.yaml (v2.0)

```yaml
# === 스키마 버전 ===
schema_version: '2.0'

# === 기본 메타정보 ===
backlog_id: string
title: string
type: string # Epic | Story | Task | Bug | Subtask
status: string # prepared | decomposed | in_progress | completed
notion_id: string
created_at: datetime
prepared_at: datetime

# === 📦 원본 컨텐츠 블록 ===
content_blocks:
  - <content_block>
  - ...

# === 📋 구조화된 요구사항 ===
requirements:
  - <requirement>
  - ...

# === ✅ 수용 기준 ===
acceptance_criteria:
  - <acceptance_criteria>
  - ...

# === 🔗 계층 정보 ===
hierarchy:
  parent:
    id: string
    title: string
    type: string
    notion_id: string
  children:
    - id: string
      title: string
      covers: string[] # 커버하는 블록 ID
    - ...
  connections:
    blocking: string[]
    blocked_by: string[]
    related: string[]

# === 📊 커버리지 메트릭 ===
coverage: <coverage_metrics>

# === 🎨 컨텍스트 ===
context:
  figma:
    url: string
    file_key: string
    node_id: string
  references: string[]
  unclear_items: string[]

# === 📝 원본 데이터 (하위 호환) ===
raw:
  description: string
  acceptance_criteria: string
```

### child-backlog.yaml

```yaml
# === 기본 정보 ===
id: string
parent_id: string
title: string
type: string
status: string # ready | in_progress | completed

# === 📦 커버하는 블록 ===
covers:
  - <block_coverage>
  - ...

# === 🔗 형제 관계 ===
siblings:
  - <sibling_relationship>
  - ...

# === 📝 상속된 컨텐츠 ===
inherited_content:
  - block_id: string
    full_text: string
  - ...

# === 추적성 ===
traceability:
  requirements: string[] # REQ-XXX 목록
  acceptance_criteria: string[] # AC-XXX 목록

# === 작업 내용 ===
description: string # AI 생성 상세 설명
implementation_notes: string # 구현 노트
```

---

## Validation Rules

### 1. 블록 파싱 검증

- 모든 블록에 고유 ID 필수
- lines[0] <= lines[1] 필수
- content 비어있으면 안됨

### 2. 분해 검증

- 커버리지 100% 권장 (경고만, 차단 안함)
- 미커버 블록은 사용자 확인 필요
- 공유 블록은 relationship 명시 필요

### 3. 추적성 검증

- 모든 하위 백로그는 최소 1개 블록 커버
- source_blocks의 모든 ID는 content_blocks에 존재해야 함
- requirements와 acceptance_criteria 간 관계 일관성

---

## Migration Guide

### v1.0 → v2.0 마이그레이션

1. `raw.description`을 파싱하여 `content_blocks` 생성
2. `requirements`에 `source_blocks` 필드 추가 (빈 배열로 초기화)
3. `coverage` 섹션 추가 (초기값 0)
4. `schema_version: "2.0"` 추가

### 하위 호환성

- `raw` 섹션은 유지하여 기존 워크플로우와 호환
- v1.0 파일은 읽기 가능, v2.0 기능 미지원
