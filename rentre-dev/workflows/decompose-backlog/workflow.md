---
name: Decompose Backlog Workflow
description: 계층적 백로그 분해 - 준비된 백로그를 가이드 기반으로 하위 유형으로 분해 + Dev handoff
author: Rentre-Dev

# Configuration
config_source: '{project-root}/{bmad_folder}/rentre-dev/config.yaml'
installed_path: '{project-root}/{bmad_folder}/rentre-dev/workflows/decompose-backlog'
module_path: '{project-root}/{bmad_folder}/rentre-dev'

# Paths
guides_folder: '{module_path}/data/guides'
data_path: '{module_path}/data'
backlogs_folder: '{data_path}/backlogs'

# Session State (컨텍스트 유실 방지)
# backlog_id는 step-02에서 결정됨
backlog_folder: '{backlogs_folder}/{backlog_id}'
decompose_state_file: '{backlog_folder}/decompose.yaml'

# Templates
backlog_template: '{module_path}/templates/backlog-item-template.md'
subtask_template: '{module_path}/templates/subtask-template.md'

# Runtime Options
runtime_options:
  detail_level:
    options: [high, standard, detailed]
    default: standard

# Related Workflows
related_workflows:
  - prepare-backlog
  - analyze-codebase
---

# Decompose Backlog Workflow

**Goal:** 준비된 백로그를 가이드 기반으로 하위 유형으로 분해하고, 추적성을 유지하며, Dev 에이전트로의 원활한 핸드오프를 지원합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 백로그 분해 전문가 collaborating with a PM/개발자. This is a partnership, not a client-vendor relationship. You bring 계층 구조 분석, 추적성 관리, 그리고 요구사항 분해 전문성, while the user brings 도메인 지식, 프로젝트 컨텍스트, 그리고 비즈니스 우선순위. Work together as equals to decompose backlogs effectively.

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

## PREREQUISITES

이 워크플로우를 실행하기 전에:

1. **가이드 파일 필수**: `data/guides/` 폴더에 가이드 파일이 있어야 함
   - `hierarchy-map.md` (필수)
   - `backlog-guide-summary.md` (필수)
   - `guide-*.md` (유형별 가이드)
2. **Navigator 에이전트의 `*analyze-db` 실행**: 가이드가 없으면 먼저 실행 필요
3. **백로그 준비 권장**: `prepare-backlog` 워크플로우로 백로그를 미리 준비하면 최상의 결과

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`
- `notion_integration`, `output_folder`
- `default_detail_level` (분해 강도 기본값)
- `date` as system-generated current datetime

### 2. Reference Resources

Note these paths for use during the workflow (load on-demand, not upfront):

- **Guides Folder**: `{guides_folder}`
- **Hierarchy Guide**: `{guides_folder}/hierarchy-map.md`
- **Summary Guide**: `{guides_folder}/backlog-guide-summary.md`

### 3. First Step Execution

Load, read the full file and then execute `{installed_path}/steps/step-01-load-guides.md` to begin the workflow.
