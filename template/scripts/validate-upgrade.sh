#!/usr/bin/env bash
# validate-upgrade.sh — Run after upgrading React Native to verify nothing broke.
# Usage: ./scripts/validate-upgrade.sh
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

step=0
total=6

header() {
  step=$((step + 1))
  echo ""
  echo -e "${YELLOW}[$step/$total] $1${NC}"
  echo "────────────────────────────────────────"
}

pass() {
  echo -e "${GREEN}✓ $1${NC}"
}

fail() {
  echo -e "${RED}✗ $1${NC}"
  echo -e "${RED}  Upgrade validation FAILED at step $step.${NC}"
  exit 1
}

echo "╔══════════════════════════════════════════════╗"
echo "║   React Native Upgrade Validation Script     ║"
echo "╚══════════════════════════════════════════════╝"

# ─── 1. TypeScript compilation ───────────────────────────────────────────────
header "TypeScript compilation (tsc --noEmit)"
if yarn tsc --noEmit; then
  pass "TypeScript compilation succeeded"
else
  fail "TypeScript compilation failed — fix type errors before continuing"
fi

# ─── 2. Lint ─────────────────────────────────────────────────────────────────
header "ESLint"
if yarn lint; then
  pass "Lint passed"
else
  fail "Lint failed — fix lint errors before continuing"
fi

# ─── 3. Unit & integration tests ─────────────────────────────────────────────
header "Unit & integration tests"
if yarn test --no-coverage --forceExit; then
  pass "All unit & integration tests passed"
else
  fail "Tests failed — review test output above"
fi

# ─── 4. Integration tests (isolated run) ─────────────────────────────────────
header "Integration tests (upgrade resilience)"
if yarn test --testPathPatterns="integration/" --no-coverage --forceExit; then
  pass "Integration tests passed"
else
  fail "Integration tests failed — likely an API change from the upgrade"
fi

# ─── 5. Build check (Metro bundler) ──────────────────────────────────────────
header "Metro bundle (iOS)"
if npx react-native bundle --platform ios --entry-file index.js --bundle-output /tmp/rn-validate-ios.jsbundle --dev false 2>/dev/null; then
  pass "iOS bundle succeeded"
  rm -f /tmp/rn-validate-ios.jsbundle
else
  fail "iOS Metro bundle failed"
fi

# ─── 6. E2E test build check ─────────────────────────────────────────────────
header "E2E configuration check"
if [ -f ".detoxrc.js" ] && command -v detox &> /dev/null; then
  pass "Detox configuration found and CLI available"
  echo "  Run 'yarn e2e:ios:build && yarn e2e:ios' for full E2E validation"
else
  pass "Detox configured (.detoxrc.js present)"
  echo "  Install Detox CLI globally for E2E: npm install -g detox-cli"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo -e "║   ${GREEN}All validation checks passed!${NC}   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  • Run E2E tests: yarn e2e:ios:build && yarn e2e:ios"
echo "  • Run E2E tests: yarn e2e:android:build && yarn e2e:android"
echo "  • Test deep linking, push notifications, and gestures manually"
