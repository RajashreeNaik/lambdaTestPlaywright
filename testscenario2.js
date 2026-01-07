const { firefox } = require('playwright');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

(async () => {
  // 1. Configure Capabilities for Firefox on macOS Catalina
  const capabilities = {
     'browserName': 'Chrome', // Options: Chrome, MicrosoftEdge, pw-firefox, pw-webkit
        'browserVersion': 'latest',
        'LT:Options': {
          'platform': 'macOS Catalina',
          'build': 'Playwright Cloud Build',
          'name': 'LambdaTest Test Scenario2',
          'user': process.env.LT_USERNAME,
          'accessKey': process.env.LT_ACCESS_KEY,
          'network': true,
          'video': true,
          'console': true
        }
      };
    
      // 2. Establish Connection
      const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
      });

  const page = await browser.newPage();

  try {
    // --- SCENARIO 2 LOGIC ---
    await page.goto('https://www.lambdatest.com/selenium-playground');
     //slidersLinkXPath = "//a[contains(text(), 'Drag & Drop Sliders')]"
    await page.click('text=Drag & Drop Sliders');

    // Select the slider "Default value 15"
    // The specific selector for the 15-to-95 slider container
    const sliderContainer = page.locator('//h4[contains(text(), "Default value 15")]/following-sibling::div');
    const slider = sliderContainer.locator('input[type="range"]');
    const output = sliderContainer.locator('output');

    // Get the bounding box to calculate movement
    const box = await slider.boundingBox();

    if (box) {
      // Move to the starting point of the slider
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      
      // Move the mouse to the right until the value reaches 95
      // We use a loop or a direct coordinate calculation
      await page.mouse.move(box.x + (box.width * 0.94), box.y + box.height / 2);
      await page.mouse.up();
    }

    // Validation
    const finalValue = await output.textContent();
    console.log(`Current Slider Value: ${finalValue}`);

    if (finalValue === "96") {
      console.log("Success: Slider reached 96");
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Reached 95 successfully' } })}`);
    } else {
      console.log(`Failed: Slider value is ${finalValue}`);
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: `Value was ${finalValue} instead of 95` } })}`);
    }

  } catch (e) {
    console.error(e);
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.message } })}`);
  } finally {
    await browser.close();
  }
})();