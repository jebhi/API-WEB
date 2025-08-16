import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: (code: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
} as any);

export function renderMarkdown(md: string) {
  const dirty = marked.parse(md);
  const clean = DOMPurify.sanitize(dirty);
  return { __html: clean };
}
