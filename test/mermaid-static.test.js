'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  compactLinearFlowchart,
  replaceMermaidFences,
  staticDiagramMarkup,
  clientDiagramMarkup
} = require('../tools/lib/mermaid-static');

test('Mermaid fences become client-rendered diagrams', async () => {
  const markdown = [
    'Before',
    '',
    '```mermaid',
    'flowchart LR',
    '  A --> B',
    '```',
    '',
    'After'
  ].join('\n');
  const result = await replaceMermaidFences(markdown);

  assert.doesNotMatch(result, /```mermaid/);
  assert.match(result, /class="mermaid-diagram mermaid-client"/);
  assert.match(result, /data-mermaid-source="flowchart LR\n  A --&gt; B"/);
  assert.match(result, /Before[\s\S]*After/);
});

test('non-Mermaid Markdown remains unchanged', async () => {
  const markdown = '```js\nconsole.log("ok");\n```';
  assert.equal(await replaceMermaidFences(markdown, async () => {
    throw new Error('renderer should not run');
  }), markdown);
});

test('static diagram markup exposes a single accessible figure', () => {
  const markup = staticDiagramMarkup('flowchart TD\nA --> B', '<svg></svg>', '<svg></svg>');
  assert.match(markup, /role="img"/);
  assert.match(markup, /aria-label="Mermaid flowchart diagram"/);
  assert.equal((markup.match(/aria-hidden="true"/g) || []).length, 2);
});

test('long horizontal chains become compact two-step rows', () => {
  const compact = compactLinearFlowchart([
    'flowchart LR',
    'A[Mix Space] -->|API| B[GitHub Actions]',
    'B --> C[Fetch lists]',
    'C --> D[Fetch details]',
    'D --> E[Allocate slug]',
    'E --> F[Generate posts]',
    'F --> G[Build Hexo]',
    'G --> H[Publish Pages]'
  ].join('\n'));

  assert.match(compact, /^flowchart TB/);
  assert.match(compact, /subgraph mermaid_row_1/);
  assert.match(compact, /A\[Mix Space\] -->\|API\| B\[GitHub Actions\]/);
  assert.match(compact, /mermaid_row_1 --> mermaid_row_2/);
  assert.match(compact, /style mermaid_row_4 fill:transparent,stroke:transparent/);
});
