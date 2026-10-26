#!/usr/bin/env bash
# Run this only after Django, Express/MongoDB and the sentiment service are running.
# Example: USER_NAME=root USER_PASS='your-password' bash tools/curl_tests.sh
set -u

BASE="${BASE:-http://localhost:8000}"
SENT="${SENT:-http://localhost:5050}"
OUT_DIR="${OUT_DIR:-submission_outputs}"
mkdir -p "$OUT_DIR"
COOKIE_JAR="$OUT_DIR/cookies.txt"

run_file() {
  local filename="$1"
  local description="$2"
  shift 2
  (
    printf '# %s\n' "$description"
    printf '$'
    printf ' %q' "$@"
    printf '\n\n'
    "$@"
    status=$?
    printf '\n\n# Exit code: %s\n' "$status"
    exit "$status"
  ) > "$OUT_DIR/$filename" 2>&1
  local status=$?
  cat "$OUT_DIR/$filename"
  printf '\nSaved: %s/%s\n\n' "$OUT_DIR" "$filename"
  return "$status"
}

USER_NAME="${USER_NAME:-root}"
USER_PASS="${USER_PASS:-}"
if [[ -z "$USER_PASS" ]]; then
  read -r -s -p "Password for Django user '$USER_NAME': " USER_PASS
  printf '\n'
fi

run_file loginuser "Login request; cookie jar is saved for the logout test" \
  curl -sS -i -c "$COOKIE_JAR" -X POST -H 'Content-Type: application/json' \
  -d "{\"userName\":\"$USER_NAME\",\"password\":\"$USER_PASS\"}" "$BASE/djangoapp/login" || true

run_file logoutuser "Logout request using the login cookie" \
  curl -sS -i -b "$COOKIE_JAR" "$BASE/djangoapp/logout" || true

run_file getdealerreviews "Reviews for dealer ID 1" \
  curl -sS -i "$BASE/djangoapp/reviews/dealer/1" || true
run_file getalldealers "All dealerships" \
  curl -sS -i "$BASE/djangoapp/get_dealers" || true
run_file getdealerbyid "Dealership details for ID 1" \
  curl -sS -i "$BASE/djangoapp/dealer/1" || true
run_file getdealersbyState "Dealerships located in Kansas" \
  curl -sS -i "$BASE/djangoapp/get_dealers/Kansas" || true
run_file getallcarmakes "All car makes and models" \
  curl -sS -i "$BASE/djangoapp/get_cars" || true
run_file analyzereview "Sentiment analysis for Fantastic services" \
  curl -sS -i "$SENT/analyze/Fantastic%20services" || true

echo "Finished. Review files in $OUT_DIR; make sure each response is successful before submitting."
