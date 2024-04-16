import Image from 'next/image'
import React from 'react'
type AvatarProps = {
  url?: string
  width: number
  height: number
  fallback: string
  radiusPercentage?: string
}
function Avatar({ url, width, height, fallback, radiusPercentage = '100%' }: AvatarProps) {
  if (!url)
    return (
      <div className="flex items-center justify-center rounded-full bg-gray-700" style={{ width: width, height: height }}>
        <p style={{ fontSize: width * 0.6 }} className="font-bold text-white">
          {fallback || 'U'}
        </p>
      </div>
    )
  return (
    <div style={{ width: width, height: height }} className="relative flex items-center justify-center">
      <Image src={url} alt="Avatar" fill={true} style={{ borderRadius: radiusPercentage }} />
    </div>
  )
}

export default Avatar
