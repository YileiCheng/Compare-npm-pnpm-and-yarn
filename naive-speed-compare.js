const { execSync } = require("child_process");
const Table = require("cli-table3");

const commands = {
  pnpm: "pnpm add react",
  npm: "npm install react",
  yarn: "yarn add react",
};

function cleanUp() {
  execSync(
    "rm -rf node_modules package-lock.json package.json pnpm-lock.yaml yarn.lock",
    { stdio: "ignore" }
  );
}

function measureTime(command) {
  cleanUp();

  const startTime = process.hrtime();
  execSync(command, { stdio: "ignore" });
  const endTime = process.hrtime(startTime);

  const timeInSeconds = endTime[0] + endTime[1] / 1e9;
  return timeInSeconds;
}

const results = [];

for (const manager in commands) {
  const time = measureTime(commands[manager]);
  results.push({ packageManager: manager, timeInSeconds: time });
}

const table = new Table({
  head: ["Package Manager", "Time (seconds)"],
  colWidths: [20, 15],
});

results.forEach((result) => {
  table.push([result.packageManager, result.timeInSeconds.toFixed(2) + "s"]);
});

console.log(table.toString());

cleanUp();
execSync("pnpm add cli-table3", { stdio: "ignore" });
