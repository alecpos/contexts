'use client';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

export default function LegitScriptSeal() {
    const sealHtml = `
        <a href="https://legitscript.com" target="_blank" title="Verify LegitScript Approval">
            <img src="https://static.legitscript.com/seals/21048250.png" alt="LegitScript approved" width="105" height="90" border="0" />
        </a>
    `;

    return <div dangerouslySetInnerHTML={{ __html: sealHtml }} />;
}
