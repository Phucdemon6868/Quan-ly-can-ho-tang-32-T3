import React from 'react';

const UsersGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.75 3.75 0 1 1 5.25 0m-5.25 0a3.75 3.75 0 0 0-5.25 0M3 13.5a9 9 0 0 1 18 0v2.25c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 15.75V13.5Z"
    />
  </svg>
);

export default UsersGroupIcon;
