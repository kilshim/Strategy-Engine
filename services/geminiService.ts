
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
    throw new Error("API 키가 필요합니다. 설정에서 API 키를 입력해주세요.");
  }

  // 매 요청마다 새로운 인스턴스를 생성하여 최신 API 키 반영 보장
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const frameworkPrompt = getFrameworkSpecificPrompt(framework, prompt);
  
  try {
    const response = await ai.models.generateContent({
      // Pro 모델은 무료 티어에서 할당량이 매우 적거나 제한될 수 있으므로
      // 더 빠르고 할당량이 넉넉한 Flash 모델을 기본으로 사용합니다.
      model: 'gemini-3-flash-preview',
      contents: frameworkPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("분석 데이터를 생성하지 못했습니다.");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 할당량 초과(429) 에러에 대한 친절한 안내
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("API 사용량이 초과되었습니다. 잠시 후 다시 시도하거나, 설정에서 개인 API 키를 등록해 주세요.");
    }
    
    // API 키가 유효하지 않은 경우
    if (error.message?.includes("API key not valid") || error.message?.includes("403")) {
      throw new Error("유효하지 않은 API 키입니다. 설정에서 키를 확인해 주세요.");
    }

    throw new Error(error.message || "전략 분석 엔진과의 통신에 실패했습니다.");
  }
};

