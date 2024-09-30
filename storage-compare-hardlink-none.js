const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const commands = {
  // pnpm: "pnpm add react",
  npm: "npm install react",
  yarn: "yarn add react",
  pnpm: "pnpm add react",
};

function cleanUp() {
  execSync(
    "rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock package.json"
  );
}

function getDirectorySize(dirPath, processedInodes = new Map()) {
  const stat = fs.statSync(dirPath);

  // If the current path is a directory
  if (stat.isDirectory()) {
    const files = fs.readdirSync(dirPath);
    return files.reduce((total, file) => {
      return (
        total + getDirectorySize(path.join(dirPath, file), processedInodes)
      );
    }, 0);
  } else {
    const inode = stat.ino;

    // Check if the inode has been processed before
    if (!processedInodes.has(inode)) {
      // First time seeing this inode, add its size
      processedInodes.set(inode, 1);
      return stat.size;
    } else {
      // Inode has been processed before, increment the count
      const count = processedInodes.get(inode);
      processedInodes.set(inode, count + 1);

      console.log(stat.nlink);

      if (count === 1) {
        // This is the second time we see the inode, subtract the size
        return -stat.size;
      } else {
        // Any further occurrences, do nothing (return 0)
        return 0;
      }
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
  results.push({ packageManager: manager, sizeInMB: size.toFixed(2) + " MB" });
}

console.log("\n" + "Package Manager".padEnd(20) + "Size (MB)".padEnd(15));
console.log("-".repeat(35));

results.forEach((result) => {
  console.log(result.packageManager.padEnd(20) + result.sizeInMB.padEnd(15));
});

// cleanUp();
