import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Props {
    className: any;
    link1: string;
    link2: string;
    name: string;
}

function Capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Breadcrumbs({
    className,
    link1,
    link2,
    name,
}: Props): JSX.Element {
    return (
        <div
            id="breadcrumb-container"
            className={`inline-flex items-center relative ${className} body2`}
        >
            <div className="inline-flex items-center gap-[8px] flex-[0_0_auto] relative">
                <Link
                    className="text-gray-600 no-underline !flex-[0_0_auto] hover:text-gray-600 hover:underline"
                    href={`https://gobioverse.com`}
                >
                    Home
                </Link>
            </div>
            <div className={`flex flex-col items-center relative w-[36px]`}>
                <NavigateNextIcon />
            </div>
            <div>
                <Link
                    className="text-gray-600 no-underline !flex-[0_0_auto] hover:text-gray-600 hover:underline"
                    href={`/${link1}`}
                >
                    {Capitalize(link1)}
                </Link>
            </div>
            <div className={`flex flex-col items-center relative w-[36px]`}>
                <NavigateNextIcon />
            </div>
            <div className="inline-flex items-center gap-[8px] flex-[0_0_auto] relative">
                {name}
            </div>
        </div>
    );
}

Breadcrumbs.propTypes = {
    icon: PropTypes.bool,
    separator: PropTypes.oneOf(['text', 'icon']),
    collapsed: PropTypes.bool,
    linkLink: PropTypes.string,
    linkLink1: PropTypes.string,
    linkLink2: PropTypes.string,
};
