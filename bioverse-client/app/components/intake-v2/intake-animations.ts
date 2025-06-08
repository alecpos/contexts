import styles from './styles/text-animations.module.css';

function animate(elems: NodeListOf<Element>) {
    return new Promise((resolve, reject) => {
        // Animation end handler
        function handleAnimationStart() {
            resolve(elems[elems.length - 1]);
        }
        elems[elems.length - 1]?.addEventListener(
            'animationstart',
            handleAnimationStart,
            {
                once: true,
            },
        );
        for (let e of elems) {
            e.classList.add(styles['text-animate']);
        }
    });
}

export const syncTextAnimations = async () => {
    let wbwText = document.querySelectorAll('.wbw-container');
    for (let elem of wbwText) {
        let words = elem.querySelectorAll(':scope > span');
        await animate(words);
        await new Promise((resolve) => {
            setTimeout(() => resolve(0), 100);
        });
    }
};

function reset(elems: NodeListOf<Element>) {
    for (let e of elems) {
        e.classList.remove(styles['text-animate']);
    }
}

export const resetTextAnimations = () => {
    let wbwText = document.querySelectorAll('.wbw-container');
    for (let elem of wbwText) {
        let words = elem.querySelectorAll(':scope > span');
        reset(words);
    }
}

export const continueButtonExitAnimation = async (delay: number) => {
    const e = document.querySelector('.continue-button');
    e?.classList.add('animate-buttonExit');
    await new Promise((resolve) => {
        setTimeout(() => resolve(0), delay);
    });
}