const { execSync } = require("child_process");

// more packages to add: react-dom lodash axios express
const commands = {
  npm: "npm install react",
  pnpm: "pnpm add react",
  yarn: "yarn add react",
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

  // If this two lines is uncommented, install cmd will be run to create nm and cache, 
  // then nm will be deleted, leaving cache for npm's cache-copy and pnpm's hard-link testing
  // execSync(command);
  // execSync("rm -rf node_modules");

  const startTime = process.hrtime();
  execSync(command);
  const endTime = process.hrtime(startTime);

  const timeInSeconds = endTime[0] + endTime[1] / 1e9;
  return timeInSeconds;
}

const results = [];

for (const manager in commands) {
  const time = measureTime(manager, commands[manager]);
  results.push({ packageManager: manager, timeInSeconds: time });
}

console.log("\n" + "Package Manager".padEnd(20) + "Time (seconds)".padEnd(15));
console.log("-".repeat(35));

results.forEach((result) => {
  console.log(
    result.packageManager.padEnd(20) +
      result.timeInSeconds.toFixed(2).padEnd(15)
  );
});

cleanUp();
cleanUpCache();
