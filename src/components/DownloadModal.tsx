import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, CheckCircle2, Copy, ExternalLink, X, ArrowDownToLine, Sparkles, Share, PlusSquare, MonitorDown } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'source'>('device');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownloadZip = () => {
    setDownloadingZip(true);
    // Direct browser navigation or anchor download trigger
    const link = document.createElement('a');
    link.href = '/api/download-zip';
    link.download = 'scorers-mindset-app.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingZip(false), 2000);
  };

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('npm install && npm run dev');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div 
      id="download-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="download-modal-content"
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ArrowDownToLine className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight uppercase font-display">
                Download Scorer's Mindset
              </h2>
              <p className="text-xs text-slate-400">
                Install as a mobile/desktop app or download the full project archive
              </p>
            </div>
          </div>
          <button
            id="close-download-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 mt-5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-bold">
          <button
            id="download-tab-device"
            onClick={() => setActiveTab('device')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'device'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install on Device (PWA)</span>
          </button>
          <button
            id="download-tab-source"
            onClick={() => setActiveTab('source')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'source'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Source Code (.ZIP)</span>
          </button>
        </div>

        {/* Tab 1: Install to Phone / Desktop */}
        {activeTab === 'device' && (
          <div className="mt-5 space-y-4">
            {isInstalled ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>This app is already running in standalone installed app mode!</span>
              </div>
            ) : installPrompt ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <div className="font-bold text-white text-sm">One-Click Install Ready</div>
                  <div className="text-xs text-slate-300">Add directly to your device home screen or app launcher.</div>
                </div>
                <button
                  id="install-pwa-action-btn"
                  onClick={handleInstallPwa}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <MonitorDown className="w-4 h-4" />
                  <span>Install Now</span>
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* iPhone / iPad instructions */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad (iOS Safari)</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li>Open this app in <strong className="text-white">Safari</strong></li>
                  <li>Tap the <strong className="text-amber-300 flex-inline items-center gap-1"><Share className="w-3 h-3 inline" /> Share</strong> button at the bottom</li>
                  <li>Scroll down and tap <strong className="text-amber-300 flex-inline items-center gap-1"><PlusSquare className="w-3 h-3 inline" /> Add to Home Screen</strong></li>
                  <li>Launches full-screen with zero browser address bars</li>
                </ol>
              </div>

              {/* Android / Chrome / Desktop instructions */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Laptop className="w-4 h-4" />
                  <span>Android & Desktop (Chrome/Edge)</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li>In Chrome or Edge, look at the right side of the address bar</li>
                  <li>Click the <strong className="text-amber-300">Install</strong> icon or open browser settings (⋮)</li>
                  <li>Select <strong className="text-amber-300">"Install Scorer's Mindset"</strong></li>
                  <li>Enjoy instant offline launch court-side or in the gym</li>
                </ol>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                All your custom anchor mantras, flow sessions, and diagnostic scores save permanently to your device local storage.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Download Source Code (.ZIP) */}
        {activeTab === 'source' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-amber-400" />
                  <span>Full Application Source (.ZIP)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete repository with React 19, Vite, Tailwind CSS, and Express backend.
                </p>
              </div>
              <button
                id="direct-download-zip-btn"
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{downloadingZip ? 'Packing ZIP...' : 'Download ZIP'}</span>
              </button>
            </div>

            {/* Quick Run Instructions */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300">How to run locally after extracting:</div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-amber-300">
                <span>npm install && npm run dev</span>
                <button
                  id="copy-npm-cmd-btn"
                  onClick={handleCopyCmd}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCmd ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* AI Studio Export option */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Platform Export Option:</span>
              </div>
              <p>
                You can also click the top-right <strong className="text-white">Settings / Three-Dots menu</strong> in Google AI Studio and select <strong className="text-amber-300">"Export to ZIP"</strong> or <strong className="text-amber-300">"Export to GitHub"</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            id="close-download-modal-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
