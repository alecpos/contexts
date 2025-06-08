import React from 'react';
import Link from 'next/link';
import styles from '../../../intake-v2/styles/text-animations.module.css';

interface Props {
    children?: React.ReactNode;
    className?: string;
    id?: string;
    onClick?: any;
    animate?: boolean;
    delay?: number;
    style?: React.CSSProperties; 
}

export default function BioType({
    children,
    className,
    id,
    onClick,
    animate = false,
    delay = 0,
}: Props) {
    const renderStringContent = (text: string) => {
        const processedText = text.replace(/\[bio-quote\]/g, "'");

        const tagPattern =
            /(?:<|\[)bio-(paragraph|bullet-item|link)(?:\s+className="([^"]+)")?(?:>|\])(.*?)((?:<\/|\[\/)bio-\1(?:>|\]))/g;
        const linkPattern = /<source="([^"]+)">(.*?)<\/source>/;

        let match;
        const output = [];
        let foundCustomTag = false;

        while ((match = tagPattern.exec(processedText)) !== null) {
            foundCustomTag = true;
            const [fullMatch, bioTag, customClass, innerContent] = match;

            if (bioTag) {
                switch (bioTag) {
                    case 'paragraph':
                        output.push(
                            <p
                                key={`p-${output.length}`}
                                className={`my-2 ${customClass || ''}`}
                            >
                                {innerContent}
                            </p>
                        );
                        break;
                    case 'bullet-item':
                        // Apply Tailwind CSS classes for styling bullet items
                        output.push(
                            <div
                                key={`li-${output.length}`}
                                className={`flex items-start ${
                                    customClass || ''
                                }`}
                            >
                                <span className='text-lg leading-none mt-1 mr-2'>
                                    •
                                </span>
                                <span>{innerContent}</span>
                            </div>
                        );
                        break;
                    case 'link':
                        const linkMatch = innerContent.match(linkPattern);
                        if (linkMatch) {
                            output.push(
                                <Link
                                    key={`link-${output.length}`}
                                    href={linkMatch[1]}
                                >
                                    <a
                                        className={`text-blue-600 hover:text-blue-800 ${
                                            customClass || ''
                                        }`}
                                    >
                                        {linkMatch[2]}
                                    </a>
                                </Link>
                            );
                        }
                        break;
                }
            }
        }

        return foundCustomTag ? (
            output
        ) : animate ? (
            <p className={className}>
                {processedText.split(' ').map((letter, index) => (
                    <span
                        key={index}
                        style={{ animationDelay: `${index * 0.04 + delay}s` }}
                        className={styles['word-wrapper']}
                    >
                        <span>{letter}</span>
                    </span>
                ))}
            </p>
        ) : (
            <p className={className}>{processedText}</p>
        );
    };

    const renderContent = () => {
        if (typeof children === 'string') {
            return renderStringContent(children);
        } else {
            return children;
        }
    };

    return (
        <div className={`biotype ${className || ''}`} id={id} onClick={onClick}>
            {renderContent()}
        </div>
    );
}
