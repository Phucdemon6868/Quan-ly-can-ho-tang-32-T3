import React from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 115" aria-labelledby="logo-title" role="img" {...props}>
    <title id="logo-title">Logo 32T3 Unity and Love</title>
    <g>
      {/* Dark blue left part */}
      <path d="M 15,65 L 15,35 L 40,35 L 40,55 Z" fill="#1e3a8a" />
      {/* Light blue right part */}
      <path d="M 45,20 L 85,35 L 85,65 L 55,65 Z" fill="#60a5fa" />
       {/* Medium blue folded part */}
      <path d="M 40,35 L 45,20 L 55,42 L 40,55 Z" fill="#3b82f6" />
    </g>
    <text x="50" y="90" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">
      32T3
    </text>
    <text x="50" y="105" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" fontSize="8" letterSpacing="1" textAnchor="middle" fill="#4b5563" fontWeight="600">
      UNITY AND LOVE
    </text>
  </svg>
);

export default LogoIcon;
