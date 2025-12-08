# Rentre-Dev

노션 백로그를 조종하는 개발자의 부조종사

## Overview

Rentre-Dev은 노션 백로그와 실제 개발 업무를 연동/자동화하여 업무 효율을 극대화하는 BMAD 모듈입니다.

**핵심 기능:**

- **계층적 백로그 분해** - Epic→Story→Task→Subtask 등 가이드 기반 분해
- **Block-based Traceability** - 블록 기반 추적성 시스템으로 요구사항-구현 완전 매핑
- **피그마 연동** - 백로그의 피그마 링크 자동 감지 및 하위 백로그 전파
- **런타임 분해 강도 선택** - 분해 시점에 high/standard/detailed 선택 가능
- 코드베이스 스마트 분석 (관련 파일 자동 탐색)
- 노션 ↔ 로컬 상태 자동 동기화
- 노션 백로그 DB 구조 분석 및 가이드 문서 생성

### Block-based Traceability System

백로그 분해 시 **정보 유실을 방지**하고, 하위 백로그를 모두 합치면 상위 백로그의 모든 요구사항을 완전히 커버할 수 있도록 합니다.

**핵심 메커니즘:**

1. **블록 식별자 시스템**: 각 블록에 고유 ID 부여 (REQ-001, AC-001, TECH-001 등)
2. **블록 타입 분류**: Requirements, AcceptanceCriteria, TechnicalNotes, Context, Constraints
3. **하위 블록 매핑**: 각 하위 백로그가 어떤 상위 블록을 담당하는지 명시
4. **누락 검증**: 분해 완료 전 모든 블록이 매핑되었는지 자동 검증
5. **컨텍스트 상속**: 하위 백로그에 상위 백로그의 핵심 정보 포함

> 상세 스키마: `docs/block-traceability-schema.md` 참조

## Installation

```bash
# BMAD 인스톨러로 설치
bmad install rentre-dev
```

## Components

### Agents (4)

| Agent              | Role       | Description                                                      |
| ------------------ | ---------- | ---------------------------------------------------------------- |
| **PM (Pilot)**     | 분석가     | 계층적 백로그 분해, 피그마 링크 감지 및 하위 백로그 전파         |
| **Dev (Coder)**    | 개발자     | 서브태스크 구현, **피그마 MCP 연동**, 완료 시 문서 자동 업데이트 |
| **QA (Inspector)** | 검토자     | 구현 검토, 완료 확인, 노션 동기화                                |
| **Navigator**      | 구조분석가 | 노션 DB 구조 분석, 백로그 가이드 문서 생성/편집                  |

### Workflows (8)

| Workflow                 | Type        | Description                                                |
| ------------------------ | ----------- | ---------------------------------------------------------- |
| **quick-execute**        | Interactive | 빠른 실행 - 간단한 단독 백로그 분해 없이 바로 작업 시작    |
| **prepare-backlog**      | Interactive | 백로그 준비 - 상/하위/연결 분석, 요구사항 구조화, 컨텍스트 |
| **decompose-backlog**    | Interactive | 계층적 백로그 분해 - 런타임 강도 선택 + Dev handoff        |
| **dev-backlog**          | Interactive | Dev 에이전트용 백로그 실행 워크플로우                      |
| **analyze-codebase**     | Interactive | 코드베이스 분석 - 백로그 관련 코드 분석 (재사용 가능)      |
| **review-progress**      | Document    | 진행 상황 리뷰 & 리포트 생성                               |
| **analyze-db-structure** | Document    | 노션 백로그 DB 구조 분석 → 가이드 문서 생성                |
| **edit-backlog-guide**   | Interactive | 백로그 가이드 문서 협력 편집                               |

### Tasks (2)

| Task                | Description                                   |
| ------------------- | --------------------------------------------- |
| **analyze-backlog** | 빠른 백로그 분석 - 복잡도/리스크 평가         |
| **gather-context**  | 부족한 컨텍스트 수집 - 필수 정보 파악 및 요청 |

### Templates (9)

