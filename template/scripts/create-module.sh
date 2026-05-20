#!/bin/bash

set -e

# Module scaffolding script
# Usage: ./scripts/create-module.sh <type> <name>
# Example: ./scripts/create-module.sh feature payments
#          ./scripts/create-module.sh domain order

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
  echo "Usage: $0 <type> <name>"
  echo ""
  echo "Types:"
  echo "  feature  - Create a feature module (screens, api, storage, translations)"
  echo "  domain   - Create a domain module (api, storage, store)"
  echo "  shared   - Create a shared utility module"
  echo ""
  echo "Examples:"
  echo "  $0 feature payments"
  echo "  $0 domain order"
  echo "  $0 shared analytics"
  exit 1
}

if [ $# -lt 2 ]; then
  usage
fi

TYPE="$1"
NAME="$2"

# Validate type
if [[ "$TYPE" != "feature" && "$TYPE" != "domain" && "$TYPE" != "shared" ]]; then
  echo "Error: Invalid type '$TYPE'. Must be 'feature', 'domain', or 'shared'."
  usage
fi

# Validate name (lowercase, alphanumeric, hyphens)
if [[ ! "$NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: Module name must be lowercase alphanumeric with hyphens (e.g., 'my-module')."
  exit 1
fi

# Determine paths
case "$TYPE" in
  feature)
    MODULE_DIR="$ROOT_DIR/modules/features/$NAME"
    PACKAGE_NAME="@modules/features/$NAME"
    ALIAS="@modules/features-$NAME"
    LINK_PATH="link:./modules/features/$NAME"
    ;;
  domain)
    MODULE_DIR="$ROOT_DIR/modules/domain/$NAME"
    PACKAGE_NAME="@modules/domain/$NAME"
    ALIAS="@modules/domain-$NAME"
    LINK_PATH="link:./modules/domain/$NAME"
    ;;
  shared)
    MODULE_DIR="$ROOT_DIR/modules/$NAME"
    PACKAGE_NAME="@modules/$NAME"
    ALIAS="@modules/$NAME"
    LINK_PATH="link:./modules/$NAME"
    ;;
esac

# Check if module already exists
if [ -d "$MODULE_DIR" ]; then
  echo "Error: Module directory already exists: $MODULE_DIR"
  exit 1
fi

echo "Creating $TYPE module: $NAME"
echo "  Directory: $MODULE_DIR"
echo "  Package:   $PACKAGE_NAME"
echo "  Alias:     $ALIAS"
echo ""

# Pascal case conversion for component/screen names
PASCAL_NAME=$(echo "$NAME" | perl -pe 's/(^|-)(\w)/uc($2)/ge')

# Create directory structure
mkdir -p "$MODULE_DIR/src"

# Create package.json
cat > "$MODULE_DIR/package.json" << EOF
{
  "name": "$PACKAGE_NAME",
  "version": "0.0.0",
  "description": "${PASCAL_NAME} Module",
  "main": "src/index",
  "author": "",
  "license": "UNLICENSED",
  "homepage": "#readme",
  "create-react-native-library": {
    "languages": "js",
    "type": "library",
    "version": "0.47.0"
  }
}
EOF

# Create structure based on type
case "$TYPE" in
  feature)
    mkdir -p "$MODULE_DIR/src/screens/${PASCAL_NAME}Screen"
    mkdir -p "$MODULE_DIR/src/api/hooks"
    mkdir -p "$MODULE_DIR/src/api/services"
    mkdir -p "$MODULE_DIR/src/storage"
    mkdir -p "$MODULE_DIR/src/translations/en"
    mkdir -p "$MODULE_DIR/src/translations/ar"
    mkdir -p "$MODULE_DIR/src/__tests__"

    # Screen
    cat > "$MODULE_DIR/src/screens/${PASCAL_NAME}Screen/index.tsx" << EOF
import * as React from 'react';
import { Screen } from '@modules/components';

const ${PASCAL_NAME}Screen = () => <Screen />;

export default React.memo(${PASCAL_NAME}Screen);
EOF

    cat > "$MODULE_DIR/src/screens/index.ts" << EOF
export { default as ${PASCAL_NAME}Screen } from './${PASCAL_NAME}Screen';
EOF

    # API
    cat > "$MODULE_DIR/src/api/services/query${PASCAL_NAME}.ts" << EOF
import { httpClient } from '@modules/core';

const getBaseUrl = () => '';

