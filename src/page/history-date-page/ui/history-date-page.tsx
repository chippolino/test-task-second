import s from './history-date-page.module.scss';
import { useMemo, useRef, useState } from 'react';
import { animateNumber } from '../model/utils/animate-number.ts';
import cn from 'classnames';
import type { ButtonPosition } from '../model/types/types.ts';
import { EffectFade, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { slides, slides2 } from '../model/api/data.ts';
import { generateButtonPositions } from '../model/utils/generate-button-position.ts';
import { SlideNextButton } from './slider-next-button/slider-next-button.tsx';
import { InnerSwiper } from './inner-swiper/inner-swiper.tsx';

export const HistoryDatePage = () => {
  const selectedSlides = useMemo(() => {
    return Math.random() > 0.5 ? slides : slides2;
  }, []);

  const mainSwiperRef = useRef<SwiperType | null>(null);

  const [currentValue1, setCurrentValue1] = useState(selectedSlides[0]?.dateRange?.start || 0);
  const [currentValue2, setCurrentValue2] = useState(selectedSlides[0]?.dateRange?.end || 0);
  const numberRef1 = useRef<HTMLDivElement>(null);
  const numberRef2 = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [activeSlide, setActiveSlide] = useState<number | null>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const buttonPositions: ButtonPosition[] = generateButtonPositions(selectedSlides);

  const radius = 265;

  const handleButtonClick = (clickedIndex: number) => {
    setIsAnimating(true);
    setActiveSlide(null);

    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(clickedIndex);
    }

    const clickedButton = buttonPositions[clickedIndex];
    const firstButtonAngle = buttonPositions[0].angle;
    const targetRotation = firstButtonAngle - clickedButton.angle;

    const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
    const normalizedTarget = ((targetRotation % 360) + 360) % 360;

    let rotationDiff = normalizedTarget - normalizedCurrent;

    if (rotationDiff < 0) {
      rotationDiff += 360;
    }

    if (rotationDiff > 180) {
      rotationDiff = rotationDiff - 360;
    }

    const newRotation = currentRotation + rotationDiff;

    if (containerRef.current) {
      containerRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    const slideData = selectedSlides[clickedIndex];
    if (slideData.dateRange) {
      animateToValues(slideData.dateRange.start, slideData.dateRange.end);
    }

    setTimeout(() => {
      setActiveSlide(clickedIndex);
      setIsAnimating(false);
    }, 800);

    setCurrentRotation(newRotation);
  };

  const animateToValues = (targetValue1: number, targetValue2: number) => {
    animateNumber(numberRef1, currentValue1, targetValue1, setCurrentValue1);
    animateNumber(numberRef2, currentValue2, targetValue2, setCurrentValue2);
  };

  return (
    <section className={s.root}>
      <div className={s.history}>
        <h1 className={s.title}>Исторические даты</h1>

        <div className={s.numbers}>
          <div className={s.numberWrap}>
            <div className={s.numberDisplay} ref={numberRef1}>
              {currentValue1}
            </div>
            <div className={cn(s.numberDisplay, s.numberDisplaySecond)} ref={numberRef2}>
              {currentValue2}
            </div>
          </div>

          <div className={s.circle}>
            <div ref={containerRef} className={s.buttonsContainer}>
              {buttonPositions.map((position, index) => {
                const angleRad = (position.angle - 90) * (Math.PI / 180);
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;
                const rotation = -currentRotation;

                return (
                  <button
                    key={index}
                    ref={el => {
                      buttonRefs.current[index] = el;
                    }}
                    className={cn(s.circularButton, 'circular-button', {
                      [s.activeButton]: index === activeSlide,
                    })}
                    style={{
                      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                    }}
                    onClick={() => handleButtonClick(index)}
                    data-text={position.text}
                  >
                    {position.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={s.swiper}>
          <Swiper
            className={s.realSwiper}
            onSwiper={swiper => {
              mainSwiperRef.current = swiper;
            }}
            onSlideChange={swiper => {
              const newIndex = swiper.activeIndex;
              if (newIndex !== activeSlide && !isAnimating) {
                handleButtonClick(newIndex);
              }
            }}
            allowTouchMove={false}
            spaceBetween={50}
            effect={'fade'}
            fadeEffect={{
              crossFade: true,
            }}
            speed={600}
            pagination={{
              el: `.customPagEl`,
              clickable: true,
              type: 'custom',
              renderCustom: (_, current, total) => `${current}/${total}`,
            }}
            modules={[Pagination, EffectFade]}
          >
            {selectedSlides.map((group, index) => (
              <SwiperSlide key={index}>
                <InnerSwiper group={group} index={index} activeSlide={activeSlide} isAnimating={isAnimating} />
              </SwiperSlide>
            ))}
            <span slot="container-start" className={s.start}>
              <span className={cn(s.customPag, 'customPagEl')}></span>
              <SlideNextButton />
            </span>
          </Swiper>
        </div>
      </div>
    </section>
  );
};
