# lambdaTestPlaywright
Javascript code for playwright framework
ID,Scenario Name,Description
01,Simple Form Demo,"Validates URL structure, message input, and dynamic text display."
02,Drag & Drop Sliders,Moves a slider from a default value of 15 to a target value of 95.
03,Input Form Submit,"Validates HTML5 form requirements, dropdown selection, and success messages."

Prerequisites
Before running the tests, ensure you have the following installed:

Node.js (LTS version)

VS Code (Recommended)

Playwright Test Extension for VS Code

Installation & Setup
Clone the repository:

git clone <your-repo-link>
cd testscenario
Install dependencies:
npm install
Install Playwright Browsers:
npx playwright install
Set LambdaTest Credentials: Set your credentials as environment variables to keep them secure:
# For Mac/Linux
export LT_USERNAME="your_username"
export LT_ACCESS_KEY="your_access_key"

# For Windows (PowerShell)
$env:LT_USERNAME="your_username"
$env:LT_ACCESS_KEY="your_access_key"


Running the Tests
Local Execution (Headless)
To run all tests locally:
npx playwright test

LambdaTest Cloud Execution
To run a specific script (e.g., Scenario 3) on the LambdaTest Grid:

node testscenario3.js

Project Structure

├── .gitpod.yml          # Gitpod workspace configuration
├── package.json         # Project dependencies and scripts
├── playwright.config.ts # Global Playwright settings
├── testscenario1.js     # Simple Form Demo script
├── testscenario2.js     # Slider Demo script (Firefox/Mac Catalina)
└── testscenario3.js     # Input Form Submit script

Viewing Results
Local Reports: After running tests, use npx playwright show-report.

LambdaTest Dashboard: * View live execution videos.

Analyze network logs and console outputs.

Check test status (Passed/Failed) based on assertions.
