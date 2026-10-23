# 게시판 Supabase 설정

1. Supabase에서 새 프로젝트를 만들고, **SQL Editor**에 `supabase/migrations/20261023_create_board.sql` 전체를 붙여 실행합니다.
2. Authentication의 Email 설정에서 관리자에게 쓸 이메일 로그인 방식을 켭니다. 관리자 계정을 한 개 만듭니다.
3. SQL Editor에서 아래의 `관리자 이메일`만 실제 이메일로 바꿔 실행합니다.
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = '관리자 이메일');
   ```
4. Project Settings → API에서 Project URL과 **anon 또는 publishable key**를 확인합니다. 서비스 역할(service_role) 키는 절대 사이트나 Vercel에 넣지 않습니다.
5. 로컬은 `.env.local`, Vercel은 Project Settings → Environment Variables에 아래 이름으로 각각 등록합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Vercel에서 새 배포를 실행합니다. 환경 변수는 빌드 때 포함되므로 등록 뒤에는 반드시 재배포해야 합니다.

## 게시글 등록

배포 주소의 `/admin/`에서 Supabase 관리자 이메일과 비밀번호로 로그인합니다. 공지사항과 자료실을 선택해 제목·본문을 등록하고, 자료실에는 필요할 때만 외부 링크를 넣습니다. 파일 업로드 기능은 포함하지 않습니다.

## 검수

- 로그아웃 상태에서 `/notices/`, `/resources/`의 공개 글만 보이는지 확인합니다.
- 비공개 글은 관리자 로그인 상태에서만 보이는지 확인합니다.
- 일반 계정 또는 로그인하지 않은 상태에서 등록·수정·삭제 API가 거부되는지 확인합니다. 이는 화면 버튼 숨김과 별개로 RLS가 처리합니다.
