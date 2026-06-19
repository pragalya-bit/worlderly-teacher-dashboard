import { useState } from 'react'

// Photo fallback (stock adult headshots) when no local kid photo is provided.
export function avatarUrl(seed) {
  return `https://i.pravatar.cc/160?u=${encodeURIComponent(seed)}`
}

// Renders a profile picture. Resolution order:
//   1. `photo` (a local kid photo at /kids/<id>.jpg, if you've added one)
//   2. `src`   (pravatar stock photo fallback)
//   3. colored initial
export function Avatar({ photo, src, initial, color = 'bg-orange-500', className = '' }) {
  const chain = [photo, src].filter(Boolean)
  const [i, setI] = useState(0)
  const cur = chain[i]
  return (
    <span
      className={`${color} inline-flex items-center justify-center overflow-hidden text-white font-extrabold shrink-0 ${className}`}
    >
      {cur ? (
        <img src={cur} alt={initial} onError={() => setI((v) => v + 1)} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </span>
  )
}
