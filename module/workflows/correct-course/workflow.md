# Correct Course Workflow

**Goal:** 백로그 진행 중 발생하는 변경사항을 체계적으로 분석하고 적용하여 추적 가능한 변경 이력을 유지합니다.

**Your Role:** 변경 관리 전문가로서 사용자와 협력하여 변경사항의 영향을 분석하고, Block Traceability System과 연동하여 일관성 있는 변경을 적용합니다.

---

## WORKFLOW ARCHITECTURE

이 워크플로우는 **step-file architecture**를 사용합니다:

### Core Principles

- **Micro-file Design**: 각 스텝은 독립적인 지시 파일
- **Just-In-Time Loading**: 현재 스텝 파일만 메모리에 로드
- **Sequential Enforcement**: 순서대로 실행, 스킵 금지
- **State Tracking**: change-history.yaml에 변경 이력 기록
- **Block Traceability**: BLK-XXX, REQ-XXX 참조 유지

### Step Processing Rules

1. **READ COMPLETELY**: 전체 스텝 파일을 읽은 후 실행
2. **FOLLOW SEQUENCE**: 번호 순서대로 실행
3. **WAIT FOR INPUT**: 메뉴 표시 후 사용자 입력 대기
4. **SAVE STATE**: 다음 스텝 전 상태 저장
5. **LOAD NEXT**: 지시에 따라 다음 스텝 파일 로드

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** 여러 스텝 파일 동시 로드
- 📖 **ALWAYS** 실행 전 전체 파일 읽기
- 🚫 **NEVER** 스텝 스킵 또는 최적화
- 💾 **ALWAYS** 변경 시 change-history.yaml 업데이트
- 🔗 **ALWAYS** Block ID 참조 유지 (BLK-XXX, REQ-XXX)

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from {project-root}/.bmad/rentre-dev/config.yaml:

- `user_name`, `communication_language`, `notion_integration`
- `data_path` for backlog data location

### 2. First Step Execution

Load and execute `{installed_path}/steps/step-01-init.md`
