// lib/getSimpleIcon.ts
import { SimpleIcon } from "simple-icons";

export function getSimpleIcon(icon: SimpleIcon): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}`;
}