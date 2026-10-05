#!/usr/bin/env bash
set -e

OUTPUT_DIR="${OUTPUT_DIR:-dist}"
BASE_PATH="${BASE_PATH:-/}"

echo "Building static demo into $OUTPUT_DIR with base path $BASE_PATH..."

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy static frontend assets to output directory
cp -r public/* "$OUTPUT_DIR/"

# Ensure index.html exists in OUTPUT_DIR
if [ ! -f "$OUTPUT_DIR/index.html" ]; then
  echo "Error: index.html was not generated in $OUTPUT_DIR" >&2
  exit 1
fi

echo "Static demo built successfully into $OUTPUT_DIR"
