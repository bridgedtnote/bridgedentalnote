# 브릿지덴탈노트 — GitHub / Vercel 배포용 소스

기존 홈페이지의 8개 페이지, 원본 로고, 디자인과 반응형 동작이 포함되어 있습니다.
샘플 신청과 도입 문의는 실제 전송·저장 기능이 없는 목업입니다.

## GitHub에 올리기
1. ZIP 압축을 풉니다.
2. GitHub에서 새 저장소를 만듭니다.
3. 압축을 푼 폴더 안의 파일과 폴더를 업로드합니다.
4. 저장소 최상위에 package.json, package-lock.json, app 폴더가 있도록 합니다.
ZIP 파일 자체만 올리면 Vercel에서 소스를 빌드할 수 없습니다.

## Vercel에 배포하기
1. Vercel에서 새 프로젝트를 추가하고 위 GitHub 저장소를 연결합니다.
2. Framework Preset은 Next.js, Root Directory는 package.json이 있는 위치로 선택합니다.
3. Build Command: npm run build / Install Command: npm ci / Output Directory: out
4. Node.js는 22.13 이상을 사용합니다. 별도로 입력할 환경변수나 API 키는 없습니다.
5. Deploy를 실행합니다.

vercel.json에 빌드 설정이 포함되어 있습니다.
현재 설정은 Next.js 정적 내보내기(output: export)입니다.
npm run build를 실행하면 배포용 파일이 out 폴더에 생성됩니다.
GitHub는 이 안내에서 소스 저장소로 사용하며, GitHub Pages 배포 설정은 포함하지 않습니다.
Vercel 배포의 접근 범위는 Vercel에서 별도로 설정하세요. 기존 Sites 접근 설정은 이전되지 않습니다.

## 내 컴퓨터에서 확인하기
Node.js와 npm 설치 후 터미널에서 다음을 실행합니다.
```sh
npm ci
npm run dev
```
브라우저에서 http://localhost:3000 을 엽니다.
배포용 검사는 npm run build 로 실행합니다.

## 페이지
/ · /about · /products · /cases · /resources · /faq · /sample · /contact

## 주요 파일
- app/page.tsx: 홈
- app/info-page.tsx: 내부 페이지 콘텐츠
- app/site-shell.tsx: 공통 헤더·푸터·모바일 메뉴
- app/globals.css: 공통 디자인·반응형 스타일
- public/bridge-dental-note-logo.png: 원본 로고

원본 프로젝트의 패키지 버전과 잠금 파일을 유지했습니다.
기존 호스팅 설정, 인증정보, Git 기록, node_modules, 빌드 결과, 임시 파일은 제외했습니다.

참고 문서:
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://nextjs.org/docs/app/guides/static-exports
