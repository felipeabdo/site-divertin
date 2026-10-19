#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT="$ROOT/public/descanso.gif"
OUTPUT="$ROOT/public/descanso-candidato.webp"

if [[ ! -f "$INPUT" ]]; then
  echo "ERRO: não encontrei $INPUT" >&2
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ERRO: ffmpeg não está instalado. No Ubuntu/Zorin, instale com: sudo apt install ffmpeg" >&2
  exit 1
fi
if ! ffmpeg -hide_banner -encoders 2>/dev/null | grep -q 'libwebp_anim'; then
  echo "ERRO: seu ffmpeg não oferece o encoder libwebp_anim." >&2
  echo "Use uma compilação do FFmpeg com suporte a libwebp, ou mantenha o GIF original." >&2
  exit 1
fi

if [[ -e "$OUTPUT" ]]; then
  echo "O arquivo candidato já existe: $OUTPUT" >&2
  echo "Mova-o ou renomeie-o antes de gerar outra versão; nada será sobrescrito." >&2
  exit 1
fi

echo "Criando uma cópia candidata; o GIF original não será alterado..."
ffmpeg -hide_banner -loglevel warning -i "$INPUT" -an -vsync 0 \
  -c:v libwebp_anim -lossless 0 -quality 78 -compression_level 6 \
  -preset picture -loop 0 "$OUTPUT"

echo
echo "Tamanhos para comparação:"
du -h "$INPUT" "$OUTPUT"
echo
echo "Confira visualmente a animação, transparência e velocidade antes de trocar as referências no site."
echo "O código do site ainda usa /descanso.gif; a troca para /descanso-candidato.webp é manual e opcional."
