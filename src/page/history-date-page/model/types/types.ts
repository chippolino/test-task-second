export type ButtonPosition = {
  angle: number;
  label: string;
  text: string;
};

export type SlideItem = {
  date: number;
  text: string;
};

export type SlideGroup = {
  dateRange?: {
    start: number;
    end: number;
  };
  category: string;
  slides: SlideItem[];
};
