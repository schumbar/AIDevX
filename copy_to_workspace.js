#!/usr/bin/env node

/**
 * Simple script to copy files to the workspace/uploads directory
 * 
 * Usage: node copy_to_workspace.js <file_path>
 */

const fs = require('fs');
const path = require('path');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided');
  console.error('Usage: node copy_to_workspace.js <file_path>');
  process.exit(1);
}

// Get the current working directory
const cwd = process.cwd();

// Create the destination directory path
const destDir = path.join(cwd, 'workspace', 'uploads');

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Get the file name from the path
const fileName = path.basename(filePath);

// Create the destination file path
const destPath = path.join(destDir, fileName);

try {
  // Copy the file
  fs.copyFileSync(filePath, destPath);
  console.log(`File copied successfully to ${destPath}`);
  
  // Make the file readable by everyone
  fs.chmodSync(destPath, 0o666);
  console.log(`File permissions set to 666`);
  
  // List the contents of the destination directory
  const files = fs.readdirSync(destDir);
  console.log(`\nContents of ${destDir}:`);
  files.forEach(file => {
    const stats = fs.statSync(path.join(destDir, file));
    console.log(`${file} (${stats.size} bytes)`);
  });
} catch (error) {
  console.error(`Error copying file: ${error.message}`);
  process.exit(1);
}
