// ==================== 설정 ====================
// 🎤 음성을 텍스트로 변환하는 간단한 버전 (AI 없음)
const VAULT_PATH = 'L:\\obsidian auto\\';

// ==================== 상태 관리 ====================
const state = {
    isRecording: false,
    recognition: null,
    transcribedText: '',
    interimText: '',
    startTime: null,
    timerInterval: null,
    vaultHandle: null,
    currentMarkdown: '',
    currentCategory: '',
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

// ==================== DOM 요소 ====================
const elements = {
    recordBtn: document.getElementById('recordBtn'),
    visualizer: document.getElementById('visualizer'),
    recordingStatus: document.getElementById('recordingStatus'),
    timer: document.getElementById('timer'),
    transcriptionBox: document.getElementById('transcriptionBox'),
    processingIndicator: document.getElementById('processingIndicator'),
    previewSection: document.getElementById('previewSection'),
    categoryBadge: document.getElementById('categoryBadge'),
    markdownPreview: document.getElementById('markdownPreview'),
    saveToObsidianBtn: document.getElementById('saveToObsidianBtn'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    toast: document.getElementById('toast'),
    micIcon: document.querySelector('.mic-icon'),
    stopIcon: document.querySelector('.stop-icon')
};

// ==================== 초기화 ====================
function init() {

    // Web Speech API 지원 확인
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.', 'error');
        elements.recordBtn.disabled = true;
        return;
    }

    // Speech Recognition 초기화
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    state.recognition.lang = 'ko-KR';
    // 모바일에서는 continuous 모드 비활성화 (안정성 향상)
    state.recognition.continuous = !state.isMobile;
    state.recognition.interimResults = true;

    console.log('초기화 완료 - 모바일:', state.isMobile, 'Continuous:', state.recognition.continuous);

    // 이벤트 리스너 설정
    setupEventListeners();
}

// ==================== 이벤트 리스너 ====================
function setupEventListeners() {
    // 녹음
    elements.recordBtn.addEventListener('click', toggleRecording);

    // Speech Recognition 이벤트
    state.recognition.onresult = handleSpeechResult;
    state.recognition.onerror = handleSpeechError;
    state.recognition.onend = handleSpeechEnd;

    // 내보내기
    elements.saveToObsidianBtn.addEventListener('click', saveToObsidian);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.downloadBtn.addEventListener('click', downloadMarkdown);
}



// ==================== 녹음 관리 ====================
function toggleRecording() {
    if (state.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {

    state.isRecording = true;
    state.transcribedText = '';
    state.interimText = '';
    state.startTime = Date.now();

    // UI 업데이트
    elements.recordBtn.classList.add('recording');
    elements.visualizer.classList.add('recording');
    elements.micIcon.style.display = 'none';
    elements.stopIcon.style.display = 'block';
    elements.recordingStatus.textContent = '녹음 중...';
    elements.recordingStatus.classList.add('active');
    elements.transcriptionBox.innerHTML = '<p class="text"></p>';
    elements.previewSection.classList.remove('active');

    // 타이머 시작
    startTimer();

    // 음성 인식 시작
    try {
        console.log('음성 인식 시작...');
        state.recognition.start();
    } catch (error) {
        console.error('음성 인식 시작 오류:', error);
        showToast('음성 인식을 시작할 수 없습니다: ' + error.message, 'error');
        stopRecording();
    }
}

function stopRecording() {
    state.isRecording = false;

    // UI 업데이트
    elements.recordBtn.classList.remove('recording');
    elements.visualizer.classList.remove('recording');
    elements.micIcon.style.display = 'block';
    elements.stopIcon.style.display = 'none';
    elements.recordingStatus.textContent = '녹음 완료';
    elements.recordingStatus.classList.remove('active');

    // 타이머 중지
    stopTimer();

    // 음성 인식 중지
    try {
        state.recognition.stop();
    } catch (error) {
        console.error('음성 인식 중지 오류:', error);
    }

    // 마지막 interim 텍스트도 포함 (모바일 대응)
    const finalText = (state.transcribedText + ' ' + state.interimText).trim();

    console.log('녹음 중지 - 최종 텍스트:', finalText);
    console.log('- transcribedText:', state.transcribedText);
    console.log('- interimText:', state.interimText);

    // 간단한 마크다운 생성 (AI 없이)
    if (finalText) {
        createSimpleMarkdown(finalText);
    } else {
        showToast('녹음된 내용이 없습니다. 다시 시도해주세요.', 'error');
        console.warn('녹음된 텍스트가 비어있습니다.');
    }
}

// ==================== 타이머 ====================
function startTimer() {
    state.timerInterval = setInterval(() => {
        const elapsed = Date.now() - state.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        elements.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 100);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

// ==================== 음성 인식 처리 ====================
function handleSpeechResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
        } else {
            interimTranscript += transcript;
        }
    }

    if (finalTranscript) {
        state.transcribedText += finalTranscript;
        console.log('최종 텍스트 추가:', finalTranscript);
    }

    // interim 텍스트 저장 (모바일에서 final로 전환 안 될 수 있음)
    state.interimText = interimTranscript;

    // 실시간 표시
    const textElement = elements.transcriptionBox.querySelector('.text');
    if (textElement) {
        textElement.textContent = state.transcribedText + interimTranscript;
    }
}

function handleSpeechError(event) {
    console.error('음성 인식 오류:', event.error, event);

    const errorMessages = {
        'no-speech': '음성이 감지되지 않았습니다. 다시 시도해주세요.',
        'audio-capture': '마이크에 접근할 수 없습니다. 권한을 확인해주세요.',
        'not-allowed': '마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.',
        'network': '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
        'aborted': '음성 인식이 중단되었습니다.'
    };

    const message = errorMessages[event.error] || `음성 인식 오류: ${event.error}`;

    // aborted는 정상적인 중지이므로 표시하지 않음
    if (event.error !== 'aborted') {
        showToast(message, 'error');
    }
}

function handleSpeechEnd() {
    console.log('음성 인식 종료 - isRecording:', state.isRecording);

    if (state.isRecording) {
        // 연속 모드에서만 자동 재시작
        if (state.recognition.continuous) {
            try {
                console.log('음성 인식 재시작...');
                state.recognition.start();
            } catch (error) {
                console.error('음성 인식 재시작 오류:', error);
            }
        }
    }
}

// ==================== AI 처리 ====================
async function processWithAI(text) {
    console.log('AI 처리 시작 - 텍스트 길이:', text.length);
    elements.processingIndicator.classList.add('active');
    elements.recordingStatus.textContent = 'AI 처리 중...';
    elements.recordingStatus.classList.add('active');

    try {
        const result = await callGeminiAPI(text);
        state.currentMarkdown = result.markdown;
        state.currentCategory = result.category;

        console.log('AI 처리 완료 - 카테고리:', result.category);
        displayMarkdownPreview(result.markdown, result.category);
        elements.processingIndicator.classList.remove('active');
        elements.recordingStatus.classList.remove('active');
        showToast('AI 처리가 완료되었습니다! ✨', 'success');
    } catch (error) {
        console.error('AI 처리 오류:', error);
        elements.processingIndicator.classList.remove('active');
        elements.recordingStatus.classList.remove('active');

        let errorMessage = 'AI 처리 중 오류가 발생했습니다.';
        let detailedError = error.message || '알 수 없는 오류';

        if (error.message.includes('API key')) {
            errorMessage = 'API 키가 유효하지 않습니다.';
            detailedError += '\n\n개발자에게 문의하세요.';
        } else if (error.message.includes('quota') || error.message.includes('429')) {
            errorMessage = 'API 할당량이 초과되었습니다.';
            detailedError += '\n\n해결방법:\n1. 잠시 후 다시 시도\n2. 새 API 키 발급';
        } else if (error.message.includes('400')) {
            errorMessage = 'API 요청 형식 오류';
            detailedError += '\n\n모델명이나 요청 형식에 문제가 있을 수 있습니다.';
        } else if (error.message.includes('403')) {
            errorMessage = 'API 키 권한 오류';
            detailedError += '\n\n해결방법:\n1. API 키가 활성화되었는지 확인\n2. Gemini API가 활성화되었는지 확인';
        }

        // 화면에 상세 오류 표시
        alert(`${errorMessage}\n\n상세 오류:\n${detailedError}`);
        showToast(errorMessage, 'error');
    }
}

async function callGeminiAPI(text) {
    const prompt = `다음 음성 메모를 분석하여 카테고리를 분류하고 Obsidian 호환 마크다운으로 변환해주세요.

카테고리:
- 영업: 업체명, 담당자, 요청사항, 마감일 등이 포함된 내용
- 마라톤: 훈련 거리, 페이스, 컨디션, 통증 등이 포함된 내용
- 아이디어: 비즈니스 인사이트, 철학적 사유, 새로운 아이디어 등

음성 메모:
${text}

다음 JSON 형식으로 응답해주세요:
{
  "category": "영업" | "마라톤" | "아이디어",
  "title": "자동 생성된 제목",
  "markdown": "완전한 마크다운 문서 (frontmatter 포함)"
}

마크다운 형식:
---
category: [카테고리]
created: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}
---

# [제목]

## 원본 내용
[음성 변환 원문]

## 구조화된 정보
[카테고리별 추출된 정보를 구조화]

## 메모
[추가 컨텍스트나 인사이트]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('API 응답 오류:', response.status, errorData);
        throw new Error(errorMsg);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;

    // JSON 추출 (```json ... ``` 형식일 수 있음)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }

    const result = JSON.parse(jsonText);
    return result;
}

// ==================== 마크다운 미리보기 ====================
function displayMarkdownPreview(markdown, category) {
    // 카테고리 배지
    const categoryMap = {
        '영업': 'sales',
        '마라톤': 'marathon',
        '아이디어': 'idea',
        '메모': 'note'
    };

    const categoryClass = categoryMap[category] || 'idea';
    elements.categoryBadge.textContent = category;
    elements.categoryBadge.className = `category-badge ${categoryClass}`;

    // 마크다운 표시
    elements.markdownPreview.innerHTML = `<pre>${escapeHtml(markdown)}</pre>`;

    // 섹션 표시
    elements.previewSection.classList.add('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 내보내기 ====================
async function saveToObsidian() {
    if (!state.currentMarkdown) {
        showToast('저장할 내용이 없습니다.', 'error');
        return;
    }

    try {
        // File System Access API 사용
        if (!state.vaultHandle) {
            showToast('먼저 Obsidian 볼트 폴더를 선택해주세요.', 'error');
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `vibe-${timestamp}.md`;

        const fileHandle = await state.vaultHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(state.currentMarkdown);
        await writable.close();

        showToast(`Obsidian에 저장되었습니다: ${filename}`, 'success');
    } catch (error) {
        console.error('파일 저장 오류:', error);
        showToast('파일 저장 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

async function copyToClipboard() {
    if (!state.currentMarkdown) {
        showToast('복사할 내용이 없습니다.', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(state.currentMarkdown);
        showToast('클립보드에 복사되었습니다.', 'success');
    } catch (error) {
        console.error('클립보드 복사 오류:', error);
        showToast('클립보드 복사 중 오류가 발생했습니다.', 'error');
    }
}

function downloadMarkdown() {
    if (!state.currentMarkdown) {
        showToast('다운로드할 내용이 없습니다.', 'error');
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `vibe-${timestamp}.md`;

    const blob = new Blob([state.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('파일이 다운로드되었습니다.', 'success');
}

// ==================== 토스트 알림 ====================
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type} show`;

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ==================== 앱 시작 ====================
document.addEventListener('DOMContentLoaded', init);
