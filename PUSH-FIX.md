# 🚨 GitHub 푸시 실패 해결 가이드

## 문제 진단

원격 저장소(remote)가 설정되지 않았습니다. GitHub 저장소를 먼저 생성해야 합니다.

---

## ✅ 해결 방법 (3단계)

### 1단계: GitHub 저장소 생성 (2분)

1. **브라우저에서 GitHub 접속**
   ```
   https://github.com/new
   ```

2. **저장소 정보 입력**
   - Repository name: `vibe-capturer`
   - Description: `음성 메모를 Obsidian 마크다운으로 변환`
   - **Public** 선택 ✓
   - ❌ **Add a README file** (체크 해제)
   - ❌ **Add .gitignore** (체크 해제)
   - ❌ **Choose a license** (선택 안 함)

3. **Create repository** 클릭

---

### 2단계: 원격 저장소 연결

GitHub가 보여주는 페이지에서 본인의 **사용자명**을 확인하세요.

**PowerShell 또는 명령 프롬프트에서 실행:**

```bash
cd "L:\obsidian auto\vibe-capturer"
git remote add origin https://github.com/kanghyunmo-lab/vibe-capturer.git
```

**예시:**
```bash
git remote add origin https://github.com/johndoe/vibe-capturer.git
```

> 💡 `[YOUR-USERNAME]`을 본인의 GitHub 사용자명으로 바꾸세요!

---

### 3단계: 푸시 실행

```bash
git branch -M main
git push -u origin main
```

**인증 요청 시:**
- Username: GitHub 사용자명 입력
- Password: GitHub 비밀번호 또는 Personal Access Token 입력

---

## 🔐 인증 문제 해결

### Personal Access Token 생성 (비밀번호 대신 사용)

GitHub는 보안을 위해 비밀번호 대신 Token 사용을 권장합니다.

1. **GitHub 접속**
   ```
   https://github.com/settings/tokens
   ```

2. **Generate new token (classic)** 클릭

3. **설정**
   - Note: `vibe-capturer-deploy`
   - Expiration: `90 days`
   - **repo** 체크 ✓

4. **Generate token** 클릭

5. **토큰 복사** (한 번만 표시됨!)

6. **푸시 시 비밀번호 대신 토큰 입력**

---

## 📋 전체 명령어 요약

```bash
# 1. 폴더로 이동
cd "L:\obsidian auto\vibe-capturer"

# 2. 원격 저장소 연결 (YOUR-USERNAME 변경 필수!)
git remote add origin https://github.com/kanghyunmo-lab/vibe-capturer.git

# 3. 브랜치 이름 변경
git branch -M main

# 4. 푸시
git push -u origin main
```

---

## ✅ 성공 확인

푸시가 성공하면 다음과 같은 메시지가 표시됩니다:

```
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (11/11), done.
Writing objects: 100% (13/13), 35.42 KiB | 5.06 MiB/s, done.
Total 13 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/[YOUR-USERNAME]/vibe-capturer.git
 * [new branch]      main -> main
```

---

## 🌐 다음 단계: GitHub Pages 활성화

푸시가 성공하면:

1. **GitHub 저장소 페이지로 이동**
   ```
   https://github.com/[YOUR-USERNAME]/vibe-capturer
   ```

2. **Settings** 탭 클릭

3. **Pages** 메뉴 클릭

4. **Source 설정**
   - Branch: **main** 선택
   - Folder: **/ (root)** 선택
   - **Save** 클릭

5. **5분 대기 후 접속**
   ```
   https://kanghyunmo-lab.github.io/vibe-capturer/
   ```

---

## ❓ 여전히 문제가 있나요?

### 오류 메시지를 확인하세요

오류 메시지를 복사해서 알려주시면 정확한 해결 방법을 안내해드리겠습니다!

**일반적인 오류:**

1. **"remote origin already exists"**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/[YOUR-USERNAME]/vibe-capturer.git
   ```

2. **"Permission denied"**
   - Personal Access Token 생성 필요 (위 참조)

3. **"Repository not found"**
   - GitHub 저장소 이름 확인
   - 사용자명 확인

---

## 💡 빠른 도움말

막히는 부분이 있으면:
1. 오류 메시지 전체 복사
2. 어느 단계에서 막혔는지 알려주세요
3. 즉시 도와드리겠습니다!
