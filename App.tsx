
import React, { useState, useCallback, useEffect } from 'react';
import { FrameworkType, AnalysisResult } from './types';
import { FRAMEWORKS } from './constants';
import { generateStrategy } from './services/geminiService';
import { 
  Search, PlusCircle, History, BookOpen, Settings, Send, 
  Loader2, Download, Copy, Trash2, CheckCircle, Info, 
  Key, ShieldCheck, AlertCircle, X, ExternalLink, Lightbulb, HelpCircle, Eye, EyeOff
} from 'lucide-react';

const App: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<FrameworkType>(FrameworkType.PRD);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // API 키 로컬 스토리지 관리
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('user_gemini_api_key') || '');
  const [tempKey, setTempKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('strategy_history');
    if (saved) {
      try { setResults(JSON.parse(saved)); } catch (e) { console.error("Failed to parse history"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('strategy_history', JSON.stringify(results));
  }, [results]);

  const handleSaveKey = () => {
    const trimmedKey = tempKey.trim();
    if (trimmedKey) {
      localStorage.setItem('user_gemini_api_key', trimmedKey);
      setApiKey(trimmedKey);
      setTempKey('');
      setError(null);
      alert("API 키가 브라우저에 성공적으로 저장되었습니다.");
    }
  };

  const handleClearKey = () => {
    if (window.confirm("저장된 API 키를 삭제하시겠습니까?")) {
      localStorage.removeItem('user_gemini_api_key');
      setApiKey('');
      setTempKey('');
    }
  };

  const handleClearData = () => {
    if (window.confirm("모든 생성 히스토리와 데이터를 삭제하시겠습니까?")) {
      setResults([]);
      setCurrentResult(null);
      localStorage.removeItem('strategy_history');
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    if (!apiKey && !process.env.API_KEY) {
      setError("API 키가 없습니다. 설정에서 무료 API 키를 입력해주세요.");
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentResult(null);

    try {
      const generatedContent = await generateStrategy(userInput, activeFramework, apiKey);
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        framework: activeFramework,
        title: userInput.length > 30 ? userInput.substring(0, 30) + '...' : userInput,
        content: generatedContent,
        timestamp: Date.now(),
      };
      setResults(prev => [newResult, ...prev]);
      setCurrentResult(newResult);
      setUserInput('');
    } catch (err: any) {
      setError(err.message || "예상치 못한 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
    if (currentResult?.id === id) setCurrentResult(null);
  };

  const frameworkInfo = FRAMEWORKS.find(f => f.type === activeFramework)!;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">G</div>
          <h1 className="font-bold text-lg tracking-tight">전략 엔진</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">프레임워크</h2>
            <div className="space-y-1">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.type}
                  onClick={() => { setActiveFramework(fw.type); setCurrentResult(null); }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                    activeFramework === fw.type ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{fw.icon}</span>
                  <span className="text-sm">{fw.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">히스토리</h2>
            <div className="space-y-1">
              {results.length === 0 ? (
                <p className="px-3 text-xs text-slate-400 italic">내역이 없습니다</p>
              ) : (
                results.slice(0, 15).map((res) => (
                  <div key={res.id} className="group relative">
                    <button
                      onClick={() => { setCurrentResult(res); setActiveFramework(res.framework); }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-xs truncate pr-8 ${
                        currentResult?.id === res.id ? 'bg-slate-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {res.title}
                    </button>
                    <button onClick={() => deleteResult(res.id)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <Settings size={18} className="group-hover:rotate-45 transition-transform" />
              <span className="text-sm font-medium">설정 및 API 키</span>
            </div>
            {!apiKey && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl">{frameworkInfo.icon}</span>
            <div>
              <h2 className="font-bold text-slate-800">{frameworkInfo.label}</h2>
              <p className="text-xs text-slate-400">{frameworkInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentResult && (
              <>
                <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">
                  {isCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  {isCopied ? '복사됨' : '복사하기'}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  <Download size={16} /> PDF 내보내기
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in duration-300">
              <Info className="mt-0.5 shrink-0" size={18} />
              <div className="text-sm flex-1"><p className="font-semibold">생성 오류</p><p>{error}</p></div>
              <button onClick={() => setError(null)}><X size={16} /></button>
            </div>
          )}

          {!currentResult && !isGenerating ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Framework Guide Card */}
              <div className="bg-white border border-indigo-100 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                      <HelpCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{frameworkInfo.label}는 무엇인가요?</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                    "{frameworkInfo.easyExplanation}"
                  </p>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50 flex items-start gap-3">
                    <Lightbulb className="text-amber-500 shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">실제 예시</p>
                      <p className="text-sm text-slate-600">{frameworkInfo.example}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-xl mx-auto py-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">당신의 아이디어를 들려주세요!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">아래 입력창에 생각하고 계신 비즈니스나 제품 아이디어를 적어주세요. 전문적인 전략 문서를 만들어 드릴게요.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all text-left group" onClick={() => setUserInput("클래식카 마니아들이 부품을 거래하고 복원 팁을 공유하는 구독형 커뮤니티 플랫폼")}>
                    <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-tight group-hover:translate-x-1 transition-transform">예시 1</p>
                    <p className="text-sm text-slate-600 line-clamp-2">클래식카 복원 및 부품 거래 소셜 마켓플레이스</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all text-left group" onClick={() => setUserInput("로컬 유기농 베이커리의 전국구 냉동 생지 배송 서비스 확장 전략")}>
                    <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-tight group-hover:translate-x-1 transition-transform">예시 2</p>
                    <p className="text-sm text-slate-600 line-clamp-2">베이커리의 전국 단위 D2C 배송 서비스 확장</p>
                  </div>
                </div>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600 text-xs">분석 중...</div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">전략 설계 중...</h3>
              <p className="text-slate-500 animate-pulse">Gemini 3 Flash가 전문 컨설턴트의 시각으로 분석하고 있습니다.</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{currentResult.title}</h1>
                  <p className="text-sm text-slate-400">{new Date(currentResult.timestamp).toLocaleDateString()} 생성 | {currentResult.framework} 프레임워크 적용</p>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-normal bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
                {currentResult.content}
              </div>
              <footer className="mt-12 text-center text-xs text-slate-400 pb-10">
                <p>© 2024 비즈니스 인텔리전스 전략 엔진. Powered by Google Gemini 3 Flash (무료 플랜).</p>
                <p className="mt-1 italic">생성된 결과물은 전문가의 검토가 필요합니다.</p>
              </footer>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-slate-200 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`${frameworkInfo.label}를 만들기 위한 아이디어를 적어주세요... (Shift+Enter로 전송)`}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[60px] max-h-[200px] resize-none text-slate-700 shadow-inner"
              rows={1}
              disabled={isGenerating}
            />
            <div className="absolute right-3 bottom-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !userInput.trim()}
                className={`flex items-center justify-center p-3 rounded-xl transition-all shadow-md ${
                  !userInput.trim() || isGenerating ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                }`}
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Settings size={20} /></div>
                  <h3 className="font-bold text-slate-800">설정 및 API 관리</h3>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Key size={16} className="text-indigo-500" />Gemini API 키 입력</h4>
                    {apiKey ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><ShieldCheck size={10} /> 키 설정됨</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><AlertCircle size={10} /> 키 미설정</span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <input 
                        type={showKey ? "text" : "password"}
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder={apiKey ? "새 API 키를 입력하여 변경..." : "Gemini API 키를 붙여넣으세요..."}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveKey}
                        disabled={!tempKey.trim()}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                          tempKey.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        키 저장하기
                      </button>
                      {apiKey && (
                        <button 
                          onClick={handleClearKey}
                          className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Info size={12} className="inline mr-1 mb-0.5" /> 
                    입력하신 키는 브라우저의 로컬 저장소(LocalStorage)에만 저장되며, 서버로 전송되지 않습니다. 
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold ml-1 hover:underline">무료 키 발급받기 →</a>
                  </p>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Trash2 size={16} className="text-red-500" />데이터 관리</h4>
                  <button onClick={handleClearData} className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all border border-red-100">모든 생성 히스토리 초기화</button>
                </div>
              </div>
              <div className="p-6 bg-slate-50 text-center">
                <button onClick={() => setShowSettings(false)} className="px-8 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-lg">닫기</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .prose h1 { @apply text-4xl font-extrabold mb-6 text-slate-900; }
        .prose h2 { @apply text-2xl font-bold mt-12 mb-6 border-b border-slate-200 pb-3 text-indigo-700; }
        .prose h3 { @apply text-xl font-bold mt-8 mb-4 text-slate-800 border-l-4 border-indigo-400 pl-3; }
        .prose p { @apply mb-5 leading-8 text-slate-700; }
        .prose table { @apply w-full my-8 border-collapse shadow-sm rounded-lg overflow-hidden border border-slate-200; }
        .prose th { @apply bg-slate-100 border border-slate-200 p-4 text-left font-bold text-slate-800; }
        .prose td { @apply border border-slate-200 p-4 bg-white text-slate-600; }
        .prose ul { @apply list-disc ml-8 mb-6 space-y-2; }
        .prose li { @apply text-slate-700; }
        .prose blockquote { @apply border-l-4 border-indigo-500 pl-6 italic text-slate-500 my-8 py-2 bg-indigo-50/30 rounded-r-lg; }
      `}</style>
    </div>
  );
};

export default App;
