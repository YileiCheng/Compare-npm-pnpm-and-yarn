const { execSync } = require("child_process");
const fs = require("fs");
const path = "speed-compare-results.csv";

const commands = {
  npm: "npm install react",
  pnpm: "pnpm add react",
  yarn: "yarn add react",
};

const commands_plus = {
  npm: "npm install react react-dom lodash axios express",
  pnpm: "pnpm add react react-dom lodash axios express",
  yarn: "yarn add react react-dom lodash axios express",
};

function cleanUp() {
  execSync(
    "rm -rf node_modules package-lock.json package.json pnpm-lock.yaml yarn.lock"
  );
}

function cleanUpCache() {
  execSync("pnpm store prune");
  execSync("npm cache clean --force");
  execSync("yarn cache clean");
}

function measureTime(manager, command) {
  cleanUp();

  switch (manager) {
    case "pnpm":
      execSync("pnpm init");
      break;
    case "npm":
      execSync("npm init -y");
      break;
    case "yarn":
      execSync("yarn init -y");
      break;
    default:
      throw new Error("Invalid package manager");
  }

  // TODO: If this two lines is uncommented, install cmd will be run to create nm and cache, 
  // TODO: then nm will be deleted, leaving cache for npm's cache-copy and pnpm's hard-link testing
  // execSync(command);
  // execSync("rm -rf node_modules");

  const startTime = process.hrtime();
  execSync(command);
  const endTime = process.hrtime(startTime);

  const timeInSeconds = endTime[0] + endTime[1] / 1e9;
  return timeInSeconds;
}

function updateCSV(test_mode, results) {
  let csvData = "";

  if (fs.existsSync(path)) {
    // CSV exists, read the file
    csvData = fs.readFileSync(path, "utf-8");
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const testModeIndex = headers.indexOf(test_mode);

    // If the test_mode column doesn't exist, add it
    if (testModeIndex === -1) {
      headers.push(test_mode);
      lines[0] = headers.join(",");
    }

    // Update each manager's row with the new data
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const manager = row[0];

      if (results[manager]) {
        if (testModeIndex === -1) {
          // If column didn't exist, append data
          row.push(results[manager][test_mode]);
        } else {
          // If column exists, update the specific column
          row[testModeIndex] = results[manager][test_mode];
        }
        lines[i] = row.join(",");
      }
    }

    // Write the updated CSV back to the file
    fs.writeFileSync(path, lines.join("\n"));
    console.log(`CSV updated with ${test_mode} data.`);
  } else {
    // CSV doesn't exist, create new CSV with the current test_mode
    const headers = "Package Manager,install-nm,install-nm-cached,install-nm-with-more-packages\n";
    const rows = [];

    for (const manager in results) {
      const row = `${manager},${test_mode === 'install-nm' ? results[manager]["install-nm"] : ""},${test_mode === 'install-nm-cached' ? results[manager]["install-nm-cached"] : ""},${test_mode === 'install-nm-with-more-packages' ? results[manager]["install-nm-with-more-packages"] : ""}`;
      rows.push(row);
    }

    const csvContent = headers + rows.join("\n");
    fs.writeFileSync(path, csvContent);
    console.log("New CSV created.");
  }
}

function runTestMode(test_mode) {
  const results = {
    npm: { 'install-nm': 0, 'install-nm-cached': 0, 'install-nm-with-more-packages': 0 },
    pnpm: { 'install-nm': 0, 'install-nm-cached': 0, 'install-nm-with-more-packages': 0 },
    yarn: { 'install-nm': 0, 'install-nm-cached': 0, 'install-nm-with-more-packages': 0 },
  };

  const timeResults = [];

  for (const manager in commands) {
    let time;
    switch (test_mode) {
      case "install-nm":
        time = measureTime(manager, commands[manager]);
        results[manager]["install-nm"] = time;
        break;
      case "install-nm-cached":
        execSync(commands[manager]); // First run to cache dependencies
        execSync("rm -rf node_modules"); // Remove node_modules to test cached installation
        time = measureTime(manager, commands[manager]);
        results[manager]["install-nm-cached"] = time;
        break;
      case "install-nm-with-more-packages":
        time = measureTime(manager, commands_plus[manager]);
        results[manager]["install-nm-with-more-packages"] = time;
        break;
      default:
        throw new Error("Invalid test mode");
    }
    
    // Store results for console output
    timeResults.push({ packageManager: manager, timeInSeconds: time });
  }

  // Update or create the CSV file
  updateCSV(test_mode, results);

  // Output results in the console
  console.log("\n" + "Package Manager".padEnd(20) + "Time (seconds)".padEnd(15));
  console.log("-".repeat(35));

  timeResults.forEach((result) => {
    console.log(
      result.packageManager.padEnd(20) +
        result.timeInSeconds.toFixed(2).padEnd(15)
    );
  });
}

// TODO: Change this value manually to run different test modes
const test_mode = "install-nm"; 
// const test_mode = "install-nm-cached";
// const test_mode = "install-nm-with-more-packages";

runTestMode(test_mode);
cleanUp();
cleanUpCache();
