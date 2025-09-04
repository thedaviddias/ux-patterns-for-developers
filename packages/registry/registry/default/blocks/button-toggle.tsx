"use client"

import { Button } from "../ui/button"
import { useState } from "react"

export default function ButtonToggle() {
  const [isPinned, setIsPinned] = useState(false)

  return (
    <Button
      variant={isPinned ? "default" : "outline"}
      onClick={() => setIsPinned(!isPinned)}
      className="gap-2"
    >
      <svg className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      {isPinned ? "Pinned" : "Pin"}
    </Button>
  )
}
