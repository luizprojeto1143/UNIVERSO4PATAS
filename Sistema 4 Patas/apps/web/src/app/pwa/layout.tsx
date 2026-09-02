import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Patas PWA",
  description: "Portal da equipe da clínica veterinária",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "4 Patas",
  },
};

export const viewport = {
  themeColor: "#4F46E5",
};

export default function PWALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 relative pb-safe">
      {children}
    </main>
  );
}
