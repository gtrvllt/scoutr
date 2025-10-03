export default function AboutPage() {
  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">About</h1>
      <p className="text-gray-700 text-lg mb-8">laincore & redd 2025</p>
      <div className="border-l-4 border-blue-400 p-6 flex flex-col gap-4 bg-white">
        <div className="flex items-center gap-3 mt-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 text-xl font-bold shadow-sm">S</span>
          <div>
            <span className="font-semibold text-yellow-700">scoutr</span>
            <span className="ml-2 text-gray-700">— scoutr est une application pensée pour s’entraîner à <span className="font-semibold">GeoGuessr</span> en permettant à chacun d’ajouter ses propres <span className="font-semibold">métas</span>, de les apprendre, de se tester dessus, et bien plus encore !<br/>Un aspect communautaire riche en fonctionnalités arrive bientôt, pour partager, progresser et s’amuser ensemble.<br/>L’aspect <span className="font-semibold">learning</span> sera aussi une grosse partie de l’expérience, pour repousser ses limites et s’améliorer chaque jour, sur ses metas ou celles des autres ...</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-xl font-bold shadow-sm">R</span>
          <div>
            <span className="font-semibold text-blue-700">redd</span>
            <span className="ml-2 text-gray-700">— développeur web passionné, spécialisé en <span className="font-semibold">React</span> & <span className="font-semibold">Vue</span>.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-700 text-xl font-bold shadow-sm">L</span>
          <div>
            <span className="font-semibold text-pink-700">laincore</span>
            <span className="ml-2 text-gray-700">— en formation <span className="font-semibold">UI/UX designer</span>, imagine l’expérience utilisateur de demain.</span>
          </div>
        </div>

      </div>
    </div>
  )
}