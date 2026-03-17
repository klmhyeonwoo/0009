# AI 활용 보고서

## 사용한 도구 / 모델

- **도구**: Claude Code (Anthropic CLI)
- **모델**: claude-sonnet-4-6

## 적용한 작업 범위

백엔드는 AI를 활용하여 생성하였으며, 프론트엔드는 직접 작성 후 일부 로직 검증 및 최종 요구사항 점검에 AI를 활용하였습니다.

### 백엔드 (`app/server/`)

- Express 서버 설정 및 미들웨어 구성
- JWT 기반 인증 로직 (sign-in, refresh token)
- Bearer Auth 미들웨어
- 50개 in-memory mock 태스크 데이터 생성
- 모든 API 엔드포인트 구현 (`/api/sign-in`, `/api/refresh`, `/api/user`, `/api/dashboard`, `/api/task`, `/api/task/:id`)

### 프론트엔드 (`app/`)

프론트엔드 코드는 직접 작성하였으며, AI는 다음 항목에 활용하였습니다.

**직접 작성한 주요 구현:**
- Axios 인터셉터 기반 API 클라이언트 (`src/api/index.ts`) — 요청/응답 로깅, 상태 코드별 에러 처리, 401 시 로그인 페이지 리다이렉트
- 인증 Context 및 훅 (`src/hooks/api/useAuth.ts`, `App.tsx`) — `AuthContext`, `ProtectedRoute`, 쿠키 기반 토큰 관리
- 전체 페이지 컴포넌트 (Dashboard, SignIn, TaskList, TaskDetail, UserProfile, NotFound)
- React Query 훅 (`useTaskList`, `useTaskDetail`, `useDashboard`, `useUser`)
- 라우팅 구조 및 레이아웃 (`App.tsx`, `AppLayout.tsx`)
- 로그인 폼 유효성 검증 및 에러 모달, 삭제 확인 모달

**AI를 활용한 항목:**
- `TaskList.tsx`의 가상 스크롤링 로직 검증 (`@tanstack/react-virtual` — `useVirtualizer` 설정, `overscan`, `estimateSize` 등)
- 무한 스크롤 트리거 로직 검증 (마지막 virtualItem 감지 → `fetchNextPage` 호출)
- CSS 커스텀 프로퍼티 토큰 생성 (`src/styles/tokens.css`) — 요구사항의 예시 토큰(`primary`, `disabled`) 외에 `secondary`, `danger`, `success`, `text-*`, `bg-*`, `border`, `error` 등 추가 토큰을 AI로 생성
- 개발 완료 후 `requirement.md` 기준 전체 요구사항 최종 점검

## 핵심 프롬프트 요약

1. **백엔드 생성 프롬프트**: `requirement.md`와 `openapi.yaml`을 분석하여 Node.js Express 백엔드를 생성해달라고 지시. JWT 인증, 50개 in-memory mock 데이터 등 세부 요구사항을 명시.

2. **수정 프롬프트**: OpenAPI spec에서 `TaskItem.id`가 `string` 타입임을 확인하고, 서버의 `number` 타입을 `string`으로 수정 지시.

3. **프론트엔드 스크롤 검증 프롬프트**: 직접 작성한 `useVirtualizer` 설정 및 무한 스크롤 트리거 로직(`useEffect`)이 `@tanstack/react-virtual` 사용 방식에 맞게 올바른지 검토 요청. `count`, `estimateSize`, `overscan` 값의 적절성과, 마지막 아이템 인덱스 감지 조건(`lastItem.index >= tasks.length - 1`)의 정확성 확인.

4. **프론트엔드 최종 검증 프롬프트**: 프론트엔드 개발 완료 후 `requirement.md`의 전체 요구사항을 기준으로 누락된 항목이 없는지 검토 요청. GNB/LNB 라우팅, 로그인 유효성 조건, 상세 페이지 404 처리 및 삭제 모달 동작, 대시보드 데이터 표시, 회원정보 페이지 등 각 항목별 구현 여부 점검.

## 사람이 최종 검증한 내용

- 백엔드 생성 코드 리뷰 (`server/src/index.js`, 인증 로직, API 엔드포인트)
- OpenAPI 스펙(`openapi.yaml`)과의 정합성 확인 (id 타입, 응답 스키마, 보안 스킴)
- 프론트엔드 전체 코드 직접 작성 및 검토 (App.tsx, 각 페이지 컴포넌트, API 레이어, 스타일)
- TypeScript 타입 오류 검증 (`tsc --noEmit` 실행 — 오류 없음 확인)
- AI가 검증한 가상 스크롤 + 무한 스크롤 로직 최종 확인 (`TaskList.tsx`)
- `requirement.md` 기반 전체 요구사항 체크리스트 검토 결과 확인 및 누락 항목 수정

## 비밀정보

해당 프로젝트에는 하드코딩된 JWT secret(`task-secret`)과 테스트 계정 정보(`test@example.com` / `password1`)가 포함되어 있으나, 이는 과제용 목 서버에 한정되며 실제 서비스 환경의 민감정보가 아닙니다.
