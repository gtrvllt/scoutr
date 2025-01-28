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
        <AppBar className="mt-0" />
        <main className="main-content flex h-full">
          <aside className="w-1/4 country-list-container">
            <CountryList />
          </aside>
          <div className="flex-1 p-4 main-container">{children}</div>
        </main>
      </body>
    </html>
  );
}
