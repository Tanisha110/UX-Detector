(async () => {
  function captureUXData() {
    const rawText = document.body.innerText;
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.innerText);
    const buttons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]')).map(b => b.innerText || b.value);
    const alerts = Array.from(document.querySelectorAll('[role="alert"], [aria-live]')).map(a => a.innerText);

    return {
      rawText,
      headings,
      buttons,
      alerts
    };
  }

  function getISTTimestamp() {
    const date = new Date();
    // Convert to IST by adding 5.5 hours (19800000 ms)
    const ist = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    return ist.toISOString(); // still ISO 8601 format, but in IST
  }

  const UXData = captureUXData();
  const deviceInfo = {
    userAgent: navigator.userAgent,
    width: window.innerWidth,
    height: window.innerHeight,
    platform: navigator.platform
  };

  const timestamp = getISTTimestamp();

  try {
    await fetch("http://localhost:3000/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: window.location.href,
        rawText: UXData.rawText,
        headings: UXData.headings,
        buttons: UXData.buttons,
        alerts: UXData.alerts,
        deviceInfo,
        timestamp // 👈 include IST timestamp here
      })
    });
    console.log("📡 UX data sent to backend with timestamp:", timestamp);
  } catch (err) {
    console.error("❌ Failed to send UX data:", err);
  }
})();

