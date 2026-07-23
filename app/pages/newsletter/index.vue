<template>
  <div class="py-12 px-6">
    <h1 class="text-3xl font-bold mb-4 text-gray-900">Newsletter</h1>
    <p class="text-gray-700 text-lg mb-8">
      Bienvenue sur notre page dédiée à la newsletter et au changelog de Scoutr ! Ici, vous retrouverez toutes les mises à jour importantes concernant l'application, ainsi que les nouvelles fonctionnalités que nous ajoutons régulièrement pour améliorer votre expérience.
      <br />
      Restez informé des dernières évolutions, des corrections de bugs, et des ajouts qui rendent Scoutr encore plus performant. Nous sommes ravis de partager avec vous notre progression et de continuer à construire, ensemble, une plateforme qui répond à vos besoins et dépasse vos attentes.
    </p>
    <!-- RÈGLE RÉDACTION : entrées courtes et factuelles uniquement. Une ligne = une fonctionnalité. Pas de phrases longues, pas de mise en contexte. -->
    <div class="border-l-4 border-black p-6 flex flex-col gap-4 bg-white">

      <!-- 23 juillet 2026 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">23 juillet 2026</h2>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Image de header par pays — photos hébergées sur Supabase Storage</li>
          <li>Métas groupées par tag dans la page pays</li>
          <li>Tags globaux — plus liés à un pays, réutilisables partout</li>
          <li>Édition de méta directement dans la dialog de focus</li>
          <li>Suggestions de tags issues de tous les pays dans le formulaire d'ajout</li>
          <li>Casse des tags normalisée — première lettre majuscule</li>
          <li>Tag "daily" renommé en "Official tip"</li>
        </ul>
      </div>

      <!-- 22 juin 2026 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">22 juin 2026</h2>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Notation des métas dans le quizz — 0 à 5 étoiles après chaque réponse</li>
          <li>Choix de la source des métas dans le quizz — les tiennes ou celles de la communauté</li>
        </ul>
      </div>

      <!-- 18 juin 2026 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">18 juin 2026</h2>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Correction du chargement des variables d'environnement Supabase et Mapbox</li>
          <li>Focus automatique sur la barre de recherche à l'ouverture de la country list</li>
          <li>16 pays GeoGuessr ajoutés : Inde, Vietnam, Népal, Chine, Géorgie, Arménie, Maroc, Égypte, Tunisie, Rwanda, Ouganda, Tanzanie, Madagascar, Zimbabwe, Costa Rica, Paraguay</li>
        </ul>
        <p class="mt-4 text-gray-700">
          <em><strong>La base de données a été entièrement vidée en préparation d'un beta test qui arrive très prochainement. 🎉</strong></em>
        </p>
      </div>

      <!-- 30 avril 2026 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">30 avril 2026</h2>
        <h3 class="text-xl font-semibold text-gray-800">Refonte complète de Scoutr</h3>
        <p class="mt-2 text-gray-700">
          Scoutr repart de zéro avec une toute nouvelle version, plus rapide et plus agréable à utiliser.
        </p>
        <h3 class="text-xl font-semibold text-gray-800 mt-3">Nouveautés</h3>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Carte du monde interactive — survole un pays pour le voir, clique pour y accéder</li>
          <li>Pages pays : capitale, langue, continent, statut de couverture, drapeau et galerie de métas</li>
          <li>Vue globale de toutes les métas, filtrable par tags</li>
          <li>Quiz configurable : choix du nombre de questions, portée (tous les pays, un continent, des pays précis), feedback immédiat et récapitulatif final</li>
          <li>Zoom et déplacement sur les images à la molette ou au glisser-déposer</li>
          <li>Connexion en un clic via Google</li>
          <li>Ajout de métas : import d'image, glisser-déposer, tags avec autocomplétion</li>
          <li>Suppression de métas avec confirmation</li>
          <li>Recherche de pays par nom ou continent dans la barre latérale</li>
          <li>Pages About us, Donate, Newsletter et Terms of use</li>
          <li>Notifications pour confirmer vos actions</li>
        </ul>
      </div>

      <!-- 7 octobre 2025 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">7 octobre 2025</h2>
        <h3 class="text-xl font-semibold text-gray-800">Améliorations</h3>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Amélioration de la world map</li>
          <li>Amélioration de l'ajout de méta</li>
          <li>Amélioration de l'ajout de méta-tag</li>
          <li>Fermeture de la country-list au clic d'un pays</li>
        </ul>
        <h3 class="text-xl font-semibold text-gray-800">Nouveaux ajouts</h3>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Intégration des pages Newsletter, About us, Donate & Terms of use</li>
          <li>Amélioration de l'ajout de méta</li>
          <li>Amélioration de l'ajout de méta-tag</li>
        </ul>
      </div>

      <!-- 7 mai 2025 -->
      <div class="gap-3 mt-2">
        <h2 class="text-2xl font-bold">7 mai 2025</h2>
        <h3 class="text-xl font-semibold text-gray-800">Nouvelles fonctionnalités</h3>
        <ul class="list-disc pl-6 mt-2 text-gray-700">
          <li>Ajout de metas avec sélection ou création de tag</li>
          <li>Implémentation de la world map pour sélectionner un pays</li>
        </ul>
      </div>

    </div>
  </div>
</template>
