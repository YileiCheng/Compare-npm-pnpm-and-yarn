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
    name: "remove lock files",
    cacheClearCmd:
      "rm -rf node_modules pnpm-lock.yaml yarn.lock npackage-lock.json package.json",
  },
  {
    name: "initialize pnpm",
    cacheClearCmd: "pnpm init",
  },
  {
    name: "initialize yarn",
    cacheClearCmd: "yarn init -y",
  },
  {
    name: "initialize npm",
    cacheClearCmd: "npm init -y",
  },
  {
    name: "install cli-table3",
    cacheClearCmd: "npm install cli-table3",
  },
];

clearCache.forEach((cm) => {
  console.log(cm.name);
  execSync(cm.cacheClearCmd, { stdio: "ignore" });
});
