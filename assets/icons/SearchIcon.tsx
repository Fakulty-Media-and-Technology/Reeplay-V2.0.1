import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.82935 11.4771C8.94845 11.4771 11.477 8.94851 11.477 5.82941C11.477 2.7103 8.94845 0.181763 5.82935 0.181763C2.71024 0.181763 0.181702 2.7103 0.181702 5.82941C0.181702 8.94851 2.71024 11.4771 5.82935 11.4771ZM5.90317 9.06024C7.73249 9.06024 9.21545 7.57728 9.21545 5.74796C9.21545 3.91863 7.73249 2.43567 5.90317 2.43567C4.07384 2.43567 2.59088 3.91863 2.59088 5.74796C2.59088 7.57728 4.07384 9.06024 5.90317 9.06024Z"
      fill="white"
    />
    <Rect
      x={11.8419}
      y={13.8184}
      width={6.53427}
      height={2.79474}
      rx={1.39737}
      transform="rotate(-135 11.8419 13.8184)"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
