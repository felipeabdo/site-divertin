#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$ROOT/public"
SRC_DIR="$ROOT/src"

if [[ ! -d "$PUBLIC_DIR" ]]; then
  echo "ERRO: pasta public/ não encontrada em: $ROOT" >&2
  exit 1
fi

echo "=== 25 maiores arquivos de public/ ==="
find "$PUBLIC_DIR" -type f -printf '%s\t%p\0' \
  | sort -z -nr \
  | head -z -n 25 \
  | while IFS=$'\t' read -r -d '' bytes path; do
      mib=$(awk -v b="$bytes" 'BEGIN { printf "%.2f", b / 1048576 }')
      rel="${path#"$ROOT/"}"
      if grep -RIlF --exclude-dir=node_modules --exclude-dir=.next -- "$rel" "$SRC_DIR" >/dev/null 2>&1; then
        status="referência literal localizada em src/"
      elif grep -RIlF --exclude-dir=node_modules --exclude-dir=.next -- "$(basename "$path")" "$SRC_DIR" >/dev/null 2>&1; then
        status="nome localizado em src/ (confira o caminho)"
      else
        status="nenhuma referência literal em src/; confirme antes de remover"
      fi
      printf '%7s MiB  %s\n          %s\n' "$mib" "$rel" "$status"
    done

echo
echo "=== Sugestões ==="
echo "- Não apague imagens com base apenas nesta lista; confira também CSS, configurações e outros diretórios."
echo "- next/image otimiza imagens estáticas usadas pelo componente Image durante a entrega; não reduz o arquivo original em public/."
echo "- GIFs animados são servidos no formato original pelo otimizador padrão do Next.js."
