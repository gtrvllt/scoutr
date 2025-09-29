import "@/ui/global.css";

import ClientAppBar from "@/components/ClientAppBar";
import ClientCountryList from "@/components/ClientCountryList";
// import dynamic from 'next/dynamic';
// const AppBar = dynamic(() => import('@/components/AppBar'), { ssr: false });
// const CountryList = dynamic(() => import('@/components/CountryList'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <ClientAppBar />
        <main className="main-container flex">
          <div className="country-list-container absolute top-64px left-0 z-50 h-full  backdrop-blur-md shadow-lg ">
            <ClientCountryList />
          </div>
          <div className="flex-1 main-content">{children}</div>
        </main>
      </body>
    </html>
  );
}
