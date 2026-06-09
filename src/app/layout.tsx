import { Geist_Mono, Vazirmatn } from "next/font/google"

import { AppSidebar } from "@/components/shared/app-sidebar"
import { Header } from "@/components/shared/header"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/lib/providers"
import { cn } from "@/lib/utils"
import Script from "next/script"
import "./globals.css"

const geist = Vazirmatn({ 
  subsets: ["arabic","latin","latin-ext"], 
  variable: "--font-sans",
})

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
      <head>
        <Script
          id="theme-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=localStorage.getItem("theme"),t="system"===e||!e?window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light":e;document.documentElement.classList.remove("light","dark"),document.documentElement.classList.add(t)}catch(e){}})();`,
          }}
        />
      </head>
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
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
