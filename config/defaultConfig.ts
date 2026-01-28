import type { SiteConfig } from './types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  meta: {
    siteName: 'Location Benne Occitanie',
    tagline: 'Location de benne en Occitanie (Montauban, Toulouse, Albi)',
    description:
      'Location de bennes pour gravats, encombrants, déchets verts. Livraison rapide, tri conforme. Intervention Montauban, Toulouse, Albi. Devis en 2 min.',
    language: 'fr',
    logoUrl: 'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/Logo-de-Benne-Occitanie-2.png',
    socialImageUrl: 'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/Logo-de-Benne-Occitanie-2.png',
  },
  contact: {
    phone: '+33 6 79 98 41 26',
    phoneDisplay: '06.79.98.41.26',
    email: 'mesnierdu82@gmail.com',
    address: {
      street: '28 chemin des Bernardets',
      postalCode: '82000',
      city: 'Montauban',
      region: 'Occitanie',
      country: 'FR',
    },
    openingHours: [
      'Lundi–Vendredi : 08:00–19:00',
      'Samedi : 09:00–12:30',
      'Dimanche : Fermé',
    ],
    areasServed: ['Montauban', 'Toulouse', 'Albi', 'Occitanie'],
    social: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
  },
  nav: [
    { label: 'Accueil', to: '/' },
    { label: 'Bennes', to: '/bennes' },
    { label: 'Services', to: '/services' },
    { label: 'À propos', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  home: {
    hero: {
      badge: 'Votre solution',
      title: 'Location de bennes rapide et efficace',
      subtitle:
        'Profitez d’un service d’évacuation de gravats et déchets dans toute l’Occitanie : Montauban, Toulouse, Albi, ainsi que toutes les communes alentours.',
      primaryCta: { label: 'Obtenez un devis', to: '/contact' },
      secondaryCta: { label: 'Appeler', type: 'tel' },
      imageUrl:
        'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png',
      imageAlt: 'Camion benne – Location Benne Occitanie',
    },
    aboutTeaser: {
      kicker: 'À propos de nous',
      title: 'Découvrez l’histoire de Location Benne Occitanie et de notre engagement',
      body: 'Location Benne Occitanie, spécialisée dans la location de bennes, est dédiée à un service de qualité en Occitanie depuis sa création.',
      cta: { label: 'Lire la suite', to: '/about' },
      imageUrl:
        'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-4-aout-2025-21_26_42.png',
      imageAlt: 'Qualité de service',
    },
    servicesTeaser: {
      kicker: 'Services',
      title: 'Nos services de location de bennes en Occitanie',
      items: [
        {
          prefix: '01.',
          title: 'Location de Bennes',
          description: 'Une benne polyvalente, idéale pour tous vos projets',
        },
        {
          prefix: '02.',
          title: 'Évacuation de Déchets',
          description: 'Un service rapide pour l’évacuation de tous vos déchets.',
        },
        {
          prefix: '03.',
          title: 'Devis Gratuits',
          description: 'Obtenez un devis gratuit et sans engagement.',
        },
      ],
      cta: { label: 'Obtenez un devis', to: '/contact' },
    },
    benefits: {
      kicker: 'Nos atouts',
      title: 'Découvrez nos avantages uniques pour vos projets',
      items: [
        {
          title: 'Rapidité',
          description:
            'Nous garantissons une intervention rapide pour répondre à vos besoins d’évacuation de manière efficace.',
        },
        {
          title: 'Devis gratuit',
          description:
            'Obtenez un devis gratuit et transparent, sans engagement, pour tous vos projets de location de bennes.',
        },
        {
          title: 'Expertise locale',
          description:
            'Nos connaissances locales nous permettent d’offrir des solutions adaptées et efficaces pour leur environnement.',
        },
      ],
    },
    howItWorks: {
      kicker: 'Comment ça fonctionne',
      title: 'Découvrez notre processus de location de bennes',
      steps: [
        {
          kicker: 'Step-01',
          title: 'Étape 1 : Demande',
          description: 'Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.',
        },
        {
          kicker: 'Step-02',
          title: 'Étape 2 : Livraison',
          description: 'Nous livrons la benne à l’endroit indiqué dans les meilleurs délais.',
        },
        {
          kicker: 'Step-03',
          title: 'Étape 3 : Évacuation',
          description: 'Une fois la benne pleine, nous assurons son enlèvement rapidement et efficacement.',
        },
      ],
    },
    commitments: {
      kicker: 'Engagement',
      title: 'Pourquoi choisir Location Benne Occitanie ?',
      items: [
        {
          title: 'Simplicité & Rapidité',
          description:
            'Réservation facile et livraison express de votre benne partout en Occitanie, pour tous vos chantiers et débarras.',
        },
        {
          title: 'Tarifs transparents',
          description:
            'Devis gratuit et prix sans surprise, adaptés à chaque besoin, pour particuliers et professionnels.',
        },
        {
          title: 'Service local & réactif',
          description:
            'Une équipe proche de chez vous, à l’écoute, disponible pour répondre à toutes vos questions et assurer un suivi personnalisé.',
        },
        {
          title: 'Engagement écologique',
          description:
            'Gestion responsable des déchets, tri en centre agréé et solutions respectueuses de l’environnement.',
        },
      ],
      imageUrl:
        'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-4-aout-2025-19_24_04.png',
      imageAlt: 'Service local en Occitanie',
    },
    testimonials: {
      title: 'Ce que nos clients disent de nous',
      items: [
        {
          author: 'Dominique Tertrais',
          source: 'Google',
          text: 'Une équipe de choc, efficace, sympathique et discrète avec un rapport qualité prix au top… un travail soigné et performant. Je recommande avec enthousiasme.',
        },
        {
          author: 'Magali Estevinha',
          source: 'Google',
          text: 'Nous recommandons Location Benne Occitanie, pour leur réactivité et sérieux. Travail propre et respectueux des lieux.',
        },
        {
          author: 'Corinne et Eric BELIERES',
          source: 'Google',
          text: 'Suite aux aléas climatiques, nous avons dû évacuer un cubage important d’arbres tombés. La benne a été livrée dans les temps et positionnée dans notre jardin. L’évacuation des déchets verts a été faite rapidement vers la déchetterie. Un soulagement pour nous.',
        },
      ],
    },
    finalCta: {
      title: 'Ne laissez pas vos encombrants s’accumuler !',
      body: 'Contactez-nous dès aujourd’hui pour un devis gratuit et rapide sur la location de bennes.',
      cta: { label: 'Obtenez un devis', to: '/contact' },
    },
  },
  bennes: {
    title: 'Nos bennes de 3 à 15 m³',
    subtitle: 'Location pour tous vos besoins',
    introTitle: 'Notre gamme de bennes en détail',
    introBody:
      'Découvrez notre gamme complète de bennes à louer de 3 à 15 m³, adaptées à tous vos besoins : travaux, débarras, chantiers, déchets verts ou gravats. Nous livrons rapidement sur Montauban, Toulouse, Albi et toute la région Occitanie, pour particuliers et professionnels.',
    items: [
      {
        title: 'Benne 3 m³',
        volume: '3 m³',
        lead: 'Vous avez un petit volume de déchets à évacuer ?',
        paragraphs: [
          'La benne 3 m³ est idéale pour tous vos petits chantiers à la maison : débarras de cave, nettoyage de garage, taille de haies ou petits travaux de bricolage. Son format compact lui permet de se faufiler partout, même dans les accès les plus étroits.',
          'Facile à positionner, elle s’adresse aussi bien aux particuliers qu’aux petits artisans qui souhaitent évacuer rapidement gravats, déchets verts ou petits encombrants.',
          'Optez pour une solution simple, rapide et économique avec notre benne 3 m³ !',
        ],
        imageUrl:
          'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-6-aout-2025-17_06_30-e1754492942287.png',
        imageAlt: 'Benne blanche 3 m³ vue de trois-quarts',
      },
      {
        title: 'Benne 7 m³',
        volume: '7 m³',
        lead: 'Le compromis parfait pour la maison ou le chantier !',
        paragraphs: [
          'La benne 7 m³ s’adapte à tous les besoins courants de rénovation, de débarras d’une pièce entière ou d’évacuation après un déménagement. Assez grande pour stocker du mobilier, des gravats, du bois ou des déchets mixtes, elle reste toutefois maniable et facile à placer même en zone urbaine ou dans les lotissements.',
          'Pour tous vos projets intermédiaires, faites confiance à la benne 7 m³, polyvalente et économique !',
        ],
        imageUrl:
          'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/Conteneur-a-dechets-blanc-sur-beton.png',
        imageAlt: 'Benne blanche 7 m³ vue de trois-quarts',
      },
      {
        title: 'Benne 10 m³',
        volume: '10 m³',
        lead: 'Un grand volume pour vos travaux ambitieux !',
        paragraphs: [
          'Vous préparez une rénovation complète, le débarras d’une grande maison ou l’élagage massif de votre jardin ? La benne 10 m³ est faite pour vous. Elle offre suffisamment d’espace pour les déchets volumineux, les matériaux de chantier, les meubles encombrants ou les déchets verts en quantité.',
          'Sa polyvalence séduit aussi bien les professionnels du bâtiment que les particuliers lors de gros travaux.',
          'Avec la benne 10 m³, libérez-vous des contraintes logistiques et gagnez un temps précieux !',
        ],
        imageUrl:
          'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-6-aout-2025-17_19_27.png',
        imageAlt: 'Benne blanche 10 m³ vue de trois-quarts',
      },
      {
        title: 'Benne 15 m³',
        volume: '15 m³',
        lead: 'Le choix des gros chantiers et des professionnels exigeants !',
        paragraphs: [
          'La benne 15 m³ répond aux besoins les plus importants : chantiers de démolition, nettoyage d’entrepôts, débarras de bâtiments entiers ou grands travaux d’entreprise.',
          'Son volume généreux limite les rotations, ce qui est idéal pour optimiser votre temps et vos coûts. Capable d’accueillir tout-venant, gravats, déchets industriels ou mobiliers volumineux, elle est le partenaire indispensable des opérations de grande envergure.',
          'Pour tous vos grands projets, la benne 15 m³ est la solution la plus efficace et la plus rentable !',
        ],
        imageUrl:
          'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-6-aout-2025-17_24_50.png',
        imageAlt: 'Benne blanche 15 m³ vue de trois-quarts',
      },
    ],
    cta: {
      title: 'Ne laissez pas vos encombrants s’accumuler !',
      body: 'Contactez-nous dès aujourd’hui pour un devis gratuit et rapide sur la location de bennes.',
      label: 'Obtenez un devis',
      to: '/contact',
    },
  },
  servicesPage: {
    kicker: 'Nos services',
    title: 'Location de Bennes pour vos Besoins',
    items: [
      {
        prefix: '01.',
        title: 'Location de Bennes',
        description:
          'Nous proposons des bennes adaptées à tous vos besoins, que ce soit pour des travaux de construction, de rénovation ou d’évacuation de déchets. Nos équipes vous conseilleront sur la taille adéquate et assureront une livraison rapide pour vous permettre de commencer vos travaux sans délai.',
        imageUrl: 'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/a8ba24e4-7cd1-44a0-ac98-0315be9ccc7a.png',
        imageAlt: 'Location Benne Occitanie',
      },
      {
        prefix: '02.',
        title: 'Évacuation de Déchets',
        description:
          'Notre service d’évacuation de déchets est conçu pour vous aider à vous débarrasser efficacement de toutes sortes de gravats et encombrants. Nous nous chargeons de la collecte et du transport vers les sites de traitement, garantissant une gestion écologique de vos déchets et respect des normes environnementales.',
        imageUrl:
          'https://location-benne-occitanie.fr/wp-content/uploads/2025/08/ChatGPT-Image-4-aout-2025-23_35_24-1024x683.png',
        imageAlt: 'Évacuation des déchets – Location Benne Occitanie',
      },
      {
        prefix: '03.',
        title: 'Devis Gratuits',
        description:
          'Nous offrons des devis gratuits pour toutes nos prestations. Grâce à notre approche transparente, vous pouvez évaluer nos services sans engagement et choisir la solution qui correspond le mieux à vos besoins, le tout dans un délai rapide et efficace.',
      },
      {
        prefix: '04.',
        title: 'Service Client Personnalisé',
        description:
          'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous fournir un service client personnalisé. Nous nous engageons à vous assister tout au long de votre projet, garantissant une satisfaction totale grâce à notre expertise et notre soutien constant.',
      },
    ],
    cta: {
      title: 'Ne laissez pas vos encombrants s’accumuler !',
      body: 'Contactez-nous dès aujourd’hui pour un devis gratuit et rapide sur la location de bennes.',
      label: 'Obtenez un devis',
      to: '/contact',
    },
  },
  aboutPage: {
    kicker: 'À propos',
    title: 'Découvrez l’expertise de Location Benne Occitanie',
    stats: [
      { value: '25+', label: 'Années d’expérience' },
      { value: '1+', label: 'Membres de l’équipe' },
      { value: '99%', label: 'Client satisfait' },
      { value: '1000+', label: 'Nombre de chantier' },
    ],
    sections: [
      {
        title: 'Notre entreprise',
        subtitle: 'Engagés pour un service de qualité en location de bennes',
        paragraphs: [
          'Location Benne Occitanie est fière d’avoir aidé de nombreux clients à gérer efficacement leurs déchets, offrant des solutions sur mesure qui ont transformé des espaces encombrés en lieux propres et organisés.',
          'Depuis sa création, Location Benne Occitanie a su répondre aux besoins variés de ses clients en matière de gestion des déchets. Grâce à des services rapides et efficaces, l’entreprise a pu améliorer la satisfaction et la tranquillité d’esprit de nombreux particuliers et professionnels autour de Montauban, Toulouse et Albi. Chaque intervention vise à optimiser l’espace de vie des clients tout en respectant l’environnement.',
        ],
      },
      {
        title: 'Notre parcours',
        subtitle: 'L’histoire de Location Benne Occitanie',
        paragraphs: [
          'Location Benne Occitanie a été fondée pour répondre à un besoin croissant de solutions de gestion des déchets en région Occitanie. Au fil des années, l’entreprise a construit une réputation solide grâce à son expertise locale et à son engagement envers la satisfaction client. Aujourd’hui, elle est un acteur clé dans la location de bennes, offrant des services adaptés aux besoins des habitants de la région.',
        ],
      },
      {
        title: 'Notre équipe',
        subtitle: 'Des experts à votre service',
        paragraphs: [
          'Chez Location Benne Occitanie, notre équipe d’experts met tout son savoir-faire à votre disposition pour garantir la réussite de vos projets. Forts d’une expérience reconnue dans la location de bennes et la gestion des déchets, nous vous accompagnons à chaque étape : conseil sur le choix de la benne, modalités de livraison, respect des délais, et suivi personnalisé. Professionnels ou particuliers, bénéficiez d’un service réactif, de solutions adaptées et d’une écoute attentive pour tous vos besoins. Notre priorité : votre satisfaction, la sécurité de vos chantiers et le respect de l’environnement en Occitanie. Faites confiance à des spécialistes locaux engagés à vos côtés !',
        ],
      },
    ],
    cta: {
      title: 'Ne laissez pas vos encombrants s’accumuler !',
      body: 'Contactez-nous dès aujourd’hui pour un devis gratuit et rapide sur la location de bennes.',
      label: 'Obtenez un devis',
      to: '/contact',
    },
  },
  contactPage: {
    kicker: 'Contact',
    title: 'Nous sommes là pour vous aider',
    infoKicker: 'Entrer en contact',
    infoTitle: 'Nous contacter facilement',
    formTitle: 'Demande de location de benne en Occitanie',
    formSubtitle: 'Remplissez le formulaire ci-dessous pour nous contacter rapidement',
    successTitle: '✅ Merci pour votre demande de location !',
    successBody: 'Nous vous répondrons rapidement.',
    submitLabel: 'Envoyer ma demande',
  },
  privacy: {
    title: 'Politique de confidentialité',
    lastUpdated: '2025-08-04',
    sections: [
      {
        title: '1. Introduction',
        paragraphs: [
          'Nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons et quels sont vos droits.',
        ],
      },
      {
        title: '2. Données collectées',
        paragraphs: ['Nous collectons les informations suivantes :'],
        bullets: [
          'Informations saisies dans les formulaires de contact/devis (nom, prénom, adresse e-mail, téléphone, message, ville)',
          'Informations techniques : adresse IP, navigateur, pages visitées (via cookies techniques)',
        ],
      },
      {
        title: '3. Utilisation des données',
        paragraphs: ['Les données sont utilisées uniquement pour :'],
        bullets: [
          'Répondre à vos demandes de contact ou devis',
          'Gérer nos prestations de services',
          'Améliorer notre site et nos services',
        ],
        note: 'Nous ne vendons ni ne partageons vos données à des tiers non autorisés.',
      },
      {
        title: '4. Cookies',
        paragraphs: [
          'Notre site utilise des cookies pour améliorer l’expérience utilisateur et mesurer l’audience (ex : Google Analytics).',
          'Vous pouvez à tout moment paramétrer vos préférences de cookies dans votre navigateur.',
        ],
      },
      {
        title: '5. Destinataires des données',
        paragraphs: [
          'Seules les personnes habilitées de Location Benne Occitanie ont accès à vos informations pour traiter vos demandes.',
        ],
      },
      {
        title: '6. Durée de conservation',
        paragraphs: [
          'Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et au maximum 3 ans après le dernier contact.',
        ],
      },
      {
        title: '7. Sécurité',
        paragraphs: [
          'Nous mettons en place des mesures techniques pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.',
        ],
      },
      {
        title: '8. Vos droits',
        paragraphs: ['Conformément au RGPD, vous disposez des droits suivants :'],
        bullets: [
          'Accès, rectification ou suppression de vos données',
          'Limitation ou opposition au traitement',
          'Retrait du consentement',
        ],
        note: 'Pour exercer vos droits, écrivez-nous à l’adresse e-mail indiquée sur le site ou via le formulaire de contact.',
      },
      {
        title: '9. Contact',
        paragraphs: [
          'Pour toute question concernant la politique de confidentialité, contactez-nous à l’adresse e-mail indiquée sur le site.',
        ],
      },
    ],
  },
  admin: {
    github: {
      owner: '',
      repo: '',
      branch: 'main',
      path: 'public/data.config',
      allowedUsers: [],
    },
    google: {
      oauthClientId: '',
      accountName: '',
      locationName: '',
      scope: 'https://www.googleapis.com/auth/business.manage',
    },
  },
};
