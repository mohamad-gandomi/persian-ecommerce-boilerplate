'use client';

import * as React from 'react';
import { marked } from 'marked';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = React.useMemo(() => {
    if (!content || !content.trim()) return '';
    try {
      return marked.parse(content, { async: false, breaks: true, gfm: true }) as string;
    } catch {
      return content;
    }
  }, [content]);

  if (!html) {
    return (
      <div className="text-muted-foreground text-center py-12 italic text-sm">
        No content written yet. Switch to Write mode to compose your story.
      </div>
    );
  }

  return (
    <div
      className="article-rendered-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
