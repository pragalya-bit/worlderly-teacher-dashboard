import { useState } from 'react'

// Generative (AI-style) avatar URL — consistent per seed, kid-friendly.
export function avatarUrl(seed) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4,c8f7d4`
}

// Renders a profile picture; falls back to a colored initial if the image fails.
export function Avatar({ src, initial, color = 'bg-orange-500', className = '' }) {
  const [err, setErr] = useState(false)
  return (
    <span
      className={`${color} inline-flex items-center justify-center overflow-hidden text-white font-extrabold shrink-0 ${className}`}
    >
      {src && !err ? (
        <img src={src} alt={initial} onError={() => setErr(true)} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </span>
  )
}