const getFrameworkSpecificPrompt = (framework: FrameworkType, input: string): string => {
  switch (framework) {
    case FrameworkType.SUMMARY:
      return `비즈니스 아이디어: "${input}". 
      다음 구조의 JSON으로 통합 전략 요약을 제공해줘. 각 항목은 전문가의 시각에서 아주 깊이 있고 풍성하게 설명해줘:
      {
        "core_value": "비즈니스의 존재 이유와 시장을 압도할 핵심 가치 (강력한 슬로건 포함)",
        "vision": "향후 5년 내 시장에서 점유할 독보적인 위치와 미래 상상도",
        "swot_highlights": {
          "S": "강점: 현재 가진 자산 중 가장 강력한 현금화 도구와 그 근거",
          "W": "약점: 성장을 가로막는 리스크와 이를 상쇄할 전략적 보완책",
          "O": "기회: 시장 트렌드에서 포착된 가장 수익성 높은 진입 시점",
          "T": "위협: 경쟁사의 공격이나 거시 환경 변화에 대한 방어 시나리오"
        },
        "roadmap_key_phases": [
          "1단계: 시장 검증 및 초기 핵심 고객(Early Adopters) 확보 전략",
          "2단계: 제품 고도화 및 시장 점유율 확대를 위한 스케일업 전략",
          "3단계: 브랜드 로열티 구축 및 비즈니스 생태계 확장 전략"
        ],
        "revenue_model": "가장 효율적인 수익 창출 구조와 단가 책정 로직에 대한 상세 분석",
        "critical_success_factor": "이 사업의 성패를 가를 단 하나의 핵심 지표(North Star Metric)와 관리 방법"
      }`;
    case FrameworkType.SWOT:
      return `비즈니스: "${input}". 
      다음 구조의 JSON으로 SWOT 분석을 해줘. 항목당 최소 4개 이상의 아주 구체적인 통찰을 담아줘:
      {
        "strengths": ["경쟁사가 따라올 수 없는 우리만의 내부적 역량과 자산"],
        "weaknesses": ["현재 내부적으로 해결해야 할 운영상, 기술상의 한계점"],
        "opportunities": ["규제 변화, 소비자 인식 변화 등 우리가 이용할 수 있는 외부 호재"],
        "threats": ["대안 서비스의 등장이나 원가 상승 등 우리를 위협하는 외부 요인"],
        "recommendations": ["분석 결과를 종합하여 시장에서 승리하기 위한 구체적인 실행 지침 3가지 (이유 포함)"]
      }`;
    case FrameworkType.ROADMAP:
      return `프로젝트: "${input}". 
      다음 구조의 JSON으로 전문적인 12개월 로드맵을 작성해줘. 각 분기는 하나의 완성된 스토리가 되어야 해:
      {
        "quarters": [
          {"q": "Q1: 기초 구축", "title": "MVP 개발 및 시장 가설 검증", "milestones": ["실행해야 할 구체적인 마일스톤 3개"], "goal": "정량적인 성공 측정 기준"},
          {"q": "Q2: 시장 진입", "title": "핵심 채널 확보 및 공격적 마케팅", "milestones": ["실행해야 할 구체적인 마일스톤 3개"], "goal": "고객 확보 비용(CAC) 최적화 목표"},
          {"q": "Q3: 확장 성장", "title": "서비스 자동화 및 운영 효율화", "milestones": ["실행해야 할 구체적인 마일스톤 3개"], "goal": "고객 유지율(Retention) 목표치"},
          {"q": "Q4: 수익 극대화", "title": "비즈니스 모델 고도화 및 다각화", "milestones": ["실행해야 할 구체적인 마일스톤 3개"], "goal": "매출 및 이익률 달성 목표"}
        ]
      }`;
    case FrameworkType.MCKINSEY_7S:
      return `조직/비즈니스: "${input}". 
      다음 구조의 JSON으로 맥킨지 7S 분석을 해줘. 조직 운영의 효율성을 극대화할 수 있는 진단이 필요해:
      {
        "hard_elements": {
          "strategy": "지속 가능한 경쟁 우위를 점하기 위한 중장기 계획",
          "structure": "의사결정 속도를 높이고 책임을 명확히 할 조직 구조 제언",
          "systems": "업무의 일관성과 효율성을 보장할 프로세스와 IT 시스템"
        },
        "soft_elements": {
          "shared_values": "조직 구성원들을 하나로 묶어줄 핵심 철학과 신념",
          "style": "리더십의 방식과 조직 내 커뮤니케이션 문화의 지향점",
          "staff": "현재 조직에 가장 시급한 인적 자원과 인재상",
          "skills": "시장에서 승리하기 위해 조직 전체가 보유해야 할 핵심 역량"
        },
        "alignment_score": 0~100,
        "summary": "7가지 요소의 정렬 상태에 대한 총평과 조직 혁신을 위한 핵심 제언"
      }`;
    case FrameworkType.PRD:
      return `제품 아이디어: "${input}". 
      다음 구조의 JSON으로 PRD(제품 요구사항 문서)를 도출해줘. 실무 기획자가 바로 사용할 수 있는 수준이어야 해:
      {
        "background": "이 제품이 해결하고자 하는 시장의 근본적인 문제와 탄생 배경",
        "user_target": ["인구통계학적, 심리학적으로 정의된 구체적인 페르소나들"],
        "core_features": [
          {"feature": "기능명", "priority": "P0~P2", "description": "기능의 상세 정의와 이 기능이 사용자 가치를 어떻게 실현하는지 설명"}
        ],
        "user_stories": ["사용자가 겪는 시나리오와 그에 따른 제품의 가치 체감 경로"],
        "success_metrics": ["제품의 안착 여부를 판단할 구체적인 핵심 성과 지표(KPI) 리스트"]
      }`;
    case FrameworkType.LEAN_CANVAS:
      return `비즈니스 모델 아이디어: "${input}". 
      린 캔버스의 모든 항목을 논리적이고 풍부하게 분석해줘:
      {
        "problem": ["고객이 느끼는 가장 고통스러운 Pain Points 3가지와 그 이유"],
        "solution": ["각 문제를 완벽하게 해소할 제품/서비스의 핵심 메커니즘"],
        "key_metrics": ["사업의 생존과 성장을 증명할 수 있는 결정적인 숫자들"],
        "uvp": "경쟁사와 비교했을 때 고객이 반드시 우리를 선택해야만 하는 압도적인 이유",
        "unfair_advantage": "자본과 인력을 가진 대기업도 쉽게 카피할 수 없는 우리만의 해자(Moat)",
        "channels": ["고객에게 도달하는 가장 비용 효율적인 경로와 마케팅 전략"],
        "customer_segments": ["우리의 가치에 가장 먼저 반응할 핵심 고객층과 타겟 확장 순서"],
        "cost_structure": ["초기 및 운영 단계에서 발생하는 주요 비용 항목과 관리 포인트"],
        "revenue_streams": ["수익 극대화를 위한 다각화된 매출 구조와 현금 흐름 창출 방안"]
      }`;
    default:
      return `아이디어: "${input}". 
      해당 프레임워크에 맞는 전문적인 전략 데이터를 JSON 형식으로 아주 상세하고 풍부하게 도출해줘.`;
  }
};
