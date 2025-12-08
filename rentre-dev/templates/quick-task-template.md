---
id: {backlog_id}
title: {backlog_title}
type: quick-task
status: ready-for-dev
execution_mode: direct
complexity: {complexity_score}/10
created: {timestamp}
notion_url: {notion_url}
figma_url: {figma_url}
---

# {backlog_title}

## 설명

{backlog_description}

## 작업 목록 (Tasks)

<!-- Dev Agent: 이 목록을 순서대로 체크하며 구현하세요 -->

{tasks_from_acceptance_criteria}

## 관련 파일

{files_to_modify_formatted}

## 참조

- 코드 분석: [code-analysis.md](./code-analysis.md)
- 피그마: {figma_reference}
- 노션: {notion_reference}

## 작업 로그

- [{timestamp}] quick-execute 워크플로우 완료, 작업 준비됨

---

**Dev 명령어:** `*implement` | `*done` | `*status`
