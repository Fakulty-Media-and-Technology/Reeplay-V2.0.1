import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={22}
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.75 21.875C9.95312 21.875 10.9375 20.8654 10.9375 19.6314H6.5625C6.5625 20.8654 7.53594 21.875 8.75 21.875ZM15.3125 15.1442V9.53526C15.3125 6.09135 13.5188 3.20833 10.3906 2.44551V1.68269C10.3906 0.751603 9.65781 0 8.75 0C7.84219 0 7.10938 0.751603 7.10938 1.68269V2.44551C3.97031 3.20833 2.1875 6.08013 2.1875 9.53526V15.1442L0 17.3878V18.5096H17.5V17.3878L15.3125 15.1442Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
