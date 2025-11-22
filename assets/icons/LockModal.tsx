import * as React from 'react';
import Svg, {G, Rect, Defs, Pattern, Use, Image} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props: any) => (
  <Svg
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <G filter="url(#filter0_d_4508_338)">
      <Rect x={4} width={25} height={25} fill="url(#pattern0_4508_338)" />
    </G>
    <Defs>
      <Pattern
        id="pattern0_4508_338"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}>
        <Use xlinkHref="#image0_4508_338" transform="scale(0.0111111)" />
      </Pattern>
      <Image
        id="image0_4508_338"
        width={90}
        height={90}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default SVGComponent;
