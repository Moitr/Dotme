'use strict';

const { compactLinearFlowchart, replaceMermaidFences } = require('../tools/lib/mermaid-static');

hexo.extend.filter.register('before_post_render', async (data) => {
  if (!/^[ \t]{0,3}(?:`{3,}|~{3,})[ \t]*mermaid\b/im.test(data.content || '')) return data;
  try {
    data.content = await replaceMermaidFences(data.content);
    return data;
  } catch (error) {
    const source = data.source || data.path || data.title || 'unknown post';
    throw new Error(`Unable to render Mermaid in ${source}: ${error.message}`);
  }
}, 0);
