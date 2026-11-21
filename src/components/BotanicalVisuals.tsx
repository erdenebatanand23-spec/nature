export function BrandLogoMark({ className = 'w-7 h-7' }: { className?: string }) {
  return <CircularPlantCircuitLogo className={className} />;
}

export function BotanicalCornerAccent({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 220C85 170 155 115 270 30"
        stroke="#1F7A4C"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M125 145C112 105 135 68 182 56C188 98 164 132 125 145Z"
        stroke="#1F7A4C"
        strokeWidth="1.1"
        fill="#1F7A4C"
        fillOpacity="0.06"
      />
      <path
        d="M178 104C214 96 248 112 262 146C226 152 194 134 178 104Z"
        stroke="#0E6BA8"
        strokeWidth="1.1"
        fill="#0E6BA8"
        fillOpacity="0.05"
      />
      <path
        d="M78 180C66 150 82 122 116 112C122 144 104 170 78 180Z"
        stroke="#1F7A4C"
        strokeWidth="1"
        fill="#1F7A4C"
        fillOpacity="0.04"
      />
      <circle cx="270" cy="30" r="3" fill="#0E6BA8" fillOpacity="0.45" />
    </svg>
  );
}

export function CircularPlantCircuitLogo({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#FFFFFF" stroke="#215b63" strokeOpacity="0.28" strokeWidth="1.5" />
      <circle
        cx="32"
        cy="32"
        r="25.5"
        fill="#F8FAF9"
        stroke="#67c090"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeDasharray="3.5 3.5"
      />
      {/* Botanical Leaf */}
      <path
        d="M20.5 42.5C20.5 29.5 29.5 20 44 20C44 33.5 34.5 42.5 20.5 42.5Z"
        fill="#67c090"
        fillOpacity="0.26"
        stroke="#215b63"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* Central Vein Merging Into Circuit Trace */}
      <path
        d="M20.5 42.5C27.5 35.5 33.5 29.5 41.5 22.5"
        stroke="#215b63"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Geometric Circuit Branches */}
      <path
        d="M29.5 33.5H38.5L43 38H48.5"
        stroke="#67c090"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5 37.5V45.5H34"
        stroke="#215b63"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.5 28.5V21H26.5"
        stroke="#67c090"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circuit Junction Nodes */}
      <circle cx="48.5" cy="38" r="2.3" fill="#67c090" stroke="#215b63" strokeWidth="1.1" />
      <circle cx="34" cy="45.5" r="2.3" fill="#215b63" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="26.5" cy="21" r="2.1" fill="#67c090" stroke="#215b63" strokeWidth="1" />
    </svg>
  );
}

