import HomeMap from "@/components/HomeMap"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="homemap-container flex items-end p-4 min-h-[400px]">
       <HomeMap/>
      </div>    
    </main>
  );
}
