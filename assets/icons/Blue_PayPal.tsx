import * as React from 'react';
import Svg, {Rect, Defs, Pattern, Use, Image} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <Rect width={36} height={36} rx={18} fill="url(#pattern0)" />
    <Defs>
      <Pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}>
        <Use xlinkHref="#image0_3517_903" transform="scale(0.00925926)" />
      </Pattern>
      <Image
        id="image0_3517_903"
        width={108}
        height={108}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default SVGComponent;
