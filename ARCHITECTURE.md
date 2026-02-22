# ARCHITECTURE.md

## 1. Project Mission & Vibe (프로젝트 미션 및 무드)

- **Project Mission:** B2B 영업부의 리드 유입부터 최종 정산까지 전 과정을 디지털화하는 '영업부 통합 관리 자동화 시스템(B2B Sales Integrated CRM/ERP)' 구축 [1, 2].
- **North Star Metric:** 수작업(Manual Tasks) 80% 제거 및 리드 전환율(Lead Conversion Rate) 30% 향상, 파이프라인 가시성 100% 확보 [3].
- **Design System & Vibe:** Shadcn/UI 기반의 'Premium Fintech/SaaS Dashboard'. 주조색은 다크 모드(Dark Mode)를 기본으로 하며, 세련되고 직관적인 Clean Minimalist 디자인을 지향. 사용자 상호작용 시 마이크로 애니메이션(Framer Motion)을 적용하여 생동감 있는 경험 제공 [4-6].
- **Target Persona & Core Value:**
  - **영업 담당자(Sales Rep):** 반복적인 데이터 입력에서 해방되어 핵심 영업 활동에 집중할 수 있는 'AI 코파일럿' 경험 제공 [2].
  - **영업 관리자(Sales Manager):** 감이 아닌 데이터(Data-driven) 기반의 파이프라인 모니터링 및 수익 예측을 통한 '의사결정 엔진' 제공 [2].

---

## 2. Tech Stack & Hard Constraints (기술 스택 및 강력한 제약조건)

- **Framework:** Next.js 15 (App Router 전용 - 반드시 최신 안정 버전 사용) [4, 7].
- **Language:** TypeScript (Strict Mode 필수, `any` 타입 사용 절대 금지) [7, 8].
- **Styling:** Tailwind CSS, Shadcn/UI, Framer Motion (CSS Modules 사용 금지, Tailwind 유틸리티 클래스만 사용) [4, 9, 10].
- **State Management:**
  - Server State: Tanstack Query (React Query)
  - Client State: Zustand
- **Database/ORM:** Supabase (PostgreSQL), Prisma ORM [3].
- **AI Agent Integration:** Google Antigravity 에이전트 워크플로(.agent/rules, .agent/skills) 적극 활용 [11, 12].
- **Hard Constraints (금지 사항):**
  - "Pages Router 사용 절대 금지 (오직 App Router만 사용)"
  - "매직 넘버(Magic numbers)나 암묵적인 One-liner 코드 작성 금지 (가독성과 명시성 우선)" [7, 9].
  - "API 키 및 데이터베이스 연결 문자열은 절대 하드코딩하지 말고 `.env.local` 파일에서 로드할 것" [6].
  - "데이터베이스 마이그레이션 시 `DROP TABLE`과 같은 파괴적인 명령어는 인간의 사전 검토(Review) 없이 자동 실행 금지" [6].

---

## 3. Directory Structure (폴더 구조)

프로젝트는 유지보수성과 관심사 분리(Separation of Concerns)를 위해 다음과 같은 트리 구조를 가집니다. 경로 별칭(Alias)은 `@/* -> ./src/*` 규칙을 따릅니다 [7].

