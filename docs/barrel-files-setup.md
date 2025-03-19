## 8. Handling Special Cases and Case Sensitivity

For components with special naming conventions or case sensitivity issues, we provide a tool to fix specific barrel files:

```bash
# Fix a specific barrel file
npm run fix-barrel src/path/to/barrel-file.ts
```

This tool checks the barrel file against a list of known case sensitivity issues and automatically fixes them.

### Adding New Special Cases

To add a new special case to the fix-barrel tool:

1. Open `tools/fix-barrel.js`
2. Add your special case to the `KNOWN_FIXES` object:

```javascript
const KNOWN_FIXES = {
  'src/shared/components/json-viewer': { 'JsonViewer': 'JSONViewer' },
  // Add your new special case here
  'path/to/component': { 'wrongName': 'correctName' }
};
```

The fix-barrel tool is particularly useful when:
- You have components with uppercase acronyms (e.g., `JSONViewer`, `APIClient`)
- Components with special naming conventions
- Components that don't follow the standard export pattern 