# Create Worktree - 백로그/태스크용 새 Worktree 생성

<critical>Communicate in {communication_language} throughout</critical>
<critical>Worktree 생성 전 반드시 worktree-setup이 완료되어 있어야 합니다</critical>

<workflow>

<step n="1" goal="Worktree 생성 정보 수집">

<action>Worktree 기능 활성화 확인</action>

<check if="worktree_enabled != 'enabled'">
  <action>오류: "Worktree 기능이 비활성화되어 있습니다. 먼저 config에서 활성화해주세요."</action>
  <action>워크플로우 종료</action>
</check>

<action>공유 폴더 존재 확인:

```bash
[ -d "{shared_path}" ] && echo "OK" || echo "NOT_FOUND"
```

</action>

<check if="shared_path not found">
  <action>안내: "공유 폴더가 없습니다. worktree-setup을 먼저 실행해주세요."</action>
  <ask>worktree-setup을 실행하시겠습니까? (y/n)</ask>
  <check if="response == 'y'">
    <invoke-workflow path="{project-root}/.bmad/backlog-pilot/workflows/worktree-setup/workflow.yaml"/>
  </check>
</check>

<action>현재 활성 worktree 목록 표시:

```bash
git worktree list
```

</action>

<ask>어떤 작업을 위한 Worktree를 생성하시겠습니까?

**입력 방식:**

1. 백로그 ID 입력 (예: TASK-123, epic-user-auth)
2. 현재 진행 중인 백로그에서 선택
3. 사용자 정의 이름</ask>

<check if="option 1">
  <ask>백로그 ID를 입력해주세요:</ask>
  <action>입력된 ID를 {backlog_id}에 저장</action>
</check>

<check if="option 2">
  <action>로컬 백로그 목록 조회: {module_path}/data/backlogs/</action>
  <action>목록 표시 및 선택</action>
</check>

<check if="option 3">
  <ask>Worktree 이름을 입력해주세요 (영문, 하이픈 사용):</ask>
  <action>입력된 이름을 {backlog_id}에 저장</action>
</check>

<action>브랜치 이름 생성: {worktree_branch_prefix}{backlog_id}</action>

<template-output>worktree_info_collected</template-output>
</step>

<step n="2" goal="Git Worktree 및 브랜치 생성">

<action>기준 브랜치 최신화:

```bash
git fetch origin {worktree_base_branch}
```

</action>

<action>브랜치 중복 확인:

```bash
git branch --list "{worktree_branch_prefix}{backlog_id}"
```

</action>

<check if="branch already exists">
  <ask>브랜치 '{worktree_branch_prefix}{backlog_id}'가 이미 존재합니다.
  - [u] 기존 브랜치 사용
  - [r] 새 이름으로 생성
  - [c] 취소</ask>

  <check if="response == 'r'">
    <ask>새 브랜치 이름을 입력해주세요:</ask>
    <action>새 이름으로 {backlog_id} 업데이트</action>
  </check>
</check>

<action>Worktree 경로 결정: {worktree_path}/{backlog_id}</action>

<action>Worktree 및 브랜치 생성:

```bash
git worktree add {worktree_path}/{backlog_id} -b {worktree_branch_prefix}{backlog_id} origin/{worktree_base_branch}
```

</action>

<action>생성 결과 확인:

```bash
git worktree list | grep "{backlog_id}"
```

</action>

<template-output>worktree_created</template-output>
</step>

<step n="3" goal="Worktree 환경 설정 (Symlink 및 공유 데이터 연결)">

<action>Worktree 내 모듈 폴더 구조 생성:

```bash
cd {worktree_path}/{backlog_id}
mkdir -p .bmad/backlog-pilot/data
mkdir -p .bmad/backlog-pilot/data/tasks
mkdir -p .bmad/backlog-pilot/data/backlogs
```

</action>

<action>공유 폴더 Symlink 생성:

```bash
cd {worktree_path}/{backlog_id}/.bmad/backlog-pilot/data

# 가이드 폴더 symlink
ln -sf {guides_path} guides

# 분석 캐시 symlink
ln -sf {analysis_cache_path} analysis
```

</action>

<action>Symlink 검증:

```bash
ls -la {worktree_path}/{backlog_id}/.bmad/backlog-pilot/data/
```

**예상 결과:**

```
guides -> {guides_path}
analysis -> {analysis_cache_path}
tasks/
backlogs/
```

</action>

<action>Worktree 메타데이터 생성:

```yaml
# {worktree_path}/{backlog_id}/.worktree-info.yaml
backlog_id: {backlog_id}
branch: {worktree_branch_prefix}{backlog_id}
created_at: {date}
base_branch: {worktree_base_branch}
project_root: {project-root}
status: active
```

</action>

<template-output>worktree_configured</template-output>
</step>

<step n="4" goal="백로그 컨텍스트 복사 (선택적)">

<action>관련 백로그 데이터 확인:

- 메인 저장소의 {module_path}/data/backlogs/{backlog_id}/ 존재 여부
  </action>

<check if="backlog data exists in main">
  <ask>메인 저장소에 해당 백로그 데이터가 있습니다. Worktree로 복사하시겠습니까?
  - [y] 복사 - 백로그 정보, 서브태스크 등 복사
  - [n] 새로 시작 - 빈 상태로 시작</ask>

  <check if="response == 'y'">
    <action>백로그 데이터 복사:
    ```bash
    cp -r {module_path}/data/backlogs/{backlog_id} {worktree_path}/{backlog_id}/.bmad/backlog-pilot/data/backlogs/
    ```
    </action>
  </check>
</check>

<template-output>context_copied</template-output>
</step>

<step n="5" goal="생성 완료 및 안내">

<action>Worktree 생성 완료 메시지:

**Worktree 생성 완료!**

**생성된 Worktree:**

- 경로: `{worktree_path}/{backlog_id}`
- 브랜치: `{worktree_branch_prefix}{backlog_id}`
- 기준: `{worktree_base_branch}`

**공유 데이터 연결:**

- 가이드: {guides_path} (symlink)
- 분석 캐시: {analysis_cache_path} (symlink)

**작업 시작 방법:**

1. **터미널에서 이동:**

   ```bash
   cd {worktree_path}/{backlog_id}
   ```

2. **VS Code에서 열기:**

   ```bash
   code {worktree_path}/{backlog_id}
   ```

3. **Claude Code에서 작업:**
   새 터미널에서 해당 폴더로 이동 후 Claude Code 실행

**주의사항:**

- 각 worktree는 독립적인 작업 공간입니다
- 공유 데이터(가이드, 분석 캐시)는 모든 worktree에서 동일합니다
- 작업 완료 후 `*merge-worktree` 또는 수동으로 PR 생성
  </action>

<ask>다음 작업을 선택해주세요:

- [o] Worktree 폴더 열기 (code 명령)
- [s] 다른 worktree로 전환
- [l] 활성 worktree 목록 보기
- [d] 완료</ask>

<check if="response == 'o'">
  <action>VS Code로 worktree 열기:
  ```bash
  code {worktree_path}/{backlog_id}
  ```
  </action>
</check>

<check if="response == 's'">
  <invoke-workflow path="{project-root}/.bmad/backlog-pilot/workflows/switch-worktree/workflow.yaml"/>
</check>

<check if="response == 'l'">
  <action>활성 worktree 목록:
  ```bash
  git worktree list
  ```
  </action>
</check>

<template-output>creation_complete</template-output>
</step>

</workflow>
