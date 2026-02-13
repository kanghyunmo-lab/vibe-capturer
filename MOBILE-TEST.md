# 📱 모바일 테스트 가이드

## 방법 1: 로컬 서버로 공유 (추천) ⭐

### 1단계: PC에서 서버 시작

1. `start-server.bat` 파일을 더블클릭
2. 명령 프롬프트 창이 열리면서 서버가 시작됩니다
3. PC의 IP 주소를 확인하세요

### 2단계: PC IP 주소 확인

명령 프롬프트에서:
```bash
ipconfig
```

**IPv4 주소**를 찾으세요 (예: `192.168.0.100`)

### 3단계: 모바일에서 접속

1. **PC와 모바일이 같은 Wi-Fi에 연결**되어 있어야 합니다
2. 모바일 Chrome 브라우저 열기
3. 주소창에 입력:
   ```
   http://[PC의 IP 주소]:8000
   ```
   예: `http://192.168.0.100:8000`

4. Vibe Capturer가 열립니다! 🎉

### 주의사항

- ⚠️ **HTTPS가 아니므로** 일부 기능(마이크, 파일 저장)이 제한될 수 있습니다
- ✅ 음성 인식은 작동합니다
- ⚠️ File System Access API는 HTTPS에서만 작동 (클립보드 복사, 다운로드는 가능)

---

## 방법 2: GitHub Pages로 배포 (완전한 기능)

HTTPS가 필요한 모든 기능을 사용하려면 GitHub Pages에 배포하세요:

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com) 로그인
2. "New repository" 클릭
3. 저장소 이름: `vibe-capturer`
4. Public으로 설정
5. "Create repository" 클릭

### 2단계: 파일 업로드

1. 저장소 페이지에서 "uploading an existing file" 클릭
2. 다음 파일들을 드래그 앤 드롭:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. "Commit changes" 클릭

### 3단계: GitHub Pages 활성화

1. 저장소 Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` → `/root`
4. Save

### 4단계: 모바일에서 접속

5분 후 다음 주소로 접속:
```
https://[your-username].github.io/vibe-capturer/
```

이제 모든 기능이 완벽하게 작동합니다! ✨

---

## 방법 3: 파일 직접 전송 (간단하지만 제한적)

1. `vibe-capturer` 폴더를 압축
2. 모바일로 전송 (이메일, 클라우드 등)
3. 모바일에서 압축 해제
4. `index.html` 파일을 Chrome으로 열기

⚠️ **제한사항**: 파일 시스템 접근 불가, 일부 기능 제한

---

## 🎯 모바일 최적화 확인 사항

제가 이미 구현한 모바일 최적화:

✅ **터치 친화적 버튼** - 큰 터치 영역
✅ **반응형 레이아웃** - 세로 모드 최적화
✅ **모바일 폰트 크기** - 가독성 향상
✅ **제스처 지원** - 스와이프, 탭 등

---

## 💡 추천 방법

**빠른 테스트**: 방법 1 (로컬 서버)
**완전한 기능**: 방법 2 (GitHub Pages)

어떤 방법을 선호하시나요?
