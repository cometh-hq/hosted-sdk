#!/bin/bash

# Define the list of directories containing package.json files that should be built.

DIRECTORIES=("packages/*")

# Loop through each directory and run 'yarn build'.
for DIR in ${DIRECTORIES[@]}; do
  # Check if the directory contains a package.json file.
  if [ -f "$DIR/package.json" ]; then
      echo "Building $DIR"
      (cd $DIR && yarn build)
    fi
done

echo "Build process completed."
