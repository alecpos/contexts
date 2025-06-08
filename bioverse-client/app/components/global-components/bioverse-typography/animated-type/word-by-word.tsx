import { ReactNode, isValidElement, useEffect, useState } from 'react';
import styles from '../../../intake-v2/styles/text-animations.module.css';
import {
    resetTextAnimations,
    syncTextAnimations,
} from '@/app/components/intake-v2/intake-animations';

interface Props {
    children: ReactNode;
    delay?: number;
    className?: string;
}

function WordByWord({ children, delay = 0.05, className }: Props) {
    let styledWord = (i: number, className: string, w: string | number) => {
        return (
            <span
                key={i}
                style={{ animationDelay: `${i * delay}s` }}
                className={`${styles['word-wrapper']} ${className}`}
            >
                {w}
            </span>
        );
    };

    const renderWords = () => {
        let tempText: React.JSX.Element[] = [];
        let i = 0;

        const getChildText = (children: ReactNode, className: string) => {
            if (typeof children === 'string' || typeof children === 'number') {
                const c =
                    typeof children === 'string'
                        ? children
                        : children.toString();
                for (let w of c.split(' ')) {
                    tempText.push(styledWord(i, className, w));
                    i++;
                }
                return tempText;
            }
            if (
                children &&
                isValidElement(children) &&
                children.type == 'span'
            ) {
                let { children: echildren, className: eClass } = children.props;
                getChildText(echildren, eClass);
            }
            if (!children || !Array.isArray(children)) {
                return [];
            }
            for (let child of children) {
                getChildText(child, className);
            }
        };
        getChildText(children, className || '');
        return tempText;
    };

    const [text, setText] = useState<ReactNode[]>(renderWords());

    // Needed for back to back usage...
    useEffect(() => {
        setText(renderWords());
        return () => {
            resetTextAnimations();
        };
    }, [children]);

    useEffect(() => {
        syncTextAnimations();
    }, [text]);

    return <div className={`wbw-container ${className}`}>{text}</div>;
}

export default WordByWord;
