// src/components/CopyButton.tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CopyButton = ({ text, className = '', size = 'md' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all duration-200 ${sizeClasses[size]} ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className={`${iconSize[size]} text-green-400`} />
          <span className="text-green-400 font-mono">Copied!</span>
        </>
      ) : (
        <>
          <Copy className={`${iconSize[size]} text-cyan-300`} />
          <span className="text-cyan-300 font-mono">Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;