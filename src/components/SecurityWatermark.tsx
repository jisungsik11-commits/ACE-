import { MouseEvent, useEffect } from 'react';

interface SecurityWatermarkProps {
  userName: string;
  userPhone: string;
}

export default function SecurityWatermark({ userName, userPhone }: SecurityWatermarkProps) {
  // Prevent common copy/save gestures
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: MouseEvent) => {
    e.preventDefault();
  };

  // Double-secure watermark label
  const watermarkText = `${userName || '미인증'} ${userPhone || '010-0000-0000'} | 유출 시 5,000만 원 청구 및 형사고소`;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-30 overflow-hidden"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      id="security-watermark-overlay"
    >
      {/* Absolute Diagonal Text Array */}
      <div className="absolute inset-[-50%] flex flex-wrap content-around justify-around opacity-[0.14] rotate-[-28deg] select-none pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="text-[11px] font-sans font-extrabold text-amber-500 whitespace-nowrap tracking-wide select-none pointer-events-none mx-6 my-8 px-4 py-1 border border-dashed border-amber-500/25 rounded"
          >
            {watermarkText}
          </div>
        ))}
      </div>

      {/* Screen Capture Block Message Banner (Top edge) */}
      <div className="absolute top-1.5 left-1.5 right-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-amber-400 border border-amber-500/30 flex justify-between items-center z-40 select-none pointer-events-none">
        <span>🔒 DYNAMIC WATERMARK ENCRYPTED</span>
        <span>CAPTURE TRACE ACTIVE</span>
      </div>
    </div>
  );
}
