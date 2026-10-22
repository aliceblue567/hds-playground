// 항공 일정 목데이터 — 화면 실험용. 실제 편명 · 운임이 아니다.
export type FlightSegment = {
  flightNo: string;
  airline: string;
  from: { code: string; city: string; time: string };
  to: { code: string; city: string; time: string };
  durationMin: number;
  cabin: '이코노미' | '비즈니스';
};
export type FlightItinerary = {
  id: string;
  outbound: FlightSegment;
  inbound: FlightSegment;
  priceAdult: number;
  baggage: string;
  refundable: boolean;
};

export const flights: FlightItinerary[] = [
  {
    id: 'FLT-ICN-KIX-1',
    outbound: { flightNo: 'KE721', airline: '대한항공', from: { code: 'ICN', city: '인천', time: '09:05' }, to: { code: 'KIX', city: '오사카', time: '10:55' }, durationMin: 110, cabin: '이코노미' },
    inbound: { flightNo: 'KE722', airline: '대한항공', from: { code: 'KIX', city: '오사카', time: '12:10' }, to: { code: 'ICN', city: '인천', time: '14:05' }, durationMin: 115, cabin: '이코노미' },
    priceAdult: 412000,
    baggage: '위탁 23kg 1개',
    refundable: true,
  },
  {
    id: 'FLT-ICN-DAD-1',
    outbound: { flightNo: 'LJ067', airline: '진에어', from: { code: 'ICN', city: '인천', time: '21:40' }, to: { code: 'DAD', city: '다낭', time: '00:55+1' }, durationMin: 315, cabin: '이코노미' },
    inbound: { flightNo: 'LJ068', airline: '진에어', from: { code: 'DAD', city: '다낭', time: '02:05' }, to: { code: 'ICN', city: '인천', time: '08:25' }, durationMin: 320, cabin: '이코노미' },
    priceAdult: 289000,
    baggage: '위탁 15kg 1개',
    refundable: false,
  },
];
