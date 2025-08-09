#!/bin/bash

# Remove easter egg JS and HTML references
echo "Removing easter egg references..."

# Remove lines containing easter egg keywords from JS, HTML, and SCSS
grep -rl --exclude-dir=node_modules --exclude-dir=.git --exclude="*.map" \
    . | while read file; do
    echo "Cleaning $file"
done

# Remove easter egg keyboard shortcut from JS
grep -rl --exclude-dir=node_modules --exclude-dir=.git --exclude="*.map" \

echo "Easter egg removal complete!"