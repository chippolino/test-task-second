import type { RefObject } from 'react';
import { gsap } from 'gsap';

export const animateNumber = (
  elementRef: RefObject<HTMLDivElement | null>,
  currentValue: number,
  targetValue: number,
  setCurrentValue: (val: number) => void,
) => {
  if (!elementRef.current) return;

  gsap.fromTo(
    elementRef.current,
    { innerText: currentValue },
    {
      innerText: targetValue,
      duration: 1.5,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.innerText = Math.round(Number(elementRef.current.innerText)).toString();
        }
      },
      onComplete: () => {
        setCurrentValue(targetValue);
      },
    },
  );
};
