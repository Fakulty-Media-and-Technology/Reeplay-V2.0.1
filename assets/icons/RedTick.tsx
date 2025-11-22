import * as React from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';
const RedTick = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={59}
    height={59}
    viewBox="0 0 59 59"
    fill="none"
    {...props}>
    <Circle cx={29.2712} cy={29.2712} r={28.7411} fill="#FF1313" />
    <Rect
      x={19.1719}
      y={35.6876}
      width={30.7333}
      height={9.60415}
      rx={4.80207}
      transform="rotate(-45 19.1719 35.6876)"
      fill="white"
    />
    <Rect
      x={19.1123}
      y={22.0712}
      width={19.2083}
      height={9.60415}
      rx={4.80207}
      transform="rotate(45 19.1123 22.0712)"
      fill="white"
    />
  </Svg>
);
export default RedTick;