export function HeroEcoCircuitBackdrop({ animateIn = true }: { animateIn?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none transition-opacity duration-500 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Crisp Mint & Teal Soft Atmospheric Glows */}
      <div
        className="absolute -top-28 -left-24 w-[430px] h-[430px] rounded-full opacity-75"
        style={{
          background: 'radial-gradient(circle, rgba(103,192,144,0.18) 0%, rgba(248,250,249,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-28 -right-24 w-[460px] h-[460px] rounded-full opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(33,91,99,0.12) 0%, rgba(103,192,144,0.14) 45%, rgba(255,255,255,0) 75%)',
        }}
      />

      {/* Faint Glowing Geometric Circuit Lines (#215b63 & #67c090) */}
      <svg
        viewBox="0 0 1360 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id="ecoCircuitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Perimeter Circuit Network */}
        <g filter="url(#ecoCircuitGlow)" opacity="0.62">
          <path
            d="M-20 190 H95 L140 235 H225 L260 200 H295"
            stroke="#215b63"
            strokeOpacity="0.34"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw' : ''}
          />
          <path
            d="M20 330 H115 L155 290 H225"
            stroke="#67c090"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw-delayed' : ''}
          />
          <path
            d="M-10 530 H95 L145 480 H215 L255 520 H290"
            stroke="#67c090"
            strokeOpacity="0.48"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw' : ''}
          />
          <path
            d="M140 235 V375 L180 415 H245"
            stroke="#215b63"
            strokeOpacity="0.28"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw-delayed' : ''}
          />

          <circle
            cx="295"
            cy="200"
            r="4.5"
            fill="#FFFFFF"
            stroke="#215b63"
            strokeWidth="1.75"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="225"
            cy="290"
            r="3.8"
            fill="#67c090"
            fillOpacity="0.85"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="245"
            cy="415"
            r="4"
            fill="#FFFFFF"
            stroke="#67c090"
            strokeWidth="1.6"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="290"
            cy="520"
            r="4"
            fill="#215b63"
            fillOpacity="0.7"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
        </g>

        {/* Right Perimeter Circuit Network */}
        <g filter="url(#ecoCircuitGlow)" opacity="0.62">
          <path
            d="M1380 175 H1255 L1205 225 H1125 L1095 190 H1065"
            stroke="#215b63"
            strokeOpacity="0.34"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw' : ''}
          />
          <path
            d="M1340 340 H1235 L1190 385 H1125"
            stroke="#67c090"
            strokeOpacity="0.52"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw-delayed' : ''}
          />
          <path
            d="M1380 545 H1255 L1210 500 H1135 L1100 540 H1070"
            stroke="#67c090"
            strokeOpacity="0.48"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw' : ''}
          />
          <path
            d="M1205 225 V330 L1160 375 H1085"
            stroke="#215b63"
            strokeOpacity="0.28"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateIn ? 'animate-circuit-draw-delayed' : ''}
          />

          <circle
            cx="1065"
            cy="190"
            r="4.5"
            fill="#FFFFFF"
            stroke="#215b63"
            strokeWidth="1.75"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="1125"
            cy="385"
            r="3.8"
            fill="#67c090"
            fillOpacity="0.85"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="1085"
            cy="375"
            r="4"
            fill="#FFFFFF"
            stroke="#67c090"
            strokeWidth="1.6"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
          <circle
            cx="1070"
            cy="540"
            r="4"
            fill="#215b63"
            fillOpacity="0.7"
            className={animateIn ? 'animate-circuit-node' : ''}
          />
        </g>
      </svg>

      {/* Organic Floating Translucent Leaf Shapes (#67c090) */}
      <div
        className={`absolute top-6 -right-4 sm:top-12 sm:right-16 w-20 sm:w-36 h-20 sm:h-36 opacity-35 sm:opacity-85 ${
          animateIn ? 'animate-eco-leaf-float-a' : ''
        }`}
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path
            d="M24 96C24 52 54 22 100 22C100 66 70 96 24 96Z"
            fill="#67c090"
            fillOpacity="0.16"
            stroke="#67c090"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <path
            d="M24 96C48 72 72 48 96 26"
            stroke="#215b63"
            strokeOpacity="0.28"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className={`absolute bottom-14 -left-4 sm:bottom-20 sm:left-16 w-20 sm:w-32 h-20 sm:h-32 opacity-35 sm:opacity-75 ${
          animateIn ? 'animate-eco-leaf-float-b' : ''
        }`}
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path
            d="M94 94C94 54 66 26 24 26C24 66 52 94 94 94Z"
            fill="#67c090"
            fillOpacity="0.18"
            stroke="#67c090"
            strokeOpacity="0.42"
            strokeWidth="1.2"
          />
          <path
            d="M94 94C72 72 50 50 28 30"
            stroke="#215b63"
            strokeOpacity="0.25"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 left-8 w-20 h-20 opacity-65 ${
          animateIn ? 'animate-eco-leaf-float-b' : ''
        }`}
      >
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <path
            d="M14 66C14 36 35 16 66 16C66 46 45 66 14 66Z"
            fill="#67c090"
            fillOpacity="0.15"
            stroke="#67c090"
            strokeOpacity="0.38"
            strokeWidth="1.1"
          />
        </svg>
      </div>

      <div
        className={`hidden md:block absolute bottom-24 right-14 w-24 h-24 opacity-70 ${
          animateIn ? 'animate-eco-leaf-float-a' : ''
        }`}
      >
        <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
          <path
            d="M78 78C78 44 54 20 18 20C18 54 42 78 78 78Z"
            fill="#67c090"
            fillOpacity="0.15"
            stroke="#67c090"
            strokeOpacity="0.4"
            strokeWidth="1.1"
          />
        </svg>
      </div>
    </div>
  );
}

