@echo off
chcp 65001 > nul
echo ========================================
echo   Vibe Capturer - GitHub 배포 도구
echo ========================================
echo.

REM Git이 설치되어 있는지 확인
git --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Git이 설치되어 있지 않습니다.
    echo.
    echo Git을 설치하려면:
    echo 1. https://git-scm.com/download/win 방문
    echo 2. Git 다운로드 및 설치
    echo 3. 이 스크립트를 다시 실행하세요.
    echo.
    pause
    exit /b 1
)

echo ✅ Git이 설치되어 있습니다.
echo.

REM 이미 Git 저장소인지 확인
if exist ".git" (
    echo 📦 기존 Git 저장소 발견
    echo.
    echo 변경사항을 커밋하고 푸시합니다...
    echo.
    
    git add .
    git commit -m "Update: %date% %time%"
    git push origin main
    
    if errorlevel 1 (
        echo.
        echo ⚠️  푸시 실패. 원격 저장소를 확인하세요.
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ 배포 완료!
    echo.
    echo 🌐 GitHub Pages에서 확인하세요:
    echo    https://[your-username].github.io/vibe-capturer/
    echo.
    echo 💡 변경사항이 반영되려면 1-2분 정도 걸립니다.
    echo.
    pause
    exit /b 0
)

echo 📝 새 Git 저장소를 초기화합니다...
echo.

REM Git 초기화
git init
git add .
git commit -m "Initial commit: Vibe Capturer MVP"

echo.
echo ========================================
echo   GitHub 저장소 설정 안내
echo ========================================
echo.
echo 다음 단계를 따라주세요:
echo.
echo 1. GitHub에 로그인하세요
echo    https://github.com
echo.
echo 2. 새 저장소를 만드세요:
echo    - Repository name: vibe-capturer
echo    - Public 선택
echo    - README, .gitignore 추가하지 마세요
echo.
echo 3. 저장소가 생성되면 아래 명령어를 실행하세요:
echo.
echo    git remote add origin https://github.com/[your-username]/vibe-capturer.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. GitHub 저장소 Settings → Pages에서:
echo    - Source: Deploy from a branch
echo    - Branch: main → /root
echo    - Save 클릭
echo.
echo 5. 5분 후 다음 주소로 접속:
echo    https://[your-username].github.io/vibe-capturer/
echo.
echo ========================================
echo.
echo 💡 위 명령어를 복사해서 실행하세요!
echo.
pause
