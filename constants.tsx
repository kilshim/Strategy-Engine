
import { FrameworkType, FrameworkInfo } from './types';

export const FRAMEWORKS: FrameworkInfo[] = [
  {
    type: FrameworkType.SUMMARY,
    label: '통합 전략 요약',
    description: '비즈니스의 핵심 가치와 전략을 한눈에 보여주는 마스터 대시보드.',
    easyExplanation: '내 사업의 "핵심 요약판"이에요. 우리가 왜 존재하는지, 어떻게 돈을 벌고 성공할지를 한 장으로 완벽하게 정리해줍니다.',
    example: '예:\n1. 1인 가구를 위한 구독형 유기농 밀키트 서비스의 수익 구조와 시장 선점 전략\n2. 친환경 소재를 활용한 프리미엄 테크 액세서리 브랜드의 런칭 로드맵 및 가치 제언',
    icon: '🏆'
  },
  {
    type: FrameworkType.PRD,
    label: 'PRD 빌더',
    description: '제품 요구사항 문서(PRD), 유저 스토리 및 MoSCoW 우선순위 분석.',
    easyExplanation: '아이디어를 실제로 만들기 위한 "제품 설계도"입니다. 어떤 사용자를 위해 어떤 기능을 먼저 만들어야 할지 상세하게 정의해줍니다.',
    example: '예:\n1. 클래식카 복원 및 부품 거래를 위한 소셜 마켓플레이스 앱의 핵심 기능 및 사용자 시나리오\n2. 생성형 AI를 활용한 개인 맞춤형 명상 및 수면 유도 서비스의 MVP 요구사항 정의',
    icon: '📄'
  },
  {
    type: FrameworkType.SWOT,
    label: 'SWOT 분석',
    description: '강점/약점/기회/위협을 시각화하는 전략 매트릭스.',
    easyExplanation: '우리 사업이 처한 "상황판"입니다. 우리의 내부 강점과 약점, 그리고 외부 시장의 기회와 위협을 분석해 최적의 전략을 도출합니다.',
    example: '예:\n1. 도심형 마이크로 풀필먼트 센터(MFC) 기반의 퀵커머스 서비스 시장 진입 분석\n2. 로컬 수제 맥주 브랜딩 기업의 전국 단위 유통망 확장 시 시장 경쟁 상황 분석',
    icon: '📊'
  },
  {
    type: FrameworkType.ROADMAP,
    label: '전략 로드맵',
    description: '분기별 마일스톤과 목표가 담긴 시각적 타임라인.',
    easyExplanation: '비즈니스 목표 달성을 위한 "이정표"입니다. 제품 출시 전후 1년간의 핵심 일정과 단계별 목표를 시각적으로 보여줍니다.',
    example: '예:\n1. B2B SaaS 협업 툴의 초기 시장 진입 후 글로벌 확장까지의 분기별 기술 개발 및 영업 로드맵\n2. 지역 기반 시니어 돌봄 매칭 서비스의 사용자 확보 및 신규 지역 진출 마일스톤',
    icon: '🗺️'
  },
  {
    type: FrameworkType.LEAN_CANVAS,
    label: '린 캔버스',
    description: '비즈니스 모델의 9가지 핵심 요소를 정리한 시트.',
    easyExplanation: '사업 모델의 "핵심 구조도"입니다. 고객 문제, 해결책, 수익 모델 등 9가지 요소를 한 장으로 정리해 사업의 논리성을 검증합니다.',
    example: '예:\n1. 베이커리의 전국 단위 D2C 배송 서비스 확장 모델을 위한 린 캔버스 작성\n2. 주택 임대 관리 자동화 솔루션 스타트업의 비즈니스 모델 및 유입 채널 정의',
    icon: '🎨'
  },
  {
    type: FrameworkType.MCKINSEY_7S,
    label: '맥킨지 7S',
    description: '조직의 내부 역량과 정렬 상태를 진단하는 모델.',
    easyExplanation: '회사의 톱니바퀴들이 잘 맞물려 돌아가는지 확인하는 "조직 진단 돋보기"입니다. 전략, 기술, 문화 등 7가지 요소의 정렬 상태를 진단합니다.',
    example: '예:\n1. 스타트업이 시리즈 A 투자 유치 후 조직 규모 확장(Scaling) 시 필요한 문화와 시스템 진단\n2. 전통적인 제조 기업이 디지털 전환(DX)을 추진할 때 필요한 내부 핵심 역량 및 변화 관리 포인트',
    icon: '💎'
  }
];

export const SYSTEM_INSTRUCTION = `당신은 맥킨지 출신의 전략 컨설턴트이자 실리콘밸리 제품 리더입니다.
사용자의 비즈니스 아이디어를 분석하여 시각화하기 좋은 구조화된 JSON 데이터로 답변하십시오.
설명 없이 순수 JSON만 반환하며, 모든 텍스트는 한국어로 작성하십시오.
폰트는 'Pretendard Variable'을 기준으로 가독성 있게 구조를 설계하십시오.`;
