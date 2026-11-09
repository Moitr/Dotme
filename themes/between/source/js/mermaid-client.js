(function () {
  'use strict';

  if (!window.mermaid) return;

  var renderedCount = 0;

  function renderMermaidDiagrams() {
    var diagrams = Array.prototype.slice.call(document.querySelectorAll('.mermaid-client'));
    if (!diagrams.length) return;
    var dark = document.documentElement.classList.contains('dark');
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: 'Inter, Arial, sans-serif',
      flowchart: { htmlLabels: true, useMaxWidth: true },
      themeVariables: dark ? {
        background: '#1b1e23', primaryColor: '#24282f', primaryTextColor: '#e5e7eb',
        primaryBorderColor: '#454b55', lineColor: '#a1a7b0', secondaryColor: '#20242a',
        tertiaryColor: '#24282f', clusterBkg: '#20242a', clusterBorder: '#454b55',
        edgeLabelBackground: '#20242a', fontSize: '15px'
      } : {
        background: '#f5f6f8', primaryColor: '#fff', primaryTextColor: '#202328',
        primaryBorderColor: '#d7dbe1', lineColor: '#737982', secondaryColor: '#f5f6f8',
        tertiaryColor: '#fff', clusterBkg: '#f5f6f8', clusterBorder: '#d7dbe1',
        edgeLabelBackground: '#f5f6f8', fontSize: '15px'
      }
    });
    diagrams.forEach(function (figure) {
      var source = figure.getAttribute('data-mermaid-source');
      var canvas = figure.querySelector('.mermaid-client-canvas');
      if (!source || !canvas || canvas.dataset.renderedTheme === (dark ? 'dark' : 'light')) return;
      var id = 'mermaid-client-' + (++renderedCount);
      window.mermaid.render(id, source, canvas).then(function (result) {
        canvas.innerHTML = result.svg;
        canvas.dataset.renderedTheme = dark ? 'dark' : 'light';
      }).catch(function () {
        canvas.textContent = 'Unable to render diagram.';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', renderMermaidDiagrams);
  document.addEventListener('site:page-view', renderMermaidDiagrams);
  window.addEventListener('themechange', renderMermaidDiagrams);
}());
