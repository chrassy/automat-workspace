#!/usr/bin/env bash
set -e

OUTPUT_DIR="${OUTPUT_DIR:-dist}"
BASE_PATH="${BASE_PATH:-/}"

echo "Building static site to $OUTPUT_DIR with base path $BASE_PATH..."

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy public static files to output directory
cp -r src/public/* "$OUTPUT_DIR/"

echo "Static demo built successfully into $OUTPUT_DIR"
