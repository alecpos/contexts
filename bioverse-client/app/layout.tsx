'use server';
import './globals.css';
import ThemeClient from './styles/mui-theme-provider';
import Script from 'next/script';
import themeOptions from './styles/mui-theme';

import RudderStackAnalytics from './components/tracking/RudderStackAnalytics';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' style={{ scrollBehavior: 'smooth' }}>
            <head>
                <script
                    type='text/javascript'
                    dangerouslySetInnerHTML={{
                        __html: `!function(){"use strict";var sdkBaseUrl="https://rssdk.gobioverse.com/v3";var sdkName="rsa.min.js";var asyncScript=true
    ;window.rudderAnalyticsBuildType="legacy",window.rudderanalytics=[]
    ;var e=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession"]
    ;for(var t=0;t<e.length;t++){var n=e[t];window.rudderanalytics[n]=function(e){return function(){
    window.rudderanalytics.push([e].concat(Array.prototype.slice.call(arguments)))}}(n)}try{
    new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(a){}
    if(window.rudderAnalyticsMount=function(){
    "undefined"==typeof globalThis&&(Object.defineProperty(Object.prototype,"__globalThis_magic__",{get:function get(){
    return this},configurable:true}),__globalThis_magic__.globalThis=__globalThis_magic__,
    delete Object.prototype.__globalThis_magic__);var e=document.createElement("script")
    ;e.src="".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),e.async=asyncScript,
    document.head?document.head.appendChild(e):document.body.appendChild(e)
    },"undefined"==typeof Promise||"undefined"==typeof globalThis){var d=document.createElement("script")
    ;d.src="https://polyfill.io/v3/polyfill.min.js?features=Symbol%2CPromise&callback=rudderAnalyticsMount",
    d.async=asyncScript,document.head?document.head.appendChild(d):document.body.appendChild(d)}else{
    window.rudderAnalyticsMount()}window.rudderanalytics.load("2lvknjYtKlsAmWdNN47xxe2lSbG","https://events.gobioverse.com",{configUrl: "https://rssdk.gobioverse.com"})
    window.rudderanalytics.page();}();`,
                    }}
                />

                <link
                    rel='preconnect'
                    href='https://dev.visualwebsiteoptimizer.com'
                />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)
                if(analytics.invoked)window.console&&console.error&&console.error("Snippet included twice.");
                else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview",
                "identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware",
                "addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return 
                    function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};
                    for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}
                    analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;
                    t.src="https://cdp.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";
                    var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._writeKey=key;
                    analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3";
            analytics.load("4c008097ec2a52c35c86");
            analytics.page();
			t.setAttribute('data-use-array-params', 'true');
            }}();
    `,
                    }}
                />
                <script
                    type='text/javascript'
                    id='vwoCode'
                    dangerouslySetInnerHTML={{
                        __html: `window._vwo_code || (function() {
var account_id=901880,
version=2.1,
settings_tolerance=2000,
hide_element='body',
hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important;',
/* DO NOT EDIT BELOW THIS LINE */
f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={nonce:v&&v.nonce,use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){if(performance.getEntriesByName('first-contentful-paint')[0]){return''}return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById('_vis_opt_path_hides');if(t)t.parentNode.removeChild(t);if(e)(new Image).src='https://dev.visualwebsiteoptimizer.com/ee.gif?a='+account_id+e}},finished:function(){return f},addScript:function(e){var t=d.createElement('script');t.type='text/javascript';if(e.src){t.src=e.src}else{t.text=e.text}v&&t.setAttribute('nonce',v.nonce);d.getElementsByTagName('head')[0].appendChild(t)},load:function(e,t){var n=this.getSettings(),i=d.createElement('script'),r=this;t=t||{};if(n){i.textContent=n;d.getElementsByTagName('head')[0].appendChild(i);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open('GET',e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||'text';o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200||o.status===304){w._vwo_code.addScript({text:o.responseText})}else{w._vwo_code.finish('&e=loading_failure:'+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}w._vwo_code.finish('&e=loading_failure:'+e)};o.send()}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){w._vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=='body'){t=d.createElement('style');var n=this.hide_element(),i=n?n+this.hide_element_style():'',r=d.getElementsByTagName('head')[0];t.setAttribute('id','_vis_opt_path_hides');v&&t.setAttribute('nonce',v.nonce);t.setAttribute('type','text/css');if(t.styleSheet)t.styleSheet.cssText=i;else t.appendChild(d.createTextNode(i));r.appendChild(t)}else{t=d.getElementsByTagName('head')[0];var i=d.createElement('div');i.style.cssText='z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;';i.setAttribute('id','_vis_opt_path_hides');i.classList.add('_vis_hide_layer');t.parentNode.insertBefore(i,t.nextSibling)}var o=window._vis_opt_url||d.URL,s='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(o)+'&vn='+version;if(w.location.search.indexOf('_vwo_xhr')!==-1){this.addScript({src:s})}else{this.load(s+'&x=true')}}};w._vwo_code=code;code.init();})();(function(){var i=window;function t(){if(i._vwo_code){var e=t.hidingStyle=document.getElementById('_vis_opt_path_hides')||t.hidingStyle;if(!i._vwo_code.finished()&&!_vwo_code.libExecuted&&(!i.VWO||!VWO.dNR)){if(!document.getElementById('_vis_opt_path_hides')){document.getElementsByTagName('head')[0].appendChild(e)}requestAnimationFrame(t)}}}t()})();`,
                    }}
                />
                <script>window.dataLayer = window.dataLayer || [];</script>
            </head>
            <Script
                id='gtm'
                strategy='afterInteractive'
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PBRBZ4C6');`,
                }}
            />

            <body>
                <noscript>
                    <iframe
                        src='https://www.googletagmanager.com/ns.html?id=GTM-PBRBZ4C6'
                        height='0'
                        width='0'
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>
                <RudderStackAnalytics />
                <ThemeClient themeOption={themeOptions}>{children}</ThemeClient>
            </body>
        </html>
    );
}
