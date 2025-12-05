# Worktree Setup - Git Worktree 초기 환경 설정

<critical>Communicate in {communication_language} throughout</critical>
<critical>이 워크플로우는 Worktree 기능을 처음 사용할 때 한 번만 실행하면 됩니다</critical>

<workflow>

<step n="1" goal="환경 검증 및 사전 조건 확인">

<action>Git 저장소 상태 확인:

```bash
git rev-parse --git-dir
git status --porcelain
```

</action>

<check if="not a git repository">
  <action>오류 표시: "Git 저장소가 아닙니다. 먼저 `git init`을 실행해주세요."</action>
  <action>워크플로우 종료</action>
</check>

<action>Worktree 기능 활성화 상태 확인: {worktree_enabled}</action>

<check if="worktree_enabled != 'enabled'">
  <ask>Worktree 기능이 비활성화되어 있습니다. 활성화하시겠습니까?
  - [y] 예 - 활성화하고 계속
  - [n] 아니오 - 종료</ask>

  <check if="response == 'n'">
    <action>워크플로우 종료</action>
  </check>
</check>

<action>현재 설정 표시:

**Git Worktree 설정:**

- Worktree 경로: {worktree_path}
- 공유 데이터 경로: {shared_path}
- 가이드 경로: {guides_path}
- 분석 캐시 경로: {analysis_cache_path}
  </action>

<template-output>environment_check</template-output>
</step>

<step n="2" goal="공유 데이터 폴더 구조 생성">

<action>공유 폴더 구조 생성:

```bash
# .bmad-shared 폴더 구조
mkdir -p {shared_path}
mkdir -p {guides_path}
mkdir -p {analysis_cache_path}
mkdir -p {shared_path}/templates
mkdir -p {shared_path}/config
```

</action>

<action>기존 가이드 파일 마이그레이션 확인:

- {module_path}/data/guides/ 폴더 확인
- 파일이 있으면 {guides_path}로 이동
  </action>

<check if="existing guides found">
  <ask>기존 가이드 파일을 공유 폴더로 이동하시겠습니까?
  - [y] 예 - 이동 (권장)
  - [n] 아니오 - 현재 위치 유지</ask>

  <check if="response == 'y'">
    <action>가이드 파일 이동:
    ```bash
    mv {module_path}/data/guides/* {guides_path}/
    rmdir {module_path}/data/guides
    ```
    </action>
  </check>
</check>

<action>기존 코드 분석 캐시 마이그레이션 확인</action>

<action>공유 폴더에 .gitkeep 파일 생성:

```bash
touch {guides_path}/.gitkeep
touch {analysis_cache_path}/.gitkeep
touch {shared_path}/templates/.gitkeep
```

</action>

<template-output>shared_folders_created</template-output>
</step>

<step n="3" goal="Symlink 설정">

<action>모듈 내 symlink 생성:

현재 모듈 데이터 폴더에서 공유 폴더로 symlink 생성:

```bash
# 기존 폴더 백업 (있는 경우)
[ -d "{module_path}/data/guides" ] && mv {module_path}/data/guides {module_path}/data/guides.bak

# symlink 생성
ln -sf {guides_path} {module_path}/data/guides
ln -sf {analysis_cache_path} {module_path}/data/analysis
```

</action>

<action>Symlink 검증:

```bash
ls -la {module_path}/data/
```

**예상 결과:**

```
guides -> {guides_path}
analysis -> {analysis_cache_path}
```

</action>

<template-output>symlinks_created</template-output>
</step>

<step n="4" goal="Worktree 기본 디렉토리 생성">

<action>Worktree 루트 디렉토리 생성:

```bash
mkdir -p {worktree_path}
```

</action>

<action>.gitignore 업데이트 확인:

- 프로젝트 루트 .gitignore에 worktree 경로 추가 필요 여부 확인
  </action>

<check if="worktree_path is inside project">
  <action>.gitignore에 추가:
  ```
  # Git Worktrees (Backlog Pilot)
  .worktrees/
  ```
  </action>
</check>

<action>Worktree 메타데이터 파일 생성:

```yaml
# {worktree_path}/.worktree-meta.yaml
created_at: { date }
project_root: { project-root }
module: backlog-pilot
shared_path: { shared_path }
```

</action>

<template-output>worktree_directory_ready</template-output>
</step>

<step n="5" goal="설정 완료 및 사용 안내">

<action>설정 완료 메시지:

**Git Worktree 환경 설정 완료!**

**생성된 구조:**

```
{project-root}/
├── .bmad-shared/backlog-pilot/     <- 공유 데이터 (Git 추적)
│   ├── guides/                      <- 백로그 가이드 문서
│   ├── analysis/                    <- 코드 분석 캐시
│   └── templates/                   <- 공유 템플릿
│
├── .bmad/backlog-pilot/data/
│   ├── guides -> .bmad-shared/...   <- Symlink
│   └── analysis -> .bmad-shared/... <- Symlink
│
└── {worktree_path}/                 <- Worktree 생성 위치
    └── (태스크별 worktree가 여기 생성됨)
```

**사용 방법:**

1. `*create-worktree` - 새 태스크용 worktree 생성
2. `*switch-worktree` - worktree 간 전환
3. `*list-worktrees` - 활성 worktree 목록

**자동 생성 설정:** {worktree_auto_create}

- on_decompose: 백로그 분해 시 자동 생성
- on_start: 태스크 시작 시 자동 생성
- manual: 수동 생성만
  </action>

<ask>설정을 확인하시겠습니까?

- [t] 테스트 worktree 생성해보기
- [d] 완료</ask>

<check if="response == 't'">
  <action>테스트 worktree 생성:
  ```bash
  cd {project-root}
  git worktree add {worktree_path}/test-worktree -b backlog/test-setup
  ```
  </action>

<action>테스트 worktree에서 symlink 설정:

```bash
cd {worktree_path}/test-worktree
mkdir -p .bmad/backlog-pilot/data
ln -sf {guides_path} .bmad/backlog-pilot/data/guides
ln -sf {analysis_cache_path} .bmad/backlog-pilot/data/analysis
```

  </action>

<action>테스트 결과 확인 및 정리:

```bash
ls -la {worktree_path}/test-worktree/.bmad/backlog-pilot/data/
git worktree remove {worktree_path}/test-worktree
git branch -d backlog/test-setup
```

  </action>

<action>테스트 성공 메시지: "테스트 worktree 생성 및 삭제 완료! 환경이 정상적으로 설정되었습니다."</action>
</check>

<template-output>setup_complete</template-output>
</step>

</workflow>
