var mixpanel = require('mixpanel').init(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
        ? process.env.MIXPANEL_DEV_PROJECT_TOKEN
        : process.env.MIXPANEL_PROD_PROJECT_TOKEN,
);

module.exports = mixpanel;
