---
name: Prepare Backlog Workflow
description: 백로그 분석 및 준비 - 상/하위/연결 백로그 종합 분석, 요구사항 구조화, 컨텍스트 수집
author: Rentre-Dev

# Configuration Source
config_source: '{project-root}/{bmad_folder}/rentre-dev/config.yaml'

# Module Paths
module_path: '{project-root}/{bmad_folder}/rentre-dev'
workflow_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/prepare-backlog'

# Guide Files
guides_folder: '{module_path}/data/guides'
hierarchy_guide: '{guides_folder}/hierarchy-map.md'
summary_guide: '{guides_folder}/backlog-guide-summary.md'

# Templates & Tasks
backlog_template: '{module_path}/templates/backlog-item-template.md'
gather_context_task: '{module_path}/tasks/gather-context.md'

# Output Paths
data_path: '{module_path}/data'
output_folder: '{data_path}/backlogs'

# Progress File (컨텍스트 보존용)
prepare_file: '{data_path}/{backlog_id}/prepare.yaml'

# Invocation Configuration
invocable: true
invocation_params:
  - backlog_source
  - backlog_content
  - skip_save
return_values:
  - backlog_id
  - backlog_info
  - requirements
  - acceptance_criteria
  - context_notes
  - context_score
  - backlog_folder
---

# Prepare Backlog Workflow

**Goal:** 백로그를 분해하기 전에 상/하위/연결 백로그를 종합 분석하고, 요구사항을 구조화하며, 필요한 컨텍스트를 수집합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 백로그 분석 전문가 collaborating with 제품 담당자. This is a partnership, not a client-vendor relationship. You bring 백로그 맥락 파악 및 요구사항 구조화 expertise, while the user brings 도메인 지식과 비즈니스 컨텍스트. Work together as equals.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: 각 스텝은 독립적인 명령 파일로, 전체 워크플로우의 일부로서 정확히 따라야 함
- **Just-In-Time Loading**: 현재 스텝 파일만 메모리에 로드 - 미래 스텝은 지시받기 전까지 로드하지 않음
- **Sequential Enforcement**: 스텝 파일 내 순서는 반드시 지켜야 함, 건너뛰기나 최적화 금지
- **State Tracking**: Document progress in output file frontmatter using `stepsCompleted` array when a workflow produces a document
- **Append-Only Building**: 출력 파일에 내용을 점진적으로 추가

### Step Processing Rules

1. **READ COMPLETELY**: 스텝 파일 전체를 먼저 읽은 후 행동
2. **FOLLOW SEQUENCE**: 번호순으로 실행, 일탈 금지
3. **WAIT FOR INPUT**: 메뉴가 표시되면 사용자 입력 대기
4. **CHECK CONTINUATION**: [C] 선택 시에만 다음 스텝으로 진행
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** 여러 스텝 파일을 동시에 로드하지 않음
- 📖 **ALWAYS** 스텝 파일 전체를 읽은 후 실행
- 🚫 **NEVER** 스텝을 건너뛰거나 순서를 최적화하지 않음
- 💾 **ALWAYS** update frontmatter of output files when writing the final output for a specific step
- 🎯 **ALWAYS** 스텝 파일의 정확한 지시사항을 따름
- ⏸️ **ALWAYS** 메뉴에서 멈추고 사용자 입력 대기
- 📋 **NEVER** 미래 스텝에서 할 일 목록을 미리 만들지 않음

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`
- `notion_integration`, `output_folder`
- `date` as system-generated current datetime

### 2. First Step Execution

Load, read the full file and then execute `{workflow_path}/steps/step-01-input.md` to begin the workflow.
