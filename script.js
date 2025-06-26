
function log(message) {
  document.getElementById('result').textContent += `\n${message}`;
}

document.getElementById('loadFrameBtn').addEventListener('click', () => {
  const url = document.getElementById('storybookUrl').value;
  document.getElementById('previewFrame').src = url;
  document.getElementById('result').textContent = `🔄 Storybook URL 로딩 중: ${url}`;
});

document.getElementById('startTestBtn').addEventListener('click', async () => {
  const scenario = JSON.parse(document.getElementById('scenarioInput').value);
  const frame = document.getElementById('previewFrame');

  document.getElementById('result').textContent = '🔄 테스트 시작...';

  try {
    const frameDoc = frame.contentWindow.document;
    for (const step of scenario) {
      const target = frameDoc.getElementById(step.targetId);
      if (!target) {
        log(`❌ Element with id ${step.targetId} not found`);
        continue;
      }

      if (step.action === 'click') {
        target.click();
        log(`✅ Clicked #${step.targetId}`);
      }

      if (step.action === 'waitForVisible') {
        await new Promise(res => setTimeout(res, 300));
        if (!target.classList.contains('hidden')) {
          log(`✅ #${step.targetId} is visible`);
        } else {
          log(`❌ #${step.targetId} is NOT visible`);
        }
      }

      if (step.action === 'waitForHidden') {
        await new Promise(res => setTimeout(res, 300));
        if (target.classList.contains('hidden')) {
          log(`✅ #${step.targetId} is hidden`);
        } else {
          log(`❌ #${step.targetId} is STILL visible`);
        }
      }
    }
    log('\n✅ 테스트 완료되었습니다.');
  } catch (e) {
    log(`❌ 오류 발생: ${e.message}`);
  }
});
