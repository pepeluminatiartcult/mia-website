#!/bin/bash
# Optimize texture images for web delivery
# Produces 4 variants per image:
#   *-lg.webp  — max 1200px (large chunks)
#   *-sm.webp  — max 600px  (small/pixelated chunks, mobile)
#   *-pix.webp — 120px      (pixelated chunks — stretched via cover for chunky blocks)
#   *-blur.webp — 64px      (blur placeholder)

set -euo pipefail

SRC_DIR="${1:-$HOME/mia/assets/textures}"
OUT_DIR="${2:-$(dirname "$0")/../public/textures}"

mkdir -p "$OUT_DIR"

QUALITY_LG=75
QUALITY_SM=70
QUALITY_PIX=60
QUALITY_BLUR=30

for src in "$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg "$SRC_DIR"/*.png; do
  [ -f "$src" ] || continue

  base=$(basename "$src" | sed 's/\.[^.]*$//')
  # Shorten pexels filenames to just the numeric ID
  short=$(echo "$base" | grep -oE '[0-9]+' | tail -1)
  [ -z "$short" ] && short="$base"

  echo "Processing: $base -> tex-$short"

  # Get original dimensions
  w=$(sips -g pixelWidth "$src" | tail -1 | awk '{print $2}')
  h=$(sips -g pixelHeight "$src" | tail -1 | awk '{print $2}')

  # Large variant: max dimension 1200px
  if [ "$w" -gt "$h" ]; then
    lg_w=1200; lg_h=$((h * 1200 / w))
    sm_w=600; sm_h=$((h * 600 / w))
  else
    lg_h=1200; lg_w=$((w * 1200 / h))
    sm_h=600; sm_w=$((w * 600 / h))
  fi

  # Use temp files for sips resize then convert to webp
  tmp="/tmp/tex-resize-$$.jpg"

  # Large
  cp "$src" "$tmp"
  sips --resampleWidth "$lg_w" "$tmp" --out "$tmp" > /dev/null 2>&1
  cwebp -q "$QUALITY_LG" "$tmp" -o "$OUT_DIR/tex-${short}-lg.webp" > /dev/null 2>&1

  # Small
  cp "$src" "$tmp"
  sips --resampleWidth "$sm_w" "$tmp" --out "$tmp" > /dev/null 2>&1
  cwebp -q "$QUALITY_SM" "$tmp" -o "$OUT_DIR/tex-${short}-sm.webp" > /dev/null 2>&1

  # Pixelated: 120px wide — stretched via CSS cover for chunky pixel blocks
  cp "$src" "$tmp"
  sips --resampleWidth 120 "$tmp" --out "$tmp" > /dev/null 2>&1
  cwebp -q "$QUALITY_PIX" "$tmp" -o "$OUT_DIR/tex-${short}-pix.webp" > /dev/null 2>&1

  # Blur placeholder: 64px wide
  cp "$src" "$tmp"
  sips --resampleWidth 64 "$tmp" --out "$tmp" > /dev/null 2>&1
  cwebp -q "$QUALITY_BLUR" "$tmp" -o "$OUT_DIR/tex-${short}-blur.webp" > /dev/null 2>&1

  rm -f "$tmp"

  # Report sizes
  lg_size=$(stat -f%z "$OUT_DIR/tex-${short}-lg.webp" 2>/dev/null || echo 0)
  sm_size=$(stat -f%z "$OUT_DIR/tex-${short}-sm.webp" 2>/dev/null || echo 0)
  pix_size=$(stat -f%z "$OUT_DIR/tex-${short}-pix.webp" 2>/dev/null || echo 0)
  blur_size=$(stat -f%z "$OUT_DIR/tex-${short}-blur.webp" 2>/dev/null || echo 0)
  echo "  lg: ${lg_size}B  sm: ${sm_size}B  pix: ${pix_size}B  blur: ${blur_size}B"
done

echo ""
echo "Done. Total files:"
ls -1 "$OUT_DIR"/*.webp | wc -l
echo "Total size:"
du -sh "$OUT_DIR"
