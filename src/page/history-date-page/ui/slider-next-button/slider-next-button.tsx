import { useSwiper } from 'swiper/react';
import { useEffect, useState } from 'react';
import s from '../history-date-page.module.scss';
import cn from 'classnames';
import { ArrowIcon } from '../../../../shared/ui/arrow-icon.tsx';

export function SlideNextButton() {
  const swiper = useSwiper();

  const [isBeginning, setIsBeginning] = useState(swiper.isBeginning);
  const [isEnd, setIsEnd] = useState(swiper.isEnd);

  useEffect(() => {
    const update = () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    swiper.on('slideChange', update);
    swiper.on('reachBeginning', update);
    swiper.on('reachEnd', update);

    update();

    return () => {
      swiper.off('slideChange', update);
      swiper.off('reachBeginning', update);
      swiper.off('reachEnd', update);
    };
  }, [swiper]);

  return (
    <div className={s.buttonWrap}>
      <button
        className={cn(s.buttonSlide, s.buttonSlidePrev)}
        disabled={isBeginning}
        onClick={() => swiper.slidePrev()}
      >
        <ArrowIcon />
      </button>
      <button className={s.buttonSlide} onClick={() => swiper.slideNext()} disabled={isEnd}>
        <ArrowIcon />
      </button>
    </div>
  );
}
