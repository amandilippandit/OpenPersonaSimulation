interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function Logo({ className = "", size = 24, color = "#f97316" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 200"
      width={(size * 3) / 2}
      height={size}
      className={className}
      fill={color}
      aria-label="OpenPersona"
    >
      <path
        d="
          M 60 5
          C 60 45, 45 75, 0 100
          C 45 125, 60 155, 60 195
          C 60 155, 75 125, 95 100
          C 75 75, 60 45, 60 5
          Z
          M 150 5
          C 150 45, 135 75, 90 100
          C 135 125, 150 155, 150 195
          C 150 155, 165 125, 185 100
          C 165 75, 150 45, 150 5
          Z
          M 240 5
          C 240 45, 225 75, 180 100
          C 225 125, 240 155, 240 195
          C 240 155, 255 125, 300 100
          C 255 75, 240 45, 240 5
          Z
        "
      />
    </svg>
  );
}
