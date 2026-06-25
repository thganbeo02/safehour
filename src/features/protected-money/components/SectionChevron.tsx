import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme/colors";

type SectionChevronProps = {
  isOpen: boolean;
};

export function SectionChevron({ isOpen }: SectionChevronProps) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.navy}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d={isOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
    </Svg>
  );
}
