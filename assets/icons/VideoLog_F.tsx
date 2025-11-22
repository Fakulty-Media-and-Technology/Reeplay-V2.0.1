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
      transform="matrix(-1 8.74228e-08 8.74228e-08 1 14.4 0)"
      fill="#FFCC00"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 7.2002C0.895431 7.2002 0 8.09563 0 9.2002V16.0002C0 17.1048 0.89543 18.0002 2 18.0002H16C17.1046 18.0002 18 17.1048 18 16.0002V9.2002C18 8.09563 17.1046 7.2002 16 7.2002H2ZM11.1 13.4662C11.7667 13.0813 11.7667 12.1191 11.1 11.7342L8.7 10.3485C8.03333 9.96363 7.2 10.4448 7.2 11.2146V13.9858C7.2 14.7556 8.03333 15.2368 8.7 14.8519L11.1 13.4662Z"
      fill="#FFCC00"
    />
    <Rect
      width={14.4}
      height={1.8}
      rx={0.899999}
      transform="matrix(-1 8.74228e-08 8.74228e-08 1 16.2 3.59961)"
      fill="#FFCC00"
    />
  </Svg>
);
export default SVGComponent;
