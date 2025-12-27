
import React, { useState, useEffect, useRef } from 'react';
import { FrameworkType, AnalysisResult } from './types';
import { FRAMEWORKS } from './constants';
import { generateStrategy } from './services/geminiService';
import html2canvas from 'html2canvas';
import { 
  Send, Loader2, Trash2, CheckCircle, Info, 
  X, Lightbulb, HelpCircle, Target, 
  TrendingUp, Calendar, Zap, Shield, Briefcase, Activity,
  AlertCircle, Menu, Settings, Key,
  Users, Wrench, Network, Star, RefreshCcw, Download, Image as ImageIcon
} from 'lucide-react';

// --- Visual Infographic Components ---

const InfoCard = ({ title, children, icon: Icon, colorClass = "bg-white", isLean = false }: any) => (
  <div className={`${colorClass} p-6 lg:p-8 ${isLean ? 'rounded-[50px] lg:rounded-[70px]' : 'rounded-[24px]'} border border-slate-100 shadow-sm transition-all flex flex-col h-full items-center text-center`}>
    <div className="flex flex-col items-center gap-3 mb-4">
      <div className="p-2.5 rounded-full bg-white shadow-sm border border-slate-50 shrink-0">
        {Icon && <Icon size={18} className="text-slate-500" />}
      </div>
      <h4 className="font-black text-slate-800 text-[10px] lg:text-[11px] uppercase tracking-[0.2em] leading-none break-keep px-2">{title}</h4>
    </div>
    <div className="text-slate-700 text-[13px] lg:text-[14px] font-bold leading-snug flex-1 w-full flex flex-col justify-center">
      {children}
    </div>
  </div>
);

