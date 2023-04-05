import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  value: string;
}

export const MarkdownPreview: React.FC<Props> = ({ value }) => {
  return (
    <div className="prose prose-sm">
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  );
};
