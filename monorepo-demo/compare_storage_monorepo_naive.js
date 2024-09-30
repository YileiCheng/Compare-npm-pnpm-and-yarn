const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to calculate directory size
const getDirectorySize = (dir) => {
  let totalSize = 0;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath); // Recursively calculate size of subdirectories
    } else {
      totalSize += stat.size; // Calculate file size
    }
  });

  return totalSize;
};

// Install dependencies
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

// Get size of node_modules
const getNodeModulesSize = (manager) => {
  return new Promise((resolve, reject) => {
    const dirPath = path.join(__dirname, `storage-monorepo-demo/${manager}-demo/node_modules`);
    try {
      const isPnpm = manager === 'pnpm';
      const size = getDirectorySize(dirPath, isPnpm); // Exclude pnpm hard links
      resolve((size / (1024 * 1024)).toFixed(2) + ' MB'); // Convert to MB
    } catch (error) {
      reject(error);
    }
  });
};

// Main function
const main = async () => {
  try {
    // Install dependencies (if needed)
    await installDependencies('npm');
    await installDependencies('pnpm');
    await installDependencies('yarn');

    // Get size of node_modules
    const npmSize = await getNodeModulesSize('npm');
    const pnpmSize = await getNodeModulesSize('pnpm');
    const yarnSize = await getNodeModulesSize('yarn');

    // Print result table
    console.log('\n| Tool  | node_modules Size  |');
    console.log('|-------|--------------------|');
    console.log(`| npm   | ${npmSize}            |`);
    console.log(`| pnpm  | ${pnpmSize}            |`);
    console.log(`| yarn  | ${yarnSize}            |`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();
