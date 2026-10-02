#!/usr/bin/env bash
set -e

OUTPUT_DIR="${OUTPUT_DIR:-dist}"
BASE_PATH="${BASE_PATH:-/}"

echo "Building static demo into $OUTPUT_DIR with base path $BASE_PATH..."

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy static frontend assets to output directory
cp -r public/* "$OUTPUT_DIR/"

echo "Static demo built successfully into $OUTPUT_DIR"
