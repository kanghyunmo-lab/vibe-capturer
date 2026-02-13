const API_KEY = 'AIzaSyDjeivNn-fOTFQGrfCL02nkRWekAJcX8QM';

async function testGeminiAPI() {
    console.log('=== Gemini API 테스트 시작 ===\n');

    // 테스트할 모델 목록
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp'
    ];

    const apiVersions = ['v1beta', 'v1'];

    for (const version of apiVersions) {
        console.log(`\n📍 API 버전: ${version}`);
        console.log('='.repeat(50));

        for (const model of modelsToTest) {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;

            try {
                console.log(`\n🧪 테스트 중: ${model}`);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: '안녕하세요'
                            }]
                        }]
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답 없음';
                    console.log(`✅ 성공! ${version}/${model}`);
                    console.log(`   응답: ${responseText.substring(0, 50)}...`);
                    console.log(`   → 이 모델을 사용하세요!`);
                } else {
                    console.log(`❌ 실패: ${response.status} ${response.statusText}`);
                    console.log(`   오류: ${data.error?.message || JSON.stringify(data)}`);
                }

            } catch (error) {
                console.log(`❌ 네트워크 오류: ${error.message}`);
            }

            // API 호출 제한 방지를 위한 지연
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('\n\n=== 테스트 완료 ===');
}

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
    // Node.js용 fetch polyfill
    const fetch = require('node-fetch');
    global.fetch = fetch;
}

testGeminiAPI().catch(console.error);
