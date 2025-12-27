
export enum FrameworkType {
  SUMMARY = 'SUMMARY',
  PRD = 'PRD',
  SWOT = 'SWOT',
  ROADMAP = 'ROADMAP',
  LEAN_CANVAS = 'LEAN_CANVAS',
  MCKINSEY_7S = 'MCKINSEY_7S'
}

export interface AnalysisResult {
  id: string;
  framework: FrameworkType;
  title: string;
  content: any; // 시각화를 위해 JSON 데이터를 받도록 변경
  timestamp: number;
}

export interface FrameworkInfo {
  type: FrameworkType;
  label: string;
  description: string;
  easyExplanation: string;
  example: string;
  icon: string;
}
