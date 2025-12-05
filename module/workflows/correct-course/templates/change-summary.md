# Change Summary: CHG-{{change_id}}

**Generated:** {{timestamp}}
**Backlog:** {{backlog_title}} ({{backlog_id}})

---

## Change Overview

| Field           | Value                  |
| --------------- | ---------------------- |
| **Change ID**   | CHG-{{change_id}}      |
| **Type**        | {{change_type_label}}  |
| **Description** | {{change_description}} |
| **Reason**      | {{change_reason}}      |
| **Applied By**  | {{user_name}}          |
| **Timestamp**   | {{timestamp}}          |

---

## Impact Summary

### Affected Blocks

{{#affected_blocks}}

- **{{id}}**: {{content_preview}}
  - Impact: {{impact_description}}
    {{/affected_blocks}}

### Affected Requirements

{{#affected_requirements}}

- **{{id}}**: {{summary}}
  - Change: {{change_detail}}
    {{/affected_requirements}}

### Affected Subtasks

{{#affected_subtasks}}

- **{{id}}**: {{title}}
  - Action: {{action}} (added/modified/removed)
    {{/affected_subtasks}}

---

## Coverage Change

| Metric       | Before               | After               |
| ------------ | -------------------- | ------------------- |
| Total Blocks | {{total_blocks}}     | {{total_blocks}}    |
| Covered      | {{before_covered}}   | {{after_covered}}   |
| Coverage %   | {{before_coverage}}% | {{after_coverage}}% |

---

## Files Modified

- `backlog-info.yaml` - {{backlog_info_changes}}
- `change-history.yaml` - Added CHG-{{change_id}}
  {{#subtask_files}}
- `subtasks/{{filename}}` - {{action}}
  {{/subtask_files}}

---

## Rollback Information

To rollback this change, restore the following from the `before` snapshot in `change-history.yaml`:

```yaml
before: { { before_snapshot } }
```

---

## Next Steps

{{#next_steps}}

- {{step}}
  {{/next_steps}}
