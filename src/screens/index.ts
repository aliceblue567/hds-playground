import type { ComponentType } from 'react';
import { PackagePayment } from './package-payment/PackagePayment';

// 실험 화면 등록. owner는 누가 시작했는지, status는 폐기 · 검토중 · Figma 정본화 · 이관 중 하나.
export type ScreenEntry = { id: string; title: string; owner: string; status: '검토중' | '폐기' | 'Figma 정본화' | '이관'; component: ComponentType };

export const screens: ScreenEntry[] = [
  { id: 'package-payment', title: '패키지 예약 · 결제 단계 (참조 화면)', owner: 'design', status: '검토중', component: PackagePayment },
];
