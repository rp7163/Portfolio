// Centralized brand icons using react-icons (Simple Icons collection).
// Each icon uses the platform's official brand color so it looks instantly
// recognizable — LeetCode orange, CodeChef red, Codeforces blue, etc.

import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiCodingninjas,
  SiGithub,
  SiGmail,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

// Brand colors per platform
export const brandColors = {
  leetcode:    "#FFA116",
  codechef:    "#5B4638",
  codeforces:  "#1F8ACB",
  codingninjas:"#F38A00",
  naukri:      "#FF7555",
  github:      "#FFFFFF",
  linkedin:    "#0A66C2",
  gmail:       "#EA4335",
  email:       "#EA4335",
};

export function BrandIcon({ name, size = 20, className = "" }) {
  const iconMap = {
    leetcode:    SiLeetcode,
    codechef:    SiCodechef,
    codeforces:  SiCodeforces,
    codingninjas:SiCodingninjas,
    naukri:      SiCodingninjas,
    github:      SiGithub,
    linkedin:    FaLinkedin,
    gmail:       SiGmail,
    email:       SiGmail,
  };

  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export default BrandIcon;
