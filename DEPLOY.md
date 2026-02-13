# Vibe Capturer - GitHub 배포 가이드

## 🚀 첫 배포 (5분)

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com) 로그인
2. 우측 상단 **+** → **New repository** 클릭
3. 저장소 설정:
   - **Repository name**: `vibe-capturer`
   - **Public** 선택
   - ❌ **README, .gitignore 추가하지 마세요**
4. **Create repository** 클릭

### 2단계: 로컬에서 배포

프로젝트 폴더에서 `deploy.bat` 실행:

```bash
L:\obsidian auto\vibe-capturer\deploy.bat
```

스크립트가 안내하는 대로 다음 명령어를 실행하세요:

```bash
git remote add origin https://github.com/[your-username]/vibe-capturer.git
git branch -M main
git push -u origin main
```

> 💡 `[your-username]`을 본인의 GitHub 사용자명으로 바꾸세요!

### 3단계: GitHub Pages 활성화

1. GitHub 저장소 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. Source 설정:
   - **Source**: Deploy from a branch
   - **Branch**: `main` → `/root`
   - **Save** 클릭

### 4단계: 배포 완료! 🎉

5분 후 다음 주소로 접속:

```
https://[your-username].github.io/vibe-capturer/
```

---

## 🔄 수정 후 재배포 (30초)

코드를 수정한 후:

1. `deploy.bat` 실행
2. 자동으로 커밋 & 푸시
3. 1-2분 후 변경사항 반영

**정말 간단합니다!** 😊

---

## 📝 수정-배포 워크플로우

### 일반적인 작업 흐름:

```mermaid
graph LR
    A[코드 수정] --> B[deploy.bat 실행]
    B --> C[자동 커밋 & 푸시]
    C --> D[GitHub Pages 자동 배포]
    D --> E[1-2분 후 반영]
```

### 예시:

1. **VS Code나 메모장에서 코드 수정**
   - 예: `app.js`에서 버튼 색상 변경
   - 예: `styles.css`에서 폰트 크기 조정

2. **파일 저장** (Ctrl+S)

3. **deploy.bat 더블클릭**
   - 자동으로 Git에 커밋
   - 자동으로 GitHub에 푸시

4. **1-2분 대기**
   - GitHub Pages가 자동으로 재배포

5. **브라우저 새로고침**
   - 변경사항 확인!

---

## 🛠️ 고급 사용법

### 커밋 메시지 커스터마이징

`deploy.bat`를 수정하여 커밋 메시지를 변경할 수 있습니다:

```batch
git commit -m "Update: %date% %time%"
```

→

```batch
git commit -m "Fix: 음성 인식 버그 수정"
```

### 변경사항 확인

배포 전에 무엇이 변경되었는지 확인:

```bash
git status
git diff
```

### 특정 파일만 배포

```bash
git add app.js
git commit -m "Update: AI 프롬프트 개선"
git push
```

---

## ❓ 문제 해결

### "Git이 설치되어 있지 않습니다"

1. [Git 다운로드](https://git-scm.com/download/win)
2. 설치 후 컴퓨터 재시작
3. `deploy.bat` 다시 실행

### "remote origin already exists"

이미 원격 저장소가 설정되어 있습니다. 다음 명령어로 확인:

```bash
git remote -v
```

변경하려면:

```bash
git remote set-url origin https://github.com/[new-username]/vibe-capturer.git
```

### "Permission denied"

GitHub 인증이 필요합니다:

1. GitHub 사용자명과 비밀번호 입력
2. 또는 [Personal Access Token](https://github.com/settings/tokens) 생성

### 변경사항이 반영되지 않음

1. **GitHub Actions 확인**:
   - 저장소 → Actions 탭
   - 배포 상태 확인

2. **캐시 삭제**:
   - 브라우저에서 Ctrl+Shift+R (강력 새로고침)

3. **시간 대기**:
   - GitHub Pages는 1-2분 소요

---

## 💡 팁

### 빠른 테스트 워크플로우

1. **로컬에서 먼저 테스트**:
   - `index.html`을 Chrome으로 열기
   - 변경사항 확인

2. **만족하면 배포**:
   - `deploy.bat` 실행

3. **모바일에서 확인**:
   - HTTPS 주소로 접속

### 버전 관리

중요한 변경사항 전에 태그 생성:

```bash
git tag -a v1.0 -m "First stable release"
git push origin v1.0
```

---

## 🎯 다음 단계

배포가 완료되면:

1. ✅ 모바일에서 테스트
2. ✅ 친구들과 공유
3. ✅ 피드백 수집
4. ✅ 개선사항 반영
5. ✅ `deploy.bat`로 재배포

**즐거운 개발 되세요!** 🚀
