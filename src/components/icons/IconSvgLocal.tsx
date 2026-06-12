import { colors } from "@/theme/colors";

import { IconSvgs, type IconSvgName } from "./index";

type IconSvgLocalProps = {
  name: IconSvgName;
  size?: number;
  color?: string;
};

export function IconSvgLocal({
  name,
  size = 40,
  color = colors.teal,
}: IconSvgLocalProps) {
  const Icon = IconSvgs[name] ?? IconSvgs.IC_CIRCLE_USER_ROUND;

  return <Icon width={size} height={size} color={color} />;
}
