const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const commands = {
  npm: "npm install react",
  pnpm: "pnpm add react",
  yarn: "yarn add react",
};

function getDirectorySize(dirPath) {
  const stat = fs.statSync(dirPath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(dirPath);
    return files.reduce((total, file) => {
      return total + getDirectorySize(path.join(dirPath, file));
    }, 0);
  } else {
    return stat.size;
  }
}

function measureSize(manager, command) {
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

  execSync(command);

  const nodeModulesPath = path.join(process.cwd(), "node_modules");

  if (fs.existsSync(nodeModulesPath)) {
    return getDirectorySize(nodeModulesPath) / (1024 * 1024); // Convert to MB
  } else {
    return 0;
  }
}

const results = [];

for (const manager in commands) {
  const size = measureSize(manager, commands[manager]);
  results.push({ packageManager: manager, sizeInMB: size.toFixed(2) + " MB" });
}

console.log("\n" + "Package Manager".padEnd(20) + "Size (MB)".padEnd(15));
console.log("-".repeat(35));

results.forEach((result) => {
  console.log(result.packageManager.padEnd(20) + result.sizeInMB.padEnd(15));
});

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

cleanUp();
cleanUpCache();
