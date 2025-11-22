import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M14.8574 23.2143H19.5003C21.0389 23.2143 22.286 21.9672 22.286 20.4285V17.6428"
      stroke="white"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M8.35672 13L3.71387 13L3.71387 17.6429C3.71387 18.6689 4.54494 19.5 5.57101 19.5H8.35672L8.35672 13Z"
      stroke="white"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M22.2854 13L17.6426 13V19.5H20.4283C21.4544 19.5 22.2854 18.6689 22.2854 17.6429V13Z"
      stroke="white"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M22.2853 12.9999V12.0714C22.2853 6.94286 18.1281 2.78564 12.9996 2.78564C7.87108 2.78564 3.71387 6.94286 3.71387 12.0714L3.71387 12.9999"
      stroke="white"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
