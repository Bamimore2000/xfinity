import React from "react";

const footerLinks = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16,2H8A3,3,0,0,0,5,5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V5A3,3,0,0,0,16,2Zm1.5,17A1.5,1.5,0,0,1,16,20.5H8A1.5,1.5,0,0,1,6.5,19V5A1.5,1.5,0,0,1,8,3.5h8A1.5,1.5,0,0,1,17.5,5Z"></path>
      </svg>
    ),
    name: "Web Terms Of Service",
    link: "https://www.xfinity.com/terms",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"></path>
      </svg>
    ),
    name: "CA Notice at Collection",
    link: "https://www.xfinity.com/privacy/policy/staterights#california",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Zm-1-5h2v-2h-2Zm1-12a4 4 0 0 0-4 4h2a2 2 0 0 1 4 0c0 1.5-2 1.75-2 4h2c0-1.5 2-1.75 2-4a4 4 0 0 0-4-4Z"></path>
      </svg>
    ),
    name: "Privacy Policy",
    link: "http://www.xfinity.com/privacy/policy",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM8 7h8v2H8Zm0 4h8v2H8Zm0 4h5v2H8Z"></path>
      </svg>
    ),
    name: "Your Privacy Choices",
    link: "https://www.xfinity.com/privacy/manage-preference",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 3a9 9 0 0 0-9 9c0 5.25 4.5 9 9 9s9-3.75 9-9a9 9 0 0 0-9-9Zm1 14h-2v-2h2Zm0-4h-2V7h2Z"></path>
      </svg>
    ),
    name: "Health Privacy Notice",
    link: "https://www.xfinity.com/privacy/policy/staterights#washington",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 17.5l-4.5-4.5H10V8h4v5h2.5L12 17.5Z"></path>
      </svg>
    ),
    name: "Ad Choices",
    link: "https://www.xfinity.com/adinformation",
  },
];

export default function XfinityFooter() {
  return (
    <footer className="w-full bg-white mb-4">
      <ul className="flex flex-wrap justify-center items-center gap-y-3 gap-x-6 max-w-[800px] mx-auto px-4">
        {/* Logo */}

        {/* Copyright */}
        <li className="text-gray-400 text-sm w-full text-center 2xl:w-auto">
          © {new Date().getFullYear()} Comcast
        </li>

        {/* Dynamic Links */}
        {footerLinks.map(({ icon, name, link }) => (
          <li
            key={name}
            className="text-sm flex items-center gap-2  transition"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <span className="h-5 w-5">{icon}</span>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
