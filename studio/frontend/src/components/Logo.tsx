interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function Logo({ className = "", size = 24, color = "#0f172a" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      fill={color}
      aria-label="OpenPersona"
    >
      <path
        d="
          M 65 5
          C 65 45, 50 75, 5 100
          C 50 125, 65 155, 65 195
          C 65 155, 80 125, 100 100
          C 80 75, 65 45, 65 5
          Z
          M 135 5
          C 135 45, 120 75, 100 100
          C 120 125, 135 155, 135 195
          C 135 155, 150 125, 195 100
          C 150 75, 135 45, 135 5
          Z
        "
      />
    </svg>
  );
}
