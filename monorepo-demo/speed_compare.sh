#!/bin/bash

# Run the reset script
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
npm install react react-dom lodash axios
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

# Initialize yarn project
cd ../yarn-demo
echo "Initializing yarn project..."
yarn init -y

# Install dependencies (yarn)
start_time=$(date +%s%3N)
yarn add react react-dom lodash axios
end_time=$(date +%s%3N)
yarn_duration=$((end_time - start_time))

# Output comparison results in table format
echo -e "\n| Tool  | Install Duration (milliseconds) |"
echo -e "|-------|---------------------------------|"
echo -e "| npm   | ${npm_duration}                            |"
echo -e "| pnpm  | ${pnpm_duration}                            |"
echo -e "| yarn  | ${yarn_duration}                            |"

# Clean up by removing the demo directory
cd ../../
rm -rf speed-monorepo-demo
