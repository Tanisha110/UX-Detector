const captureBtn = document.getElementById('captureBtn');
const statusDiv = document.getElementById('status');

captureBtn.addEventListener('click', () => {
  statusDiv.textContent = 'Capturing...';

  // Send message to active tab to get UX data from content.js
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "captureUX" }, async (response) => {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }

      if (response) {
        const { rawText, headings, buttons, alerts } = response;

        // Compose data to send to backend
        const payload = {
          url: tabs[0].url,
          timestamp: new Date().toISOString(),
          rawText,
          deviceInfo: {
            userAgent: navigator.userAgent,
            screen: {
              width: window.screen.width,
              height: window.screen.height
            }
          },
          patterns: [] // empty for now
        };

        try {
          const res = await fetch('http://localhost:3000/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            statusDiv.textContent = 'UX data captured and sent successfully!';
          } else {
            statusDiv.textContent = 'Failed to send data to server.';
          }
        } catch (err) {
          statusDiv.textContent = 'Network error: ' + err.message;
        }
      } else {
        statusDiv.textContent = 'No response from content script.';
      }
    });
  });
});
