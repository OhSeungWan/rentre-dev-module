# rentre-dev-module

BMAD 확장 모듈 - 노션 백로그 관리 및 개발 워크플로우 자동화

## 설치

```bash
# rentre-dev 모듈 설치
npx github:oseung-wan/rentre-dev-module
```

> 기본 설치 경로는 `./rentre-dev/`입니다. 설치 시 다른 경로를 지정할 수 있습니다.

### 특정 버전 설치

```bash
npx github:oseung-wan/rentre-dev-module#v1.0.0
```

## 명령어

```bash
# 설치 (기본)
npx github:oseung-wan/rentre-dev-module install

# 제거
npx github:oseung-wan/rentre-dev-module uninstall

# 상태 확인
npx github:oseung-wan/rentre-dev-module status

# 도움말
npx github:oseung-wan/rentre-dev-module help
```

## 기능

### 에이전트 (4개)

| 에이전트 | 역할 | 설명 |
|---------|------|------|
| PM (Pilot) | 백로그 관리 | 백로그 준비, 분해, 우선순위 관리 |
| Dev (Coder) | 개발 실행 | 서브태스크 구현, 코드 작성 |
| QA (Inspector) | 품질 검증 | 코드 리뷰, 테스트, 품질 검사 |
| Navigator | 구조 분석 | 백로그 구조 분석, 가이드 생성 |

### 워크플로우 (10+)

| 워크플로우 | 설명 |
|-----------|------|
| `prepare-backlog` | 백로그 준비 및 컨텍스트 수집 |
| `decompose-backlog` | 백로그를 서브태스크로 분해 |
| `dev-backlog` | 서브태스크 개발 실행 |
| `quick-execute` | 빠른 작업 실행 |
| `review-progress` | 진행 상황 리뷰 |
| `correct-course` | 방향 수정 |
| `analyze-codebase` | 코드베이스 분석 |
| `analyze-db-structure` | DB 구조 분석 |
| `edit-backlog-guide` | 백로그 가이드 편집 |
| `create-worktree` | Git worktree 생성 |

### Block-based Traceability System

- 백로그 → 서브태스크 → 구현 간 추적성 유지
- 자동 컨텍스트 수집 및 전파
- 노션 연동 지원 (MCP 또는 수동)

## 설정

설치 시 다음 설정을 선택할 수 있습니다:

| 설정 | 기본값 | 설명 |
|------|-------|------|
| `notion_integration` | auto | 노션 연동 방식 (auto/semi) |
| `subtask_detail_level` | standard | 서브태스크 상세도 (high/standard/detailed) |
| `auto_sync` | enabled | 자동 동기화 여부 |
| `default_save_location` | ask | 저장 위치 (local/notion/both/ask) |
| `code_analysis_depth` | standard | 코드 분석 깊이 |

설정은 설치 후 `{bmad_folder}/rentre-dev/config.yaml`에서 수정할 수 있습니다.

## 디렉토리 구조

설치 후 생성되는 구조:

```
{설치경로}/
└── rentre-dev/
    ├── module.yaml           # 모듈 정보
    ├── agents/               # 에이전트 정의
    │   ├── navigator.agent.yaml
    │   └── qa.agent.yaml
    ├── workflows/            # 워크플로우
    │   ├── analyze-codebase/
    │   ├── analyze-db-structure/
    │   └── ...
    ├── templates/            # 템플릿
    ├── tasks/                # 태스크
    └── docs/                 # 문서
```

## 라이선스

MIT

## 관련 링크

- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD Documentation](https://bmad-method.com)
