#!/bin/bash

# Cleanup script for YDKB project
# This script removes duplicate directories and files after consolidation

echo "Starting cleanup process..."

# Backup important files first
echo "Creating backup directory..."
mkdir -p backup
cp -r src backup/src
cp -r components backup/components
cp -r lib backup/lib
cp -r hooks backup/hooks
cp -r pages backup/pages

# Remove duplicate directories
echo "Removing duplicate directories..."

# Only remove if they exist
if [ -d "src" ]; then
  echo "Removing src directory..."
  rm -rf src
fi

if [ -d "components" ]; then
  echo "Removing components directory..."
  rm -rf components
fi

if [ -d "lib" ]; then
  echo "Removing lib directory..."
  rm -rf lib
fi

if [ -d "hooks" ]; then
  echo "Removing hooks directory..."
  rm -rf hooks
fi

if [ -d "pages" ]; then
  echo "Removing pages directory..."
  rm -rf pages
fi

# Remove the JSX version of QuestionCard
if [ -f "app/components/QuestionCard.jsx" ]; then
  echo "Removing JSX version of QuestionCard..."
  rm app/components/QuestionCard.jsx
fi

echo "Cleanup complete!"
echo "All files have been consolidated into the app directory."
echo "A backup of the original directories has been created in the backup directory." 