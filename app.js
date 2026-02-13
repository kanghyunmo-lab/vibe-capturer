// ==================== 상태 관리 ====================
const state = {
    isRecording: false,
    recognition: null,
    transcribedText: '',
    startTime: null,
    timerInterval: null,
    apiKey: localStorage.getItem('gemini_api_key') || '',
    vaultPath: localStorage.getItem('vault_path') || 'L:\\obsidian auto\\',
    vaultHandle: null,
    currentMarkdown: '',
    currentCategory: ''
};

// ==================== DOM 요소 ====================
const elements = {
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    apiKeyInput: document.getElementById('apiKey'),
    vaultPathInput: document.getElementById('vaultPath'),
    selectVaultBtn: document.getElementById('selectVaultBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
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
    // 설정 불러오기
    if (state.apiKey) {
        elements.apiKeyInput.value = state.apiKey;
    }
    elements.vaultPathInput.value = state.vaultPath;
    
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
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    
    // 이벤트 리스너 설정
    setupEventListeners();
}

// ==================== 이벤트 리스너 ====================
function setupEventListeners() {
    // 설정 패널
    elements.settingsBtn.addEventListener('click', toggleSettings);
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    elements.selectVaultBtn.addEventListener('click', selectVaultFolder);
    
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

// ==================== 설정 관리 ====================
function toggleSettings() {
    elements.settingsPanel.classList.toggle('active');
}

function saveSettings() {
    state.apiKey = elements.apiKeyInput.value.trim();
    state.vaultPath = elements.vaultPathInput.value.trim();
    
    localStorage.setItem('gemini_api_key', state.apiKey);
    localStorage.setItem('vault_path', state.vaultPath);
    
    showToast('설정이 저장되었습니다.', 'success');
    elements.settingsPanel.classList.remove('active');
}

async function selectVaultFolder() {
    try {
        // File System Access API 사용
        if ('showDirectoryPicker' in window) {
            const dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            state.vaultHandle = dirHandle;
            elements.vaultPathInput.value = dirHandle.name;
            showToast('폴더가 선택되었습니다.', 'success');
        } else {
            showToast('이 브라우저는 폴더 선택을 지원하지 않습니다.', 'error');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('폴더 선택 오류:', error);
            showToast('폴더 선택 중 오류가 발생했습니다.', 'error');
        }
    }
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
    // API 키 확인
    if (!state.apiKey) {
        showToast('먼저 설정에서 API 키를 입력해주세요.', 'error');
        elements.settingsPanel.classList.add('active');
        return;
    }
    
    state.isRecording = true;
    state.transcribedText = '';
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
        state.recognition.start();
    } catch (error) {
        console.error('음성 인식 시작 오류:', error);
        showToast('음성 인식을 시작할 수 없습니다.', 'error');
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
    state.recognition.stop();
    
    // AI 처리 시작
    if (state.transcribedText.trim()) {
        processWithAI(state.transcribedText);
    } else {
        showToast('녹음된 내용이 없습니다.', 'error');
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
    }
    
    // 실시간 표시
    const textElement = elements.transcriptionBox.querySelector('.text');
    if (textElement) {
        textElement.textContent = state.transcribedText + interimTranscript;
    }
}

function handleSpeechError(event) {
    console.error('음성 인식 오류:', event.error);
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
        showToast(`음성 인식 오류: ${event.error}`, 'error');
    }
}

function handleSpeechEnd() {
    if (state.isRecording) {
        // 자동으로 재시작 (연속 녹음)
        try {
            state.recognition.start();
        } catch (error) {
            console.error('음성 인식 재시작 오류:', error);
        }
    }
}

// ==================== AI 처리 ====================
async function processWithAI(text) {
    elements.processingIndicator.classList.add('active');
    
    try {
        const result = await callGeminiAPI(text);
        state.currentMarkdown = result.markdown;
        state.currentCategory = result.category;
        
        displayMarkdownPreview(result.markdown, result.category);
        elements.processingIndicator.classList.remove('active');
        showToast('AI 처리가 완료되었습니다.', 'success');
    } catch (error) {
        console.error('AI 처리 오류:', error);
        elements.processingIndicator.classList.remove('active');
        showToast('AI 처리 중 오류가 발생했습니다: ' + error.message, 'error');
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiKey}`, {
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
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API 호출 실패');
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
        '아이디어': 'idea'
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
            showToast('먼저 설정에서 Obsidian 볼트 폴더를 선택해주세요.', 'error');
            elements.settingsPanel.classList.add('active');
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
