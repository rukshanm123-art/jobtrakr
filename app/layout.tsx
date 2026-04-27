import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobTrakr — Track your job search',
  description: 'A professional job application tracker with pipeline analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-[#FAFAF8] dark:bg-[#0c0c0b] text-stone-900 dark:text-stone-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
