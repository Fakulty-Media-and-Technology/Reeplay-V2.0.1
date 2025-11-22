import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={10}
    height={9}
    viewBox="0 0 10 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={1.93652}
      y={6.89746}
      width={8.68798}
      height={2.715}
      rx={1.3575}
      transform="rotate(-45 1.93652 6.89746)"
      fill="#FF1313"
    />
    <Rect
      x={1.91977}
      y={3.04785}
      width={5.42999}
      height={2.71499}
      rx={1.3575}
      transform="rotate(45 1.91977 3.04785)"
      fill="#FF1313"
    />
  </Svg>
);
export default SVGComponent;
