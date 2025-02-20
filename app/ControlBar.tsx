import type React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type Preset = 
  | "default" 
  | "motionBlur" 
  | "pixelate" 
  | "kaleidoscope" 
  | "waterRipple" 
  | "asciiArt"
  | "neon"
  | "glitch"
  | "vintage"
  | "matrix"

interface ControlBarProps {
  currentPreset: Preset
  setPreset: (preset: Preset) => void
  triangleSize: number
  setTriangleSize: (size: number) => void
  spacing: number
  setSpacing: (spacing: number) => void
}

const ControlBar: React.FC<ControlBarProps> = ({
  currentPreset,
  setPreset,
  triangleSize,
  setTriangleSize,
  spacing,
  setSpacing,
}) => {
  const presets: { id: Preset; name: string; icon: string; category: string }[] = [
    // Basic Effects
    { id: "default", name: "Normal", icon: "🎨", category: "Basic" },
    { id: "motionBlur", name: "Motion", icon: "💨", category: "Basic" },
    { id: "pixelate", name: "Pixel", icon: "🔲", category: "Basic" },
    
    // Creative Effects
    { id: "kaleidoscope", name: "Kaleido", icon: "🌟", category: "Creative" },
    { id: "waterRipple", name: "Ripple", icon: "💧", category: "Creative" },
    { id: "neon", name: "Neon", icon: "💫", category: "Creative" },
    
    // Digital Effects
    { id: "glitch", name: "Glitch", icon: "⚡", category: "Digital" },
    { id: "matrix", name: "Matrix", icon: "👾", category: "Digital" },
    { id: "asciiArt", name: "ASCII", icon: "📝", category: "Digital" },
    
    // Retro Effects
    { id: "vintage", name: "Vintage", icon: "📷", category: "Retro" }
  ]

  return (
    <div className="fixed bottom-[40px] left-0 right-0 bg-black/80 p-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Presets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              onClick={() => setPreset(preset.id as Preset)}
              variant={currentPreset === preset.id ? "default" : "secondary"}
              className={`
                capitalize px-3 py-2 text-sm font-medium
                ${currentPreset === preset.id 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/50' 
                  : 'bg-white/10 hover:bg-white/20 text-white'}
                flex items-center justify-center gap-2 transition-all duration-200
                rounded-lg shadow-lg hover:scale-102 backdrop-blur-sm
                border border-white/20 hover:border-white/30
                min-h-[44px] md:min-h-[48px]
              `}
            >
              <span className="text-lg md:text-xl">{preset.icon}</span>
              <span className="hidden md:inline">{preset.name}</span>
              <span className="md:hidden text-xs font-medium">{preset.name}</span>
            </Button>
          ))}
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
            <span className="text-white whitespace-nowrap text-sm font-medium">Size:</span>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[triangleSize]}
              onValueChange={(value) => setTriangleSize(value[0])}
              className="flex-grow"
            />
            <span className="text-white min-w-[24px] text-right text-sm font-medium">{triangleSize}</span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
            <span className="text-white whitespace-nowrap text-sm font-medium">Space:</span>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[spacing]}
              onValueChange={(value) => setSpacing(value[0])}
              className="flex-grow"
            />
            <span className="text-white min-w-[24px] text-right text-sm font-medium">{spacing}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlBar

