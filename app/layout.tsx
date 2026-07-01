import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeMind",
  description: "O copiloto silencioso da sua casa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-50">
        {children}
      </body>
    </html>
  );
}