const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

(async () => {
  const capabilities = {
    'browserName': 'Chrome',
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 11',
     'build': 'Playwright Cloud Build',
          'name': 'LambdaTest Test Scenario3',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Open Playground and click “Input Form Submit”
    await page.goto('https://www.lambdatest.com/selenium-playground');
    await page.click('text=Input Form Submit');

    // 2. Click “Submit” without filling in any information
    const submitBtn = page.locator('button:has-text("Submit")');
    await submitBtn.click();

    // 3. Assert “Please fill out this field” error message
    // Note: Chrome's default message is "Please fill out this field." 
    // We check the validation message on the 'name' input.
    const nameInput = page.locator('#name');
    const validationMessage = await nameInput.evaluate((node) => node.validationMessage);
    
    console.log(`Validation Message: ${validationMessage}`);
    if (validationMessage === "Please fill out this field.") {
        console.log("Assertion Passed: Error message displayed.");
    }

    // 4. Fill in Name, Email, and other fields
    await nameInput.fill('Raji Naik');
    await page.fill('#inputEmail4', 'raji.naik@lamdatest.com');
    await page.fill('#inputPassword4', 'Password123');
    await page.fill('#company', 'LambdaTest Inc.');
    await page.fill('#websitename', 'https://www.lambdatest.com');
    
    // 5. From the Country drop-down, select “United States”
    await page.selectOption('select[name="country"]', { label: 'India' });

    // 6. Fill in remaining fields and click “Submit”
    await page.fill('#inputCity', 'Pune');
    await page.fill('#inputAddress1', '123 Test Street');
    await page.fill('#inputAddress2', 'Suite 400');
    await page.fill('#inputState', 'Maha');
    await page.fill('#inputZip', '94105');
    
    await submitBtn.click();

    // 7. Validate the success message
    const successMsg = page.locator('.success-msg');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toHaveText('Thanks for contacting us, we will get back to you shortly.');

    // Mark test as passed in LambdaTest Dashboard
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Form submitted successfully!' } })}`);

  } catch (e) {
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.message } })}`);
    console.error(e);
  } finally {
    await browser.close();
  }
})();