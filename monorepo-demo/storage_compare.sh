#!/bin/bash

node reset.js

# Create monorepo directory structure
mkdir -p storage-monorepo-demo/{npm-demo,pnpm-demo,yarn-demo}
cd storage-monorepo-demo

# Set up npm project
cd npm-demo
npm init -y
npm install react react-dom lodash axios

# Set up pnpm project
cd ../pnpm-demo
pnpm init 
pnpm add react react-dom lodash axios

# Set up yarn project
cd ../yarn-demo
yarn init -y
yarn add react react-dom lodash axios

cd ../../
node compare_storage_monorepo.js

rm -rf storage-monorepo-demo
