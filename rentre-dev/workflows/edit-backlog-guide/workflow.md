---
name: Edit Backlog Guide
description: 백로그 가이드 문서를 사용자와 협력하여 편집
author: Rentre-Dev

# Configuration
config_source: '{project-root}/.bmad/rentre-dev/config.yaml'
installed_path: '{project-root}/.bmad/rentre-dev/workflows/edit-backlog-guide'
module_path: '{project-root}/.bmad/rentre-dev'
guides_folder: '{module_path}/data/guides'
---

# Edit Backlog Guide - 가이드 편집 워크플로우

**Goal:** 백로그 가이드 문서를 사용자와 협력하여 편집하고 개선합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 가이드 문서 편집 전문가 collaborating with a PM/개발자. This is a partnership, not a client-vendor relationship. You bring 문서 구조화 및 편집 전문성, while the user brings 도메인 지식과 가이드 개선 방향. Work together as equals.

---

## WORKFLOW PROCESS

### Step 1: 가이드 파일 목록 표시

1. `{guides_folder}` 폴더의 모든 파일을 스캔합니다:
   - `backlog-guide-summary.md` (전체 요약)
   - `guide-*.md` (유형별 가이드)
   - `hierarchy-map.md` (계층 구조)

2. **가이드 파일이 없는 경우**:
   - 사용자에게 안내: "아직 생성된 가이드 파일이 없습니다. 먼저 `*analyze-db` 명령으로 가이드를 생성해 주세요."
   - 워크플로우 종료

3. **파일 목록 표시**:
   ```
   **사용 가능한 가이드 파일:**

   1. backlog-guide-summary.md - 전체 백로그 구조 요약
   2. hierarchy-map.md - 계층 구조 및 관계도
   3. guide-epic.md - Epic 유형 가이드
   4. guide-story.md - Story 유형 가이드
   ... (발견된 파일들)
   ```

4. **사용자에게 질문**: "어떤 가이드 파일을 편집하시겠습니까? (번호 또는 파일명)"

---

### Step 2: 선택된 파일 로드 및 표시

1. 선택된 가이드 파일을 로드합니다: `{guides_folder}/{selected_file}`

2. 현재 내용을 사용자에게 표시:
   ```
   **현재 {selected_file} 내용:**

   {file_content}

   ---
   ```

3. **편집 옵션 제시**:
   ```
   어떤 부분을 수정하시겠습니까?

   **편집 옵션:**
   a) 특정 섹션 수정 (섹션 이름 지정)
   b) 새 섹션 추가
   c) 섹션 삭제
   d) 전체 재작성
   e) 오타/표현 수정
   f) 다른 파일 선택
   ```

---

### Step 3: 협업 편집 (반복)

사용자의 선택에 따라 편집을 진행합니다:

#### Option a) 특정 섹션 수정
- 수정할 섹션 확인
- 현재 섹션 내용 표시
- 원하는 변경사항 질문
- 변경 적용 및 결과 표시

#### Option b) 새 섹션 추가
- 섹션 제목 질문
- 섹션 내용 질문
- 배치 위치 질문 (어떤 섹션 다음에)
- 섹션 추가 및 결과 표시

#### Option c) 섹션 삭제
- 모든 섹션 목록 표시
- 삭제할 섹션 선택
- 삭제 확인
- 삭제 및 결과 표시

#### Option d) 전체 재작성
- 새로운 구조/비전 질문
- 협업하여 새 내용 작성
- 파일 내용 교체

#### Option e) 오타/표현 수정
- 찾을 텍스트 질문
- 대체 텍스트 질문
- 찾기/바꾸기 적용
- 변경사항 표시

**각 편집 후:**
1. 파일 즉시 저장
2. 수정된 내용 표시:
   ```
   **수정 후 {selected_file} 내용:**

   {updated_content}

   ---
   ```

3. **다음 단계 질문**:
   ```
   추가 수정이 필요하신가요?

   1. 계속 이 파일 수정
   2. 다른 파일 편집
   3. 편집 완료
   ```
   - 1 선택 → Step 3 반복
   - 2 선택 → Step 1로 이동
   - 3 선택 → Step 4로 이동

---

### Step 4: 변경 요약 및 완료

1. **편집 요약 표시**:
   ```
   **편집 요약:**

   수정된 파일:
   {modified_files_list}

   주요 변경 사항:
   {changes_summary}

   이제 다른 에이전트들이 업데이트된 가이드를 참조하여 백로그를 탐색할 수 있습니다.
   ```

2. **다음 단계 안내**:
   ```
   **다음 단계:**

   - `*show-structure`로 전체 구조 확인
   - `*analyze-db`로 새로운 분석 수행 (DB 변경 시)
   - `*back-to-pm`으로 PM 에이전트로 복귀
   ```

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`

### 2. Start Workflow

Begin with Step 1: 가이드 파일 목록 표시
