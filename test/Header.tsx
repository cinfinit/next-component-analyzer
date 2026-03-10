
"use client"
import { useState } from "react"

export default function Header() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>Menu</button>
}