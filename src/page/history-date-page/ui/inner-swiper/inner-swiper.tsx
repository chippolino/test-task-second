import cn from 'classnames';
import s from '../history-date-page.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ArrowIcon } from '../../../../shared/ui/arrow-icon.tsx';
import { useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { slides } from '../../model/api/data.ts';
import type { SlideGroup } from '../../model/types/types.ts';

export const InnerSwiper = ({
  group,
  index,
  activeSlide,
  isAnimating,
}: {
  group: SlideGroup;
  index: number;
  activeSlide: number | null;
  isAnimating: boolean;
}) => {
  const [currentIndexes, setCurrentIndexes] = useState(slides.map(() => 0));
  const swiperRefs = useRef<SwiperType[]>([]);
  const [swiperStates, setSwiperStates] = useState(slides.map(() => ({ isBeginning: true, isEnd: false })));

  const updateSwiperState = (index: number) => {
    const swiper = swiperRefs.current[index];
    if (swiper) {
      setSwiperStates(prev => {
        const newState = [...prev];
        newState[index] = {
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
        };
        return newState;
      });

      setCurrentIndexes(prev => {
        const newIndexes = [...prev];
        newIndexes[index] = swiper.realIndex;
        return newIndexes;
      });
    }
  };

  return (
    <div
      className={cn(s.swiperInside, {
        [s.slideActive]: index === activeSlide && !isAnimating,
      })}
    >
      <Swiper
        slidesPerView={3}
        spaceBetween={80}
        onSwiper={swiper => {
          swiperRefs.current[index] = swiper;
          setTimeout(() => updateSwiperState(index), 0);
          swiper.on('slideChange', () => updateSwiperState(index));
        }}
        breakpoints={{
          320: {
            slidesPerView: 1.5,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 2,
          },

          1024: {
            slidesPerView: 3,
          },
          1440: {
            slidesPerView: 3,
          },
        }}
      >
        {group.slides.map((slide, i) => (
          <SwiperSlide key={i} className={s.slideInside}>
            <div className={s.slideInsideWrap}>
              <h3 className={s.slideInsideTitle}>{slide.date}</h3>
              <p className={s.slideInsideText}>{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={s.wrapInnerButton}>
        <button
          onClick={() => {
            swiperRefs.current[index]?.slidePrev();
          }}
          disabled={swiperStates[index]?.isBeginning}
          className={cn(s.arrowInside, s.arrowInsideLeft)}
        >
          <ArrowIcon />
        </button>
        <button
          onClick={() => {
            swiperRefs.current[index]?.slideNext();
          }}
          className={s.arrowInside}
          disabled={swiperStates[index]?.isEnd}
        >
          <ArrowIcon />
        </button>
      </div>

      <div className={s.customPaginationDots}>
        {group.slides.map((_, slideIdx) => (
          <button
            key={slideIdx}
            className={cn(s.paginationDot, {
              [s.paginationDotActive]: slideIdx === currentIndexes[index],
            })}
            onClick={() => swiperRefs.current[index]?.slideTo(slideIdx)}
          ></button>
        ))}
      </div>
    </div>
  );
};
