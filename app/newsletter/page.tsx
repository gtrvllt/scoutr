export default function AboutPage() {
  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Newsletter</h1>
      <p className="text-gray-700 text-lg mb-8">
        Bienvenue sur notre page dédiée à la newsletter et au changelog de Scoutr ! Ici, vous retrouverez toutes les mises à jour importantes concernant l'application, ainsi que les nouvelles fonctionnalités que nous ajoutons régulièrement pour améliorer votre expérience.
        <br />
        Restez informé des dernières évolutions, des corrections de bugs, et des ajouts qui rendent Scoutr encore plus performant. Nous sommes ravis de partager avec vous notre progression et de continuer à construire, ensemble, une plateforme qui répond à vos besoins et dépasse vos attentes.
      </p>
      <div className="border-l-4 border-black p-6 flex flex-col gap-4 bg-white">
        {/* 7 octobre 2025 */}
        <div className="gap-3 mt-2">
          <h2 className="text-2xl font-bold">7 octobre 2025</h2>
          <h3 className="text-xl font-semibold text-gray-800">Améliorations</h3>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li>Amélioration de la world map </li>
            <li>Amélioration de l'ajout de méta</li>
            <li>Amélioration de l'ajout de méta-tag</li>
            <li>Fermeture de la country-list au clic d'un pays</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800">Nouveaux ajouts</h3>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li>Intégration des pages Newsletter, About us, Donate & Terms of use </li>
            <li>Amélioration de l'ajout de méta</li>
            <li>Amélioration de l'ajout de méta-tag</li>
          </ul>
        </div>
        {/* PARAGRAPHE TEMPLATE */}
        <div className="gap-3 mt-2">
          <h2 className="text-2xl font-bold">7 mai 2025</h2>
          <h3 className="text-xl font-semibold text-gray-800">Nouvelles fonctionnalités</h3>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li>Ajout de metas avec sélection ou création de tag</li>
            <li>Implémentation de la world map pour sélectionner un pays</li>
          </ul>
        </div>
        {/* PARAGRAPHE TEMPLATE */}

      </div>
    </div >
  )
}