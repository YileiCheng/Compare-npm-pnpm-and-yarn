#!/bin/bash

node reset.js

# 创建 monorepo 目录结构
mkdir -p storage-monorepo-demo/{npm-demo,pnpm-demo,yarn-demo}
cd storage-monorepo-demo

# 创建共享依赖的 package.json
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

# 设置 npm 项目
cd npm-demo
npm init -y
npm install react react-dom lodash axios

# 设置 pnpm 项目
cd ../pnpm-demo
pnpm init 
pnpm add react react-dom lodash axios

# 设置 yarn 项目
cd ../yarn-demo
yarn init -y
yarn add react react-dom lodash axios

cd ../../
node compare_storage_monorepo.js

rm -rf storage-monorepo-demo