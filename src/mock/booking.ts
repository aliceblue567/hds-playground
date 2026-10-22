// 예약 진행 상태 목데이터 — 예약 · 결제 플로우 화면 실험용.
export type Traveler = { type: 'adult' | 'child' | 'infant'; nameKo: string; nameEn: string; birth: string; gender: 'M' | 'F' };
export type Booking = {
  id: string;
  productId: string;
  departureDate: string;
  travelers: Traveler[];
  contact: { name: string; phone: string; email: string };
  payment: { method: 'card' | 'transfer' | 'kakao' | 'naver' | null; installment: number; usePoint: number; couponId: string | null };
  agreements: { terms: boolean; privacy: boolean; cancelPolicy: boolean; marketing: boolean };
};

export const booking: Booking = {
  id: 'BK-20261022-0001',
  productId: 'PKG-OSA-4D',
  departureDate: '2026-11-19',
  travelers: [
    { type: 'adult', nameKo: '이유진', nameEn: 'LEE YUJIN', birth: '1990-05-14', gender: 'F' },
    { type: 'adult', nameKo: '김하나', nameEn: 'KIM HANA', birth: '1991-02-02', gender: 'F' },
  ],
  contact: { name: '이유진', phone: '010-1234-5678', email: 'yujin@example.com' },
  payment: { method: null, installment: 0, usePoint: 0, couponId: null },
  agreements: { terms: false, privacy: false, cancelPolicy: false, marketing: false },
};

export type Coupon =
  | { id: string; name: string; kind: 'amount'; amount: number; minSpend: number; expires: string }
  | { id: string; name: string; kind: 'rate'; rate: number; maxAmount: number; minSpend: number; expires: string };

export const coupons: Coupon[] = [
  { id: 'CP-WELCOME', name: '신규 가입 3만원 할인', kind: 'amount', amount: 30000, minSpend: 500000, expires: '2026-12-31' },
  { id: 'CP-JP10', name: '일본 패키지 10% 할인 (최대 15만원)', kind: 'rate', rate: 0.1, maxAmount: 150000, minSpend: 0, expires: '2026-11-30' },
];

export const paymentMethods = [
  { id: 'card', label: '신용 · 체크카드', helper: '무이자 할부 최대 6개월' },
  { id: 'kakao', label: '카카오페이', helper: '카카오페이 포인트 적립' },
  { id: 'naver', label: '네이버페이', helper: '네이버 포인트 1% 적립' },
  { id: 'transfer', label: '실시간 계좌이체', helper: '즉시 출금 · 영수증 발행' },
] as const;
