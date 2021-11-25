set -e

set -o allexport
[[ -f .env ]] && source .env
set +o allexport

flow project deploy \
    --network=testnet \
    --update
