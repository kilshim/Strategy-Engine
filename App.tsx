
import React, { useState, useEffect, useRef } from 'react';
import { FrameworkType, AnalysisResult } from './types';
import { FRAMEWORKS } from './constants';
import { generateStrategy } from './services/geminiService';
import html2canvas from 'html2canvas';
import { 
  Send, Loader2, Trash2, CheckCircle, Info, 
  X, Lightbulb, HelpCircle, Target, 
  TrendingUp, Calendar, Zap, Shield, Briefcase, Activity,
  AlertCircle, Menu, Settings, Key, Sun, Moon,
  Users, Wrench, Network, Star, RefreshCcw, Download, Image as ImageIcon,
  ArrowRight, Sparkles, ExternalLink
} from 'lucide-react';

// --- Visual Infographic Components ---

const InfoCard = ({ title, children, icon: Icon, colorClass = "bg-white" }: any) => (
  <div className={`${colorClass} dark:bg-slate-900/50 p-5 lg:p-6 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all flex flex-col items-start gap-3 relative overflow-hidden w-full`}>
    <div className="flex items-center gap-2.5 mb-1">
      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700 shrink-0">
        {Icon && <Icon size={16} className="text-slate-500 dark:text-slate-400" />}
      </div>
      <h4 className="font-bold text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-[0.15em] leading-none">{title}</h4>
    </div>
    <div className="text-slate-700 dark:text-slate-300 text-[14px] font-medium leading-relaxed flex-1 w-full text-left">
      {children}
    </div>
  </div>
);

