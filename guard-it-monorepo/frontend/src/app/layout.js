import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "GUARD IT! — Safety-as-a-Service",
  description:
    "Production-grade, multi-tenant content moderation at internet scale. Asynchronous, reliable, and built for the highest standards of safety.",
  keywords: "content moderation, AI safety, multi-tenant, SaaS, API, webhooks",
  openGraph: {
    title: "GUARD IT! — Safety-as-a-Service",
    description: "Production-grade content moderation at internet scale.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        style={{ fontFamily: "var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
