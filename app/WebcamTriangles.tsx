"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import Webcam from "react-webcam"
import ControlBar from "./ControlBar"

type Preset = "default" | "motionBlur" | "pixelate" | "kaleidoscope" | "waterRipple" | "asciiArt" | "neon" | "glitch" | "vintage" | "matrix"

const WebcamTriangles: React.FC = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [currentPreset, setCurrentPreset] = useState<Preset>("default")
  const [triangleSize, setTriangleSize] = useState(4)
  const [spacing, setSpacing] = useState(5)
  const prevImageDataRef = useRef<ImageData | null>(null)
  const movementMapRef = useRef<boolean[]>([])
  const prevPositionsRef = useRef<{ [key: string]: { x: number; y: number } }>({})

  const processImageData = useCallback(
    (imageData: ImageData, ctx: CanvasRenderingContext2D) => {
      const { width, height, data } = imageData
      
      // Clear canvas with black background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)

      switch (currentPreset) {
        case "default":
          drawDefault(ctx, width, height, data)
          break
        case "motionBlur":
          drawMotionBlur(ctx, width, height, data, 0.8)
          break
        case "pixelate":
          drawPixelate(ctx, width, height, data, spacing * 2)
          break
        case "kaleidoscope":
          drawKaleidoscope(ctx, width, height, data, 8)
          break
        case "waterRipple":
          drawWaterRipple(ctx, width, height, data, Date.now() / 1000)
          break
        case "asciiArt":
          drawAsciiArt(ctx, width, height, data, spacing)
          break
        case "neon":
          drawNeonEffect(ctx, width, height, data)
          break
        case "glitch":
          drawGlitchEffect(ctx, width, height, data)
          break
        case "vintage":
          drawVintageEffect(ctx, width, height, data)
          break
        case "matrix":
          drawMatrixEffect(ctx, width, height, data)
          break
      }

      prevImageDataRef.current = imageData
    },
    [currentPreset, spacing, triangleSize]
  )

  const drawDefault = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray) => {
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const size = (brightness / 255) * triangleSize

        drawTriangle(ctx, x, y, size, false)
      }
    }
  }

  const drawMotionBlur = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray, strength: number) => {
    if (prevImageDataRef.current) {
      ctx.globalAlpha = strength
      ctx.drawImage(ctx.canvas, 0, 0)
      ctx.globalAlpha = 1.0
    }
    const movementThreshold = 20
    const newMovementMap: boolean[] = []
    const newPositions: { [key: string]: { x: number; y: number } } = {}

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

        const currentTriangleSize = currentlyMoving ? triangleSize * 1.3 : triangleSize
        const size = (brightness / 255) * currentTriangleSize

        const key = `${x},${y}`
        const prevPos = prevPositionsRef.current[key] || { x, y }
        const dx = x - prevPos.x
        const dy = y - prevPos.y

        drawTriangle(ctx, x, y, size, currentlyMoving)

        if (currentlyMoving) {
          for (let i = 1; i <= 3; i++) {
            const alpha = 1 - i * 0.2
            const blurX = x - dx * i * 0.5
            const blurY = y - dy * i * i * 0.5
            drawTriangle(ctx, blurX, blurY, size * 0.8, true, alpha)
          }
        }

        newPositions[key] = { x, y }
      }
    }

    movementMapRef.current = newMovementMap
    prevPositionsRef.current = newPositions
  }

  const drawPixelate = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray, pixelSize: number) => {
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(x, y, pixelSize, pixelSize)
      }
    }
  }

  const drawKaleidoscope = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray, segments: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2
    const segmentAngle = (Math.PI * 2) / segments

    // Create a temporary canvas to store the original image
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // Draw the original image on the temporary canvas
    const imageData = new ImageData(data, width, height)
    tempCtx.putImageData(imageData, 0, 0)

    // Clear the main canvas
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    // Draw kaleidoscope segments
    for (let i = 0; i < segments; i++) {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(i * segmentAngle)

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(radius * Math.cos(segmentAngle / 2), radius * Math.sin(segmentAngle / 2))
      ctx.lineTo(radius * Math.cos(-segmentAngle / 2), radius * Math.sin(-segmentAngle / 2))
      ctx.closePath()
      ctx.clip()

      ctx.drawImage(tempCanvas, -centerX, -centerY)

      ctx.restore()
    }
  }

  const drawWaterRipple = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray, time: number) => {
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    const imageData = new ImageData(data, width, height)
    tempCtx.putImageData(imageData, 0, 0)

    const waveLength1 = 200
    const waveLength2 = 150
    const amplitude1 = 20
    const amplitude2 = 15
    const spacing = 5

    ctx.fillStyle = "rgba(0, 100, 255, 0.2)"
    ctx.fillRect(0, 0, width, height)

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const dx1 = Math.sin(y / waveLength1 + time) * amplitude1
        const dy1 = Math.cos(x / waveLength1 + time) * amplitude1
        const dx2 = Math.sin(x / waveLength2 + time * 1.5) * amplitude2
        const dy2 = Math.cos(y / waveLength2 + time * 1.5) * amplitude2

        const sourceX = x + dx1 + dx2
        const sourceY = y + dy1 + dy2

        const reflectionY = Math.max(0, sourceY - height * 0.3)
        const i = (Math.floor(reflectionY) * width + Math.floor(sourceX)) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const brightness = (r + g + b) / 3
        const size = (brightness / 255) * spacing * 1.2

        const waveHeight = (Math.sin(x / waveLength1 + time) + Math.cos(y / waveLength2 + time * 1.5)) * 0.5 + 0.5
        const alpha = 0.4 + waveHeight * 0.6
        const waterColor = `rgba(${r * 0.6 + 100 * waveHeight}, ${g * 0.7 + 100 * waveHeight}, ${b * 1.3}, ${alpha})`
        drawTriangle(ctx, x, y, size, false, alpha, waterColor)
      }
    }

    ctx.filter = "blur(2px)"
    ctx.drawImage(ctx.canvas, 0, 0)
    ctx.filter = "none"
  }

  const drawAsciiArt = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray, spacing: number) => {
    const asciiChars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."]
    const cellSize = spacing
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${cellSize}px monospace`
    ctx.fillStyle = "white"

    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
        ctx.fillText(asciiChars[charIndex], x, y + cellSize)
      }
    }
  }

  const drawTriangle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    isMoving: boolean,
    alpha = 1,
    fillStyle?: string,
  ) => {
    if (size < 1) {
      ctx.fillStyle = fillStyle || `rgba(255, 255, 255, ${alpha})`
      ctx.fillRect(x, y, 1, 1)
      return
    }

    const height = (size * Math.sqrt(3)) / 2

    ctx.beginPath()
    ctx.moveTo(x, y - height / 2)
    ctx.lineTo(x - size / 2, y + height / 2)
    ctx.lineTo(x + size / 2, y + height / 2)
    ctx.closePath()

    if (fillStyle) {
      ctx.fillStyle = fillStyle
    } else if (isMoving) {
      const hue = (Date.now() / 20 + x + y) % 360
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    }
    ctx.fill()
  }

  const drawNeonEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray) => {
    ctx.shadowBlur = 15
    ctx.shadowColor = "rgba(0, 255, 255, 0.8)"
    
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const size = (brightness / 255) * triangleSize

        if (brightness > 128) {
          const hue = (x / width) * 360
          ctx.fillStyle = `hsl(${hue}, 100%, 70%)`
          drawTriangle(ctx, x, y, size, true, 0.8)
        }
      }
    }
    ctx.shadowBlur = 0
  }

  const drawGlitchEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray) => {
    const time = Date.now() / 1000
    const glitchOffset = Math.sin(time) * 10

    for (let y = 0; y < height; y += spacing) {
      const offset = Math.sin(y * 0.1 + time) * glitchOffset
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        if (Math.random() < 0.05) {
          ctx.fillStyle = `rgb(${r},0,0)`
          ctx.fillRect(x + offset, y, spacing, spacing)
          ctx.fillStyle = `rgb(0,${g},0)`
          ctx.fillRect(x - offset, y, spacing, spacing)
          ctx.fillStyle = `rgb(0,0,${b})`
          ctx.fillRect(x, y, spacing, spacing)
        } else {
          const brightness = (r + g + b) / 3
          const size = (brightness / 255) * triangleSize
          drawTriangle(ctx, x, y, size, false)
        }
      }
    }
  }

  const drawVintageEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray) => {
    ctx.filter = 'sepia(0.8) contrast(1.2) brightness(0.8)'
    
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const size = (brightness / 255) * triangleSize

        const noise = Math.random() * 0.2 + 0.8
        drawTriangle(ctx, x, y, size * noise, false, 0.7)
      }
    }
    ctx.filter = 'none'
  }

  const drawMatrixEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8ClampedArray) => {
    const characters = "01"
    ctx.font = `${spacing}px monospace`
    ctx.fillStyle = "#00ff00"
    
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        
        if (brightness > 50) {
          const char = characters.charAt(Math.floor(Math.random() * characters.length))
          const alpha = brightness / 255
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`
          ctx.fillText(char, x, y)
        }
      }
    }
  }

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
  }, [isVideoReady, processImageData])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvas.width = width
        canvas.height = height
      }
    })

    resizeObserver.observe(canvas)
    return () => resizeObserver.disconnect()
  }, [])

  const handleVideoReady = () => {
    setIsVideoReady(true)
  }

  const handleCameraError: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    console.error("Camera error:", event)
    alert("Camera access failed. Please check your camera permissions and try again.")
  }

  // Camera settings add karenge
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
    aspectRatio: 16/9
  }

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[70vw] aspect-video mx-auto">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedMetadata={handleVideoReady}
        mirrored={true}
        onError={handleCameraError}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <ControlBar
        currentPreset={currentPreset}
        setPreset={setCurrentPreset}
        triangleSize={triangleSize}
        setTriangleSize={setTriangleSize}
        spacing={spacing}
        setSpacing={setSpacing}
      />
    </div>
  )
}

export default WebcamTriangles

