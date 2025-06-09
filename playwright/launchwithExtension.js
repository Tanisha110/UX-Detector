const { chromium } = require('playwright');
const path = require('path');

const targetURL = process.argv[2];
if (!targetURL) {
  console.error("❌ Please provide a target URL");
  process.exit(1);
}

(async () => {
  const userDataDir = path.join(__dirname, 'user-data'); // To persist login/session
  const extensionPath = path.join(__dirname, '../extension'); // Your extension folder

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  const page = await context.newPage();

  try {
    console.log(`🌐 Navigating to: ${targetURL}`);
    await page.goto(targetURL, { waitUntil: 'networkidle' });

    console.log("🕒 Waiting for extension to capture and send UX data...");
    await page.waitForTimeout(10000); // Adjust based on your extension's behavior

    console.log("✅ Finished.");
  } catch (err) {
    console.error("❌ Failed to open page:", err);
  } finally {
    await context.close();
  }
})();
