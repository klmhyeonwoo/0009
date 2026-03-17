# KB Healthcare Task Manager

할 일을 관리하는 웹 애플리케이션입니다.

## 기술 스택

**Frontend**
- React 18 + TypeScript
- Vite
- Emotion (CSS-in-JS)
- TanStack Query (서버 상태 관리)
- TanStack Virtual (가상 스크롤링)
- React Router v6
- Axios

**Backend**
- Node.js + Express
- JWT 인증

## 주요 기능

- JWT 기반 로그인 / 인증
- 대시보드 — 전체 / 미완료 / 완료 태스크 현황
- 태스크 목록 — 가상 스크롤링 + 무한 스크롤
- 태스크 상세 조회 및 삭제
- 회원 정보 조회

## 시작하기

### 요구 사항

- Node.js 18+
- pnpm

### 설치

```bash
pnpm install
```

### 실행

```bash
pnpm dev
```

프론트엔드(`http://localhost:5173`)와 백엔드(`http://localhost:3001`)가 동시에 실행됩니다.

### 테스트 계정

| 항목 | 값 |
|------|----|
| 이메일 | `test@test.com` |
| 비밀번호 | `testtest` |

## 프로젝트 구조

```
kb-healthcare/
├── app/
│   ├── src/
│   │   ├── api/          # Axios 클라이언트 및 API 함수
│   │   ├── hooks/        # React Query 커스텀 훅
│   │   ├── layouts/      # GNB/LNB 레이아웃
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── components/   # 공통 컴포넌트
│   │   └── styles/       # 색상 토큰, 전역 스타일
│   └── server/
│       └── src/
│           └── index.js  # Express 서버
```
