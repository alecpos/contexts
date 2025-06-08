'use client';

import ExpandMore from '@mui/icons-material/ExpandMore';
import MarketingBanner from '../supply-selection/MarketingBanner';
import React, { useEffect, useRef } from 'react';

interface SupplySelectionCardProps {
  promoHeader?: string;
  bannerLabel?: string;
  supplyLabel: string;
  savingsLabel?: string;
  priceFirstMonth?: string;
  pricePerMonth?: string;
  productLabel: string;
  shippingBillingLabel?: string;
  showMoreState: boolean;
  onCardClick: () => void;
  onToggleMore: () => void;
  className?: string;
  isSelected: boolean;
  supply: number;
  vialSizes: string[];
  pricingOriginal?: string;
  scale?: 'small' | 'normal' | 'large';
  children?: React.ReactNode;
}

const SupplySelectionCard: React.FC<SupplySelectionCardProps> = ({
  promoHeader,
  bannerLabel,
  supplyLabel,
  savingsLabel,
  priceFirstMonth,
  pricePerMonth,
  productLabel,
  shippingBillingLabel,
  showMoreState,
  onCardClick,
  onToggleMore,
  className = '',
  isSelected,
  supply,
  vialSizes: _vialSizes,
  pricingOriginal,
  scale = 'normal',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cardRef.current;
    if (!container) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const elements = Array.from(container.querySelectorAll('*'))
      .filter(el => (el as HTMLElement).offsetParent && el.nextElementSibling);

    const extractContent = (el: HTMLElement) => {
      const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
      return text.length ? text.slice(0, 80) : '(empty)';
    };

    let output = '';
    for (let i = 0; i < elements.length - 1; i++) {
      const curr = elements[i];
      const next = elements[i + 1];
      if (!(next as HTMLElement).offsetParent) continue;

      const currRect = curr.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const gapPx = nextRect.top - currRect.bottom;
      const gapRem = gapPx / rootFontSize;

      if (gapPx > 0) {
        output += `Between [${curr.tagName.toLowerCase()}] "${extractContent(curr as HTMLElement)}"\n`;
        output += `and     [${next.tagName.toLowerCase()}] "${extractContent(next as HTMLElement)}": ${gapRem.toFixed(2)}rem (${gapPx.toFixed(1)}px)\n\n`;
      }
    }

    if (output) {
      console.groupCollapsed('🧪 SupplySelectionCard Spacing Report');
      console.log(output);
      console.groupEnd();
    } else {
      console.log('✅ No spacing gaps detected inside SupplySelectionCard.');
    }
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
<div style={{ position: 'relative', width: '100%' }}>
{bannerLabel && (
  <div style={{ position: 'absolute', left: '1.0625rem', zIndex: 1 }}>
    <MarketingBanner text={bannerLabel} />
  </div>
)}
        <div
          onClick={onCardClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '1rem 1rem 1.25rem 1rem',
            gap: 0,
            alignSelf: 'stretch',
            background: isSelected ? 'rgba(237, 250, 255, 0.4)' : '#ffffff',
            border: isSelected
              ? '0.1875rem solid #98D2EA'
              : '1px solid rgba(102, 102, 102, 0.2)',
            borderRadius: '0.75rem',
            transition: 'transform 0.2s ease',
            cursor: 'pointer',
          }}
        >
{promoHeader && (
  <div
    className="inter_body_small_regular"
    style={
      supply === 1
        ? {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            color: 'var(--Text-Strong, rgba(0, 0, 0, 0.90))',
            fontFeatureSettings: "'liga' off, 'clig' off",
          }
        : {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background:
              'linear-gradient(91deg, var(--Green-Light-50, #CCFBB6) -10.58%, var(--Green-Light-50, #CCFBB6) 110.06%)',
            padding: '0.25rem 1rem',
            borderRadius: '0.25rem',
            color: 'var(--Text-Strong, rgba(0, 0, 0, 0.90))',
            textAlign: 'center',
            fontFeatureSettings: "'liga' off, 'clig' off",
            boxSizing: 'border-box',
          }
    }
  >
    {promoHeader}
  </div>
)}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="inter_body_bold">{supplyLabel}</div>
              {priceFirstMonth && (
              <div className="inter_body_bold">{priceFirstMonth}</div>
            )}
                {pricingOriginal && (
                  <div
                    className="inter_body_regular"
                    style={{
                      color: '#D11E66',
                      textDecoration: 'line-through',
                    }}
                  >
                    {pricingOriginal}
                  </div>
                )}
              </div>

            {savingsLabel && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div
                  style={{
                    padding: '0.375rem',
                    border: '1px solid rgba(0, 0, 0, 0.9)',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: 'rgba(0, 0, 0, 0.9)',
                  }}
                >
                  <span>{savingsLabel}</span>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: '100%',
              height: '3.125rem',
              marginBottom: '0.62rem',
              justifyContent: 'space-between',
            }}
          >
            <div
              className="inter_body_regular"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <span>
                {productLabel}
                {shippingBillingLabel && (
                  <>
                    <br />
                    <span
                      className="inter_body_regular"
                      style={{
                        color: 'var(--text-secondary, rgba(0, 0, 0, 0.60))',
                      }}
                    >
                      {shippingBillingLabel}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 0 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMore();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--Spacing-8, 0.5rem)',
                background: 'transparent',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                border: 'none', // <-- Add this line
                marginTop: 0,
              }}
            >
              <span className="inter_body_small_regular" style={{ fontSize: '0.75rem', fontWeight: 600, textDecorationLine: 'underline'}}>
                {showMoreState ? 'See Less' : 'Learn More'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.08919rem" height="1.08919rem" viewBox="0 0 18 18" fill="none">
                  <path d="M13.571 11.3636L9.21419 7.00684L4.85742 11.3636" stroke="#191919" strokeWidth="1.08919" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            {showMoreState && (
  <div
    className="md:w-[413px] pt-[0.62rem] pb-[1.25rem] md:pt-[10px] md:pb-[20px]"
    style={{
      width: '17.875rem',
      flex: 'none',
      order: 4,
      flexGrow: 0,
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <ul
      className="inter_body_regular text-[0.875rem] leading-[1.25rem] md:text-[16px] md:leading-[20px]"
      style={{
        paddingLeft: '1.25rem',
        fontFamily: 'Inter, sans-serif',
        color: 'rgba(0, 0, 0, 0.9)',
        fontStyle: 'normal',
        fontWeight: 400,
        margin: 0,
      }}
    >
      <li>
        {productLabel} shipped and billed{' '}
        {supply === 1
          ? 'monthly'
          : supply === 3
          ? 'quarterly'
          : 'semi‑annually'}
      </li>
      <li>Dedicated patient success team</li>
      <li>Free home delivery</li>
      <li>Doctor‑formulated</li>
    </ul>
  </div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplySelectionCard;
