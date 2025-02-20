"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Webcam from "react-webcam"

const WebcamCircles: React.FC = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const prevImageDataRef = useRef<ImageData | null>(null)
  const movementMapRef = useRef<boolean[]>([])

  useEffect(() => {
    let animationFrameId: number

    const processFrame = () => {
      const webcam = webcamRef.current
      const canvas = canvasRef.current

      if (webcam && canvas) {
        const video = webcam.video
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          const { videoWidth, videoHeight } = video
          canvas.width = videoWidth
          canvas.height = videoHeight

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
            const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight)
            processImageData(imageData, ctx)
          }
        }
      }

      animationFrameId = requestAnimationFrame(processFrame)
    }

    if (isVideoReady) {
      processFrame()
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isVideoReady])

  const processImageData = (imageData: ImageData, ctx: CanvasRenderingContext2D) => {
    const { width, height, data } = imageData
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    const baseCircleSize = 10
    const spacing = 12
    const movementThreshold = 30
    const newMovementMap: boolean[] = []

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3

        let isMoving = false
        if (prevImageDataRef.current) {
          const prevBrightness =
            (prevImageDataRef.current.data[i] +
              prevImageDataRef.current.data[i + 1] +
              prevImageDataRef.current.data[i + 2]) /
            3
          isMoving = Math.abs(brightness - prevBrightness) > movementThreshold
        }
        newMovementMap.push(isMoving)

        const index = (y / spacing) * Math.ceil(width / spacing) + x / spacing
        const currentlyMoving = movementMapRef.current[index] || isMoving

        // Increase circle size when moving
        const circleSize = currentlyMoving ? baseCircleSize * 1.5 : baseCircleSize
        const radius = (brightness / 255) * (circleSize / 2)

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        if (currentlyMoving) {
          const hue = (Date.now() / 20 + x + y) % 360
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
        } else {
          ctx.fillStyle = "white"
        }
        ctx.fill()
      }
    }

    prevImageDataRef.current = imageData
    movementMapRef.current = newMovementMap
  }

  const handleVideoReady = () => {
    setIsVideoReady(true)
  }

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[70vw] aspect-video mx-auto">
      <Webcam
        ref={webcamRef}
        audio={false}
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedMetadata={handleVideoReady}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  )
}

export default WebcamCircles