```text
root/
├── .agent/                 # Antigravity 에이전트 프로토콜 (rules, skills, workflows) [11, 12]
├── prisma/                 # Prisma 스키마 및 마이그레이션 파일
├── src/
│   ├── app/                # Next.js App Router (라우팅, 서버 컴포넌트, 페이지 레이아웃)
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── ui/             # Shadcn/UI 공통 컴포넌트 (Button, Input 등)
│   │   └── shared/         # 도메인에 종속되지 않은 커스텀 컴포넌트
│   ├── features/           # 도메인별 비즈니스 로직 (leads, deals, users 등)
│   ├── hooks/              # 커스텀 React 훅 (Client 전용)
│   ├── lib/                # 유틸리티 함수, Supabase 클라이언트, 설정 파일
│   └── types/              # 전역 TypeScript 인터페이스 및 타입 정의
├── public/                 # 정적 에셋 (이미지, 아이콘 등)
├── .env.local              # 환경 변수 (Git 제외)
└── ARCHITECTURE.md         # 아키텍처 청사진 (본 문서)
• app/: 오직 라우팅과 렌더링 진입점 역할만 수행 (비즈니스 로직 최소화).
• features/: 비즈니스 로직, API 호출, 데이터 패칭 로직을 도메인별로 캡슐화.
• components/: UI 렌더링에만 집중하는 멍청한(Dumb) 컴포넌트 위주로 구성.

--------------------------------------------------------------------------------
4. Data Models & Schema (데이터 모델 및 스키마)
핵심 엔티티는 B2B 영업 관리(CRM/ERP)의 핵심 요소를 반영합니다.
ERD Overview
• User (사원/관리자) 1 : N Lead (잠재 고객)
• Lead 1 : N Deal (영업 기회/파이프라인)
• Deal 1 : N Interaction (통화/이메일 등 활동 이력)
주요 모델 및 필드 정의
1. User (사용자)
    ◦ id (UUID, PK), email (String), role (Enum: ADMIN, MANAGER, REP), createdAt (DateTime)
2. Lead (잠재 고객)
    ◦ id (UUID, PK), companyName (String), contactPerson (String), score (Int, AI 스코어링), status (Enum: COLD, WARM, HOT), assignedTo (FK -> User.id).
3. Deal (영업 기회)
    ◦ id (UUID, PK), leadId (FK -> Lead.id), amount (Decimal, 예상 매출액), stage (Enum: PROSPECTING, PROPOSAL, NEGOTIATION, WON, LOST), estimatedCloseDate (DateTime, 수주 예정일).
4. Interaction (활동 이력)
    ◦ id (UUID, PK), dealId (FK -> Deal.id), type (Enum: CALL, EMAIL, MEETING), notes (Text), createdAt (DateTime).
Supabase RLS (Row Level Security) 정책
• MANAGER/ADMIN: 모든 Lead와 Deal에 대한 SELECT, INSERT, UPDATE, DELETE 권한 보유.
• REP (영업 담당자): 자신이 할당된(assignedTo === auth.uid()) Lead 및 관련 Deal 정보만 SELECT, UPDATE 가능. 타 담당자의 데이터는 접근 불가.

--------------------------------------------------------------------------------
5. Implementation Roadmap (단계별 구현 계획)
각 Phase는 에이전트가 문맥을 잃지 않고 한 번에 실행 및 검증 가능한 단위로 분할됩니다.
• Phase 1: 초기 설정 및 인프라 구축 (Init & Infra)
    ◦ Next.js 15, Tailwind CSS, TypeScript 설정.
    ◦ Supabase 프로젝트 연결 및 .env 설정.
    ◦ Prisma 스키마 작성 및 초기 DB 마이그레이션 적용 (npx prisma db push).
    ◦ Google Antigravity 글로벌 룰(.agent/rules) 및 스킬 세팅.
• Phase 2: 핵심 데이터 모델 및 API 구현 (Data & API)
    ◦ Prisma Client 인스턴스화 (lib/db.ts).
    ◦ User, Lead, Deal 엔티티에 대한 CRUD Server Actions 구현.
    ◦ RLS(Row Level Security) 정책 SQL 스크립트 작성 및 Supabase 적용.
• Phase 3: 공통 UI 컴포넌트 개발 (Shared UI)
    ◦ Shadcn/UI 초기화 및 필수 컴포넌트(Button, Input, Table, Dialog, Toast) 설치.
    ◦ 전역 레이아웃 설정 (Sidebar 네비게이션, Topbar).
    ◦ 다크 모드(Dark Mode) 토글 기능 및 Theme Provider 적용.
• Phase 4: 비즈니스 로직 및 페이지 구현 (Business Logic)
    ◦ 리드(Lead) 목록 페이지 및 칸반(Kanban) 보드 형태의 파이프라인(Deal) 뷰 구현.
    ◦ 각 단계 전환(Stage 변경) 시 Zustand 및 Tanstack Query를 활용한 Optimistic UI 업데이트 적용.
    ◦ 예상 매출액(Amount) 및 수주 예정일(Estimated Close Date) 시각화 대시보드 구축.
• Phase 5: 폴리싱 및 배포 (Polish & Deploy)
    ◦ Framer Motion을 활용한 카드 호버 및 리스트 렌더링 마이크로 애니메이션 추가.
    ◦ 전역 에러 바운더리(Error Boundary) 및 로딩 스켈레톤(Skeleton) 처리.
    ◦ Vercel 배포 스크립트 설정.
    ◦ 에이전트 브라우저(Browser Subagent)를 활용한 End-to-End 녹화 및 워크스루(Walkthrough) 아티팩트 생성.

--------------------------------------------------------------------------------
6. Coding Standards & Conventions (코딩 규칙)
• 컴포넌트 작성 규칙:
    ◦ 모든 컴포넌트는 함수형 컴포넌트(Functional Component)로 작성합니다.
    ◦ export default 대신 Named Export를 엄격히 사용합니다 (예: export const Dashboard = () => {}).
    ◦ 복잡성보다 가독성을 우선시합니다 (Readability > Cleverness).
• 네이밍 컨벤션:
    ◦ 파일 및 폴더명: kebab-case (예: lead-dashboard.tsx, use-fetch-deals.ts)
    ◦ 컴포넌트 및 인터페이스명: PascalCase (예: LeadDashboard, DealModel)
    ◦ 함수 및 변수명: camelCase (예: calculateTotalRevenue, leadScore)
• 에러 핸들링 전략:
    ◦ 모든 API 호출 및 Server Actions는 try-catch 블록으로 감싸야 합니다.
    ◦ 에러를 묵인하는 Silent Catch Block 사용을 절대 금지합니다.
    ◦ API 호출 실패 시 반드시 Sonner(또는 Shadcn Toast)를 통해 사용자에게 Toast 알림을 표시해야 합니다 (예: toast.error("리드 정보를 불러오는데 실패했습니다.")).
    ◦ 로깅 시 구조화된 낮은 카디널리티(Low-cardinality) 로깅을 사용합니다.

--------------------------------------------------------------------------------
7. Verification Scenarios (검증 시나리오)
구현 단계 완료 후 에이전트가 브라우저 서브 에이전트(Browser Subagent)를 통해 스스로 검증해야 할 체크리스트입니다.
1. 접근 제어 (Auth & RLS):
    ◦ 비로그인 상태에서 /dashboard 접근 시 /login 페이지로 즉시 리다이렉트 되는가?
    ◦ 영업 담당자(REP) 계정으로 로그인 시, 타 담당자에게 할당된 리드(Lead) 데이터가 보이지 않는가?
2. UI/UX 무결성:
    ◦ 다크 모드(Dark Mode)로 전환 시, 표(Table)와 텍스트의 가독성이 훼손되지 않고 유지되는가?
    ◦ 파이프라인(Deal)의 칸반 보드에서 카드를 다른 스테이지로 이동할 때 UI가 지연 없이 즉각적으로(Optimistic) 변경되는가?
3. 비즈니스 로직:
    ◦ 리드(Lead) 생성 시 유효하지 않은 데이터(예: 이메일 형식 오류)를 입력했을 때 적절한 에러 폼 검증(Toast 알림)이 나타나는가?
    ◦ 수주 예정일(Estimated Close Date)이 과거로 설정될 경우 경고 표시가 나타나는가?
4. 산출물 검증:
    ◦ E2E 테스트 통과 후, 성공적인 작동을 증명하는 스크린샷 및 브라우저 녹화물(Walkthrough Artifact)이 정상적으로 생성 및 첨부되었는가?