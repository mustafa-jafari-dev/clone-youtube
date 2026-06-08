import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/lib/providers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { Header } from "@/components/shared/header"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <Providers>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex min-h-svh flex-1 flex-col">
                <Header />
                <div className="flex-1">{children}</div>
              </main>
            </SidebarProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
