# Review Progress - 진행 상황 리뷰 워크플로우

<critical>Communicate in {communication_language} throughout</critical>

<workflow>

<step n="1" goal="전체 태스크 현황 수집">
<action>data/backlogs/ 폴더의 모든 백로그 스캔</action>
<action>각 태스크의 task-info.yaml 파싱</action>
<action>상태별 분류: 완료/진행중/대기</action>

<template-output>task_overview</template-output>
</step>

<step n="2" goal="상세 진행 현황 분석">
<action>각 진행 중 태스크의 서브태스크 완료율 계산</action>
<action>블로커나 지연 사항 식별</action>
<action>최근 완료된 항목 정리</action>

**진행 현황 요약:**

| 태스크 | 진행률 | 상태 |
| ------ | ------ | ---- |

{{task_progress_table}}

<template-output>detailed_progress</template-output>
</step>

<step n="3" goal="리포트 생성">
<action>progress-report.md 템플릿 로드</action>
<action>수집된 데이터로 템플릿 채우기</action>
<action>리포트 파일 저장</action>

<ask>리포트를 노션에도 동기화할까요? [y/n]</ask>

<check if="yes">
  <action>노션 페이지에 리포트 요약 추가</action>
</check>

<template-output>report_saved</template-output>
</step>

</workflow>