export const query${PASCAL_NAME} = {
  getBaseUrl,
};
EOF

    cat > "$MODULE_DIR/src/api/hooks/index.ts" << EOF
export {};
EOF

    cat > "$MODULE_DIR/src/api/index.ts" << EOF
export * from './hooks';
export { query${PASCAL_NAME} } from './services/query${PASCAL_NAME}';
EOF

    # Storage
    cat > "$MODULE_DIR/src/storage/index.ts" << EOF
export {};
EOF

    # Translations
    cat > "$MODULE_DIR/src/translations/en/index.ts" << EOF
export default {};
EOF

    cat > "$MODULE_DIR/src/translations/ar/index.ts" << EOF
import type en from '${ALIAS}/src/translations/en';

const ar: typeof en = {};

export default ar;
EOF

    cat > "$MODULE_DIR/src/translations/index.ts" << EOF
import ar from './ar';
import en from './en';

export default {
  en,
  ar,
};
EOF

    # Barrel export
    cat > "$MODULE_DIR/src/index.ts" << EOF
// Screens
export * from './screens';

// API
export * from './api';

// Storage
export * from './storage';

// Translations
export { default as ${NAME}Translations } from './translations';
EOF

    # Test file
    cat > "$MODULE_DIR/src/__tests__/${PASCAL_NAME}Screen.test.tsx" << EOF
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { ${PASCAL_NAME}Screen } from '${ALIAS}';

describe('${PASCAL_NAME}Screen', () => {
  it('renders without crashing', async () => {
    const { toJSON } = await render(<${PASCAL_NAME}Screen />);
    expect(toJSON()).toBeTruthy();
  });
});
EOF
    ;;

  domain)
    mkdir -p "$MODULE_DIR/src/api/fakers"
    mkdir -p "$MODULE_DIR/src/api/hooks"
    mkdir -p "$MODULE_DIR/src/api/services"
    mkdir -p "$MODULE_DIR/src/storage"
    mkdir -p "$MODULE_DIR/src/store"
    mkdir -p "$MODULE_DIR/src/__tests__"

    # Store
    cat > "$MODULE_DIR/src/store/${NAME}.ts" << EOF
import { createSlice } from '@reduxjs/toolkit';

export interface ${PASCAL_NAME}State {}

const initialState: ${PASCAL_NAME}State = {};

const ${NAME}Slice = createSlice({
  name: '${NAME}',
  initialState,
  reducers: {},
});

export default ${NAME}Slice.reducer;
EOF

    cat > "$MODULE_DIR/src/store/index.ts" << EOF
export { default as ${NAME}Reducer } from './${NAME}';
export type { ${PASCAL_NAME}State } from './${NAME}';
EOF

    # API
    cat > "$MODULE_DIR/src/api/services/query${PASCAL_NAME}.ts" << EOF
import { httpClient } from '@modules/core';

const getBaseUrl = () => '';

export const query${PASCAL_NAME} = {
  getBaseUrl,
};
EOF

    cat > "$MODULE_DIR/src/api/hooks/index.ts" << EOF
export {};
EOF

    cat > "$MODULE_DIR/src/api/index.ts" << EOF
export * from './hooks';
export { query${PASCAL_NAME} } from './services/query${PASCAL_NAME}';
EOF

    # Storage
    cat > "$MODULE_DIR/src/storage/index.ts" << EOF
export {};
EOF

    # Barrel
    cat > "$MODULE_DIR/src/index.ts" << EOF
// Store
export * from './store';

// API
export * from './api';

// Storage
export * from './storage';
EOF
    ;;

  shared)
    mkdir -p "$MODULE_DIR/src/__tests__"

    # Barrel
    cat > "$MODULE_DIR/src/index.ts" << EOF
export {};
EOF
    ;;
esac

echo "✓ Module scaffolded at $MODULE_DIR"
echo ""
echo "Next steps:"
echo "  1. Add to package.json dependencies:"
echo "     \"$ALIAS\": \"$LINK_PATH\""
echo "  2. Add to tsconfig.json paths:"
echo "     \"$ALIAS\": [\"./${MODULE_DIR#$ROOT_DIR/}/src\"]"
echo "     \"$ALIAS/*\": [\"./${MODULE_DIR#$ROOT_DIR/}/src/*\"]"
echo "  3. Run: yarn install"
echo "  4. Add to jest.config.js moduleNameMapper if needed"
echo ""
