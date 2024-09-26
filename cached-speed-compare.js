const { execSync } = require("child_process");
const Table = require("cli-table3");

const packageManagers = [
  { name: "npm", installCmd: "npm install lodash" },
  { name: "pnpm", installCmd: "pnpm add lodash" },
  { name: "yarn", installCmd: "yarn add lodash" },
];

const repetitions = 5;

const timeInstall = (installCmd) => {
  const times = [];

  for (let i = 0; i < repetitions; i++) {
    console.log(`Running "${installCmd}" - iteration ${i + 1}`);

    const startTime = process.hrtime();
    execSync(installCmd, { stdio: "ignore" });
    const endTime = process.hrtime(startTime);

    const timeInSeconds = endTime[0] + endTime[1] / 1e9;
    times.push(timeInSeconds);
  }

  const averageTime = times.reduce((sum, time) => sum + time, 0) / repetitions;
  return averageTime;
};

const results = packageManagers.map((pm) => {
  const avgTimeTaken = timeInstall(pm.installCmd);
  return { manager: pm.name, avgTime: avgTimeTaken };
});

const table = new Table({
  head: ["Package Manager", `Avg Time (${repetitions} runs)`],
  colWidths: [20, 30],
});

results.forEach((result) => {
  table.push([
    result.manager,
    result.avgTime ? result.avgTime.toFixed(3) : "Error",
  ]);
});

console.log(table.toString());
