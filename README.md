# 복지온 사회복지 서비스 플랫폼

Firebase Authentication과 Cloud Firestore를 사용하는 정적 다중 페이지 웹사이트입니다.

## 페이지

- `index.html`: 홈
- `policies.html`: 복지정책 검색 및 분야별 필터
- `notices.html`: Firestore 실시간 공지사항 목록
- `login.html`: Firebase 이메일·비밀번호 로그인
- `admin.html`: 관리자 공지사항 등록

## Firebase 설정

1. Firebase 콘솔에서 프로젝트와 웹 앱을 생성합니다.
2. **Authentication > Sign-in method > Email/Password**를 활성화합니다.
3. Cloud Firestore 데이터베이스를 생성합니다.
4. 웹 앱 설정값을 `firebase-config.js`에 입력합니다.
5. `firestore.rules`를 Firestore 보안 규칙으로 배포합니다.
6. Authentication에서 관리자 사용자를 생성합니다.
7. Firestore에 `users/{관리자 UID}` 문서를 만들고 다음 내용을 입력합니다.

```json
{
  "role": "admin",
  "name": "관리자"
}
```

## 로컬 실행

ES Modules는 파일을 직접 열어 실행할 수 없습니다. 다음과 같이 정적 웹 서버를 사용하세요.

```bash
npx serve .
```

터미널에 표시된 로컬 주소를 브라우저에서 엽니다.

## Firebase Hosting 배포

이 폴더에서 Firebase CLI 로그인과 프로젝트 연결을 완료한 후 실행합니다.

```bash
firebase deploy
```
