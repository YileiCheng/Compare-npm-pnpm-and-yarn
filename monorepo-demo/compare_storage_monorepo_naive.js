const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 计算目录大小的函数
const getDirectorySize = (dir) => {
  let totalSize = 0;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath); // 递归计算子目录大小
    } else {
      totalSize += stat.size; // 计算文件大小
    }
  });

  return totalSize;
};

// 安装依赖
const installDependencies = (manager) => {
  return new Promise((resolve, reject) => {
    let command;
    if (manager === 'yarn') {
      command = `${manager} add react react-dom lodash axios`;
    } else {
      command = `${manager} install --save react react-dom lodash axios`;
    }
    exec(command, { cwd: path.join(__dirname, `storage-monorepo-demo/${manager}-demo`) }, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

// 获取 node_modules 大小
const getNodeModulesSize = (manager) => {
  return new Promise((resolve, reject) => {
    const dirPath = path.join(__dirname, `storage-monorepo-demo/${manager}-demo/node_modules`);
    try {
      const isPnpm = manager === 'pnpm';
      const size = getDirectorySize(dirPath, isPnpm); // 排除 pnpm 的硬链接
      resolve((size / (1024 * 1024)).toFixed(2) + ' MB'); // 转换为 MB
    } catch (error) {
      reject(error);
    }
  });
};

// 主函数
const main = async () => {
  try {
    // 安装依赖（如果需要的话）
    await installDependencies('npm');
    await installDependencies('pnpm');
    await installDependencies('yarn');

    // 获取 node_modules 大小
    const npmSize = await getNodeModulesSize('npm');
    const pnpmSize = await getNodeModulesSize('pnpm');
    const yarnSize = await getNodeModulesSize('yarn');

    // 打印结果表格
    console.log('\n| 工具  | node_modules 大小 |');
    console.log('|-------|-------------------|');
    console.log(`| npm   | ${npmSize}      |`);
    console.log(`| pnpm  | ${pnpmSize}     |`);
    console.log(`| yarn  | ${yarnSize}     |`);
  } catch (error) {
    console.error('发生错误:', error);
  }
};

main();
