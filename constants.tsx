
import React from 'react';
import { FrameworkType, FrameworkInfo } from './types';

export const FRAMEWORKS: FrameworkInfo[] = [
  {
    type: FrameworkType.PRD,
    label: 'PRD 빌더',
    description: '제품 요구사항 문서(PRD), 유저 스토리 및 MoSCoW 우선순위 분석.',
    easyExplanation: '마치 레고를 조립하기 전의 "조립 설명서"와 같아요! 우리가 만들 앱이 누구를 위한 것인지, 어떤 기능이 꼭 있어야 하는지 차근차근 적어보는 거예요.',
    example: '예: "강아지 말을 번역해주는 앱"을 만든다면? 주인님이 쓰는 화면, 강아지 소리 분석 기능 등이 필요하겠죠!',
    icon: '📄'
  },
  {
    type: FrameworkType.SWOT,
    label: 'SWOT 분석',
    description: '내부의 강점/약점 및 외부의 기회/위협 매트릭스 분석.',
    easyExplanation: '우리의 "장점과 단점"을 한눈에 보여주는 보물지도예요. 우리가 잘하는 것과 조심해야 할 것을 알면 전쟁에서 이길 확률이 높아져요!',
    example: '예: "우리 학교 앞 떡볶이집" 분석하기. 장점은 "진짜 맵다", 단점은 "가게가 작다"처럼 정리하는 거예요.',
    icon: '📊'
  },
  {
    type: FrameworkType.ROADMAP,
    label: '전략 로드맵',
    description: '주요 마일스톤과 실행 계획이 포함된 시계열 로드맵.',
    easyExplanation: '앞으로 우리가 할 일을 달력에 표시한 "미래 계획표"예요. 언제 무엇을 완성할지 순서대로 적어두면 길을 잃지 않아요.',
    example: '예: "여름방학 정복하기". 1주차는 수영 배우기, 2주차는 독후감 쓰기처럼 차례대로 적는 거죠!',
    icon: '🗺️'
  },
  {
    type: FrameworkType.LEAN_CANVAS,
    label: '린 캔버스',
    description: '스타트업을 위한 핵심 비즈니스 모델 1페이지 요약.',
    easyExplanation: '내 사업 아이디어를 종이 한 장에 다 그리는 "마법의 지도"예요. 누가 우리 물건을 살지, 돈은 어떻게 벌지 한눈에 볼 수 있어요.',
    example: '예: "무인 문구점" 열기. 준비물은 무엇인지, 친구들이 어떤 학용품을 좋아할지 한 장에 정리해봐요.',
    icon: '🎨'
  },
  {
    type: FrameworkType.MCKINSEY_7S,
    label: '맥킨지 7S',
    description: '조직의 정렬 및 운영 효과성 진단을 위한 프레임워크.',
    easyExplanation: '회사의 톱니바퀴들이 잘 맞물려 돌아가는지 확인하는 "돋보기"예요. 사람, 실력, 규칙들이 모두 한마음인지 체크해봐요.',
    example: '예: "우리 축구팀" 이기게 만들기. 선수들의 실력, 감독님의 작전, 팀워크가 다 잘 맞는지 확인하는 거예요.',
    icon: '🏢'
  }
];

export const SYSTEM_INSTRUCTION = `당신은 맥킨지(McKinsey)와 같은 글로벌 컨설팅 펌 및 선도적인 테크 스타트업에서 20년 이상의 경력을 쌓은 세계적인 전략 컨설턴트이자 프로덕트 리더입니다.
당신의 목표는 사용자의 정형화되지 않은 비즈니스 아이디어를 MECE(Mutually Exclusive, Collectively Exhaustive) 원칙에 입각하여 매우 전문적이고 실행 가능한 전략 문서로 변환하는 것입니다.
모든 답변은 고품질의 한국어 마크다운(Markdown) 형식으로 작성하십시오.
비즈니스 전문 용어를 적절히 사용하며, 논리적이고 비판적인 시각을 유지하십시오.
사용자 입력이 모호할 경우, 전문적인 판단에 근거해 합리적인 가정을 세우고 이를 명시하여 답변을 완성하십시오.`;
