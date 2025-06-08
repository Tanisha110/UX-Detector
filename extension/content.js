// Collect visible text content, headings, buttons, alerts

function captureUXData() {
  // Get all visible text from body
  const rawText = document.body.innerText;

  // Collect headings texts (h1-h6)
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.innerText);

  // Collect button texts
  const buttons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]')).map(b => b.innerText || b.value);

  // Alerts and banners can be tricky — let's grab all elements with role alert or aria-live
  const alerts = Array.from(document.querySelectorAll('[role="alert"], [aria-live]')).map(a => a.innerText);

  return {
    rawText,
    headings,
    buttons,
    alerts
  };
}

// Listen for message from popup to send captured UX data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureUX") {
    const data = captureUXData();
    sendResponse(data);
  }
});
