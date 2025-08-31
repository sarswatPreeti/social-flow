import * as React from "react";

interface VoteIconProps {
  type: "up" | "down";
  active?: boolean;
  size?: number;
}

export const VoteIcon: React.FC<VoteIconProps> = ({
  type,
  active = false,
  size = 32,
}) => {
  const fill = active ? "#2563eb" : "#fff";
  const stroke = active ? "#fff" : "#222";
  const circleFill = active ? "#2563eb" : "#fff";
  const circleStroke = active ? "#2563eb" : "#e5e7eb";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill={circleFill}
        stroke={circleStroke}
        strokeWidth="2"
      />
      {type === "up" ? (
        // Upvote arrow (Reddit style)
        <g>
          <polygon
            points="20,13 27,23 13,23"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="17"
            y="23"
            width="6"
            height="4"
            rx="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      ) : (
        // Downvote arrow (Reddit style)
        <g>
          <polygon
            points="20,27 27,17 13,17"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="17"
            y="13"
            width="6"
            height="4"
            rx="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
};
