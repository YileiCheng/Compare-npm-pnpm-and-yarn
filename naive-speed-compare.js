const { execSync } = require("child_process");

const commands = {
  pnpm: "pnpm add lodash",
  npm: "npm install lodash",
  yarn: "yarn add lodash",
};

function cleanUp() {
  execSync(
    "rm -rf node_modules package-lock.json package.json pnpm-lock.yaml yarn.lock",
    { stdio: "ignore" }
  );
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

  const startTime = process.hrtime();
  execSync(command, { stdio: "ignore" });
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
