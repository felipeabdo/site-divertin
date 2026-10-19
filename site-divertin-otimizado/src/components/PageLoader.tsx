// 'use client';

// import { useEffect, useState } from 'react';
// import { preload } from 'react-dom';

// interface PageLoaderProps 
//       <noscript>
//         <style>{`#page-loader{display:none!important}`}</style>
//       </noscript>

//       <div
//         id="page-loader"
//         role="status"
//         aria-live="polite"
//         aria-busy={!fading}
//         className="fixed inset-0 z-[9999] flex items-center justify-center"
//         style={{
//           backgroundColor,
//           opacity: fading ? 0 : 1,
//           transition: `opacity ${fadeDuration}ms ease`,
//           pointerEvents: fading ? 'none' : 'auto',
//         }}
//       >
        
        
//         <img
//           src={src}
//           alt={alt}
//           draggable={false}
//           decoding="async"
//           fetchPriority="high"
//           style={{
//             width: typeof width === 'number' ? `${width}px` : width,
//             height: height === undefined ? 'auto' : typeof height === 'number' ? `${height}px` : height,
//             maxWidth,
//             objectFit: 'contain',
//             userSelect: 'none',
//           }}
//         />
//       </div>
//     </>
//   );
// }


import React from 'react';

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Carregando...</p>
    </div>
  );
}
