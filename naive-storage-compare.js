const { execSync } = require("child_process");
const Table = require("cli-table3");
const fs = require("fs");
const path = require("path");

const packageManagers = [
  {
    name: "npm",
    installCmd: "npm install lodash",
    cleanupCmd: "node reset.js",
  },
  {
    name: "pnpm",
    installCmd: "pnpm add lodash",
    cleanupCmd: "node reset.js",
  },
  {
    name: "yarn",
    installCmd: "yarn add lodash",
    cleanupCmd: "node reset.js",
  },
];

const getFolderSize = (folderPath, processedInodes = new Set()) => {
  const stat = fs.statSync(folderPath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(folderPath);
    return files.reduce((total, file) => {
      const filePath = path.join(folderPath, file);
      return total + getFolderSize(filePath, processedInodes);
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
};

const formatSizeUnits = (bytes) => {
  if (bytes >= 1e9) {
    return (bytes / 1e9).toFixed(2) + " GB";
  } else if (bytes >= 1e6) {
    return (bytes / 1e6).toFixed(2) + " MB";
  } else if (bytes >= 1e3) {
    return (bytes / 1e3).toFixed(2) + " KB";
  } else {
    return bytes + " B";
  }
};

const measureStorage = (installCmd, cleanupCmd) => {
  try {
    console.log(`Cleaning up using: ${cleanupCmd}`);
    execSync(cleanupCmd);

    console.log(`Installing using: ${installCmd}`);
    execSync(installCmd, { stdio: "ignore" });

    const nodeModulesPath = path.join(__dirname, "node_modules");
    const size = getFolderSize(nodeModulesPath);
    return size;
  } catch (error) {
    console.error(`Error while running ${installCmd}:`, error);
    return null;
  }
};

const results = packageManagers.map((pm) => {
  const size = measureStorage(pm.installCmd, pm.cleanupCmd);
  return { manager: pm.name, size };
});

const table = new Table({
  head: ["Package Manager", "Node Modules Size"],
  colWidths: [20, 30],
});

results.forEach((result) => {
  table.push([
    result.manager,
    result.size ? formatSizeUnits(result.size) : "Error",
  ]);
});

console.log(table.toString());
