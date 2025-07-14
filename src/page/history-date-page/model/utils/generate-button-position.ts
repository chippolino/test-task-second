import type { ButtonPosition, SlideGroup } from '../types/types.ts';

export const generateButtonPositions = (slidesData: SlideGroup[]): ButtonPosition[] => {
  const positions: ButtonPosition[] = [];

  const angleStep = 360 / slidesData.length;

  const startAngle = 30;

  for (let i = 0; i < slidesData.length; i++) {
    const angle = startAngle + i * angleStep;
    positions.push({
      angle: angle,
      label: `${i + 1}`,
      text: slidesData[i].category || `Категория ${i + 1}`,
    });
  }

  return positions;
};
