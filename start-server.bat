@echo off
echo Vibe Capturer 로컬 서버 시작 중...
echo.
echo 모바일에서 접속하려면:
echo 1. PC와 모바일이 같은 Wi-Fi에 연결되어 있어야 합니다
echo 2. 모바일 Chrome에서 아래 주소로 접속하세요:
echo.
echo    http://[PC의 IP 주소]:8000
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.
python -m http.server 8000
