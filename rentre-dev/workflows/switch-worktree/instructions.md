# Switch Worktree - Worktree 간 전환

<critical>Communicate in {communication_language} throughout</critical>

<workflow>

<step n="1" goal="현재 상태 확인 및 활성 Worktree 목록">

<action>현재 작업 디렉토리 확인:

```bash
pwd
git rev-parse --show-toplevel
```

</action>

<action>모든 활성 Worktree 목록 조회:

```bash
git worktree list --porcelain
```

</action>

<action>Worktree 목록을 사용자 친화적으로 표시:

**활성 Worktree 목록:**

| #   | 이름     | 브랜치           | 경로                     | 상태 |
| --- | -------- | ---------------- | ------------------------ | ---- |
| 1   | main     | main             | {project-root}           | 메인 |
| 2   | task-001 | backlog/task-001 | {worktree_path}/task-001 | 활성 |
| 3   | task-002 | backlog/task-002 | {worktree_path}/task-002 | 활성 |

**현재 위치:** {current_worktree}
</action>

<action>각 worktree의 상태 정보 로드:

- .worktree-info.yaml 읽기
- 마지막 커밋 정보
- 변경된 파일 수
  </action>

<template-output>worktree_list</template-output>
</step>

<step n="2" goal="전환할 Worktree 선택">

<ask>어떤 Worktree로 전환하시겠습니까?

{worktree_list_numbered}

또는:

- [m] 메인 저장소로
- [n] 새 worktree 생성
- [c] 취소</ask>

<check if="response == 'm'">
  <action>메인 저장소 경로를 대상으로 설정: {project-root}</action>
</check>

<check if="response == 'n'">
  <invoke-workflow path="{project-root}/.bmad/backlog-pilot/workflows/create-worktree/workflow.yaml"/>
  <action>워크플로우 종료</action>
</check>

<check if="response == 'c'">
  <action>워크플로우 종료</action>
</check>

<check if="response is number">
  <action>선택된 worktree 경로를 {target_worktree_path}에 저장</action>
</check>

<template-output>target_selected</template-output>
</step>

<step n="3" goal="현재 Worktree 상태 저장 (선택적)">

<action>현재 worktree의 변경사항 확인:

```bash
git status --porcelain
```

</action>

<check if="uncommitted changes exist">
  <ask>현재 worktree에 커밋되지 않은 변경사항이 있습니다.

**변경된 파일:**
{changed_files_list}

어떻게 처리하시겠습니까?

- [s] Stash - 임시 저장 후 전환
- [c] Commit - 커밋 후 전환
- [l] Leave - 그대로 두고 전환
- [a] Abort - 전환 취소</ask>

    <check if="response == 's'">
      <action>변경사항 stash:
      ```bash
      git stash push -m "WIP: Before switching to {target_worktree}"
      ```
      </action>
    </check>

    <check if="response == 'c'">
      <ask>커밋 메시지를 입력해주세요:</ask>
      <action>커밋 생성:
      ```bash
      git add -A
      git commit -m "{commit_message}"
      ```
      </action>
    </check>

    <check if="response == 'a'">
      <action>워크플로우 종료</action>
    </check>
  </check>

<action>현재 worktree 세션 상태 저장:

```yaml
# {current_worktree}/.worktree-session.yaml
last_active: { datetime }
last_task: { current_task_id }
stashed: { true/false }
```

</action>

<template-output>state_saved</template-output>
</step>

<step n="4" goal="대상 Worktree로 전환">

<action>전환 안내:

**Worktree 전환**

**From:** {current_worktree}
**To:** {target_worktree_path}
**Branch:** {target_branch}

**전환 방법:**

터미널에서 직접 이동이 필요합니다:

```bash
cd {target_worktree_path}
```

또는 VS Code에서 새 창으로 열기:

```bash
code {target_worktree_path}
```

</action>

<action>대상 worktree의 이전 세션 상태 확인:

- .worktree-session.yaml 읽기
- stash가 있으면 알림
  </action>

<check if="target has stashed changes">
  <action>안내: "대상 worktree에 stash된 변경사항이 있습니다. `git stash pop`으로 복원할 수 있습니다."</action>
</check>

<action>전환 후 권장 작업:

1. **진행 중인 작업 확인:**

   ```bash
   cat .bmad/backlog-pilot/data/backlogs/*/progress.yaml
   ```

2. **stash 복원 (있는 경우):**

   ```bash
   git stash list
   git stash pop
   ```

3. **Dev 에이전트로 작업 계속:**
   ```
   *continue
   ```
   </action>

<template-output>switch_complete</template-output>
</step>

<step n="5" goal="전환 완료 요약">

<action>전환 완료 메시지:

**Worktree 전환 준비 완료!**

**다음 명령어를 실행하세요:**

```bash
cd {target_worktree_path}
```

**대상 Worktree 정보:**

- 백로그: {target_backlog_id}
- 브랜치: {target_branch}
- 마지막 활동: {last_active}

**공유 데이터는 자동으로 연결되어 있습니다:**

- 가이드 문서: 동기화됨
- 코드 분석 캐시: 동기화됨
  </action>

<template-output>summary</template-output>
</step>

</workflow>
