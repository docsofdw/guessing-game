#!/bin/bash

# Final cleanup script for YDKB project
# This script removes backup files and any remaining duplicates

echo "Starting final cleanup process..."

# Remove backup files
echo "Removing backup files..."
find . -name "*.bak" -type f -delete

# Remove any remaining JSX files that have TypeScript equivalents
echo "Checking for duplicate JSX/TSX files..."
for tsx_file in $(find app -name "*.tsx"); do
  base_name=$(basename "$tsx_file" .tsx)
  dir_name=$(dirname "$tsx_file")
  jsx_file="$dir_name/$base_name.jsx"
  
  if [ -f "$jsx_file" ]; then
    echo "Found duplicate: $jsx_file (already have $tsx_file)"
    rm "$jsx_file"
  fi
done

# Remove any empty directories
echo "Removing empty directories..."
find app -type d -empty -delete

echo "Final cleanup complete!" 