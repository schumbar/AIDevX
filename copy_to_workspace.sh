#!/bin/bash

# This script copies files from a source directory to the workspace directory
# Usage: ./copy_to_workspace.sh <source_file_or_directory> [destination_subdirectory]

# Set the workspace directory path
WORKSPACE_DIR="$(pwd)/workspace"

# Check if source file/directory is provided
if [ -z "$1" ]; then
    echo "Error: Source file or directory not provided"
    echo "Usage: $0 <source_file_or_directory> [destination_subdirectory]"
    exit 1
fi

SOURCE="$1"

# Always use the uploads subdirectory
DEST_DIR="$WORKSPACE_DIR/uploads"
# Create destination subdirectory if it doesn't exist
mkdir -p "$DEST_DIR"

# Check if source exists
if [ ! -e "$SOURCE" ]; then
    echo "Error: Source '$SOURCE' does not exist"
    exit 1
fi

# Copy the file or directory
if [ -d "$SOURCE" ]; then
    # It's a directory, copy recursively
    cp -R "$SOURCE"/* "$DEST_DIR/"
    echo "Directory '$SOURCE' copied to '$DEST_DIR'"
else
    # It's a file
    cp "$SOURCE" "$DEST_DIR/"
    echo "File '$SOURCE' copied to '$DEST_DIR'"
fi

# List the contents of the destination directory
echo "Contents of destination directory:"
ls -la "$DEST_DIR"
