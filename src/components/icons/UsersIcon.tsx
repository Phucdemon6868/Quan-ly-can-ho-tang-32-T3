import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 3.375c-3.418 0-6.167 2.053-6.167 4.593 0 1.284.663 2.45 1.696 3.216.51.385 1.054.68 1.636.902.58.22 1.196.333 1.835.333s1.255-.113 1.835-.333c.582-.222 1.126-.517 1.636-.902C16.504 10.418 17.167 9.25 17.167 7.968c0-2.54-2.75-4.593-6.167-4.593z" />
  </svg>
);

export default UsersIcon;
