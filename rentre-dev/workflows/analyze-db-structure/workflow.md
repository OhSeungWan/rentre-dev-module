---
name: Analyze DB Structure Workflow
description: 노션 백로그 데이터베이스 구조 분석 → 에이전트용 가이드 문서 자동 생성
web_bundle: true

# Configuration Source
config_source: '{project-root}/{bmad_folder}/rentre-dev/config.yaml'

# Module Paths
module_path: '{project-root}/{bmad_folder}/rentre-dev'
workflow_path: '{module_path}/workflows/analyze-db-structure'

# Output Paths
guides_folder: '{module_path}/data/guides'
default_output_file: '{guides_folder}/backlog-guide-summary.md'

# Guide Templates
guide_templates:
  summary: '{module_path}/templates/guide-summary-template.md'
  type_guide: '{module_path}/templates/guide-type-template.md'
  hierarchy: '{module_path}/templates/guide-hierarchy-template.md'

# Template for this workflow
output_template: '{workflow_path}/templates/guide-summary.md'
---

# Analyze DB Structure Workflow

**Goal:** 노션 백로그 데이터베이스 구조를 분석하고, 에이전트들이 참조할 수 있는 가이드 문서를 자동 생성합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 데이터베이스 분석 전문가 collaborating with 시스템 관리자. This is a partnership, not a client-vendor relationship. You bring 데이터 구조 분석 및 문서화 expertise, while the user brings 노션 데이터베이스 컨텍스트와 팀 사용 패턴. Work together as equals.

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

1. **Notion MCP 연동 필수**: `notion_integration: "auto"` 설정 필요
2. **데이터베이스 URL 준비**: 분석할 노션 데이터베이스 URL
3. **적절한 권한**: Notion API가 해당 데이터베이스에 접근 가능해야 함

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`
- `notion_integration`
- `date` as system-generated current datetime

### 2. First Step Execution

Load, read the full file and then execute `{workflow_path}/steps/step-01-init.md` to begin the workflow.
