# {{type_name}} Guide

> Backlog Type: **{{type_name}}**
> Generated: {{date}}

## Overview

| 항목          | 값                    |
| ------------- | --------------------- |
| 유형명        | {{type_name}}         |
| 아이콘        | {{type_icon}}         |
| 목적          | {{type_purpose}}      |
| 일반적인 수명 | {{typical_lifecycle}} |

## Description

{{type_description}}

## Hierarchy Position

```
{{hierarchy_position}}
```

**상위 유형:** {{parent_types}}
**하위 유형:** {{child_types}}
**연결 가능 유형:** {{linked_types}}

## Required Fields

이 유형의 백로그를 생성할 때 필수로 입력해야 하는 필드:

| 필드명 | 타입 | 설명 | 예시 |
| ------ | ---- | ---- | ---- |

{{required_fields_table}}

## Optional Fields

선택적으로 입력할 수 있는 필드:

| 필드명 | 타입 | 설명 | 권장 |
| ------ | ---- | ---- | ---- |

{{optional_fields_table}}

## Status Workflow

이 유형의 상태 전환 흐름:

```
{{status_workflow_diagram}}
```

| 상태 | 설명 | 다음 가능 상태 |
| ---- | ---- | -------------- |

{{status_table}}

## Relationships

### Parent Relation (상위 연결)

- **속성명:** {{parent_relation_property}}
- **연결 대상:** {{parent_target_types}}
- **규칙:** {{parent_rules}}

### Child Relation (하위 연결)

- **속성명:** {{child_relation_property}}
- **연결 대상:** {{child_target_types}}
- **규칙:** {{child_rules}}

### Linked Relations (연결 백로그)

{{linked_relations_list}}

## Agent Usage Examples

### 이 유형의 백로그 조회

```notion-api
POST /databases/{database_id}/query
{
  "filter": {
    "property": "Type",
    "select": { "equals": "{{type_name}}" }
  },
  "sorts": [
    { "property": "Created", "direction": "descending" }
  ]
}
```

### 새 {{type_name}} 생성

```notion-api
POST /pages
{
  "parent": { "database_id": "{database_id}" },
  "properties": {
    "Name": { "title": [{ "text": { "content": "새 {{type_name}} 제목" } }] },
    "Type": { "select": { "name": "{{type_name}}" } },
    {{required_properties_example}}
  }
}
```

### 상태 업데이트

```notion-api
PATCH /pages/{page_id}
{
  "properties": {
    "Status": { "select": { "name": "In Progress" } }
  }
}
```

## Best Practices

{{best_practices_list}}

## Common Patterns

{{common_patterns}}

---

_이 가이드는 Navigator 에이전트가 자동 생성했습니다._
