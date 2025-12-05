---
name: 'step-05-create-handoff'
description: '작업 문서를 생성하고 Dev 에이전트로 핸드오프합니다'

# Path Definitions
workflow_path: '{module_path}/workflows/quick-execute'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-05-create-handoff.md'
workflowFile: '{workflow_path}/workflow.md'
workflowConfig: '{workflow_path}/workflow.yaml'

# Templates
quickTaskTemplate: '{module_path}/templates/quick-task-template.md'

# Agent References
devAgent: '{module_path}/agents/dev.md'

# Output Paths
backlogs_output: '{module_path}/data/backlogs'
---

# Step 5: 작업 문서 생성 및 핸드오프

## STEP GOAL:

수집된 모든 정보를 통합한 작업 문서를 생성하고, Dev 에이전트로 핸드오프하여 구현을 시작할 수 있도록 합니다. 이것이 워크플로우의 마지막 단계입니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: This is the FINAL step - no next step file
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a handoff coordinator preparing work for implementation
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring documentation skills, user brings approval

### Step-Specific Rules:

- 🎯 Create comprehensive work document
- 🚫 FORBIDDEN to start implementation in this step
- 💬 Approach: Clear and actionable documentation
- 📋 Ensure all collected information is preserved

## EXECUTION PROTOCOLS:

- 🎯 Compile all gathered information into work document
- 💾 Save document to backlog folder
- 📖 Provide clear handoff to Dev agent
- 🚫 This step completes the workflow

## CONTEXT BOUNDARIES:

- Available context: All previous steps' output
- Focus: Document creation and agent handoff
- Limits: No implementation, only preparation
- Dependencies: Steps 1-4 completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Create Backlog Folder Structure

Ensure folder exists: `{backlogs_output}/{backlog_id}/`

Files to create/update:

- `quick-task.md` - Main work document (this step)
- `code-analysis.md` - Already created in Step 3
- `figma-context.md` - Created in Step 4 if applicable

### 2. Generate Work Document

Create file: `{backlogs_output}/{backlog_id}/quick-task.md`

**IMPORTANT: Convert acceptance criteria to task checklist format**

For each acceptance criterion, create a task entry:

```
- [ ] **T{n}**: {acceptance_criterion_summary}
```

Use template structure (reference: {quickTaskTemplate}):

```markdown
---
id: {backlog_id}
title: {backlog_title}
type: quick-task
status: ready-for-dev
execution_mode: direct
complexity: {complexity_score}/10
created: {timestamp}
notion_url: {notion_url}
figma_url: {figma_url}
---

# {backlog_title}

## 설명

{backlog_description}

## 작업 목록 (Tasks)

<!-- Dev Agent: 이 목록을 순서대로 체크하며 구현하세요 -->

- [ ] **T1**: {first_acceptance_criterion}
- [ ] **T2**: {second_acceptance_criterion}
- [ ] **T3**: {third_acceptance_criterion}
      ... (각 AC마다 하나의 Task)

## 관련 파일

{files_to_modify_formatted}

예시:

- 수정: `src/components/Example.tsx`
- 수정: `src/pages/index.tsx`
- 신규: (필요시)

## 참조

- 코드 분석: [code-analysis.md](./code-analysis.md)
- 피그마: {figma_reference}
- 노션: {notion_reference}

## 작업 로그

- [{timestamp}] quick-execute 워크플로우 완료, 작업 준비됨

---

**Dev 명령어:** `*implement` | `*done` | `*status`
```

### 3. Display Completion Summary

Display:

"**✅ 빠른 실행 준비 완료!**

━━━━━━━━━━━━━━━━━━━━━━━

**백로그:** {backlog_title}
**ID:** {backlog_id}
**복잡도:** {complexity_score}/10
**작업 수:** {task_count}개 (AC 기반)
**관련 파일:** {file_count}개

**생성된 파일:**

- `{backlogs_output}/{backlog_id}/quick-task.md`
- `{backlogs_output}/{backlog_id}/code-analysis.md`
  {figma_file_if_exists}

━━━━━━━━━━━━━━━━━━━━━━━

**🚀 Dev 에이전트로 전환하여 작업을 시작할 수 있습니다.**

**Dev 에이전트에서 사용 가능한 명령:**

- `*implement` - 구현 시작
- `*figma` - 피그마 디자인 참조
- `*done` - 작업 완료 처리"

### 4. Present MENU OPTIONS

Display: "**Select an Option:**

[D] **Dev 전환** - Dev 에이전트로 전환하여 구현 시작
[S] **Stay** - PM 에이전트 유지
[L] **Later** - 워크플로우 종료 (나중에 `*continue`로 재개)
[X] **Exit** - 완전 종료"

#### Menu Handling Logic:

##### IF D (Dev Agent):

- Display: "Dev 에이전트로 전환합니다. quick-task 컨텍스트가 유지됩니다."
- Load Dev agent with context:
  - `backlog_id`: {backlog_id}
  - `backlog_folder`: {backlogs_output}/{backlog_id}
  - `quick_task_file`: {backlogs_output}/{backlog_id}/quick-task.md
  - `execution_mode`: direct
- Transfer control to Dev agent

##### IF S (Stay):

- Display: "PM 에이전트를 유지합니다. 언제든 Dev 에이전트로 전환할 수 있습니다."
- End workflow successfully (user stays in current context)

##### IF L (Later):

- Save session state for continuation
- Display: "세션이 저장되었습니다. 나중에 `*continue {backlog_id}`로 재개할 수 있습니다."
- End workflow gracefully

##### IF X (Exit):

- Display: "워크플로우를 종료합니다. 생성된 파일은 보존됩니다."
- End workflow

##### IF Any other comments or queries:

- Help user respond
- Redisplay menu options

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- This is the FINAL step - no next step to load
- All options should end the workflow gracefully
- Files created should be preserved regardless of choice

## CRITICAL STEP COMPLETION NOTE

This is the FINAL step of the quick-execute workflow. Upon user selection:

- D: Transfer to Dev agent for implementation
- S/L/X: End workflow with appropriate message

The work document and analysis files are preserved for future use.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Work document created with all collected information
- Acceptance criteria converted to task checklist format
- Frontmatter includes `execution_mode: direct`
- All sections populated with appropriate data
- Files saved to correct location
- User given clear handoff options
- Dev agent properly invoked if selected
- Workflow ends gracefully

### ❌ SYSTEM FAILURE:

- Work document missing required sections
- Not converting AC to task checklist format
- Missing `execution_mode: direct` in frontmatter
- Not saving files before ending
- Starting implementation in this step
- Not offering Dev agent handoff option
- Losing collected context
- Not preserving files on exit

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## 🎉 WORKFLOW COMPLETE

This concludes the Quick Execute workflow. The backlog is now ready for implementation by the Dev agent.
