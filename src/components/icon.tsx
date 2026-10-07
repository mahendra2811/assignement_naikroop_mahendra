import type { CSSProperties } from "react";

type IconName =
  | "spark"
  | "message"
  | "arrow"
  | "copy"
  | "check"
  | "smile"
  | "briefcase"
  | "flag"
  | "refresh"
  | "info";
const paths: Record<IconName, React.ReactNode> = {
  spark: (
    <>
      <path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z" />
      <path d="m20 2 .7 1.3L22 4l-1.3.7L20 6l-.7-1.3L18 4l1.3-.7L20 2Z" />
    </>
  ),
  message: (
    <>
      <path d="M4 4h16v12H9l-5 4V4Z" />
      <path d="M8 8h8M8 12h5" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14a4 4 0 0 0 8 0M8 9h.01M16 9h.01" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3M3 12c5 3 13 3 18 0M12 11v5" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7V3l-4 4m4 0a9 9 0 1 0 1 8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </>
  ),
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