| Template                        | Description                       |
| ------------------------------- | --------------------------------- |
| **backlog-info-v2.yaml**        | 백로그 정보 블록 기반 템플릿 (v2) |
| **child-backlog.yaml**          | 하위 백로그 매핑 템플릿           |
| **quick-task-template.md**      | 빠른 태스크 실행용 간소화 템플릿  |
| **subtask-template.md**         | 서브태스크 템플릿                 |
| **backlog-item-template.md**    | 백로그 아이템 템플릿              |
| **progress-report.md**          | 진행 보고서 템플릿                |
| **guide-summary-template.md**   | 가이드 요약 템플릿                |
| **guide-type-template.md**      | 가이드 타입별 템플릿              |
| **guide-hierarchy-template.md** | 가이드 계층 구조 템플릿           |

### Docs (1)

| Document                         | Description                         |
| -------------------------------- | ----------------------------------- |
| **block-traceability-schema.md** | 블록 기반 추적성 시스템 스키마 문서 |

## Quick Start

### 1. PM 에이전트 로드

```
/bmad:rentre-dev:agents:pm
```

### 2. 메뉴 확인

```
*help
```

### 3. 권장 워크플로우

**간단한 백로그 빠른 실행 (권장):**

```
*quick         # 분해 없이 바로: 분석 → 코드분석 → 작업 시작
```

**새 백로그 분해:**

```
*prepare     # 1단계: 백로그 준비 (요구사항 구조화)
*decompose   # 2단계: 백로그 분해 (런타임 강도 선택 가능)
```

**코드 분석 먼저:**

```
*analyze-code  # 코드베이스 분석
*decompose     # 분석 결과 활용하여 분해
```

**빠른 평가만:**

```
*analyze  # 복잡도/리스크 빠른 평가
```

**컨텍스트 수집:**

```
*gather   # 부족한 정보 파악 및 요청
```

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Rentre-Dev Flow                       │
└─────────────────────────────────────────────────────────────┘

                    ┌───────────┐
                    │ Navigator │ ←── 백로그 DB 구조 분석
                    │           │     가이드 문서 생성/편집
                    └─────┬─────┘
                          │
                          ▼ (가이드 참조)
                    ┌───────────┐
                    │    PM     │
                    │  (Pilot)  │
                    └─────┬─────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ prepare  │───▶│ analyze  │───▶│decompose │
    │ backlog  │    │ codebase │    │ backlog  │
    └──────────┘    └──────────┘    └────┬─────┘
                                         │
                          ┌──────────────┴──────────────┐
                          ▼                             ▼
                    ┌───────────┐               ┌────────────┐
                    │    Dev    │               │   quick    │
                    │ (dev-     │               │  execute   │
                    │  backlog) │               │ (간단작업) │
                    └─────┬─────┘               └────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │    QA     │
                    │(Inspector)│
                    └─────┬─────┘
                          │
                          ▼
                    ┌──────────┐
                    │  노션    │
                    │  동기화  │
                    └──────────┘
