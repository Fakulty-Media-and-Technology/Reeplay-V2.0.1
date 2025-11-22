import {ImageSourcePropType} from 'react-native';

export interface HeroSliderDataProps {
  _id: number;
  image: any;
  type: string;
  title: string;
  tags: string[];
  colors: string[];
  colors2: string[];
}

export interface LiveSliderDataProps {
  image: any;
  type: string;
  title: string;
  subscription: string;
  colors2: string[];
}

export interface HomeSlideProps {
  image?: ImageSourcePropType;
  videoURL?: string;
  type?: string;
  title: string;
  tags?: string[];
  colors?: string[];
  colors2?: string[];
}
export interface LiveSlideProps {
  image: ImageSourcePropType;
  videoURL: string;
  type: string;
  title: string;
  subscription: string;
  colors2?: string[];
}
