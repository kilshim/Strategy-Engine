
import { GoogleGenAI } from "@google/genai";
import { FrameworkType } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateStrategy = async (
  prompt: string,
  framework: FrameworkType,
  apiKey: string
): Promise<string> => {
  // 사용자가 입력한 키가 우선이며, 없을 경우 시스템 환경변수를 시도합니다.
  const finalApiKey = apiKey || process.env.API_KEY;
  
  if (!finalApiKey) {
    throw new Error("API 키가 설정되지 않았습니다. 설정에서 무료 API 키를 입력해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const frameworkPrompt = getFrameworkSpecificPrompt(framework, prompt);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: frameworkPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "콘텐츠 생성에 실패했습니다.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("입력된 API 키가 유효하지 않습니다. 다시 확인해주세요.");
    }
    throw new Error(error.message || "서비스 연결에 실패했습니다.");
  }
};

const getFrameworkSpecificPrompt = (framework: FrameworkType, input: string): string => {
  const languageSuffix = "모든 내용은 한국어로 상세하고 전문적으로 작성해줘.";
  
  switch (framework) {
    case FrameworkType.PRD:
      return `다음 아이디어에 대한 포괄적인 제품 요구사항 문서(PRD)를 작성해줘: "${input}". 
      포함 내용: 요약, 대상 고객, 유저 페르소나, 유저 스토리(수용 기준 포함), 기능적/비기능적 요구사항, MoSCoW 우선순위 매트릭스. ${languageSuffix}`;
    case FrameworkType.SWOT:
      return `다음 비즈니스에 대한 상세한 SWOT 분석을 수행해줘: "${input}". 
      결과를 마크다운 표 형식을 사용하여 2x2 매트릭스로 제시하고, 각 사분면(S-O, W-T 등)에 대한 구체적인 전략적 제언을 포함해줘. ${languageSuffix}`;
    case FrameworkType.ROADMAP:
      return `다음 프로젝트를 위한 12개월 전략 로드맵을 작성해줘: "${input}". 
      분기별(Q1-Q4)로 나누어 주요 마일스톤, 필요 자원, 핵심 성공 요인(KSF)을 정리해줘. ${languageSuffix}`;
    case FrameworkType.LEAN_CANVAS:
      return `다음 비즈니스 모델에 대한 린 캔버스를 작성해줘: "${input}". 
      문제점, 해결책, 고유 가치 제안, 경쟁 우위, 고객 세그먼트, 핵심 지표, 채널, 비용 구조, 수익원을 반드시 포함해줘. ${languageSuffix}`;
    case FrameworkType.MCKINSEY_7S:
      return `맥킨지 7S 프레임워크를 사용하여 다음 조직/비즈니스의 정렬 상태를 분석해줘: "${input}". 
      'Hard' 요소(전략, 구조, 시스템)와 'Soft' 요소(공유 가치, 스타일, 구성원, 기술)를 분석하고 개선 방향을 제시해줘. ${languageSuffix}`;
    default:
      return `${input} ${languageSuffix}`;
  }
};
