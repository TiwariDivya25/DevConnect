// src/components/CodeBlock.tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code, language = '' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-3 group">
      {/* Header with language and copy button */}
      <div className="flex justify-between items-center mb-1 px-1">
        {language && (
          <span className="text-xs font-mono text-cyan-300 px-2 py-1 bg-cyan-900/30 rounded">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-sm font-mono transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-300">Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code block */}
      <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};