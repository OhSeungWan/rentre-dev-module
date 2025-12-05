---
name: 'step-04-implement'
description: '코드 구현 및 vitest 테스트 작성'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/dev-backlog'

# File References
thisStepFile: '{workflow_path}/steps/step-04-implement.md'
nextStepFile: '{workflow_path}/steps/step-05-verify.md'
workflowFile: '{workflow_path}/workflow.yaml'

# Data References
data_path: '{project-root}/.bmad/rentre-dev/data/backlogs'
---

# Step 4: 구현 + 테스트

## STEP GOAL:

🆕 **Block-based Traceability**: 서브태스크의 코드를 구현하고, vitest 단위 테스트를 작성합니다.
상속된 원본 지시사항(`inherited_content`)을 참조하여 정보 소실 없이 정확하게 구현합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a practical full-stack developer
- ✅ Communicate in {communication_language}
- ✅ Write clean, testable code with proper tests

### Step-Specific Rules:

- 🎯 Focus on implementation AND testing
- 🚫 FORBIDDEN to skip test writing
- 💬 Explain changes as you implement
- 🚪 Complete both code and tests before proceeding

## EXECUTION PROTOCOLS:

- 🎯 Implement code following existing patterns
- 💾 Write vitest tests for new code
- 📖 Update checklist items as completed
- 🚫 FORBIDDEN to proceed without tests

## SEQUENCE OF INSTRUCTIONS:

### 1. 구현 계획 확인

**🔨 구현 시작: {current_subtask_title}**

**작업 단계 체크리스트:**
{steps_with_checkboxes}

각 단계를 순서대로 진행합니다.

### 1b. 🆕 원본 지시사항 재확인 (Block-based Traceability)

<check if="inherited_content exists">
**⚠️ 구현 전 원본 지시사항 확인!**

> **📝 상속된 지시사항:**
>
> ```
> {inherited_content_summary}
> ```

**🚨 핵심 제약조건:**

- ⚠️ {constraint_1}
- ⚠️ {constraint_2}
- ...

**📌 이 제약조건들을 반드시 준수하며 구현하세요!**

</check>

### 2. 코드 구현

각 체크리스트 항목에 대해:

<action>
1. 관련 파일 읽기 (Read 도구 사용)
2. 기존 코드 패턴 파악
3. 수정/추가 코드 작성 (Edit/Write 도구 사용)
4. 체크리스트 항목 완료 표시
</action>

**구현 원칙:**

- 기존 코드 스타일 따르기
- 최소한의 변경으로 목표 달성
- 명확한 변수명과 함수명 사용
- 필요한 곳에 주석 추가
- 🆕 **상속된 원본 지시사항의 제약조건 준수**

**⚠️ 구현 중 발견사항:**
{implementation_findings}

### 3. vitest 테스트 작성

**🧪 테스트 작성**

<action>
1. 테스트 파일 위치 결정: {related_file}.test.ts 또는 {related_file}.spec.ts
2. 테스트 케이스 작성:
   - 정상 동작 테스트
   - 엣지 케이스 테스트
   - 에러 핸들링 테스트
</action>

**테스트 템플릿:**

```typescript
import { describe, it, expect } from 'vitest'
import { functionName } from './module'

describe('functionName', () => {
  it('should do something', () => {
    // Arrange
    const input = ...

    // Act
    const result = functionName(input)

    // Assert
    expect(result).toBe(expected)
  })

  it('should handle edge case', () => {
    // ...
  })
})
```

### 4. 구현 진행 상황 표시

**📊 진행 상황:**

| 단계         | 상태      |
| ------------ | --------- |
| 체크리스트 1 | ✅ 완료   |
| 체크리스트 2 | 🔄 진행중 |
| 체크리스트 3 | ⏳ 대기   |
| 테스트 작성  | ⏳ 대기   |

### 5. 도움 요청 처리 (H 선택 시)

<check if="user needs help">
**❓ 어떤 도움이 필요하신가요?**

1. 기술적 문제 해결
2. 코드 패턴 조언
3. 테스트 작성 가이드
4. API 문서 조회 (Context-7)
5. 코드베이스 검색 (Serena)

<action>도움 제공 후 구현 계속</action>
</check>

### 6. 일시 정지 처리 (P 선택 시)

<check if="user wants to pause">
**⏸️ 구현 일시 정지**

현재까지의 진행상황을 저장합니다:

- 완료된 체크리스트: {completed_items}
- 작성된 테스트: {test_files}
- 마지막 작업: {last_action}

<action>세션 상태에 진행상황 저장</action>

다음에 `*continue` 또는 이 워크플로우를 다시 실행하면 이어서 작업할 수 있습니다.
</check>

### 7. 구현 완료 확인

<check if="all checklist items completed AND tests written">
**✅ 구현 완료**

**완료된 작업:**

- 코드 변경: {changed_files_count}개 파일
- 테스트 추가: {test_files_count}개 파일
- 체크리스트: {completed_items}/{total_items} 완료

<check if="inherited_content exists">
**🆕 원본 지시사항 준수 확인:**

| 제약조건       | 준수 여부 |
| -------------- | --------- |
| {constraint_1} | ✅ / ❌   |
| {constraint_2} | ✅ / ❌   |
| ...            | ...       |

⚠️ **모든 제약조건이 준수되었는지 확인하세요!**
</check>
</check>

<check if="implementation incomplete">
**⚠️ 아직 완료되지 않은 항목이 있습니다:**
{incomplete_items}

계속 진행하시겠습니까?
</check>

### 8. Present MENU OPTIONS

Display: **구현 상태:** [C] 검증으로 진행 | [H] 도움 요청 | [P] 일시 정지

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- Check implementation completeness before allowing C
- After help or pause, return to implementation

#### Menu Handling Logic:

- IF C: 구현 완료 확인 후 load {nextStepFile}
- IF H: 도움 제공 후 구현 계속, 메뉴 재표시
- IF P: 세션 저장 후 워크플로우 일시 정지
- IF Any other: 응답 후 메뉴 재표시

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected AND implementation is complete (code + tests) will you load {nextStepFile} for verification.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 체크리스트 항목 구현됨
- vitest 테스트 작성됨
- 기존 코드 패턴 준수
- 진행상황 저장됨

### ❌ SYSTEM FAILURE:

- 테스트 없이 진행
- 체크리스트 무시
- 기존 패턴 무시
- 진행상황 미저장

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
