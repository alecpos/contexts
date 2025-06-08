'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

/** Simple intro page for the global weight loss funnel. */
export default function GlobalIntro() {
    return (
        <div className="flex flex-col items-center gap-4">
            <BioType className="inter-h5-question-header">
                Welcome to Bioverse
            </BioType>
            <p className="text-sm text-gray-600">
                Start your journey to better health.
            </p>
        </div>
    );
}
