'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
      <div className={`
        glass rounded-xl p-4 pr-12 border shadow-2xl min-w-[320px] max-w-md
        ${type === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-red-500/30 bg-red-500/10'
        }
      `}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}

          {/* Message */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-emerald-300' : 'text-red-300'
            }`}>
              {type === 'success' ? 'Success' : 'Error'}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${
              type === 'success' ? 'bg-emerald-400' : 'bg-red-400'
            }`}
            style={{
              animation: `shrink ${duration}ms linear`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}