```

## Configuration

설치 시 다음 설정을 구성할 수 있습니다:

| Setting                  | Options                  | Default  |
| ------------------------ | ------------------------ | -------- |
| **notion_integration**   | auto, semi               | auto     |
| **subtask_detail_level** | high, standard, detailed | standard |
| **auto_sync**            | enabled, disabled        | enabled  |

### subtask_detail_level (기본값, 런타임 오버라이드 가능)

- **high**: 큰 단위로 분해 (3-5개 서브태스크)
- **standard**: 중간 단위로 분해 (5-8개 서브태스크)
- **detailed**: 파일/메서드 수준으로 분해 (8-15개 서브태스크)

> **런타임 선택**: `*decompose` 실행 시 분해 강도를 선택할 수 있습니다.

## Module Structure

```
rentre-dev/
├── _module-installer/
│   └── install-config.yaml
├── agents/
│   ├── pm.agent.yaml          # PM (Pilot) 에이전트
│   ├── dev.agent.yaml         # Dev (Coder) 에이전트
│   ├── qa.agent.yaml          # QA (Inspector) 에이전트
│   └── navigator.agent.yaml   # Navigator 에이전트
├── workflows/
│   ├── quick-execute/         # 빠른 실행 (5 steps)
│   ├── prepare-backlog/       # 백로그 준비 (7 steps)
│   ├── decompose-backlog/     # 계층적 백로그 분해 (8 steps)
│   ├── dev-backlog/           # Dev 백로그 실행 (6 steps)
│   ├── analyze-codebase/      # 코드베이스 분석 (5 steps)
│   ├── review-progress/       # 진행 상황 리뷰
│   ├── analyze-db-structure/  # DB 구조 분석 (5 steps)
│   └── edit-backlog-guide/    # 가이드 편집
├── tasks/
│   ├── analyze-backlog.md     # 빠른 백로그 분석
│   └── gather-context.md      # 컨텍스트 수집
├── templates/
│   ├── backlog-info-v2.yaml   # 블록 기반 백로그 정보 템플릿
│   ├── child-backlog.yaml     # 하위 백로그 매핑 템플릿
│   ├── quick-task-template.md # 빠른 태스크 템플릿
│   ├── subtask-template.md    # 서브태스크 템플릿
│   ├── backlog-item-template.md
│   ├── progress-report.md
│   ├── guide-summary-template.md
│   ├── guide-type-template.md
│   └── guide-hierarchy-template.md
├── docs/
│   └── block-traceability-schema.md  # 블록 추적성 스키마 문서
└── README.md
```

## 피그마 연동

### 피그마 링크 자동 감지 (PM 에이전트)

백로그 분해 시 다음 패턴을 자동으로 감지합니다:

- `https://www.figma.com/file/{file_key}...`
- `https://www.figma.com/design/{file_key}...`
- 노드 ID: `node-id={node_id}` 또는 `123:456` 형식

감지된 피그마 정보는 **UI/퍼블리싱 관련 하위 백로그에 자동 전파**됩니다.

### Dev 에이전트 피그마 명령

| 명령          | 설명                               |
| ------------- | ---------------------------------- |
| `*figma`      | 피그마 디자인 스펙 조회 (MCP 연동) |
| `*figma-code` | 피그마에서 컴포넌트 코드 생성      |

## Requirements

- BMAD Method v6+
- 노션 MCP 서버 (auto 모드 사용 시)
- **피그마 MCP 서버** (피그마 연동 사용 시)

## Changelog

### v2.3.0 (2024-12)

**주요 변경사항:**

- **Block-based Traceability System 도입** - 블록 기반 추적성 시스템으로 요구사항-구현 매핑 강화
  - 블록 식별자 시스템 (REQ-xxx, AC-xxx, TECH-xxx 등)
  - backlog-info-v2.yaml, child-backlog.yaml 템플릿 추가
  - docs/block-traceability-schema.md 문서 추가
- **dev-backlog 워크플로우 추가** - Dev 에이전트 전용 백로그 실행 워크플로우 (6 steps)
- **quick-task-template.md 추가** - 빠른 태스크용 간소화 템플릿
- **step-file 아키텍처 마이그레이션** - 모든 워크플로우가 step 파일 기반으로 전환

### v2.2.0 (2024-12)

**주요 변경사항:**

- **quick-execute 워크플로우 추가** - 간단한 단독 백로그를 분해 없이 바로 실행
  - 복잡도 자동 평가 (너무 복잡하면 분해 권장)
  - 코드 분석 → 컨텍스트 수집(선택) → Dev handoff 일체형
  - PM 에이전트에서 `*quick` 명령으로 실행
- **QA 에이전트 수정** - sync-notion → sync-changes 참조 수정

### v2.1.0 (2024-11)

**주요 변경사항:**

- **gather-context 태스크 추가** - 부족한 컨텍스트 파악 및 적극 요청
- **prepare-backlog 컨텍스트 충족도 검증** - Step 5에 gather-context 연동

### v2.0.0 (2024-11)

**주요 변경사항:**

- **prepare-backlog 워크플로우 추가** - 백로그 분석 + 컨텍스트 수집 통합
- **런타임 분해 강도 선택** - decompose 시 high/standard/detailed 선택 가능
- **Dev handoff 통합** - decompose 완료 후 바로 Dev 에이전트 전환
- **decompose-backlog 간소화** - 870행 → 420행 (50% 감소)
- **start-task 제거** - decompose-backlog로 기능 통합
- **sync-notion 제거** - sync-changes로 기능 통합

## Author

Created by BMad with BMad Builder

## License

MIT
