const { execSync } = require("child_process");
const Table = require("cli-table3");

const packageManagers = [
  {
    name: "pnpm",
    installCmd: "pnpm add lodash",
    cleanupCmd: "rm -rf node_modules pnpm-lock.yaml",
  },
  {
    name: "yarn",
    installCmd: "yarn add lodash",
    cleanupCmd: "rm -rf node_modules yarn.lock",
  },
  {
    name: "npm",
    installCmd: "npm install lodash",
    cleanupCmd: "rm -rf node_modules package-lock.json",
  },
];

const timeInstall = (installCmd, cleanupCmd) => {
  try {
    execSync(cleanupCmd);

    console.log(`Installing using: ${installCmd}`);

    const startTime = process.hrtime();
    execSync(installCmd, { stdio: "ignore" });
    const endTime = process.hrtime(startTime);

    const timeInSeconds = endTime[0] + endTime[1] / 1e9;

    return timeInSeconds;
  } catch (error) {
    console.error(`Error while running ${installCmd}:`, error);
    return null;
  }
};

const results = packageManagers.map((pm) => {
  const timeTaken = timeInstall(pm.installCmd, pm.cleanupCmd);
  return { manager: pm.name, time: timeTaken };
});

const table = new Table({
  head: ["Package Manager", "Time (seconds)"],
  colWidths: [20, 20],
});

results.forEach((result) => {
  table.push([result.manager, result.time ? result.time.toFixed(3) : "Error"]);
});

console.log(table.toString());
