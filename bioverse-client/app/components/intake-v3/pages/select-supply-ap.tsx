'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState } from 'react';
import ContinueButton from '../buttons/ContinueButtonV3AP';
import SupplySelectionCard from '../components/SupplySelectionCard';
import Image from 'next/image';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { BaseOrder } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { StripePriceId } from '@/app/types/product-prices/product-prices-types';

interface SelectSupplyProps {
  monthlyPriceData: any;
  quarterlyPriceData: any;
  orderData: BaseOrder;
  monthlyDiscount: string;
  quarterlyDiscount: string;
  priceData: any[];
}

export default function SelectSupplyComponent({
  orderData,
  monthlyPriceData,
  quarterlyPriceData,
  monthlyDiscount,
  quarterlyDiscount,
  priceData = [],
}: SelectSupplyProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fullPath = usePathname();

  const [selectedSupply, setSelectedSupply] = useState<1 | 3 | 6>(1);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showMore, setShowMore] = useState<Record<1 | 3 | 6, boolean>>({ 1: false, 3: false, 6: false });

  const biannualVariant = priceData.find(v => v.cadence === 'biannually');
  const quarterlyVariant = priceData.find(v => v.cadence === 'quarterly');
  const regularMonthlyVariant = priceData.find(v => v.variant_index === 1);

  // Calculate savings for all variants
  const regularMonthlyPrice = regularMonthlyVariant?.price_data?.product_price || 239;
  const biannualTotal = regularMonthlyPrice * 6;
  const quarterlyTotal = regularMonthlyPrice * 3;
  const biannualPrice = biannualVariant?.price_data?.product_price || 0;
  const quarterlyPrice = quarterlyVariant?.price_data?.product_price || 0;

  const savingsAmounts = {
    6: biannualTotal - biannualPrice,
    3: quarterlyTotal - quarterlyPrice,
    1: 0 // No savings for monthly
  };

  const getBillingText = (supply: 1 | 3 | 6) =>
    supply === 6 ? 'billed semi‑annually' : supply === 3 ? 'billed quarterly' : 'billed monthly';

  const displayProductName = (href: string) =>
    href === PRODUCT_HREF.B12_INJECTION ? 'B12 Methylcobalamin ' : href === PRODUCT_HREF.SERMORELIN ? 'Sermorelin ' : href;

  const buildUpdateOrderPayload = () => {
    const variant =
      selectedSupply === 6 ? biannualVariant : selectedSupply === 3 ? quarterlyVariant : regularMonthlyVariant;
    const discount = selectedSupply === 6 || selectedSupply === 3 ? quarterlyDiscount : monthlyDiscount;

    return {
      price_id: variant?.stripe_price_ids[process.env.NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId],
      price: variant?.price_data?.product_price,
      variant_index: variant?.variant_index,
      variant_text: variant?.vial_dosages,
      subscription_type: selectedSupply === 6 ? 'biannually' : selectedSupply === 3 ? 'quarterly' : 'monthly',
      discount_id: discount ? [discount] : [],
    };
  };

  const pushToNextRoute = async () => {
    setButtonLoading(true);
    await updateOrder(orderData.id, buildUpdateOrderPayload());

    const nextRoute = getNextIntakeRoute(fullPath, orderData.product_href, searchParams.toString(), false);
    const sp = new URLSearchParams(searchParams.toString());

    let subscriptionType = selectedSupply === 6 ? 'semi-annually' : selectedSupply === 3 ? 'quarterly' : 'monthly';
    sp.set('st', subscriptionType);

    router.push(`/intake/prescriptions/${orderData.product_href}/${nextRoute}?${sp.toString()}`);
  };

  const renderSupplyCard = (supply: 1 | 3 | 6, idx: number) => {
    const variant = supply === 6 ? biannualVariant : supply === 3 ? quarterlyVariant : regularMonthlyVariant;
    const totalIndividualCost = regularMonthlyPrice * supply;
    const bundlePrice = variant?.price_data?.product_price || 0;
    const savingsAmount = savingsAmounts[supply];
    const savingsPct = Math.round((savingsAmount / totalIndividualCost) * 100);

    let marginBottom = '0';
    if (supply === 6) marginBottom = '2.5rem'; // Top card
    if (supply === 3) marginBottom = '1.5rem';       // Middle card
    if (supply === 1) marginBottom = '4rem';       // Middle card

    return (
      <div style={{ marginBottom }}>
        <SupplySelectionCard
          key={supply}
          bannerLabel={supply === 6 ? 'Max Savings' : supply === 3 ? 'Most Popular' : undefined}
          promoHeader={supply !== 1 ? `For a limited time, save ${savingsPct}%` : 'Supply ships every month. Cancel anytime.'}
          supplyLabel={`${supply}-month supply`}
          savingsLabel={supply !== 1 ? `save $${savingsAmount}` : undefined}
          priceFirstMonth={variant?.price_data?.quarterly_display_price}
          pricePerMonth={variant?.price_data?.quarterly_display_price}
          pricingOriginal={supply !== 1 ? `$${regularMonthlyPrice.toFixed(2)}` : undefined}
          productLabel={`${displayProductName(orderData.product_href)} ${supply === 6 ? '60' : supply === 3 ? '30' : '10'} mg`}
          shippingBillingLabel={`Shipped monthly, ${getBillingText(supply)}`}
          isSelected={selectedSupply === supply}
          supply={supply}
          vialSizes={variant?.vial_dosages?.split(' x ').map(() => '10')}
          showMoreState={showMore[supply]}
          onCardClick={() => setSelectedSupply(supply)}
          onToggleMore={() => setShowMore(prev => ({ ...prev, [supply]: !prev[supply] }))}
        >
          <span
            className="inter_body_regular"
            style={{
              color: 'var(--Text-Strong, rgba(0, 0, 0, 0.90))',
              fontSize: 'var(--Size-Body, 1rem)',
              fontWeight: 400,
              lineHeight: 'var(--Line-Height-Body, 1.25rem)'
            }}
          >
            {/* expanded section text here */}
          </span>
        </SupplySelectionCard>
      </div>
    );
  };

  const discountText = biannualVariant?.price_data?.blue_display_text?.replace('Your Savings: ', '') ?? '17%';
  const bannerRef = '/img/intake/sermorelin/sermorelin_banner2.png';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      maxWidth: '32rem',
      margin: '0 auto',
      padding: '0 1.25rem',
      backgroundColor: '#FAFAFA',
    }}>
        <div style={{ width: '100%', height: '6.3125rem', position: 'relative', marginBottom: '1rem' }}>
          <Image
            src={bannerRef}
            alt="product"
            fill
            priority
            sizes="(max-width: 447px) 100vw, 447px"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <h2 className='inter_h5_regular'>
            How much medication would you like to receive?
          </h2>
          <p className='inter_body_medium_regular'>
            For a limited time, Bioverse is offering a {discountText} discount on your medication if you purchase a 6-month supply.
          </p>
        </div>
        <div style={{ width: '100%' }}>{([6, 3, 1] as const).map((supply, idx) => renderSupplyCard(supply, idx))}
        <ContinueButton
            onClick={pushToNextRoute}
            buttonLoading={buttonLoading}
          />
  </div>

      </div>
  );
}
