
export enum FrameworkType {
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
  content: string;
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
