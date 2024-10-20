import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
const ChartIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_302_2314)">
      <Path
        d="M8 12H4C3.44772 12 3 12.4477 3 13V19C3 19.5523 3.44772 20 4 20H8C8.55228 20 9 19.5523 9 19V13C9 12.4477 8.55228 12 8 12Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 8H16C15.4477 8 15 8.44772 15 9V19C15 19.5523 15.4477 20 16 20H20C20.5523 20 21 19.5523 21 19V9C21 8.44772 20.5523 8 20 8Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 4H10C9.44772 4 9 4.44772 9 5V19C9 19.5523 9.44772 20 10 20H14C14.5523 20 15 19.5523 15 19V5C15 4.44772 14.5523 4 14 4Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 20H18"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_302_2314">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ChartIcon;
