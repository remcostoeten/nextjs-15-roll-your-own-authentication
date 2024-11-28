export function GradientBackground() {
    return (
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 788 1000">
        <defs>
          {/* Green */}
          <linearGradient id="bg0" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="788" y2="1000">
            <stop offset="0" stopColor="#10412F"/>
            <stop offset="1" stopColor="#000000"/>
          </linearGradient>
          {/* Blue */}
          <linearGradient id="bg1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="788" y2="1000">
            <stop offset="0" stopColor="#1a4b6e"/>
            <stop offset="1" stopColor="#051b2c"/>
          </linearGradient>
          {/* Purple */}
          <linearGradient id="bg2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="788" y2="1000">
            <stop offset="0" stopColor="#4a1b70"/>
            <stop offset="1" stopColor="#1a0829"/>
          </linearGradient>
          {/* Orange */}
          <linearGradient id="bg3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="788" y2="1000">
            <stop offset="0" stopColor="#782c1f"/>
            <stop offset="1" stopColor="#2c0f0a"/>
          </linearGradient>
          {/* Teal */}
          <linearGradient id="bg4" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="788" y2="1000">
            <stop offset="0" stopColor="#1b4b2c"/>
            <stop offset="1" stopColor="#0a1f0f"/>
          </linearGradient>
        </defs>
        <g>
          <rect width="788" height="1000" rx="32" fill={`url(#var(--gradient-id))`}/>
          <path filter="url(#blur1)" d="M608.777 923.631c-222.885 148.739-718.459-192.901-891.505 0-230.813 257.299 702.845 388.939 1026.484 225.099C1111.62 962.487 1253.6-.964 915.024 223.776c-236.818 157.195-69.89 542.131-306.247 699.855" fill="var(--blur1-color)"/>
          <path filter="url(#blur2)" d="M492.648 797.844c-182.021 85.287-511.451-223.518-661.44-99.903-200.058 164.88 477.915 367.099 736.381 281.903C861.377 883 1074.59 184.656 798.228 313.326c-193.305 89.998-112.558 394.076-305.58 484.518" fill="var(--blur2-color)"/>
        </g>
        <filter id="blur1" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="107"/>
        </filter>
        <filter id="blur2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="150"/>
        </filter>
      </svg>
    )
  }