
import { GoogleGenAI } from "@google/genai";
import { FrameworkType } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateStrategy = async (
  prompt: string,
  framework: FrameworkType,
  apiKey: string
): Promise<any> => {
  const finalApiKey = apiKey || process.env.API_KEY;
  
  if (!finalApiKey) {
    throw new Error("API 키가 필요합니다.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const frameworkPrompt = getFrameworkSpecificPrompt(framework, prompt);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: frameworkPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) throw new Error("분석 데이터를 생성하지 못했습니다.");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "전략 분석 엔진과의 통신에 실패했습니다.");
  }
};

const getFrameworkSpecificPrompt = (framework: FrameworkType, input: string): string => {
  switch (framework) {
    case FrameworkType.SUMMARY:
      return `비즈니스 아이디어: "${input}". 
      다음 구조의 JSON으로 통합 전략 요약을 제공해줘:
      {
        "core_value": "고유 가치 한 줄 요약",
        "vision": "장기적 비전",
        "swot_highlights": {"S": "강점", "W": "약점", "O": "기회", "T": "위협"},
        "roadmap_key_phases": ["단계 1", "단계 2", "단계 3"],
        "revenue_model": "수익 모델 핵심",
        "critical_success_factor": "가장 중요한 성공 요인"
      }`;
    case FrameworkType.SWOT:
      return `비즈니스: "${input}". 
      다음 구조의 JSON으로 SWOT 분석을 해줘:
      {
        "strengths": ["강점 리스트"],
        "weaknesses": ["약점 리스트"],
        "opportunities": ["기회 리스트"],
        "threats": ["위협 리스트"],
        "recommendations": ["핵심 전략 제언"]
      }`;
    case FrameworkType.ROADMAP:
      return `프로젝트: "${input}". 
      다음 구조의 JSON으로 12개월 로드맵을 작성해줘:
      {
        "quarters": [
          {"q": "Q1", "title": "단계명", "milestones": ["항목"], "goal": "핵심 목표"},
          {"q": "Q2", "title": "단계명", "milestones": ["항목"], "goal": "핵심 목표"},
          {"q": "Q3", "title": "단계명", "milestones": ["항목"], "goal": "핵심 목표"},
          {"q": "Q4", "title": "단계명", "milestones": ["항목"], "goal": "핵심 목표"}
        ]
      }`;
    case FrameworkType.MCKINSEY_7S:
      return `조직/비즈니스: "${input}". 
      다음 구조의 JSON으로 맥킨지 7S 분석을 해줘:
      {
        "hard_elements": {
          "strategy": "전략 핵심",
          "structure": "조직 구조 제언",
          "systems": "필요 시스템/인프라"
        },
        "soft_elements": {
          "shared_values": "공유 가치/비전",
          "style": "리더십 스타일/문화",
          "staff": "필요 인재 구성",
          "skills": "핵심 보유 역량"
        },
        "alignment_score": 0~100,
        "summary": "총평 및 개선 방향"
      }`;
    case FrameworkType.PRD:
      return `제품 아이디어: "${input}". 
      다음 구조의 JSON으로 PRD 핵심 내용을 도출해줘:
      {
        "background": "추진 배경",
        "user_target": ["주요 사용자층"],
        "core_features": [
          {"feature": "기능명", "priority": "P0/P1/P2", "description": "설명"}
        ],
        "user_stories": ["유저 스토리"],
        "success_metrics": ["성공 지표"]
      }`;
    case FrameworkType.LEAN_CANVAS:
      return `비즈니스 모델 아이디어: "${input}". 
      다음 구조의 린 캔버스 JSON 데이터를 상세히 분석하여 모든 키값을 채워줘:
      {
        "problem": ["주요 문제점 3가지"],
        "solution": ["핵심 해결책 1-2가지"],
        "key_metrics": ["측정 가능한 핵심 지표 2가지"],
        "uvp": "독보적 가치 제안 (Unique Value Proposition) 1문장",
        "unfair_advantage": "경쟁 우위 (따라하기 힘든 강점) 1문장",
        "channels": ["고객 유입/획득 채널 2가지"],
        "customer_segments": ["타겟 고객 및 얼리 어답터 정의"],
        "cost_structure": ["주요 비용 항목 2-3가지"],
        "revenue_streams": ["수수료, 구독료 등 수익 창출 방식"]
      }`;
    default:
      return `아이디어: "${input}". 
      해당 프레임워크에 맞는 상세 데이터를 JSON 형식으로 분석해줘.`;
  }
};
