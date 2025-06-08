'use client';

import React from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface MarketingBannerProps {
  text: string;
  textColorClass?: string; // Optional class for text color override
}

const MarketingBanner: React.FC<MarketingBannerProps> = ({
  text,
  textColorClass = '',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '-.75rem',
        left: 'var(--card-horizontal-padding)',
        transform: 'translateY(-100%)',
        zIndex: 2,
        pointerEvents: 'none',
        width: '6.9375rem',
        height: '.2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '0.75rem 0rem',
          background: 'linear-gradient(90deg, #d4e4f0 0%, #c2e4ff 31.5%, #d9e1ed 66.5%, #e5caff 100%)',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <BioType
          className={'inter_body_small_regular'}
          style={{
            lineHeight: 'var(--Line-Height-Small-Body, 1.125rem)', // 18px
            fontWeight: 400,
            textAlign: 'center',
            fontFeatureSettings: "'liga' off, 'clig' off",
            whiteSpace: 'nowrap',
            color: 'var(--Text-Strong, rgba(0, 0, 0, 0.90))',
          }}
        >
          {text}
        </BioType>
      </div>
    </div>
  );
};

export default MarketingBanner;