import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.45486 14.9097C11.5721 14.9097 14.9097 11.5721 14.9097 7.45486C14.9097 3.33765 11.5721 0 7.45486 0C3.33765 0 0 3.33765 0 7.45486C0 11.5721 3.33765 14.9097 7.45486 14.9097ZM7.55198 11.7191C9.96668 11.7191 11.9242 9.76163 11.9242 7.34693C11.9242 4.93223 9.96668 2.97473 7.55198 2.97473C5.13728 2.97473 3.17978 4.93223 3.17978 7.34693C3.17978 9.76163 5.13728 11.7191 7.55198 11.7191Z"
      fill="#C4C4C4"
    />
    <Rect
      x={15.3914}
      y={18}
      width={8.62519}
      height={3.68904}
      rx={1.84452}
      transform="rotate(-135 15.3914 18)"
      fill="#C4C4C4"
    />
  </Svg>
);
export default SVGComponent;
