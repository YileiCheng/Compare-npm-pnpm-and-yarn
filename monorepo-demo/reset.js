const { execSync } = require("child_process");

const clearCache = [
  {
    name: "clear cache for pnpm",
    cacheClearCmd: "pnpm store prune",
  },
  {
    name: "clear cache for yarn",
    cacheClearCmd: "yarn cache clean",
  },
  {
    name: "clear cache for npm",
    cacheClearCmd: "npm cache clean --force",
  },
  {
    name: "remove lock files, package.json, and node_modules",
    cacheClearCmd:
      "rm -rf node_modules pnpm-lock.yaml yarn.lock package-lock.json package.json",
  },
];

clearCache.forEach((cm) => {
  console.log(cm.name);
  execSync(cm.cacheClearCmd, { stdio: "ignore" });
});
