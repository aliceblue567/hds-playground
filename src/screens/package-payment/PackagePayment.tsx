// 참조 화면 — 패키지 예약의 「결제 단계」. AGENTS.md 규칙대로 HDS 컴포넌트만으로 조립했다.
// 이 화면이 보여주는 것: 헤더 → 예약 요약 → 여행자 → 쿠폰 · 포인트 → 결제수단 → 약관 → 하단 고정 결제 버튼,
// 그리고 로딩(Skeleton) · 쿠폰 없음(EmptyState) 상태. HDS에 없는 "요금 요약 카드" 하나만 data-hds="custom"으로 표시했다.
import { useEffect, useState } from 'react';
import {
  Header, ListCell, ListValue, Label, Divider, RadioItem, CheckboxItem, AccordionGroup, BottomFixed, BottomPanelText,
  EmptyState, SkeletonGroup, SkeletonText, SkeletonRectangle, Toast, ToastRegion, Icon, icChevronRightRegularTight,
} from '@aliceblue567/hds-react';
import { booking, packages, coupons, paymentMethods, formatKRW, formatDate } from '../../mock';
import './PackagePayment.css';

type PayMethod = (typeof paymentMethods)[number]['id'];

export function PackagePayment() {
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PayMethod | null>(booking.payment.method);
  const [couponId, setCouponId] = useState<string | null>(booking.payment.couponId);
  const [agree, setAgree] = useState(booking.agreements);
  const [toast, setToast] = useState<string | null>(null);

  // 목데이터지만 실제 화면처럼 로딩 상태를 한 번 거친다(규칙 5).
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const product = packages.find((p) => p.id === booking.productId)!;
  const adults = booking.travelers.filter((t) => t.type === 'adult').length;
  const children = booking.travelers.filter((t) => t.type === 'child').length;
  const subtotal = adults * product.priceAdult + children * product.priceChild;
  const coupon = coupons.find((c) => c.id === couponId);
  const discount = !coupon ? 0 : coupon.kind === 'amount' ? coupon.amount : Math.min(Math.floor(subtotal * coupon.rate), coupon.maxAmount);
  const total = subtotal - discount;
  const allRequired = agree.terms && agree.privacy && agree.cancelPolicy;
  const canPay = !!method && allRequired && !loading;

  const setAll = (on: boolean) => setAgree({ terms: on, privacy: on, cancelPolicy: on, marketing: on });

  // Toast는 3초 뒤 사라진다(가이드 Duration)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);

  const pay = () => {
    if (!canPay) { setToast(!method ? '결제수단을 선택해 주세요' : '필수 약관에 동의해 주세요'); return; }
    setToast(`${formatKRW(total)} 결제를 요청했어요`);
  };

  return (
    <div className="pay">
      <Header type="sub" title="결제" onBack={() => history.back()} />

      <SkeletonGroup loading={loading} label="예약 정보 불러오는 중">
        {loading ? (
          <div className="pay__skeleton">
            <SkeletonRectangle width="100%" height={88} />
            <SkeletonText length={75} />
            <SkeletonText length={50} />
            <SkeletonRectangle width="100%" height={160} />
          </div>
        ) : (
          <div className="pay__body">
            {/* 1. 예약 요약 */}
            <section aria-labelledby="sec-summary">
              <h2 id="sec-summary" className="pay__h2">예약 상품</h2>
              <ListCell
                title={product.title}
                subtitle={`${formatDate(booking.departureDate)} 출발 · ${product.nights}박 ${product.days}일 · ${product.airline}`}
                trailing={<Icon icon={icChevronRightRegularTight} size={20} />}
                density="spacious"
                verticalAlign="center"
                onClick={() => setToast('상품 상세로 이동')}
              />
              <div className="pay__labels">
                {product.labels.map((l) => <Label key={l} variant="tinted" color={l === '출발확정' ? 'mint' : 'gray'}>{l}</Label>)}
              </div>
            </section>

            <Divider thickness="block" />

            {/* 2. 여행자 */}
            <section aria-labelledby="sec-travelers">
              <h2 id="sec-travelers" className="pay__h2">여행자 {booking.travelers.length}명</h2>
              {booking.travelers.map((t, i) => (
                <ListCell
                  key={t.nameEn}
                  title={`${t.nameKo} (${t.nameEn})`}
                  subtitle={`${t.type === 'adult' ? '성인' : t.type === 'child' ? '아동' : '유아'} · ${t.birth} · ${t.gender === 'F' ? '여' : '남'}`}
                  trailing={<ListValue>{formatKRW(t.type === 'adult' ? product.priceAdult : t.type === 'child' ? product.priceChild : product.priceInfant)}</ListValue>}
                  divider={i < booking.travelers.length - 1}
                  density="compact"
                />
              ))}
            </section>

            <Divider thickness="block" />

            {/* 3. 쿠폰 · 포인트 */}
            <section aria-labelledby="sec-coupon">
              <h2 id="sec-coupon" className="pay__h2">할인</h2>
              {coupons.length === 0 ? (
                <EmptyState type="empty" size="compact" heading="사용할 수 있는 쿠폰이 없어요" description="쿠폰은 마이페이지에서 받을 수 있어요" showButton={false} placement="section" />
              ) : (
                <div role="radiogroup" aria-label="쿠폰 선택" className="pay__group">
                  <RadioItem name="coupon" label="쿠폰 사용 안 함" checked={couponId === null} onChange={() => setCouponId(null)} />
                  {coupons.map((c) => {
                    const usable = subtotal >= c.minSpend;
                    return (
                      <RadioItem
                        key={c.id}
                        name="coupon"
                        label={c.name}
                        helper={usable ? `${c.expires}까지` : `${formatKRW(c.minSpend)} 이상 결제 시 사용 가능`}
                        checked={couponId === c.id}
                        disabled={!usable}
                        onChange={() => setCouponId(c.id)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <Divider thickness="block" />

            {/* 4. 결제수단 */}
            <section aria-labelledby="sec-method">
              <h2 id="sec-method" className="pay__h2">결제수단</h2>
              <div role="radiogroup" aria-label="결제수단 선택" className="pay__group">
                {paymentMethods.map((m) => (
                  <RadioItem key={m.id} name="method" size="medium" label={m.label} helper={m.helper} checked={method === m.id} onChange={() => setMethod(m.id)} />
                ))}
              </div>
            </section>

            <Divider thickness="block" />

            {/* 5. 요금 요약 — HDS에 이 카드가 없어 커스텀(규칙 4). 백로그 후보. */}
            <section aria-labelledby="sec-total">
              <h2 id="sec-total" className="pay__h2">결제 금액</h2>
              <dl className="pay__sum" data-hds="custom" data-hds-reason="요금 요약(소계 · 할인 · 합계) 카드가 HDS에 없음 — ListCell로는 합계 강조 행을 못 만듦">
                <div><dt>상품 금액</dt><dd>{formatKRW(subtotal)}</dd></div>
                <div><dt>쿠폰 할인</dt><dd className={discount ? 'is-discount' : undefined}>{discount ? `-${formatKRW(discount)}` : '0원'}</dd></div>
                <div className="pay__sum-total"><dt>총 결제 금액</dt><dd>{formatKRW(total)}</dd></div>
              </dl>
            </section>

            <Divider thickness="block" />

            {/* 6. 약관 */}
            <section aria-labelledby="sec-terms">
              <h2 id="sec-terms" className="pay__h2">약관 동의</h2>
              <div className="pay__group">
                <CheckboxItem size="medium" label="전체 동의" checked={allRequired && agree.marketing} indeterminate={!(allRequired && agree.marketing) && (agree.terms || agree.privacy || agree.cancelPolicy || agree.marketing)} onChange={(e) => setAll(e.currentTarget.checked)} />
                <Divider tone="subtle" />
                <CheckboxItem label="[필수] 여행약관 및 예약 조건" icon checked={agree.terms} onChange={(e) => setAgree({ ...agree, terms: e.currentTarget.checked })} />
                <CheckboxItem label="[필수] 개인정보 수집 · 제3자 제공" icon checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.currentTarget.checked })} />
                <CheckboxItem label="[필수] 취소 · 환불 규정" helper="출발 29일 전까지 전액 환불됩니다" icon checked={agree.cancelPolicy} onChange={(e) => setAgree({ ...agree, cancelPolicy: e.currentTarget.checked })} />
                <CheckboxItem label="[선택] 혜택 · 이벤트 알림 수신" checked={agree.marketing} onChange={(e) => setAgree({ ...agree, marketing: e.currentTarget.checked })} />
              </div>
              <AccordionGroup
                size="small"
                type="fill"
                items={[
                  { title: '취소 수수료 안내', children: '출발 30일 전 취소 시 수수료가 없습니다. 29~20일 전 10%, 19~10일 전 15%, 9~8일 전 20%, 7~1일 전 30%, 당일 50%가 부과됩니다.' },
                  { title: '결제 안내', children: '카드 결제는 즉시 승인되며, 계좌이체는 입금 확인 후 예약이 확정됩니다.' },
                ]}
              />
            </section>
          </div>
        )}
      </SkeletonGroup>

      <BottomFixed
        panel={<BottomPanelText label="총 결제 금액" value={loading ? '계산 중' : formatKRW(total)} />}
        primaryAction={{ label: '결제하기', onClick: pay, disabled: loading }}
      />

      <ToastRegion>{toast && <Toast key={toast} message={toast} />}</ToastRegion>
    </div>
  );
}
