const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const commands = {
  npm: "npm install react",
  pnpm: "pnpm add react",
  yarn: "yarn add react",
};

function cleanUp() {
  execSync(
    "rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock package.json"
  );
}

function getDirectorySize(dirPath, processedInodes = new Set()) {
  const stat = fs.statSync(dirPath);

  if (stat.isDirectory()) {
    const files = fs.readdirSync(dirPath);
    return files.reduce((total, file) => {
      return (
        total + getDirectorySize(path.join(dirPath, file), processedInodes)
      );
    }, 0);
  } else {
    const inode = stat.ino;
    if (!processedInodes.has(inode)) {
      processedInodes.add(inode);
      return stat.size;
    } else {
      return 0;
    }
  }
}

module.exports = getDirectorySize;

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
  results.push({ packageManager: manager, sizeInMB: size.toFixed(4) + " MB" });
}

console.log("\n" + "Package Manager".padEnd(20) + "Size (MB)".padEnd(15));
console.log("-".repeat(35));

results.forEach((result) => {
  console.log(result.packageManager.padEnd(20) + result.sizeInMB.padEnd(15));
});

cleanUp();
