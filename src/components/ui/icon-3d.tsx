import * as React from "react"
import { cn } from "@/lib/utils"

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  green: "bg-green-500/10 text-green-500",
  blue: "bg-blue-500/10 text-blue-500",
  purple: "bg-purple-500/10 text-purple-500",
  orange: "bg-orange-500/10 text-orange-500",
}

interface Icon3DProps {
  children: React.ReactNode
  color?: keyof typeof colorClasses
  size?: keyof typeof sizeClasses
  className?: string
}

export function Icon3D({
  children,
  color = "primary",
  size = "md",
  className,
}: Icon3DProps) {
  return (
    <div
      className={cn(
        "icon-3d rounded-xl flex items-center justify-center",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      {children}
    </div>
  )
}
