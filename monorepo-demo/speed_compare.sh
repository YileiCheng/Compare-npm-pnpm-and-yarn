#!/bin/bash

node reset.js

# Create main directory
mkdir -p speed-monorepo-demo/{npm-demo,pnpm-demo,yarn-demo}
cd speed-monorepo-demo || exit

# Initialize npm project
cd npm-demo
echo "Initializing npm project..."
npm init -y

# Install dependencies (npm)
echo "Installing dependencies with npm..."
start_time=$(date +%s%3N)
npm install --save react react-dom lodash axios
end_time=$(date +%s%3N)
npm_duration=$((end_time - start_time))

# Initialize pnpm project
cd ../pnpm-demo
echo "Initializing pnpm project..."
pnpm init

# Install dependencies (pnpm)
start_time=$(date +%s%3N)
pnpm add react react-dom lodash axios
end_time=$(date +%s%3N)
pnpm_duration=$((end_time - start_time))

# Install dependencies with yarn
cd ../yarn-demo
echo "Initializing yarn project..."
yarn init -y

start_time=$(date +%s%3N)
yarn add react react-dom lodash axios
end_time=$(date +%s%3N)
yarn_duration=$((end_time - start_time))

# Output comparison results
echo "Comparison Result:"
echo "npm install duration: ${npm_duration} milliseconds."
echo "pnpm install duration: ${pnpm_duration} milliseconds."
echo "yarn install duration: ${yarn_duration} milliseconds."

cd ../../
rm -rf speed-monorepo-demo
