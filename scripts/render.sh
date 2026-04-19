#!/usr/bin/env bash
# Thin wrapper over Render's REST API. Reads $RENDER_API_KEY from
# .claude/render.env (gitignored) so the token never hits the repo.
#
# Usage:
#   scripts/render.sh services                # list services (to find ID)
#   scripts/render.sh status                  # latest deploy state of the backend
#   scripts/render.sh deploys                 # last 5 deploys with timestamps
#   scripts/render.sh wait                    # block until latest deploy is live
#   scripts/render.sh redeploy                # trigger a new deploy
#   scripts/render.sh env                     # list non-secret env vars

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.claude/render.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found. Create it with:" >&2
  echo "  RENDER_API_KEY=rnd_xxxxx" >&2
  echo "  RENDER_SERVICE_ID=srv-xxxxx  (optional — auto-discovered on first run)" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${RENDER_API_KEY:-}" ]]; then
  echo "error: RENDER_API_KEY not set in $ENV_FILE" >&2
  exit 1
fi

API="https://api.render.com/v1"
AUTH=(-H "Authorization: Bearer $RENDER_API_KEY" -H "Accept: application/json")

# Resolve service id: explicit env overrides auto-discovery by name.
resolve_service_id() {
  if [[ -n "${RENDER_SERVICE_ID:-}" ]]; then
    echo "$RENDER_SERVICE_ID"
    return
  fi
  local name="${RENDER_SERVICE_NAME:-layla-backend}"
  local id
  id=$(curl -sS "${AUTH[@]}" "$API/services?name=$name&limit=20" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
        const arr=JSON.parse(d);
        const hit=arr.find(x=>x.service&&x.service.name==='$name');
        if(!hit){console.error('no service named $name');process.exit(1)}
        console.log(hit.service.id);
      })")
  echo "$id"
}

cmd="${1:-status}"
shift || true

case "$cmd" in
  services)
    curl -sS "${AUTH[@]}" "$API/services?limit=50" \
      | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
          const arr=JSON.parse(d);
          arr.forEach(x=>console.log(x.service.id, '\t', x.service.type, '\t', x.service.name));
        })"
    ;;
  status)
    sid=$(resolve_service_id)
    curl -sS "${AUTH[@]}" "$API/services/$sid/deploys?limit=1" \
      | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
          const arr=JSON.parse(d);
          if(!arr.length){console.log('(no deploys)');return}
          const d0=arr[0].deploy;
          console.log(JSON.stringify({
            id:d0.id, status:d0.status, commit:d0.commit&&d0.commit.id&&d0.commit.id.slice(0,7),
            message:d0.commit&&d0.commit.message&&d0.commit.message.split('\n')[0].slice(0,80),
            createdAt:d0.createdAt, finishedAt:d0.finishedAt||null,
          }, null, 2));
        })"
    ;;
  deploys)
    sid=$(resolve_service_id)
    curl -sS "${AUTH[@]}" "$API/services/$sid/deploys?limit=5" \
      | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
          const arr=JSON.parse(d);
          arr.forEach(x=>{const d0=x.deploy;
            console.log([d0.createdAt, (d0.commit&&d0.commit.id||'').slice(0,7), d0.status,
              (d0.commit&&d0.commit.message||'').split('\n')[0].slice(0,70)].join(' | '));
          });
        })"
    ;;
  wait)
    sid=$(resolve_service_id)
    while true; do
      status=$(curl -sS "${AUTH[@]}" "$API/services/$sid/deploys?limit=1" \
        | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
            const a=JSON.parse(d); console.log(a[0]&&a[0].deploy&&a[0].deploy.status||'unknown');
          })")
      echo "$(date +%H:%M:%S) → $status"
      case "$status" in
        live) echo "✓ live"; exit 0 ;;
        build_failed|update_failed|canceled|deactivated) echo "✗ $status"; exit 1 ;;
      esac
      sleep 10
    done
    ;;
  redeploy)
    sid=$(resolve_service_id)
    curl -sS -X POST "${AUTH[@]}" "$API/services/$sid/deploys" \
      -H "Content-Type: application/json" -d '{"clearCache":"do_not_clear"}' \
      | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
          console.log(JSON.stringify(JSON.parse(d),null,2));
        })"
    ;;
  env)
    sid=$(resolve_service_id)
    curl -sS "${AUTH[@]}" "$API/services/$sid/env-vars?limit=50" \
      | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
          const arr=JSON.parse(d);
          arr.forEach(x=>console.log(x.envVar.key,'=',(x.envVar.value||'[secret]')));
        })"
    ;;
  *)
    echo "usage: $0 {services|status|deploys|wait|redeploy|env}" >&2
    exit 2
    ;;
esac
