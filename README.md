# Vibe Capturer

> 음성 입력을 통해 파편화된 생각을 Obsidian용 마크다운 노트로 변환해주는 개인 지식 관리 비서

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 기능

- 🎤 **실시간 음성 인식** - Web Speech API 기반 한국어 음성→텍스트 변환
- 🤖 **AI 자동 분류** - Google Gemini가 영업/마라톤/아이디어로 자동 카테고리 분류
- 📝 **마크다운 생성** - Obsidian 호환 마크다운 자동 생성 (frontmatter 포함)
- 💾 **다양한 내보내기** - Obsidian 직접 저장, 클립보드 복사, 파일 다운로드

## 🚀 빠른 시작

### 1. Google Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. "Get API Key" 클릭 (무료)
3. API 키 복사

### 2. 앱 실행

- **온라인**: [https://[your-username].github.io/vibe-capturer/](https://your-username.github.io/vibe-capturer/)
- **로컬**: `index.html` 파일을 Chrome으로 열기

### 3. 설정

1. 설정 버튼(⚙️) 클릭
2. API 키 입력
3. Obsidian 볼트 폴더 선택
4. 저장

### 4. 사용

1. 마이크 버튼 클릭
2. 생각을 자유롭게 말하기
3. 중지 버튼 클릭
4. AI가 자동으로 분류 및 마크다운 생성
5. "Obsidian에 저장" 클릭

## 📱 모바일 지원

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ 반응형 디자인
- ✅ 터치 최적화

## 🛠️ 기술 스택

- **음성 인식**: Web Speech API
- **AI 처리**: Google Gemini API
- **파일 저장**: File System Access API
- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript

## 📖 문서

- [빠른 시작 가이드](QUICKSTART.md)
- [모바일 테스트 가이드](MOBILE-TEST.md)
- [배포 가이드](DEPLOY.md)

## 🎯 카테고리별 추출 정보

### 영업
업체명, 담당자, 요청사항, 마감일, 후속 조치

### 마라톤
날짜/시간, 거리, 페이스, 컨디션, 통증/부상, 목표

### 아이디어
주제, 핵심 인사이트, 관련 분야, 실행 가능성

## 🌐 브라우저 호환성

| 브라우저 | 음성 인식 | 파일 저장 | 전체 기능 |
|---------|----------|----------|----------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari | ⚠️ | ❌ | ⚠️ |
| Firefox | ❌ | ❌ | ❌ |

**권장**: Google Chrome

## 🔒 개인정보 보호

- API 키는 브라우저 로컬 스토리지에만 저장
- 음성 데이터는 Google 서버로 전송 (Web Speech API)
- 텍스트 데이터는 Gemini API로 전송
- 외부 서버에 데이터 저장 없음

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여

이슈와 PR을 환영합니다!

## 💬 지원

문제가 발생하면 [Issues](https://github.com/[your-username]/vibe-capturer/issues)에 등록해주세요.

---

**Made with ❤️ for personal knowledge management**