const LeanCanvasVisualizer = ({ data }: any) => {
  if (!data) return <div className="p-10 text-center text-slate-400">데이터를 불러올 수 없습니다.</div>;

  const renderContent = (val: any) => {
    if (!val) return <span className="text-slate-300 italic">내용 없음</span>;
    if (Array.isArray(val)) {
      return (
        <ul className="space-y-1.5 inline-block text-left mx-auto">
          {val.map((item, i) => (
            <li key={i} className="flex gap-1.5 items-start">
              <span className="mt-1 shrink-0 opacity-40">•</span>
              <span className="break-keep">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="break-keep">{val}</p>;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="h-full">
          <InfoCard title="Problem (문제)" icon={AlertCircle} colorClass="bg-rose-50/50 border-rose-100" isLean>
            {renderContent(data.problem)}
          </InfoCard>
        </div>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1">
            <InfoCard title="Solution (해결책)" icon={Lightbulb} colorClass="bg-emerald-50/50 border-emerald-100" isLean>
              {renderContent(data.solution)}
            </InfoCard>
          </div>
          <div className="flex-1">
            <InfoCard title="Key Metrics (지표)" icon={Activity} colorClass="bg-amber-50/50 border-amber-100" isLean>
              {renderContent(data.key_metrics)}
            </InfoCard>
          </div>
        </div>
        <div className="h-full">
          <InfoCard title="Value Prop (가치제안)" icon={Target} colorClass="bg-indigo-50/60 border-indigo-100" isLean>
            <div className="px-2">
              <p className="font-black text-indigo-700 text-[15px] lg:text-base leading-tight break-keep">
                {data.uvp || data.unique_value_proposition || "내용 없음"}
              </p>
            </div>
          </InfoCard>
        </div>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1">
            <InfoCard title="Unfair Advantage" icon={Zap} colorClass="bg-violet-50/50 border-violet-100" isLean>
              <p className="font-bold text-slate-700 break-keep leading-snug">
                {data.unfair_advantage || "내용 없음"}
              </p>
            </InfoCard>
          </div>
          <div className="flex-1">
            <InfoCard title="Channels (유입)" icon={Network} colorClass="bg-blue-50/50 border-blue-100" isLean>
              {renderContent(data.channels)}
            </InfoCard>
          </div>
        </div>
        <div className="h-full">
          <InfoCard title="Segments (고객군)" icon={Users} colorClass="bg-cyan-50/50 border-cyan-100" isLean>
            {renderContent(data.customer_segments)}
          </InfoCard>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Cost Structure (비용 구조)" icon={Briefcase} colorClass="bg-slate-50 border-slate-200">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.isArray(data.cost_structure) ? data.cost_structure.map((c: string, i: number) => (
              <span key={i} className="bg-white px-3 py-1.5 rounded-full border border-slate-100 text-[11px] font-bold text-slate-500">
                {c}
              </span>
            )) : <p>{data.cost_structure}</p>}
          </div>
        </InfoCard>
        <InfoCard title="Revenue Streams (수익원)" icon={TrendingUp} colorClass="bg-slate-50 border-slate-200">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.isArray(data.revenue_streams) ? data.revenue_streams.map((r: string, i: number) => (
              <span key={i} className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 text-[11px] font-bold text-indigo-600">
                {r}
              </span>
            )) : <p>{data.revenue_streams}</p>}
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

const SWOTVisualizer = ({ data }: any) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <InfoCard title="Strengths (강점)" icon={Zap} colorClass="bg-emerald-50/50 border-emerald-100">
        <ul className="space-y-2 text-left">{data.strengths?.map((s: string, i: number) => <li key={i} className="flex gap-2.5"> <span className="text-emerald-500 mt-1">•</span> <span>{s}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Weaknesses (약점)" icon={Shield} colorClass="bg-amber-50/50 border-amber-100">
        <ul className="space-y-2 text-left">{data.weaknesses?.map((w: string, i: number) => <li key={i} className="flex gap-2.5"> <span className="text-amber-500 mt-1">•</span> <span>{w}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Opportunities (기회)" icon={TrendingUp} colorClass="bg-blue-50/50 border-blue-100">
        <ul className="space-y-2 text-left">{data.opportunities?.map((o: string, i: number) => <li key={i} className="flex gap-2.5"> <span className="text-blue-500 mt-1">•</span> <span>{o}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Threats (위협)" icon={AlertCircle} colorClass="bg-rose-50/50 border-rose-100">
        <ul className="space-y-2 text-left">{data.threats?.map((t: string, i: number) => <li key={i} className="flex gap-2.5"> <span className="text-rose-500 mt-1">•</span> <span>{t}</span></li>)}</ul>
      </InfoCard>
    </div>
    <div className="bg-slate-50 border border-slate-100 text-slate-900 p-6 lg:p-8 rounded-[32px] mt-4">
      <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Strategic Recommendations</h4>
      <div className="space-y-3">
        {data.recommendations?.map((r: string, i: number) => (
          <p key={i} className="text-[14px] lg:text-[15px] font-bold border-l-4 border-indigo-200 pl-5 leading-snug break-keep text-left">{r}</p>
        ))}
      </div>
    </div>
  </div>
);

const RoadmapVisualizer = ({ data }: any) => (
  <div className="space-y-6 py-2">
    {data.quarters?.map((q: any, i: number) => (
      <div key={i} className="relative pl-8 border-l-2 border-slate-100 pb-8 last:pb-0">
        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-indigo-100 rounded-full border-4 border-white shadow-sm" />
        <div className="mb-3">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{q.q} GOAL: {q.goal}</span>
          <h4 className="text-base lg:text-lg font-black text-slate-900 mt-0.5 leading-tight">{q.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {q.milestones?.map((m: string, j: number) => (
            <span key={j} className="text-[11px] lg:text-xs bg-white px-3 py-1 rounded-xl border border-slate-100 font-bold text-slate-600 shadow-sm">
              {m}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SummaryVisualizer = ({ data }: any) => (
  <div className="space-y-8">
    <div className="bg-slate-50 p-8 lg:p-12 rounded-[40px] border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={140} /></div>
      <div className="relative z-10 max-w-4xl">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block">Master Strategy Overview</span>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-6 tracking-tight leading-tight break-keep text-slate-900">
          {data.core_value}
        </h3>
        <p className="text-slate-500 text-[15px] lg:text-base font-medium italic leading-snug break-keep">
          "{data.vision}"
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <InfoCard title="Revenue Model" icon={Briefcase}>
        <p className="font-black text-slate-900 text-[15px] lg:text-base leading-snug">{data.revenue_model}</p>
      </InfoCard>
      <InfoCard title="Success Factor" icon={Activity}>
        <p className="font-black text-indigo-500 text-[15px] lg:text-base leading-snug">{data.critical_success_factor}</p>
      </InfoCard>
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] flex items-center justify-between">
         <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SWOT Insight</span>
            <span className="text-[14px] font-bold pr-2 leading-tight text-slate-800 break-keep">{data.swot_highlights?.S}</span>
         </div>
         <Zap size={18} className="text-amber-400 shrink-0" />
      </div>
    </div>

    <div className="space-y-5">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">전략 실행 마일스톤</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.roadmap_key_phases?.map((phase: string, i: number) => (
          <div key={i} className="bg-white border border-slate-100 p-5 lg:p-7 rounded-[24px] flex items-center gap-5 group hover:border-indigo-100 transition-colors shadow-sm">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[11px] font-black shrink-0">{i+1}</span>
            <p className="text-[15px] font-bold text-slate-700 leading-snug break-keep text-left">{phase}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const McKinsey7SVisualizer = ({ data }: any) => (
  <div className="space-y-6">
    <div className="bg-white p-6 lg:p-10 rounded-[40px] border border-slate-100 shadow-sm relative">
      <div className="absolute top-6 right-8 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black border border-indigo-100">Score: {data.alignment_score}%</div>
      <h3 className="text-lg font-black mb-6">Hard Elements</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <InfoCard title="Strategy" icon={Target} colorClass="bg-slate-50/50">
          <p className="font-bold leading-snug">{data.hard_elements?.strategy}</p>
        </InfoCard>
        <InfoCard title="Structure" icon={Network} colorClass="bg-slate-50/50">
          <p className="font-bold leading-snug">{data.hard_elements?.structure}</p>
        </InfoCard>
        <InfoCard title="Systems" icon={Wrench} colorClass="bg-slate-50/50">
          <p className="font-bold leading-snug">{data.hard_elements?.systems}</p>
        </InfoCard>
      </div>
      
      <h3 className="text-lg font-black mb-6">Soft Elements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <InfoCard title="Shared Values" icon={Star} colorClass="bg-indigo-50/30 border-indigo-100">
          <p className="font-bold text-indigo-900 text-[14px] leading-snug">{data.soft_elements?.shared_values}</p>
        </InfoCard>
        <InfoCard title="Style" icon={Users} colorClass="bg-indigo-50/30 border-indigo-100">
          <p className="font-bold text-indigo-900 text-[14px] leading-snug">{data.soft_elements?.style}</p>
        </InfoCard>
        <InfoCard title="Staff" icon={Users} colorClass="bg-indigo-50/30 border-indigo-100">
          <p className="font-bold text-indigo-900 text-[14px] leading-snug">{data.soft_elements?.staff}</p>
        </InfoCard>
        <InfoCard title="Skills" icon={Zap} colorClass="bg-indigo-50/30 border-indigo-100">
          <p className="font-bold text-indigo-900 text-[14px] leading-snug">{data.soft_elements?.skills}</p>
        </InfoCard>
      </div>
    </div>
    <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-8 lg:p-10 rounded-[40px]">
      <p className="text-[15px] lg:text-lg font-bold leading-snug text-center italic break-keep">"{data.summary}"</p>
    </div>
  </div>
);

const PRDVisualizer = ({ data }: any) => (
  <div className="space-y-6">
    <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-slate-100 shadow-sm">
      <div className="mb-10 text-left">
        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 block">Product Background</span>
        <p className="text-lg lg:text-xl font-bold text-slate-800 leading-snug break-keep">{data.background}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14 text-left">
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Users</h4>
          <div className="flex flex-wrap gap-2">
            {data.user_target?.map((t: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 border border-slate-100">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Success Metrics</h4>
          <div className="space-y-2.5">
            {data.success_metrics?.map((m: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 text-[14px] font-bold text-slate-700 leading-snug">
                <CheckCircle size={15} className="text-emerald-500 mt-1 shrink-0" /> {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Core Feature Roadmap</h4>
      <div className="overflow-hidden border border-slate-100 rounded-[24px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-[9px] font-black text-slate-400">PRIORITY</th>
              <th className="px-6 py-3 text-[9px] font-black text-slate-400">FEATURE</th>
              <th className="px-6 py-3 text-[9px] font-black text-slate-400">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.core_features?.map((f: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black ${
                    f.priority === 'P0' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                  }`}>{f.priority}</span>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-slate-800 break-keep leading-snug">{f.feature}</td>
                <td className="px-6 py-4 text-[13px] text-slate-500 leading-snug break-keep">{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<FrameworkType>(FrameworkType.SUMMARY);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [results, setResults] = useState<AnalysisResult[]>(() => {
    const saved = localStorage.getItem('strategy_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Failed to parse history", e);
        return [];
      }
    }
    return [];
  });

  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [tempKey, setTempKey] = useState('');
  
  // UI Confirmation states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [apiKeyDeleteConfirm, setApiKeyDeleteConfirm] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('strategy_history', JSON.stringify(results));
  }, [results]);

  const handleGenerate = async (inputOverride?: string) => {
    const finalInput = inputOverride || userInput;
    if (!finalInput.trim()) return;
    
    setIsGenerating(true);
    setCurrentResult(null);
    setIsMobileMenuOpen(false);

    try {
      const data = await generateStrategy(finalInput, activeFramework, apiKey);
      const newResult: AnalysisResult = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        framework: activeFramework,
        title: finalInput.length > 50 ? finalInput.substring(0, 50) + '...' : finalInput,
        content: data,
        timestamp: Date.now(),
      };
      setResults(prev => [newResult, ...prev]);
      setCurrentResult(newResult);
      setUserInput('');
    } catch (err: any) {
      alert(err.message || "오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResults(prev => prev.filter(res => res.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
    setDeleteId(null);
  };

  const clearHistoryAction = () => {
    setResults([]);
    setCurrentResult(null);
    localStorage.removeItem('strategy_history');
    setClearConfirm(false);
  };

  const deleteApiKey = () => {
    setApiKey('');
    setTempKey('');
    localStorage.removeItem('gemini_api_key');
    setApiKeyDeleteConfirm(false);
    alert('API 키가 삭제되었습니다.');
  };

  const handleDownloadPNG = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#FDFDFF',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `strategy_${currentResult?.framework || 'analysis'}_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Image generation failed", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  const renderVisualizer = (result: AnalysisResult) => {
    const data = result.content;
    switch (result.framework) {
      case FrameworkType.SUMMARY: return <SummaryVisualizer data={data} />;
      case FrameworkType.SWOT: return <SWOTVisualizer data={data} />;
      case FrameworkType.ROADMAP: return <RoadmapVisualizer data={data} />;
      case FrameworkType.MCKINSEY_7S: return <McKinsey7SVisualizer data={data} />;
      case FrameworkType.PRD: return <PRDVisualizer data={data} />;
      case FrameworkType.LEAN_CANVAS: return <LeanCanvasVisualizer data={data} />;
      default: return <div className="p-10 bg-white rounded-[40px] border border-slate-100">{JSON.stringify(data)}</div>;
    }
  };

  const frameworkInfo = FRAMEWORKS.find(f => f.type === activeFramework)!;

  // Render Sidebar Contents
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white relative z-50">
      <div className="p-8 flex items-center gap-4 border-b border-slate-50">
        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-sm">G</div>
        <div>
          <h1 className="font-black text-xl tracking-tighter">STRATEGY</h1>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Engine v2.5</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        <div>
          <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-2">Frameworks</h2>
          <div className="space-y-1">
            {FRAMEWORKS.map(fw => (
              <button
                key={fw.type}
                onClick={() => { setActiveFramework(fw.type); setCurrentResult(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-5 py-3 rounded-2xl transition-all flex items-center gap-4 ${
                  activeFramework === fw.type ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className="text-xl">{fw.icon}</span>
                <span className="text-sm font-bold">{fw.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-2">History</h2>
          <div className="space-y-2">
            {results.length === 0 ? <p className="px-4 text-[11px] text-slate-400 italic">기록 없음</p> : results.slice(0, 25).map(res => (
              <div key={res.id} className="relative group">
                {deleteId === res.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 border border-rose-100 rounded-xl p-1 animate-in slide-in-from-right-2">
                    <button 
                      onClick={(e) => deleteHistoryItem(res.id, e)} 
                      className="flex-1 py-2 text-[10px] font-black text-rose-600 uppercase tracking-widest"
                    >
                      삭제 확정
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(null); }}
                      className="p-2 text-slate-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setCurrentResult(res); setActiveFramework(res.framework); setIsMobileMenuOpen(false); }}
                      className={`flex-1 text-left px-4 py-3 rounded-xl text-[11px] truncate border transition-all ${
                        currentResult?.id === res.id ? 'bg-slate-100 border-slate-200 text-slate-900 font-black' : 'border-transparent text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {res.title}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(res.id); }} 
                      className="p-2.5 text-slate-200 hover:text-rose-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label="삭제 요청"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
      <div className="p-6 border-t border-slate-50 space-y-2.5 bg-white">
        <button 
          onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }} 
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-sm"
        >
          <Settings size={17} /> API 설정
        </button>
        {results.length > 0 && (
          clearConfirm ? (
            <div className="flex flex-col gap-2 p-3 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in">
              <span className="text-[10px] font-black text-rose-400 text-center uppercase tracking-widest">전체 삭제하시겠습니까?</span>
              <div className="flex gap-2">
                <button 
                  onClick={clearHistoryAction}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black"
                >
                  확인
                </button>
                <button 
                  onClick={() => setClearConfirm(false)}
                  className="flex-1 py-2.5 bg-white text-slate-400 rounded-xl text-xs font-black border border-slate-100"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setClearConfirm(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-rose-50 text-rose-500 rounded-2xl font-bold hover:bg-rose-100 transition-colors text-sm"
            >
              <Trash2 size={17} /> 전체 초기화
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] bg-[#FDFDFF] text-slate-900 overflow-hidden font-sans">
      {/* Mobile Sidebar / Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 shadow-2xl animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 z-[60]"><X size={24} /></button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex shadow-sm">
        {sidebarContent}
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className="h-16 lg:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-lg flex items-center justify-between px-6 lg:px-12 z-20">
          <div className="flex items-center gap-3 lg:gap-5">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-2xl shadow-inner">{frameworkInfo.icon}</div>
              <h2 className="font-black text-slate-900 text-sm lg:text-lg leading-none">{frameworkInfo.label}</h2>
            </div>
          </div>
          {currentResult && (
            <div className="flex items-center gap-2 lg:gap-3">
              <button onClick={handleDownloadPNG} className="p-2 lg:px-5 lg:py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm">
                <Download size={15} /> <span className="hidden sm:inline">이미지</span>
              </button>
              <button onClick={() => setCurrentResult(null)} className="p-2 lg:px-5 lg:py-2.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-100">
                <RefreshCcw size={15} /> <span className="hidden sm:inline">다시</span>
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-14 pb-40">
          <div className="max-w-6xl mx-auto w-full">
            {!currentResult && !isGenerating ? (
              <div className="animate-in fade-in duration-700 py-10 lg:py-20 text-center space-y-16">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight break-keep">
                    당신의 아이디어를 들려주세요!
                  </h1>
                  <p className="text-base lg:text-lg text-slate-500 font-medium leading-snug break-keep">
                    비즈니스 모델이나 제품 아이디어를 적어주시면<br/>전문적인 전략 보고서를 즉시 구성해 드릴게요.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-[40px] shadow-sm p-8 lg:p-12 text-left relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity"><HelpCircle size={260} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                       <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><HelpCircle size={24} /></div>
                       <h3 className="text-xl lg:text-2xl font-black leading-none">{frameworkInfo.label}는 무엇인가요?</h3>
                    </div>
                    <p className="text-lg lg:text-xl font-bold text-slate-700 leading-snug mb-10 break-keep">
                      "{frameworkInfo.easyExplanation}"
                    </p>
                    <div className="bg-[#F9FBFF] p-6 lg:p-8 rounded-[24px] border border-indigo-50 shadow-inner">
                      <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <Lightbulb size={20} /> <span className="text-[11px] font-black uppercase tracking-wider">구체적인 예시</span>
                      </div>
                      <p className="text-[14px] lg:text-[15px] text-slate-600 font-semibold leading-snug break-keep whitespace-pre-line">
                        {frameworkInfo.example}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-40">
                <div className="relative mb-10">
                  <div className="w-24 h-24 border-[6px] border-slate-50 border-t-indigo-100 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center"><Activity className="text-indigo-300 animate-pulse" size={32} /></div>
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-3 text-slate-700 leading-none">분석 엔진 가동 중...</h3>
                <p className="text-slate-400 text-base font-medium max-w-sm mx-auto leading-snug italic">"전문 컨설턴트의 시각으로 아이디어를 다듬고 있습니다."</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
                <div ref={captureRef} className="bg-[#FDFDFF] p-8 lg:p-12 rounded-[40px] shadow-sm">
                  <div className="mb-10 pb-8 border-b-2 border-slate-100">
                    <h1 className="text-xl lg:text-2xl font-black tracking-tight mb-6 break-keep leading-tight">{currentResult.title}</h1>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-100">{currentResult.framework} Analysis</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(currentResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="analysis-content">
                    {renderVisualizer(currentResult)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 lg:p-10 bg-white/70 backdrop-blur-3xl border-t border-slate-100 sticky bottom-0 z-40">
          <div className="max-w-4xl mx-auto flex items-end gap-4 lg:gap-6 relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`${frameworkInfo.label}를 위한 아이디어를 자유롭게 설명해주세요...`}
              className="flex-1 bg-white border-2 border-slate-100 rounded-[32px] py-5 px-8 lg:py-6 lg:px-12 focus:outline-none focus:border-indigo-200 transition-all text-sm lg:text-lg font-bold min-h-[64px] max-h-[300px] shadow-2xl shadow-indigo-100/10 resize-none leading-snug placeholder:text-slate-300"
              rows={1}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !userInput.trim()}
              className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all shadow-2xl shrink-0 ${
                !userInput.trim() || isGenerating ? 'bg-slate-50 text-slate-200' : 'bg-indigo-50 border border-indigo-100 text-indigo-500 hover:scale-105 active:scale-95 shadow-indigo-100/30'
              }`}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={28} /> : <Send size={28} />}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden p-8 lg:p-10 border border-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight text-slate-800 leading-none">API Key</h3>
                <button onClick={() => { setShowSettings(false); setApiKeyDeleteConfirm(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" 
                    value={tempKey} 
                    onChange={(e)=>setTempKey(e.target.value)} 
                    placeholder={apiKey ? "이미 저장됨" : "여기에 키를 입력하세요"} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold focus:outline-none" 
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { 
                      if(tempKey) { 
                        setApiKey(tempKey); 
                        localStorage.setItem('gemini_api_key', tempKey); 
                        alert('저장되었습니다.'); 
                        setShowSettings(false); 
                      } 
                    }} 
                    className="w-full py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-[24px] font-black text-sm shadow-xl shadow-indigo-100/20 active:scale-95 transition-transform"
                  >
                    저장하기
                  </button>

                  {apiKey && (
                    apiKeyDeleteConfirm ? (
                      <div className="flex items-center gap-2 p-2 bg-rose-50 border border-rose-100 rounded-[24px] animate-in slide-in-from-top-2">
                        <button 
                          onClick={deleteApiKey}
                          className="flex-1 py-3 bg-rose-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest"
                        >
                          삭제 확정
                        </button>
                        <button 
                          onClick={() => setApiKeyDeleteConfirm(false)}
                          className="p-3 text-slate-400 bg-white rounded-2xl border border-slate-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setApiKeyDeleteConfirm(true)}
                        className="w-full py-3 bg-white text-slate-400 border border-slate-100 rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={13} /> 저장된 API 키 삭제
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .font-sans { font-family: "Pretendard Variable", sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 20px; }
        .break-keep { word-break: keep-all; }
        textarea { scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
