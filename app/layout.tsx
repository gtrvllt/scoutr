import "@/ui/global.css";

import AppBar from "@/components/AppBar";
import BurgerMenu from "@/components/BurgerMenu";
import { CountryList } from "./components/CountryList";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <AppBar />
        <main className="main-content flex h-full">
          <aside className="w-1/4 country-list-container">
            <CountryList />
          </aside>
          <div className="flex-1 main-container">{children}</div>
        </main>
      </body>
    </html>
  );
}
