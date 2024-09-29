const { execSync } = require("child_process");

const clearCache = [
  {
    name: "pnpm",
    cacheClearCmd: "pnpm store prune",
  },
  {
    name: "yarn",
    cacheClearCmd: "yarn cache clean",
  },
  {
    name: "npm",
    cacheClearCmd: "npm cache clean --force",
  },
];

clearCache.forEach((cm) => {
  console.log(`Clearing cache for ${cm.name}`);
  execSync(cm.cacheClearCmd, { stdio: "ignore" });
});
