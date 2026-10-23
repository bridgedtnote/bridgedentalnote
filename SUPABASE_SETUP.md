# 게시판 관리자 설정

게시판은 Supabase Auth와 Row Level Security(RLS)를 사용합니다. 일반 방문자는 공개 글만 읽을 수 있고, 글 등록·수정·삭제는 `board_role: admin` 권한이 있는 계정만 가능합니다. 서비스 역할 키는 사이트에 사용하지 않습니다.

## 최초 설정

1. Supabase SQL Editor에서 `supabase/migrations/20261023_create_board.sql` 전체를 실행합니다.
2. Supabase Authentication에서 관리자용 이메일 계정을 만듭니다. 이메일/비밀번호 로그인은 기본으로 켜져 있습니다.
3. Supabase Dashboard의 Authentication → Users에서 만든 관리자를 열고 **App metadata**에 아래 내용을 추가합니다.
   ```json
   { "board_role": "admin" }
   ```
   User metadata가 아니라 반드시 **App metadata**에 넣습니다. 사용자가 직접 변경할 수 없는 권한 정보이기 때문입니다.
4. 관리자는 로그아웃 후 다시 로그인합니다. 새 JWT에 관리자 권한이 반영됩니다.
5. Vercel 환경 변수에 아래 두 값을 Preview와 Production 모두로 추가한 뒤 재배포합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase의 publishable/anon key

## 실제 공지 글 등록

1. 홈페이지의 `/admin/`으로 이동합니다.
2. 관리자 이메일과 비밀번호로 로그인합니다.
3. 공지사항 또는 자료실을 선택하고 제목·본문을 입력합니다.
4. 자료실에만 필요할 경우 외부 링크를 넣고, 공개 여부를 선택한 뒤 **등록**을 누릅니다.
5. 공지사항 또는 자료실 목록에서 제목을 눌러 공개 화면을 확인합니다.

## 확인 항목

- 비로그인 상태에서는 관리자 메뉴로 들어가도 글쓰기 화면이 보이지 않습니다.
- 비로그인 상태는 공개 글만 읽을 수 있습니다.
- 비공개 글은 관리자 로그인 상태에서만 관리 목록에서 보입니다.
- 일반 사용자나 비로그인 사용자가 Supabase API로 등록·수정·삭제를 요청해도 RLS 정책이 거부합니다.
