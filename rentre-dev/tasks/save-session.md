# Save Session Task - 워크플로우 세션 저장

워크플로우 진행 중 컨텍스트가 부족해지기 전에 현재 상태를 저장하는 태스크

## 용도

이 태스크는 워크플로우 진행 중 **컨텍스트 한계에 도달하기 전** 또는 **작업 중단 시** 호출됩니다.
Serena MCP의 memory 기능을 활용하여 세션 상태를 저장하고, 다음 세션에서 복원할 수 있습니다.

**사용 시나리오:**

- 워크플로우 진행 중 컨텍스트 75% 이상 사용 시
- 사용자가 작업 중단을 요청할 때
- 긴 워크플로우의 체크포인트 저장
- 에이전트의 `*save` 명령으로 독립 실행

## 입력 파라미터

```yaml
workflow_name: "워크플로우 이름"
current_step: 3
total_steps: 7
session_data:
  # session-state.yaml 템플릿 기반
  backlog_id: ""
  backlog_title: ""
  current_subtask: 1
  completed_subtasks: []
  total_subtasks: 0
  started_at: ""
  last_updated: ""
  notes: []
custom_context: # 워크플로우별 추가 컨텍스트
  key: value
```

## 실행 단계

### 1. 현재 세션 상태 수집

워크플로우에서 전달받은 데이터 또는 현재 컨텍스트에서 수집:

```yaml
session_snapshot:
  # 기본 정보
  workflow_name: "{workflow_name}"
  workflow_path: "{project-root}/.bmad/[module]/workflows/{workflow_name}"

  # 진행 상태
  current_step: {current_step}
  total_steps: {total_steps}
  progress_percent: {calculated_percent}%

  # 타임스탬프
  saved_at: "{ISO_TIMESTAMP}"
  session_duration: "{duration_since_start}"

  # 세션 데이터 (session-state.yaml 기반)
  session_data: {session_data}

  # 추가 컨텍스트
  custom_context: {custom_context}

  # 복원 가이드
  resume_instruction: |
    다음 세션에서 이 워크플로우를 재개하려면:
    1. 동일한 에이전트를 활성화
    2. `*load {memory_name}` 또는 `*resume` 명령 실행
    3. Step {next_step}부터 진행
```

### 2. Serena Memory에 저장

#### 2.1 Memory 이름 생성

```
{workflow_name}-session-{YYYYMMDD}-{HHMMSS}
```

예시: `dev-backlog-session-20231215-143022`

#### 2.2 저장 실행

```
mcp__serena__write_memory 호출:
- memory_name: "{generated_memory_name}"
- content: "{session_snapshot as YAML}"
```

### 3. 저장 확인 및 안내

#### 3.1 저장 성공 시

```markdown
## ✅ 세션 저장 완료

**Memory 이름:** `{memory_name}`
**저장 시각:** {saved_at}

### 📊 저장된 상태
- **워크플로우:** {workflow_name}
- **진행률:** {current_step}/{total_steps} ({progress_percent}%)
- **마지막 완료 스텝:** Step {last_completed_step}

### 🔄 다음 세션에서 복원하기

1. 에이전트 활성화 후 다음 명령 실행:
   ```
   *resume
   ```
   또는
   ```
   *load {memory_name}
   ```

2. 자동으로 Step {next_step}부터 재개됩니다.

### 💡 팁
- `mcp__serena__list_memories`로 저장된 세션 목록 확인
- 오래된 세션은 `mcp__serena__delete_memory`로 정리
```

#### 3.2 저장 실패 시

```markdown
## ⚠️ 세션 저장 실패

**원인:** {error_message}

### 대안: 파일로 저장

세션 상태를 클립보드에 복사하거나 파일로 저장할 수 있습니다:

<details>
<summary>세션 데이터 (클릭하여 펼치기)</summary>

```yaml
{session_snapshot}
```

</details>

**권장 저장 위치:**
`{agent_sidecar_folder}/sessions/{workflow_name}-{timestamp}.yaml`
```

## 반환값

```yaml
success: true | false
memory_name: "dev-backlog-session-20231215-143022"
saved_at: "2023-12-15T14:30:22Z"
resume_command: "*load dev-backlog-session-20231215-143022"
next_step: 4
error: null | "에러 메시지"
```

## 에이전트 메뉴 통합 예시

에이전트 파일의 `<menu>` 섹션에 추가:

```xml
<item cmd="*save">[S] Save Session - 현재 세션 저장</item>
<item cmd="*resume">[R] Resume Session - 저장된 세션 복원</item>
<item cmd="*sessions">[SS] List Sessions - 저장된 세션 목록</item>
```

## 연계

- **모든 워크플로우**: 컨텍스트 부족 시 자동 또는 수동 호출
- **load-session (Task)**: 저장된 세션 복원용 (별도 생성 권장)
- **에이전트 메뉴**: `*save`, `*resume` 명령으로 접근

## 자동 저장 트리거 (권장)

워크플로우 스텝 파일에 다음 체크 추가 권장:

```markdown
<!-- 스텝 시작 시 컨텍스트 체크 -->
> ⚠️ 컨텍스트 사용량이 75%를 초과하면 `*save` 명령으로 세션을 저장하세요.
```
