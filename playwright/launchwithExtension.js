const { chromium } = require('playwright');
const path = require('path');

const targetURL = process.argv[2];
if (!targetURL) {
  console.error("❌ Please provide a target URL");
  process.exit(1);
}

(async () => {
  const userDataDir = path.join(__dirname, 'user-data');
  const extensionPath = path.join(__dirname, '../extension');

  let context;
  
  try {
    console.log('🚀 Launching browser with extension...');
    
    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ],
      // Increase default navigation timeout
      timeout: 60000
    });

    const page = await context.newPage();
    
    // Set page timeout
    page.setDefaultTimeout(45000);
    page.setDefaultNavigationTimeout(45000);

    console.log(`🌐 Navigating to: ${targetURL}`);
    
    // Try multiple navigation strategies with fallback
    let navigationSuccess = false;
    
    // Strategy 1: Try with domcontentloaded (faster, more reliable)
    try {
      await page.goto(targetURL, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      console.log("✅ Page loaded successfully (domcontentloaded)");
      navigationSuccess = true;
    } catch (domError) {
      console.log('⚠️ domcontentloaded failed, trying load event...');
      
      // Strategy 2: Try with load event
      try {
        await page.goto(targetURL, { 
          waitUntil: 'load',
          timeout: 30000 
        });
        console.log("✅ Page loaded successfully (load)");
        navigationSuccess = true;
      } catch (loadError) {
        console.log('⚠️ load event failed, trying networkidle with shorter timeout...');
        
        // Strategy 3: Try networkidle with shorter timeout
        try {
          await page.goto(targetURL, { 
            waitUntil: 'networkidle',
            timeout: 20000 
          });
          console.log("✅ Page loaded successfully (networkidle)");
          navigationSuccess = true;
        } catch (networkError) {
          console.log('⚠️ All navigation strategies failed, trying basic navigation...');
          
          // Strategy 4: Basic navigation without wait conditions
          await page.goto(targetURL, { timeout: 30000 });
          console.log("✅ Page loaded with basic navigation");
          navigationSuccess = true;
        }
      }
    }

    if (navigationSuccess) {
      // Wait for page to be interactive
      await page.waitForLoadState('domcontentloaded');
      
      // Optional: Wait for a specific element to ensure page is ready
      try {
        await page.waitForSelector('body', { timeout: 5000 });
        console.log("✅ Page body is ready");
      } catch (bodyError) {
        console.log("⚠️ Body selector timeout, but continuing...");
      }

      console.log("🕒 Waiting for extension to capture and send UX data...");
      
      // Wait for extension to do its work
      await page.waitForTimeout(10000);

      console.log("✅ Finished successfully.");
    }

  } catch (err) {
    console.error("❌ Critical error occurred:", err.message);
    
    // Log additional debugging info
    if (err.name === 'TimeoutError') {
      console.log(`
🔍 Debugging Tips:
1. Check if the website is accessible in a regular browser
2. Try a simpler URL first (like https://example.com)
3. Check your internet connection
4. Some websites block automated browsers - try adding user agent
5. The website might be using aggressive anti-bot measures
      `);
    }
  } finally {
    if (context) {
      console.log("🧹 Cleaning up browser context...");
      await context.close();
    }
  }
})();

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});