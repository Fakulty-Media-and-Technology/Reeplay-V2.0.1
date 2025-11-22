import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const RightArrow = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={13}
    viewBox="0 0 9 13"
    fill="none"
    {...props}>
    <Rect
      x={6.27222}
      y={8.65796}
      width={8.4739}
      height={2.64809}
      rx={1.32405}
      transform="rotate(-137 6.27222 8.65796)"
      fill="white"
    />
    <Rect
      x={0.353394}
      y={11.1287}
      width={8.47311}
      height={2.64809}
      rx={1.32405}
      transform="rotate(-47 0.353394 11.1287)"
      fill="white"
    />
  </Svg>
);
export default RightArrow;
