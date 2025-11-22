import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      width={10.8}
      height={1.8}
      rx={0.899999}
      transform="matrix(-1 8.74228e-08 8.74228e-08 1 14.4004 0)"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 7.19971C0.895431 7.19971 0 8.09514 0 9.19971V15.9997C0 17.1043 0.89543 17.9997 2 17.9997H16C17.1046 17.9997 18 17.1043 18 15.9997V9.19971C18 8.09514 17.1046 7.19971 16 7.19971H2ZM11.0996 13.4658C11.7663 13.0809 11.7663 12.1186 11.0996 11.7337L8.69961 10.3481C8.03294 9.96319 7.19961 10.4443 7.19961 11.2141V13.9854C7.19961 14.7552 8.03294 15.2363 8.69961 14.8514L11.0996 13.4658Z"
      fill="white"
    />
    <Rect
      width={14.4}
      height={1.8}
      rx={0.899999}
      transform="matrix(-1 8.74228e-08 8.74228e-08 1 16.2002 3.6001)"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
