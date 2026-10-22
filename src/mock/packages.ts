// 패키지 상품 목데이터 — 화면 실험용. 실제 상품 · 가격이 아니다. 새 필드가 필요하면 여기에 더하고, 모양을 새로 만들지 않는다.
export type PackageProduct = {
  id: string;
  title: string;
  region: string;
  nights: number;
  days: number;
  departure: string; // 출발 공항
  airline: string;
  priceAdult: number; // 성인 1인 KRW
  priceChild: number;
  priceInfant: number;
  labels: string[]; // 무료취소 · 노쇼핑 · 노옵션 등 (HDS Label)
  rating: number; // 0~5
  reviewCount: number;
  thumbnail: string; // 자리표시 이미지(실존 사진 금지)
  departures: { date: string; seatsLeft: number; status: 'available' | 'waitlist' | 'confirmed' }[];
};

export const packages: PackageProduct[] = [
  {
    id: 'PKG-OSA-4D',
    title: '오사카 · 교토 · 나라 4일, 노쇼핑 · 노옵션',
    region: '일본 간사이',
    nights: 3,
    days: 4,
    departure: '인천',
    airline: '대한항공',
    priceAdult: 1290000,
    priceChild: 1090000,
    priceInfant: 300000,
    labels: ['무료취소', '노쇼핑', '노옵션', '출발확정'],
    rating: 4.7,
    reviewCount: 128,
    thumbnail: 'https://placehold.co/720x480/EEE/999?text=OSAKA',
    departures: [
      { date: '2026-11-12', seatsLeft: 6, status: 'confirmed' },
      { date: '2026-11-19', seatsLeft: 2, status: 'available' },
      { date: '2026-11-26', seatsLeft: 0, status: 'waitlist' },
    ],
  },
  {
    id: 'PKG-DAD-5D',
    title: '다낭 · 호이안 5일, 5성 리조트 2박 + 시내 2박',
    region: '베트남 다낭',
    nights: 3,
    days: 5,
    departure: '인천',
    airline: '진에어',
    priceAdult: 899000,
    priceChild: 799000,
    priceInfant: 200000,
    labels: ['조식포함', '전일정 가이드'],
    rating: 4.5,
    reviewCount: 342,
    thumbnail: 'https://placehold.co/720x480/EEE/999?text=DANANG',
    departures: [
      { date: '2026-11-15', seatsLeft: 12, status: 'available' },
      { date: '2026-11-22', seatsLeft: 4, status: 'confirmed' },
    ],
  },
  {
    id: 'PKG-CDG-8D',
    title: '파리 · 스위스 · 로마 서유럽 8일, 일급호텔 · 1회 자유',
    region: '서유럽',
    nights: 6,
    days: 8,
    departure: '인천',
    airline: '아시아나항공',
    priceAdult: 3490000,
    priceChild: 3190000,
    priceInfant: 800000,
    labels: ['무료취소', '전용차량', '1회 자유'],
    rating: 4.8,
    reviewCount: 57,
    thumbnail: 'https://placehold.co/720x480/EEE/999?text=EUROPE',
    departures: [
      { date: '2026-12-03', seatsLeft: 9, status: 'available' },
      { date: '2026-12-17', seatsLeft: 1, status: 'available' },
    ],
  },
];

export const formatKRW = (n: number) => `${n.toLocaleString('ko-KR')}원`;
export const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getMonth() + 1}.${d.getDate()}(${w})`;
};
