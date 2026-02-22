---
description: 변경된(Staged) 코드를 분석하여 프로젝트 규칙에 맞는 명확한 시맨틱 커밋(Semantic Commit)을 생성합니다.
---

1. **Diff 분석**:
   - 터미널에서 `git diff --cached`를 실행하여 스테이징된 변경 사항을 분석합니다. // turbo

2. **커밋 메시지 초안 작성**:
   - 다음 Conventional Commits 규격을 엄격히 따릅니다:
     - `feat(domain):` 새로운 기능 추가
     - `fix(domain):` 버그 수정
     - `refactor(domain):` 기능 변화 없는 코드 구조 개선
   - 제목은 50자 이내의 명령문(예: "add lead scoring engine")으로 작성합니다.
   - 본문에는 *무엇을(What)* 했는지가 아니라 **왜(Why)** 이 변경을 했는지 비즈니스 로직 관점에서 영어로 서술합니다.

3. **사용자 확인 및 실행**:
   - 작성된 커밋 메시지를 사용자에게 보여주고 승인을 요청합니다.
   - 사용자가 승인하면 `git commit -m "메시지"` 명령을 실행합니다.
