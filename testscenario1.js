const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

(async () => {
  // 1. Define Cloud Capabilities
  const capabilities = {
    'browserName': 'Chrome', // Options: Chrome, MicrosoftEdge, pw-firefox, pw-webkit
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright Cloud Build',
      'name': 'LambdaTest Test Scenario1',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true
    }
  };

  // 2. Establish Connection
  const browser = await pw-firefox.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const page = await browser.newPage();

  try {
    // 3. Execute Scenario
    await page.goto('https://www.lambdatest.com/selenium-playground');
    await page.click('text=Simple Form Demo');
    
    // Validate URL
    await expect(page).toHaveURL(/.*simple-form-demo/);

    const message = "Welcome to LambdaTest Cloud";
    await page.fill('input#user-message', message);
    await page.click('button#showInput');

    // Validate result
    const displayedMessage = page.locator('#message');
    await expect(displayedMessage).toHaveText(message);

    // 4. Mark Status in LambdaTest Dashboard
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Test Passed!' } })}`);

  } catch (e) {
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.message } })}`);
  } finally {
    await browser.close();
  }
})();