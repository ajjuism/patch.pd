import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Copy, Trash, Settings, Info, Coffee } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lines = text.split('\n').length;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patch.pd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const spaces = '  ';
      setText(text.substring(0, start) + spaces + text.substring(end));
      
      // Move cursor after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-2 sm:p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#252526] rounded-lg shadow-2xl overflow-hidden border border-[#323232]">
          {/* Editor Header */}
          <div className="bg-[#2d2d2d] px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 border-b border-[#323232]">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#858585]" />
              <span className="text-[#e0e0e0] font-mono text-xs sm:text-sm">patch.pd</span>
              <span className="text-[#858585] text-xs hidden sm:inline">- Pure Data File</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#323232] text-[#e0e0e0] rounded hover:bg-[#3e3e3e] transition-colors text-xs sm:text-sm"
                title="Copy to clipboard"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#323232] text-[#e0e0e0] rounded hover:bg-[#3e3e3e] transition-colors text-xs sm:text-sm"
                title="Clear editor"
              >
                <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleDownload}
                disabled={!text.trim()}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e639c] text-white rounded hover:bg-[#1177bb] disabled:bg-[#2d2d2d] disabled:text-[#858585] disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download .pd</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex h-[400px] sm:h-[500px] md:h-[600px]">
            {/* Line Numbers */}
            <div 
              ref={lineNumbersRef}
              className="bg-[#1e1e1e] text-[#858585] font-mono text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 select-none border-r border-[#323232] overflow-y-scroll scrollbar-hide"
            >
              {Array.from({ length: Math.max(lines, 1) }, (_, i) => (
                <div key={i + 1} className="leading-6 text-right pr-2">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Editor Content */}
            <textarea
              ref={textareaRef}
              className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs sm:text-sm p-2 sm:p-3 border-0 resize-none focus:ring-0 focus:outline-none leading-6 overflow-y-scroll"
              style={{ 
                height: '100%',
                caretColor: '#fff',
              }}
              placeholder="#N canvas 0 0 450 300;
#X obj 100 100 osc~ 440;
#X obj 100 150 dac~;
#X connect 0 0 1 0;"
              value={text}
              onChange={handleTextChange}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
            />
          </div>

          {/* Editor Footer */}
          <div className="bg-[#007acc] px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white font-mono flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline">Pure Data (.pd)</span>
              <span>{lines} line{lines !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>UTF-8</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-2 sm:mt-4 text-[#858585] text-xs sm:text-sm px-2 sm:px-0">
          <p>Tip: Press Tab to indent. The editor will automatically convert tabs to spaces.</p>
        </div>
      </div>

      {/* Floating Info Icon */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title="About this tool"
      >
        <Info size={24} />
      </button>

      {/* Info Dialog - Enhanced Styling */}
      {isDialogOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-[#2d2d2d] rounded-lg shadow-2xl border border-[#404040] p-5 animate-fade-in text-[#e0e0e0]">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="absolute top-3 right-3 text-[#858585] hover:text-white transition-colors duration-200 rounded-full p-1 hover:bg-[#404040]"
            aria-label="Close dialog"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4L12 12M4 12L12 4" />
            </svg>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Fun Fact!</h2>
            </div>

            <div className="space-y-3 text-[#d4d4d4]">
              <p className="text-sm leading-relaxed">
                I created this tool because I was tired of renaming text files to .pd files every single time. 
                Sometimes the simplest solutions come from the laziest problems! 
              </p>
            </div>

            {/* Add Buy Me a Coffee Link */}
            <a
              href="https://buymeacoffee.com/ajjuism"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-[#FFDD00] text-[#000000] py-2 px-4 rounded-lg hover:bg-[#FFED4A] transition-colors duration-200 w-fit"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </a>

            <div className="pt-2 border-t border-[#404040] mt-4">
              <div className="flex items-center gap-2 text-xs text-[#858585]">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Pure Data Editor
                </span>
                <span>•</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>

          {/* Enhanced triangle pointer */}
          <div className="absolute -bottom-[6px] right-8 w-3 h-3 bg-[#2d2d2d] transform rotate-45 border-r border-b border-[#404040]"></div>
        </div>
      )}
    </div>
  );
}

export default App;