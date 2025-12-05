---
name: 'step-03-analyze'
description: '코드베이스 분석 수행'

# Path Definitions
workflow_path: '{project-root}/.bmad/rentre-dev/workflows/analyze-codebase'
module_path: '{project-root}/.bmad/rentre-dev'

# File References
thisStepFile: '{workflow_path}/steps/step-03-analyze.md'
nextStepFile: '{workflow_path}/steps/step-04-save.md'
workflowFile: '{workflow_path}/workflow.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: 코드베이스 분석 수행

## STEP GOAL:

설정된 깊이와 범위에 따라 코드베이스를 분석하고, 백로그와 관련된 파일, 의존성, 패턴을 식별합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a code analysis specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring codebase analysis expertise and pattern recognition
- ✅ User brings domain knowledge and validation

### Step-Specific Rules:

- 🎯 Focus on systematic analysis execution
- 🚫 FORBIDDEN to skip analysis steps based on assumptions
- 💬 Report findings progressively
- 🚪 USE appropriate tools (Grep, Glob, SERENA MCP) for analysis

## EXECUTION PROTOCOLS:

- 🎯 Execute analysis according to configured depth
- 💾 Collect findings systematically
- 📖 Report progress to user
- 🚫 FORBIDDEN to load next step until analysis is complete

## CONTEXT BOUNDARIES:

- Configuration from step 2 is available
- Backlog info from step 1 is available
- Focus on execution, not configuration
- This is the main analysis work

## ANALYSIS PROCESS:

### 1. Extract Keywords from Backlog

백로그에서 핵심 키워드 추출:

"**키워드 추출 중...**

**키워드 추출 소스:**

- 백로그 제목
- 설명/요구사항
- 수용 기준
- 기술적 언급 (API, 컴포넌트, 서비스 등)

**추출된 키워드:** {extracted_keywords}"

### 2. Identify Tech Stack

프로젝트 기술 스택 파악:

"**기술 스택 분석 중...**

- package.json / requirements.txt / go.mod 등 확인
- 프레임워크 감지 (React, Vue, Next.js, NestJS 등)
- 주요 라이브러리 식별

**감지된 기술 스택:**

- 언어: {languages}
- 프레임워크: {frameworks}
- 주요 라이브러리: {libraries}"

### 3. Search Related Files

키워드로 관련 파일 검색 (Grep, Glob, SERENA MCP 활용):

"**관련 파일 검색 중...**

**검색 전략:**

1. 파일명 매칭: {keywords}를 포함하는 파일
2. 내용 매칭: {keywords}를 포함하는 코드
3. import/require 추적: 관련 모듈 의존성"

### 4. Execute Depth-Specific Analysis

**IF analysis_depth == 'quick':**

Quick 분석 수행:

- 관련 파일 목록 생성 (최대 {max_files_quick}개)
- 각 파일의 간단한 역할 설명
- 기본 디렉토리 구조 파악

**IF analysis_depth == 'standard':**

Standard 분석 수행:

- 관련 파일 목록 생성 (최대 {max_files_standard}개)
- 각 파일의 역할 및 책임 분석
- 파일 간 의존성 맵 생성
- 아키텍처 패턴 식별 (MVC, 클린 아키텍처, 레이어드 등)
- 네이밍 컨벤션 파악

**IF analysis_depth == 'deep':**

Deep 분석 수행:

- 관련 파일 목록 생성 (최대 {max_files_deep}개)
- Standard 분석 내용 포함
- 주요 함수/클래스/메서드 레벨 분석
- 호출 흐름 (call flow) 파악
- 데이터 흐름 추적
- 에러 핸들링 패턴 분석

**IF analysis_depth == 'comprehensive':**

Comprehensive 분석 수행:

- 관련 파일 목록 생성 (최대 {max_files_comprehensive}개)
- Deep 분석 내용 포함
- 관련 테스트 파일 분석
- 테스트 커버리지 예상
- 코드 품질 이슈 식별
- 리팩토링 기회 제안
- 기술 부채 식별

### 5. Merge with Existing Analysis (if update mode)

**IF existing_analysis exists (update mode):**

기존 분석과 새 분석 병합:

- 새로 발견된 파일 추가
- 변경된 파일 업데이트
- 삭제된 파일 제거
- 의존성 맵 갱신

### 6. Present Analysis Summary

분석 결과 요약 표시:

"**분석 결과 요약:**

- 검색된 파일: {total_files_searched}개
- 관련 파일: {relevant_files_count}개
- 수정 필요 파일: {modify_count}개
- 주요 아키텍처 패턴: {architecture_pattern}

**핵심 발견사항:**

1. {finding_1}
2. {finding_2}
3. {finding_3}

분석 결과를 저장하고 계속 진행할까요?"

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Pass analysis results, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and analysis is complete, will you then load, read entire file, then execute {nextStepFile} to save and format the analysis results.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Keywords extracted from backlog
- Tech stack identified
- Related files found systematically
- Analysis depth executed correctly
- Findings summarized clearly

### ❌ SYSTEM FAILURE:

- Skipping keyword extraction
- Ignoring configured depth settings
- Not using systematic search approach
- Missing obvious related files
- Proceeding without analysis completion

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
