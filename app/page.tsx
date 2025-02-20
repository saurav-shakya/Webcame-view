"use client"

import WebcamTriangles from "./WebcamTriangles"
import { Twitter } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <WebcamTriangles />
      </div>

      {/* Attribution Footer - Moved below control buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <a
            href="https://x.com/sauravv_x"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
          >
            <Twitter size={16} />
            <span className="font-medium">@sauravv_x</span>
          </a>
          <div className="text-sm bg-blue-500/20 px-3 py-1.5 rounded-lg text-blue-200">
            Created by <span className="font-semibold">Saurav Singh</span>
          </div>
        </div>
      </div>
    </main>
  )
}