// 린 캔버스 카드 (한 줄 스타일)
const LeanCanvasCard = ({ index, title, children, icon: Icon, colorName }: any) => {
  const colorMap: Record<string, string> = {
    yellow: 'border-amber-400 text-amber-500',
    brown: 'border-orange-700 text-orange-700',
    green: 'border-emerald-500 text-emerald-500',
    teal: 'border-teal-400 text-teal-500',
    blue: 'border-blue-500 text-blue-500',
    purple: 'border-indigo-500 text-indigo-500',
    rose: 'border-rose-500 text-rose-500',
    slate: 'border-slate-500 text-slate-500',
    violet: 'border-violet-500 text-violet-500'
  };

  const colorClass = colorMap[colorName] || 'border-slate-400 text-slate-400';
  const iconColor = colorClass.split(' ')[1];

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow w-full`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 pb-3 border-b border-slate-50 dark:border-slate-800">
          <div className="shrink-0 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {Icon && <Icon size={24} className={iconColor} strokeWidth={2} />}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-lg font-bold ${iconColor}`}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <h4 className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {title}
            </h4>
          </div>
        </div>
        
        <div className="text-left">
          <div className="text-[14px] lg:text-[15px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed break-keep">
            {Array.isArray(children) ? (
              <ul className="space-y-1.5">
                {children.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className={`shrink-0 mt-2 w-1.5 h-1.5 rounded-full ${iconColor.replace('text', 'bg')}`}></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{children}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeanCanvasVisualizer = ({ data }: any) => {
  if (!data) return <div className="p-10 text-center text-slate-400">데이터를 불러올 수 없습니다.</div>;

  const steps = [
    { title: "Problem (핵심 문제)", key: "problem", icon: AlertCircle, color: "yellow" },
    { title: "Customer Segments (고객군)", key: "customer_segments", icon: Users, color: "brown" },
    { title: "Solution (해결책)", key: "solution", icon: Lightbulb, color: "green" },
    { title: "Unique Value Prop (가치제안)", key: "uvp", icon: Target, color: "teal" },
    { title: "Unfair Advantage (경쟁 우위)", key: "unfair_advantage", icon: Zap, color: "blue" },
    { title: "Channels (유통 채널)", key: "channels", icon: Network, color: "purple" },
    { title: "Key Metrics (핵심 지표)", key: "key_metrics", icon: Activity, color: "rose" },
    { title: "Cost Structure (비용 구조)", key: "cost_structure", icon: Briefcase, color: "slate" },
    { title: "Revenue Streams (수익원)", key: "revenue_streams", icon: TrendingUp, color: "violet" }
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      {steps.map((step, idx) => (
        <LeanCanvasCard 
          key={step.key}
          index={idx}
          title={step.title}
          icon={step.icon}
          colorName={step.color}
        >
          {data[step.key]}
        </LeanCanvasCard>
      ))}
    </div>
  );
};

const SWOTVisualizer = ({ data }: any) => (
  <div className="space-y-4 max-w-3xl mx-auto">
    <div className="flex flex-col gap-4">
      <InfoCard title="Strengths (강점)" icon={Zap} colorClass="bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30">
        <ul className="space-y-2 text-left">{data.strengths?.map((s: string, i: number) => <li key={i} className="flex gap-2"> <span className="text-emerald-500">•</span> <span className="text-[14px]">{s}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Weaknesses (약점)" icon={Shield} colorClass="bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30">
        <ul className="space-y-2 text-left">{data.weaknesses?.map((w: string, i: number) => <li key={i} className="flex gap-2"> <span className="text-amber-500">•</span> <span className="text-[14px]">{w}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Opportunities (기회)" icon={TrendingUp} colorClass="bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
        <ul className="space-y-2 text-left">{data.opportunities?.map((o: string, i: number) => <li key={i} className="flex gap-2"> <span className="text-blue-500">•</span> <span className="text-[14px]">{o}</span></li>)}</ul>
      </InfoCard>
      <InfoCard title="Threats (위협)" icon={AlertCircle} colorClass="bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30">
        <ul className="space-y-2 text-left">{data.threats?.map((t: string, i: number) => <li key={i} className="flex gap-2"> <span className="text-rose-500">•</span> <span className="text-[14px]">{t}</span></li>)}</ul>
      </InfoCard>
    </div>
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 lg:p-8 rounded-[24px]">
      <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Strategic Recommendations</h4>
      <div className="space-y-3">
        {data.recommendations?.map((r: string, i: number) => (
          <p key={i} className="text-[13px] font-semibold border-l-2 border-indigo-200 pl-4 leading-relaxed break-keep text-left">{r}</p>
        ))}
      </div>
    </div>
  </div>
);

const RoadmapVisualizer = ({ data }: any) => (
  <div className="space-y-4 py-2 max-w-3xl mx-auto">
    {data.quarters?.map((q: any, i: number) => (
      <div key={i} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 pb-8 last:pb-0">
        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full border-2 border-white dark:border-slate-950" />
        <div className="mb-3">
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{q.q} GOAL: {q.goal}</span>
          <h4 className="text-sm lg:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{q.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {q.milestones?.map((m: string, j: number) => (
            <span key={j} className="text-[11px] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 font-medium text-slate-600 dark:text-slate-400 shadow-sm">
              {m}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SummaryVisualizer = ({ data }: any) => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-[0.03] text-slate-900 dark:text-white"><Target size={120} /></div>
      <div className="relative z-10 text-left">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Master Strategy Overview</span>
        <h3 className="text-lg lg:text-xl font-bold mb-6 tracking-tight leading-tight break-keep text-slate-900 dark:text-white">
          {data.core_value}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-relaxed break-keep border-l-2 border-indigo-100 pl-4">
          "{data.vision}"
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <InfoCard title="Revenue Model" icon={Briefcase}>
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-[14px]">{data.revenue_model}</p>
      </InfoCard>
      <InfoCard title="Success Factor" icon={Activity}>
        <p className="font-semibold text-indigo-500 dark:text-indigo-400 text-[14px]">{data.critical_success_factor}</p>
      </InfoCard>
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 rounded-[24px] flex items-center justify-between">
         <div className="flex flex-col gap-1 text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SWOT Insight</span>
            <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 break-keep">{data.swot_highlights?.S}</span>
         </div>
         <Zap size={18} className="text-amber-400 shrink-0" />
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">전략 실행 마일스톤</h4>
      <div className="flex flex-col gap-3">
        {data.roadmap_key_phases?.map((phase: string, i: number) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[20px] flex items-center gap-4 transition-all shadow-sm">
            <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
            <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 leading-relaxed break-keep text-left">{phase}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const McKinsey7SVisualizer = ({ data }: any) => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <div className="bg-white dark:bg-slate-900/50 p-6 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className="absolute top-6 right-8 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 text-[9px] font-bold rounded-xl border border-indigo-100">Score: {data.alignment_score}%</div>
      
      <div className="mb-10 text-left">
        <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
          <Shield className="text-indigo-500" size={20} /> Hard Elements
        </h3>
        <div className="flex flex-col gap-3">
          <InfoCard title="Strategy" icon={Target} colorClass="bg-slate-50/40">
            <p className="text-[13px] font-medium">{data.hard_elements?.strategy}</p>
          </InfoCard>
          <InfoCard title="Structure" icon={Network} colorClass="bg-slate-50/40">
            <p className="text-[13px] font-medium">{data.hard_elements?.structure}</p>
          </InfoCard>
          <InfoCard title="Systems" icon={Wrench} colorClass="bg-slate-50/40">
            <p className="text-[13px] font-medium">{data.hard_elements?.systems}</p>
          </InfoCard>
        </div>
      </div>
      
      <div className="text-left">
        <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
          <Zap className="text-amber-500" size={20} /> Soft Elements
        </h3>
        <div className="flex flex-col gap-3">
          <InfoCard title="Shared Values" icon={Star} colorClass="bg-indigo-50/20">
            <p className="text-[13px] font-medium text-indigo-900">{data.soft_elements?.shared_values}</p>
          </InfoCard>
          <InfoCard title="Style" icon={Users} colorClass="bg-indigo-50/20">
            <p className="text-[13px] font-medium text-indigo-900">{data.soft_elements?.style}</p>
          </InfoCard>
          <InfoCard title="Staff" icon={Users} colorClass="bg-indigo-50/20">
            <p className="text-[13px] font-medium text-indigo-900">{data.soft_elements?.staff}</p>
          </InfoCard>
          <InfoCard title="Skills" icon={Zap} colorClass="bg-indigo-50/20">
            <p className="text-[13px] font-medium text-indigo-900">{data.soft_elements?.skills}</p>
          </InfoCard>
        </div>
      </div>
    </div>
    
    <div className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-[32px] text-center italic break-keep text-[14px] text-indigo-900 font-medium">
      "{data.summary}"
    </div>
  </div>
);

const PRDVisualizer = ({ data }: any) => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <div className="bg-white dark:bg-slate-900/50 p-8 lg:p-12 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="mb-10 text-left border-l-4 border-indigo-100 pl-6">
        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2 block">Product Background</span>
        <p className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed break-keep">{data.background}</p>
      </div>
      
      <div className="flex flex-col gap-6 mb-12 text-left">
        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[24px]">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Target Segments</h4>
          <div className="flex flex-wrap gap-2">
            {data.user_target?.map((t: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[12px] font-semibold text-slate-700 border border-slate-100 shadow-sm">{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[24px]">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Success Metrics</h4>
          <div className="space-y-2">
            {data.success_metrics?.map((m: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 text-[13px] font-semibold text-slate-700 leading-snug">
                <CheckCircle size={14} className="text-emerald-500 mt-1 shrink-0" /> <span className="break-keep">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-left mb-8">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Core Features</h4>
        <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-[24px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800 border-b border-slate-100">
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400">PRIORITY</th>
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400">FEATURE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.core_features?.map((f: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      f.priority === 'P0' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>{f.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-slate-800 mb-1">{f.feature}</div>
                    <div className="text-[11px] text-slate-500 leading-relaxed font-medium">{f.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50/20 p-6 rounded-[24px] border border-indigo-50 text-left">
        <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Users size={16} /> User Stories
        </h4>
        <div className="space-y-3">
          {data.user_stories?.map((s: string, i: number) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-50 shadow-sm text-[13px] font-semibold text-slate-700 leading-relaxed break-keep">
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<FrameworkType>(FrameworkType.SUMMARY);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
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
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [apiKeyDeleteConfirm, setApiKeyDeleteConfirm] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('strategy_history', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleDownloadPNG = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#FDFDFF',
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
      default: return <div className="p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">{JSON.stringify(data)}</div>;
    }
  };

  const frameworkInfo = FRAMEWORKS.find(f => f.type === activeFramework)!;

  const examplePrompts = [
    { emoji: "🍱", text: "시니어 타겟의 맞춤형 건강식 정기 배송 서비스" },
    { emoji: "📦", text: "도심 내 유휴 공간을 활용한 개인 전용 창고 공유 플랫폼" },
    { emoji: "💻", text: "AI를 활용한 비전공자 직장인 대상 1:1 코딩 멘토링 앱" },
    { emoji: "🕯️", text: "반려동물 생애 주기 맞춤형 장례 및 추모 굿즈 서비스" },
    { emoji: "⛺", text: "지속 가능한 캠핑을 위한 제로 웨이스트 용품 렌탈 플랫폼" },
    { emoji: "☕", text: "로컬 카페 원두 큐레이션 구독 및 커뮤니티 플랫폼" },
    { emoji: "🤝", text: "은퇴 전문가 노하우와 사회 초년생을 잇는 지식 매칭 서비스" },
    { emoji: "🏢", text: "개인별 맞춤형 스마트 홈 오피스 가구 구독 및 컨설팅" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 relative z-50 transition-colors duration-300">
      <div className="p-8 flex items-center gap-4 border-b border-slate-50 dark:border-slate-800">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-sm">G</div>
        <div>
          <h1 className="font-bold text-xl tracking-tighter dark:text-white">STRATEGY</h1>
          <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Engine v2.5</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        <div>
          <h2 className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-4 ml-2">Frameworks</h2>
          <div className="space-y-1">
            {FRAMEWORKS.map(fw => (
              <button
                key={fw.type}
                onClick={() => { setActiveFramework(fw.type); setCurrentResult(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-5 py-3 rounded-2xl transition-all flex items-center gap-4 ${
                  activeFramework === fw.type ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-100 dark:border-indigo-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span className="text-xl">{fw.icon}</span>
                <span className="text-sm font-semibold">{fw.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-4 ml-2">History</h2>
          <div className="space-y-2">
            {results.length === 0 ? <p className="px-4 text-[11px] text-slate-400 dark:text-slate-600 italic">기록 없음</p> : results.slice(0, 25).map(res => (
              <div key={res.id} className="relative group">
                {deleteId === res.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-xl p-1 animate-in slide-in-from-right-2">
                    <button 
                      onClick={(e) => deleteHistoryItem(res.id, e)} 
                      className="flex-1 py-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest"
                    >
                      삭제 확정
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(null); }}
                      className="p-2 text-slate-400 dark:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setCurrentResult(res); setActiveFramework(res.framework); setIsMobileMenuOpen(false); }}
                      className={`flex-1 text-left px-4 py-3 rounded-xl text-[11px] truncate border transition-all ${
                        currentResult?.id === res.id ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-bold' : 'border-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {res.title}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(res.id); }} 
                      className="p-2.5 text-slate-200 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
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
      <div className="p-6 border-t border-slate-50 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={toggleTheme} 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? '다크' : '라이트'}
          </button>
          <button 
            onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }} 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            <Settings size={16} /> 설정
          </button>
        </div>
        {results.length > 0 && (
          clearConfirm ? (
            <div className="flex flex-col gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 rounded-2xl animate-in fade-in">
              <span className="text-[10px] font-bold text-rose-400 dark:text-rose-500 text-center uppercase tracking-widest">전체 삭제하시겠습니까?</span>
              <div className="flex gap-2">
                <button 
                  onClick={clearHistoryAction}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold"
                >
                  확인
                </button>
                <button 
                  onClick={() => setClearConfirm(false)}
                  className="flex-1 py-2.5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setClearConfirm(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 rounded-2xl font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors text-sm"
            >
              <Trash2 size={17} /> 전체 초기화
            </button>
          )
        )}
        <a 
          href="https://xn--design-hl6wo12cquiba7767a.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center text-[11px] font-semibold text-slate-400 dark:text-slate-600 hover:text-indigo-500 transition-colors mt-2"
        >
          떨림과울림Design.com
        </a>
      </div>
    </div>
  );

  return (
    <div className={`flex h-[100dvh] transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FDFDFF] text-slate-900'} font-sans overflow-hidden`}>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 shadow-2xl animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 dark:text-slate-600 z-[60]"><X size={24} /></button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col hidden lg:flex shadow-sm transition-colors duration-300">
        {sidebarContent}
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className="h-16 lg:h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg flex items-center justify-between px-6 lg:px-12 z-20 transition-colors duration-300">
          <div className="flex items-center gap-3 lg:gap-5">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner">{frameworkInfo.icon}</div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base leading-none">{frameworkInfo.label}</h2>
            </div>
          </div>
          {currentResult && (
            <div className="flex items-center gap-2 lg:gap-3">
              <button onClick={handleDownloadPNG} className="p-2 lg:px-5 lg:py-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <Download size={15} /> <span className="hidden sm:inline">이미지</span>
              </button>
              <button onClick={() => setCurrentResult(null)} className="p-2 lg:px-5 lg:py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
                <RefreshCcw size={15} /> <span className="hidden sm:inline">다시</span>
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-14 pb-40">
          <div className="max-w-4xl mx-auto w-full">
            {!currentResult && !isGenerating ? (
              <div className="animate-in fade-in duration-700 py-10 lg:py-16 text-center space-y-16">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight break-keep">
                    당신의 멋진 아이디어를 들려주세요! 🚀
                  </h1>
                  <p className="text-sm lg:text-base text-slate-500 dark:text-slate-200 font-medium leading-relaxed break-keep">
                    비즈니스 모델이나 서비스 아이디어를 적어주시면<br/>전문가의 시선으로 분석된 명쾌한 전략 보고서를 즉시 만들어 드릴게요.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm p-8 lg:p-12 text-left relative overflow-hidden group transition-colors duration-300">
                  <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-[0.03] group-hover:opacity-10 dark:group-hover:opacity-[0.06] transition-opacity text-slate-900 dark:text-white"><HelpCircle size={240} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm"><HelpCircle size={22} /></div>
                       <h3 className="text-lg lg:text-xl font-bold leading-none dark:text-white">{frameworkInfo.label} 가이드</h3>
                    </div>
                    <p className="text-base lg:text-lg font-semibold text-slate-700 dark:text-slate-100 leading-relaxed mb-10 break-keep">
                      "{frameworkInfo.easyExplanation}"
                    </p>
                    <div className="bg-[#F9FBFF] dark:bg-indigo-950/10 p-6 lg:p-8 rounded-[24px] border border-indigo-50 dark:border-indigo-900/30 shadow-inner">
                      <div className="flex items-center gap-2.5 mb-4 text-indigo-500 dark:text-indigo-400">
                        <Lightbulb size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">상세 비즈니스 시나리오</span>
                      </div>
                      <p className="text-[14px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed break-keep whitespace-pre-line">
                        {frameworkInfo.example}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 샘플 아이디어 섹션 */}
                <div className="max-w-3xl mx-auto text-left space-y-6">
                  <div className="flex items-center gap-3 px-4">
                    <Sparkles className="text-amber-400" size={18} />
                    <h3 className="text-sm lg:text-base font-bold text-slate-800 dark:text-slate-200">💡 이런 아이디어는 어떠세요? (클릭하여 테스트)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                    {examplePrompts.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => { setUserInput(example.text); handleGenerate(example.text); }}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-5 py-4 rounded-[20px] text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                      >
                        <span className="text-base shrink-0">{example.emoji}</span>
                        <span className="break-keep text-left">{example.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-40">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-[5px] border-slate-50 dark:border-slate-900 border-t-indigo-200 dark:border-t-indigo-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center"><Activity className="text-indigo-300 dark:text-indigo-500 animate-pulse" size={28} /></div>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-700 dark:text-slate-300 leading-none">수석 전략 컨설턴트가 분석 중입니다...</h3>
                <p className="text-slate-400 dark:text-slate-600 text-sm font-medium max-w-sm mx-auto leading-snug italic font-medium">"명확한 논리로 비즈니스의 미래를 설계하고 있어요."</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20 max-w-3xl mx-auto">
                <div ref={captureRef} className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                  <div className="mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight mb-6 break-keep leading-tight dark:text-white">{currentResult.title}</h1>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-4 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">{currentResult.framework} Analysis</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">{new Date(currentResult.timestamp).toLocaleString()}</span>
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

        <div className="p-5 lg:p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-40 transition-colors duration-300">
          <div className="max-w-3xl mx-auto flex items-end gap-3 lg:gap-5 relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`아이디어를 설명해주세요...`}
              className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] py-4 px-8 lg:py-5 lg:px-10 focus:outline-none focus:border-indigo-200 transition-all text-sm lg:text-base font-semibold min-h-[56px] max-h-[250px] shadow-xl dark:shadow-none shadow-indigo-100/10 resize-none leading-relaxed placeholder:text-slate-300 dark:text-white"
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
              className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all shadow-xl shrink-0 ${
                !userInput.trim() || isGenerating ? 'bg-slate-50 dark:bg-slate-800 text-slate-200' : 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-900/20'
              }`}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[32px] shadow-2xl overflow-hidden p-8 border border-white dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white leading-none">API Key</h3>
                <button onClick={() => { setShowSettings(false); setApiKeyDeleteConfirm(false); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-slate-400"><X size={18} /></button>
              </div>
              <div className="space-y-5">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                  <input 
                    type="password" 
                    value={tempKey} 
                    onChange={(e)=>setTempKey(e.target.value)} 
                    placeholder={apiKey ? "이미 저장됨" : "Key 입력"} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] py-3.5 pl-12 pr-5 text-xs font-semibold focus:outline-none dark:text-white" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { 
                      if(tempKey) { 
                        setApiKey(tempKey); 
                        localStorage.setItem('gemini_api_key', tempKey); 
                        alert('저장되었습니다.'); 
                        setShowSettings(false); 
                      } 
                    }} 
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold text-xs shadow-xl shadow-indigo-100/20 active:scale-95 transition-transform"
                  >
                    저장하기
                  </button>

                  {apiKey && (
                    apiKeyDeleteConfirm ? (
                      <div className="flex items-center gap-2 p-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-[20px] animate-in slide-in-from-top-1">
                        <button 
                          onClick={deleteApiKey}
                          className="flex-1 py-2.5 bg-rose-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          삭제
                        </button>
                        <button 
                          onClick={() => setApiKeyDeleteConfirm(false)}
                          className="p-2.5 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setApiKeyDeleteConfirm(true)}
                        className="w-full py-2.5 bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 rounded-[20px] font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={12} /> Key 삭제
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
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb { background: #1e293b; }
        .break-keep { word-break: keep-all; }
        textarea { scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
