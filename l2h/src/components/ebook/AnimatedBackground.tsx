export default function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

      {/* Animated Circles */}
      <div className="circles-container absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => {
          const size = 20 + Math.random() * 130;
          const left = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = 15 + Math.random() * 30;
          
          return (
            <div
              key={i}
              className="circle absolute block rounded-full animate-float"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                bottom: '-150px',
                background: 'rgba(102, 126, 234, 0.15)',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Add custom animation */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
        
        .animate-float {
          animation: float 25s linear infinite;
        }
      `}</style>
    </div>
  );
}


