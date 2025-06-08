import React, { useState, useEffect } from 'react';

interface AnimatedTypeProps {
    text: string;
    className: string;
    delay?: number; // Made optional to match your initial interface
    gap_y?: number;
    custom_class_start_index?: number;
    custom_class_end_index?: number;
    custom_class?: string;
}

export default function AnimatedBioType({
    text,
    className,
    gap_y,
    delay,
    custom_class_start_index,
    custom_class_end_index,
    custom_class,
}: AnimatedTypeProps) {
    const [isAnimationReady, setIsAnimationReady] = useState(false);

    useEffect(() => {
        // Assuming your animation setup goes here
        // For demonstration, using a timeout to simulate readiness
        setTimeout(() => {
            setIsAnimationReady(true);
        }, 100); // Adjust this timeout as needed for your actual setup
    }, []);

    return (
        <>
            <div
                className={`flex flex-row flex-wrap gap-y-${gap_y ?? '4'} ${
                    isAnimationReady ? '' : 'hidden'
                }`}
            >
                {text.split(' ').map((word, index) => (
                    <span
                        key={index}
                        className={`${
                            custom_class_start_index && custom_class_end_index
                                ? index >= custom_class_start_index &&
                                  index <= custom_class_end_index
                                    ? custom_class
                                    : className
                                : className
                        } word-animation animatedText`}
                        style={{
                            animationDelay: `${index * 0.1 + (delay ?? 0)}s`,
                            fontWeight: 200,
                        }}
                    >
                        <div>{word}</div>
                    </span>
                ))}
            </div>
            <style jsx>{`
                .word-animation {
                    margin-right: 0.5rem;
                    opacity: 0;
                    animation: fadeIn 1s forwards;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes gLXIfO {
                    from {
                        transform: translateY(20%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animatedText {
                    position: relative;
                    display: block;
                    transform: translateY(10%);
                    opacity: 0;
                    animation: 300ms cubic-bezier(0.33, 1, 0.68, 1) 0s 1 normal
                        forwards running gLXIfO;
                }
            `}</style>
        </>
    );
}
