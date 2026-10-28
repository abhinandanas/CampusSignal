import "./globals.css";

export const metadata = {
  title: "CampusSignal – Wi-Fi Dead-Zone Mapper",
  description: "Empirical campus Wi-Fi performance telemetry and dead-zone mapping platform by Team SignalX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
