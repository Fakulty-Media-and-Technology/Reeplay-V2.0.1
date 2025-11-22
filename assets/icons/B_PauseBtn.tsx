import * as React from 'react';
import Svg, {G, Rect, Defs, Pattern, Use, Image} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props: any) => (
  <Svg
    width={88}
    height={78}
    viewBox="0 0 98 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <G filter="url(#filter0_d_3949_2)">
      <Rect x={4} width={90} height={80} fill="url(#pattern0)" />
    </G>
    <Defs>
      <Pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}>
        <Use
          xlinkHref="#image0_3949_2"
          transform="matrix(0.00987654 0 0 0.0111111 0.0555556 0)"
        />
      </Pattern>
      <Image
        id="image0_3949_2"
        width={90}
        height={90}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAABv0lEQVR4nO3cPUoDYRhF4Vupe9AlGt2lP5VxKRL7I4EpbIKYfMLl+N4+8ByYmXRvMpvNZrPZbDabzWaz2Ww2OzngBngEXoFPTu8TeAEegOv/4lky4A545/fbH39r96x8cs6J+h53bfUs2/Z6Xrqd1bNs2zfw0j1bPcsGHBaEHayeZWPRIvXEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Yg2jzBNrGGWeWMMo88QaRpkn1jDKPLGGUeaJNYwyT6xhlHliDaPME2sYZZ5YwyjzxBpGmSfWMMo8sYZR5ok1jDJPrGGUeWINo8wTaxhlnljDKPPEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Yg2jzBNrGGWeWMMo88QaRpkn1jDKPLGGUeaJNYwyT6xhlHliDaPME2sYZZ5YwyjzxBpGmSfWMMo8sYZR5ok1jDJPrGGUeWINo8wTaxhlnljDKPPEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Unb+7MPqifWgH2WeZduu1F66e6tn2Y4HU7fDqefuDbiyev7ijPD+zKhbu2fptidpd/y+/fCHdACejq/nXz45bZ7ZbDabzWaz2Ww2m81mswj2BY0LdofAZHslAAAAAElFTkSuQmCC"
      />
    </Defs>
  </Svg>
);
export default SVGComponent;
