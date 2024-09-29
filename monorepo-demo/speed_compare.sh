#!/bin/bash

node reset.js

# 创建主目录
mkdir -p speed-monorepo-demo/{npm-demo,pnpm-demo,yarn-demo}
cd speed-monorepo-demo || exit

cat <<EOL > shared-dependencies.json
{
  "dependencies": {
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "lodash": "4.17.21",
    "axios": "0.21.1"
  }
}
EOL

# 初始化 npm 项目
cd npm-demo
echo "Initializing npm project..."
npm init -y

# 安装依赖 (npm)
echo "Installing dependencies with npm..."
start_time=$(date +%s%3N)
npm install --save react react-dom lodash axios
end_time=$(date +%s%3N)
npm_duration=$((end_time - start_time))

# cd ../
# node reset.js
# cd pnpm-npm-demo || exit

# initialize pnpm demo
cd ../pnpm-demo
echo "Installing dependencies with pnpm..."
pnpm init

# install dependencies
start_time=$(date +%s%3N)
pnpm add react react-dom lodash axios
end_time=$(date +%s%3N)
pnpm_duration=$((end_time - start_time))


# 使用 yarn 安装依赖
cd ../yarn-demo
echo "Installing dependencies with yarn..."
yarn init -y

start_time=$(date +%s%3N)
yarn add react react-dom lodash axios
end_time=$(date +%s%3N)
yarn_duration=$((end_time - start_time))

# 输出比较结果
echo "Comparison Result:"
echo "npm install duration: ${npm_duration} milliseconds."
echo "pnpm install duration: ${pnpm_duration} milliseconds."
echo "yarn install duration: ${yarn_duration} milliseconds."

cd ../../
rm -rf speed-monorepo-demo