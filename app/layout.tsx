import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudoku Solver",
  description:
    "Professional Sudoku solver comparing Genetic Algorithm and LSGA performance. Generate and solve puzzles of varying difficulty levels.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sudoku Solver",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-black antialiased`}>{children}</body>
    </html>
  )
}
