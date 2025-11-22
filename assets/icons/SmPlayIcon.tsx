import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={20}
    viewBox="0 0 13 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M12.3899 6.62204C13.0849 7.00102 13.0849 7.99898 12.3899 8.37796L1.97873 14.0549C1.31236 14.4183 0.499999 13.9359 0.499999 13.1769L0.5 1.82306C0.5 1.06406 1.31236 0.581743 1.97873 0.945099L12.3899 6.62204Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
