# Edit Backlog Guide - Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/rentre-dev/workflows/edit-backlog-guide/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Load and display available guide files">
<action>List all files in {guides_folder}:

- backlog-guide-summary.md (전체 요약)
- guide-\*.md (유형별 가이드)
- hierarchy-map.md (계층 구조)
  </action>

<check if="no guide files exist">
  <action>Inform user: "아직 생성된 가이드 파일이 없습니다. 먼저 `*analyze-db` 명령으로 가이드를 생성해 주세요."</action>
  <action>Exit workflow</action>
</check>

<action>Display file list with descriptions:

**사용 가능한 가이드 파일:**

1. **backlog-guide-summary.md** - 전체 백로그 구조 요약
2. **hierarchy-map.md** - 계층 구조 및 관계도
3. **guide-epic.md** - Epic 유형 가이드
4. **guide-story.md** - Story 유형 가이드
   ... (발견된 파일들)
   </action>

<ask>어떤 가이드 파일을 편집하시겠습니까? (번호 또는 파일명)</ask>
<action>Store selection as {selected_file}</action>
</step>

<step n="2" goal="Load and present current content">
<action>Load the selected guide file: {guides_folder}/{selected_file}</action>

<action>Present the current content to user:

"**현재 {selected_file} 내용:**"

{file_content}

---

</action>

<ask>어떤 부분을 수정하시겠습니까?

**편집 옵션:**
a) 특정 섹션 수정 (섹션 이름 지정)
b) 새 섹션 추가
c) 섹션 삭제
d) 전체 재작성
e) 오타/표현 수정
f) 다른 파일 선택</ask>
</step>

<step n="3" goal="Facilitate collaborative editing" repeat="until-user-satisfied">
<action>Based on user's choice, facilitate the edit:

**Option a) 특정 섹션 수정:**

- Ask which section to modify
- Show current section content
- Ask for desired changes
- Apply changes and show result

**Option b) 새 섹션 추가:**

- Ask for section title
- Ask for section content
- Ask where to place it (after which section)
- Add section and show result

**Option c) 섹션 삭제:**

- List all sections
- Ask which to delete
- Confirm deletion
- Remove and show result

**Option d) 전체 재작성:**

- Ask for the new vision/structure
- Collaborate on new content
- Replace file content

**Option e) 오타/표현 수정:**

- Ask for specific text to find
- Ask for replacement text
- Apply find/replace
- Show changes
  </action>

<action>After each edit, save the file immediately</action>

<action>Show the updated content:

"**수정 후 {selected_file} 내용:**"

{updated_content}

---

</action>

<ask>추가 수정이 필요하신가요?

1. 계속 이 파일 수정
2. 다른 파일 편집
3. 편집 완료</ask>

<check if="user selects 1">
  <goto step="3">Continue editing</goto>
</check>

<check if="user selects 2">
  <goto step="1">Select another file</goto>
</check>
</step>

<step n="4" goal="Summarize changes and complete">
<action>Present summary of all edits made:

"**편집 요약:**

수정된 파일:
{modified_files_list}

주요 변경 사항:
{changes_summary}

이제 다른 에이전트들이 업데이트된 가이드를 참조하여 백로그를 탐색할 수 있습니다."
</action>

<action>Offer next steps:

"**다음 단계:**

- `*show-structure`로 전체 구조 확인
- `*analyze-db`로 새로운 분석 수행 (DB 변경 시)
- `*back-to-pm`으로 PM 에이전트로 복귀"
  </action>

<template-output>edit_completion</template-output>
</step>

</workflow>
