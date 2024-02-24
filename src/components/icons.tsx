import {
    LucideProps,
    Moon,
    SunMedium,
    Twitter,
    type Icon as LucideIcon,
  } from "lucide-react"
  
  export type Icon = LucideIcon
  
  export const Icons = {
    sun: SunMedium,
    moon: Moon,
    twitter: Twitter,
    logo: (props: LucideProps) => (
      <svg id="emoji" viewBox="0 0 24 24" {...props} version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="color" fill="currentColor">
          <polygon fill="#D0CFCE" points="46.9583,12.625 50.1145,17.8102 50.1145,54.7777 41.9167,54.7777 42.205,20.7592"/>
          <polygon fill="#D0CFCE" points="25.1804,12.875 21.755,17.6799 21.755,54.6474 30.0625,54.2813 29.633,21.0195"/>
          <path fill="#F4AA41" d="M28.3148,57.4378c0,0,1.2601-31.8982,1.0101-39.8965c-0.24-7.6278,6.64-11.4654,6.64-11.4654 s6.88,3.8376,6.64,11.4654c-0.25,7.9983,1.01,39.8965,1.01,39.8965H28.3148z"/>
          <path fill="#FFFFFF" d="M39.5098,59.8696l16.0986-1.2525c0.1851-3.1745-3.2684-6.958-3.2684-6.958 c-8.25-5.9369-9.5834-9.42-9.5834-9.42L39.34,33.0566"/>
          <path fill="#FFFFFF" d="M32.4299,59.841l-16.0383-1.2239c-0.1851-3.1745,3.2684-6.958,3.2684-6.958 c8.25-5.9369,9.5834-9.42,9.5834-9.42l3.4166-9.1825"/>
          <path fill="#FFFFFF" d="M40.0299,65.778c-0.0101,0.0665-0.0101,0.1045-0.0101,0.1045h-8.1099c0,0,0-0.038-0.0101-0.114 c-0.0499-0.6744-0.2699-4.1796,0.5301-5.9275c-0.02-6.7253-0.06-29.0008,0.51-34.0069c0.66-5.918,3.0199-6.7919,3.0199-6.7919 s2.37,0.8739,3.0401,6.7919c0.56,5.0156,0.53,27.3386,0.5099,34.0355C40.2899,61.6269,40.0699,65.1226,40.0299,65.778z"/>
        </g>
        <g id="hair"/>
        <g id="skin"/>
        <g id="skin-shadow"/>
        <g id="line">
          <polyline fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" points="45.43,17.2598 47.7,13.1398 50.11,17.8098 50.11,49.9798"/>
          <polyline fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" points="21.75,50.0898 21.75,17.6798 24.17,13.0098 26.44,17.1298"/>
          <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" d="M43.09,42.8598c-0.31-9.52-0.63-20.96-0.49-25.32c0.24-7.63-6.64-11.46-6.64-11.46s-6.88,3.83-6.64,11.46 c0.14,4.38-0.18,15.9-0.49,25.45c0.31-0.49,0.41-0.75,0.41-0.75l3.36-9.01v-0.01c0.07-3.32,0.18-6.01,0.34-7.39 c0.66-5.91,3.02-6.79,3.02-6.79s2.37,0.88,3.04,6.79c0.15,1.36,0.26,3.99,0.34,7.23c0.18,7.54,0.19,18.41,0.17,24.38"/>
          <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" d="M40.1733,59.8126l15.4351-1.1955c0.1851-3.1745-3.2684-6.958-3.2684-6.958c-8.25-5.9369-9.5834-9.42-9.5834-9.42L39.34,33.0566"/>
          <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" d="M32.43,57.4398c-0.02-5.92-0.01-16.68,0.17-24.21l-3.36,9.01c0,0-0.1,0.26-0.41,0.75v0.01"/>
          <polyline fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" points="32.66,33.0598 32.6,33.2198 32.6,33.2298"/>
          <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" d="M28.83,42.9998c-0.73,1.16-2.61,3.61-7.08,7.09c-0.64,0.5-1.34,1.03-2.09,1.57c0,0-3.45,3.78-3.27,6.96l15.44,1.19"/>
          <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.9493" d="M40.03,65.7798c-0.01,0.06-0.01,0.1-0.01,0.1h-8.11c0,0,0-0.04-0.0099-0.11c-0.05-0.68-0.27-4.18,0.53-5.93v-2.4 c-0.02-5.92-0.01-16.68,0.17-24.21v-0.0099c0.07-3.32,0.1801-6.01,0.34-7.39c0.66-5.91,3.02-6.79,3.02-6.79s2.37,0.88,3.04,6.79 c0.15,1.36,0.26,3.99,0.34,7.23c0.18,7.54,0.19,18.41,0.17,24.38v2.43C40.29,61.6298,40.07,65.1198,40.03,65.7798z"/>
        </g>
    </svg>
    
    ),
    gitHub: (props: LucideProps) => (
      <svg viewBox="0 0 438.549 438.549" {...props}>
        <path
          fill="currentColor"
          d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
        ></path>
      </svg>
    ),
  }
  