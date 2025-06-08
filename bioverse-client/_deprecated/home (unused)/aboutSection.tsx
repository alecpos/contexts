import React from 'react';
import { Button } from '@mui/material';

export default function AboutSection() {
    return (
        <div className="">
            <p className="">Science is in our DNA</p>
            <p className="">
                Our genes determine less than 10% of how we age.
                <br />
                Over 90% is due to lifestyle &amp; environment.
            </p>
            <p className="">[SOURCE: RUBY ET AL., 2018]</p>
            <p className="">Begin your longevity journey now.</p>
            <div className="">
                <Button variant="contained">Explore all Treatments</Button>
                {/**stateProp="enabled"
                 *  className={button-instance"
                 *  labelText="Explore all treatments"
                 *  showIcon={false} style="filled"
                 * onClickAction="redirect"
                 * redirectHref="collections" */}

                <Button variant="contained">
                    Take the FREE Longevity Quiz
                </Button>
                {/**stateProp="enabled"
                    className={design-component-instance-node"
                    labelText="Take FREE longevity quiz"
                    showIcon={false}
                    style="outlined"
                    onClickAction="redirect" 
                    redirectHref="longevityquiz" */}
            </div>
        </div>
    );
}
