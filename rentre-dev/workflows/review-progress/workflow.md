---
name: Review Progress
description: 진행 상황 리뷰 및 리포트 생성
author: Rentre-Dev

# Configuration
config_source: '{project-root}/.bmad/rentre-dev/config.yaml'
installed_path: '{project-root}/.bmad/rentre-dev/workflows/review-progress'
module_path: '{project-root}/.bmad/rentre-dev'
data_path: '{module_path}/data/backlogs'
report_template: '{module_path}/templates/progress-report.md'
default_output_file: '{module_path}/data/reports/progress-report-{date}.md'
---

# Review Progress - 진행 상황 리뷰 워크플로우

**Goal:** 백로그 진행 상황을 종합적으로 리뷰하고 리포트를 생성합니다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 프로젝트 진행 상황 분석가 collaborating with a PM/개발자. This is a partnership, not a client-vendor relationship. You bring 데이터 분석 및 리포트 작성 전문성, while the user brings 프로젝트 컨텍스트와 우선순위 판단. Work together as equals.

---

## WORKFLOW PROCESS

### Step 1: 전체 태스크 현황 수집

1. `{data_path}` 폴더의 모든 백로그를 스캔합니다

2. 각 태스크의 `task-info.yaml` 파싱

3. 상태별 분류:
   - ✅ 완료 (Completed)
   - 🔄 진행중 (In Progress)
   - ⏳ 대기 (Pending/Blocked)

4. **태스크 개요 표시**:
   ```
   **태스크 현황 개요:**

   총 태스크: {total_count}개
   - 완료: {completed_count}개
   - 진행중: {in_progress_count}개
   - 대기: {pending_count}개

   완료율: {completion_rate}%
   ```

---

### Step 2: 상세 진행 현황 분석

1. 각 진행 중 태스크의 서브태스크 완료율 계산

2. 블로커나 지연 사항 식별

3. 최근 완료된 항목 정리

4. **진행 현황 테이블 표시**:
   ```
   **진행 현황 요약:**

   | 태스크 | 진행률 | 상태 | 비고 |
   |--------|--------|------|------|
   | {task_name} | {progress}% | {status} | {notes} |
   ...
   ```

5. **블로커 및 리스크 표시** (있는 경우):
   ```
   **⚠️ 주의 필요 항목:**

   - {blocker_description}
   - {risk_description}
   ```

6. **최근 완료 항목 표시**:
   ```
   **✅ 최근 완료:**

   - {completed_task_1} ({completion_date})
   - {completed_task_2} ({completion_date})
   ```

---

### Step 3: 리포트 생성

1. `{report_template}` 템플릿 로드

2. 수집된 데이터로 템플릿 채우기

3. 리포트 파일 저장: `{default_output_file}`

4. **리포트 저장 완료 안내**:
   ```
   **리포트가 저장되었습니다:**

   📄 {output_file_path}
   ```

5. **노션 동기화 질문**:
   ```
   리포트를 노션에도 동기화할까요? [Y/N]
   ```

6. **Y 선택 시**:
   - 노션 페이지에 리포트 요약 추가
   - 동기화 완료 안내

7. **완료 안내**:
   ```
   **리뷰 완료!**

   다음 단계:
   - 리포트 파일 확인: {output_file_path}
   - 블로커 해결을 위한 조치 검토
   - 다음 스프린트 계획 수립
   ```

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {config_source} and resolve:

- `user_name`, `communication_language`
- `date` as system-generated current datetime

### 2. Start Workflow

Begin with Step 1: 전체 태스크 현황 수집
