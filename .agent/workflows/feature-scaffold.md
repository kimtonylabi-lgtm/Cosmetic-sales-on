---
description:  CRM의 새로운 기능 모듈(DB, Server Action, UI)을 풀스택으로 생성합니다.
---

1. **요구사항 분석 및 스키마 설계**:
   - 사용자가 요청한 기능에 필요한 Prisma 모델 스키마를 `prisma/schema.prisma`에 추가합니다.
   - 변경된 스키마를 기반으로 `npx prisma format`을 실행합니다. // turbo

2. **비즈니스 로직(Server Actions) 구현**:
   - `src/features/[기능명]/actions.ts` 파일을 생성하고 데이터 CRUD를 위한 Server Action을 구현합니다.
   - 모든 에러는 `try-catch`로 감싸고 중앙 로거를 사용해 처리합니다.

3. **UI 컴포넌트 구현 (Next.js App Router)**:
   - `src/features/[기능명]/components/`에 서버 컴포넌트와 클라이언트 컴포넌트를 분리하여 작성합니다.
   - Shadcn/UI와 Tailwind CSS를 사용하여 디자인 시스템에 맞게 스타일링합니다.

4. **검증 및 리뷰 요청**:
   - 코드를 작성한 후, 구현된 파일 목록과 논리적 흐름을 설명하는 `Implementation Plan` 아티팩트를 생성하고 사용자의 검토를 요청합니다.