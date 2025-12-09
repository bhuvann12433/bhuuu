"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md animate-in zoom-in-50 duration-300 shadow-2xl border-2 border-black">
        <div className="text-6xl mb-6 animate-bounce">✓</div>
        <h2 className="text-3xl font-bold text-black mb-3">Puzzle Solved!</h2>
        <p className="text-gray-600 mb-8 text-lg">Congratulations, you've completed the puzzle successfully.</p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg font-bold hover:from-gray-800 hover:to-black transition-all active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
