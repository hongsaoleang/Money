import React, { createContext, useContext, useState, useEffect } from 'react';

export const TRANSLATIONS = {
  EN: {
    // Navigation
    'nav.home': 'Home',
    'nav.browseProducts': 'Browse Products',
    'nav.products': 'Products',
    'nav.manage': 'Manage',
    'nav.services': 'Services',
    'nav.aboutUs': 'About Us',
    'nav.exploreStores': 'Explore Stores',
    'nav.categories': 'Categories',
    'nav.getStarted': 'Get Started',
    'nav.signIn': 'Sign In',
    'nav.cart': 'Shopping Cart',
    'nav.accountSettings': 'Account Settings',
    'nav.adminDashboard': 'Admin Dashboard',
    'nav.deployProduct': 'Deploy Product (Client)',
    'nav.signOut': 'Sign Out',
    'nav.searchPlaceholder': 'Search products or suppliers...',
    'nav.allCategories': 'View All 24+ Marketplace Categories',
    'nav.switchBack': 'Back to Tech Store Home',
    'nav.viewMarketplace': 'JomnenhKH-Shop Modern Marketplace View',
    'nav.alternateBadge': 'Alternate Homepage',
    'nav.selectLanguage': 'Select Language',

    // Categories
    'cat.home': 'Home & Living',
    'cat.homeCount': '450+ items',
    'cat.apparel': 'Apparel & Textiles',
    'cat.apparelCount': '320+ items',
    'cat.office': 'Office & Tech',
    'cat.officeCount': '180+ items',
    'cat.furniture': 'Furniture & Decor',
    'cat.furnitureCount': '210+ items',
    'cat.ceramics': 'Ceramics & Tableware',
    'cat.ceramicsCount': '140+ items',

    // Hero Section
    'hero.tag': 'Modern B2B & Direct Marketplace',
    'hero.heading1': 'Source smarter.',
    'hero.heading2': 'Grow W together.',
    'hero.description': 'Wholesale products. Independent suppliers. New possibilities for your business.',
    'hero.cta': 'Explore Products',
    'hero.secondaryCta': 'View Featured Stores',
    'hero.statMakers': 'Independent Makers',
    'hero.statProducts': 'Vetted Products',
    'hero.statFulfillment': 'Fulfillment Rate',
    'hero.badgeCertified': 'JomnenhKH-Shop Certified',
    'hero.badgeInspected': 'Quality Inspected',
    'hero.badgeDirect': 'Direct From Makers',
    'hero.badgeWholesale': 'Wholesale pricing',

    // Featured Stores
    'stores.heading': 'Stores worth knowing',
    'stores.subtitle': 'Meet the people behind your next good find.',
    'stores.explore': 'Explore stores',
    'stores.productsSuffix': 'products',

    // Store names & descriptions
    'store.homestyle.category': 'Home Decor',
    'store.homestyle.desc': 'Bespoke ceramics, sculpted stoneware vases, and minimalist home accessories crafted from natural Nordic clay.',
    'store.trendwear.category': 'Apparel',
    'store.trendwear.desc': 'Consciously made unisex apparel, heavyweight organic cotton basics, and relaxed linen workwear for mindful wardrobes.',
    'store.officepro.category': 'Workspace',
    'store.officepro.desc': 'Ergonomic workspace accessories, walnut laptop risers, desk pads, and biophilic office accents engineered for peak focus.',
    'store.comfort.category': 'Living',
    'store.comfort.desc': 'Tactile wool blankets, sage green cushions, and heirloom soft furnishings designed to infuse spaces with warmth and tranquility.',
    'store.daily.category': 'Tableware',
    'store.daily.desc': 'Everyday ritual essentials, matte glazed espresso tumblers, drippers, and sculptural vessels made to elevate daily moments.',

    // Store Modal
    'modal.verifiedMaker': 'Verified Maker',
    'modal.aboutSupplier': 'About This Supplier',
    'modal.leadTime': 'Lead Time',
    'modal.leadTimeVal': '2–4 Days',
    'modal.positiveReviews': 'Positive Reviews',
    'modal.lowMoq': 'Low MOQ',
    'modal.lowMoqVal': '5 Units Min',
    'modal.popularItems': 'Popular Items',
    'modal.close': 'Close',
    'modal.exploreStore': 'Explore Store Products',

    // Search
    'search.suggested': 'Suggested Matches',
    'search.popular': 'Popular Marketplace Searches',
    'search.pressEnter': 'Press Enter to search for',

    // Products page
    'products.title': 'Products & Hardware',
    'products.addNew': 'Add New Product',
    'products.searchPlaceholder': 'Search by name, spec, or origin...',
    'products.allCategories': 'All Categories',
    'products.inStock': 'in stock',
    'products.backorder': 'Backorder',
    'products.addToCart': 'Add to Cart',
    'products.added': 'Added to Cart',
    'products.contactTelegram': 'Contact via Telegram',
    'products.viewDetails': 'View Details',
    'products.noProducts': 'No products found.',

    // Services page
    'services.title': 'Software & Cloud Services',
    'services.subtitle': 'High-impact engineering, web systems, and mobile architectures built for scale.',
    'services.portfolio': 'Selected Engineering Portfolio',
    'services.inquiryTitle': 'Request an Engineering Estimate',
    'services.inquirySubtitle': 'Direct inquiry with our lead full-stack architect & engineering team.',
    'services.submitBtn': 'Submit Inquiry',

    // About Us page
    'about.title': 'Engineering Team & Architecture',
    'about.subtitle': 'Meet the core engineers and system designers behind Jomnenh-KH.',
    'about.leadArchitect': 'Lead Architect',
    'about.uiEngineer': 'UI Engineer',
    'about.cloudInfra': 'Cloud Infra',

    // Footer
    'footer.tagline': 'Hardware & Software Services · Phnom Penh, Cambodia.',
    'footer.location': 'Phnom Penh, Cambodia',
    'footer.marketplace': 'Marketplace',
    'footer.allProducts': 'All Products',
    'footer.featuredStores': 'Featured Stores',
    'footer.shoppingCart': 'Shopping Cart',
    'footer.services': 'Services',
    'footer.softwareServices': 'Software Services',
    'footer.contactUs': 'Contact Us',
    'footer.company': 'Company',
    'footer.aboutUs': 'About Us',
    'footer.myAccount': 'My Account',
    'footer.copyright': '© 2026 Jomnenh-KH · All rights reserved.',
    'footer.buyerProtection': 'Buyer Protection Guaranteed',
  },

  KH: {
    // Navigation
    'nav.home': 'ទំព័រដើម',
    'nav.browseProducts': 'ស្វែងរកផលិតផល',
    'nav.products': 'ផលិតផល',
    'nav.manage': 'គ្រប់គ្រង',
    'nav.services': 'សេវាកម្ម',
    'nav.aboutUs': 'អំពីយើង',
    'nav.exploreStores': 'រុករកហាង',
    'nav.categories': 'ប្រភេទ',
    'nav.getStarted': 'ចាប់ផ្តើម',
    'nav.signIn': 'ចូលគណនី',
    'nav.cart': 'កន្ត្រកទំនិញ',
    'nav.accountSettings': 'ការកំណត់គណនី',
    'nav.adminDashboard': 'ផ្ទាំងគ្រប់គ្រង Admin',
    'nav.deployProduct': 'ដាក់ផលិតផលថ្មី (Client)',
    'nav.signOut': 'ចាកចេញ',
    'nav.searchPlaceholder': 'ស្វែងរកផលិតផល ឬអ្នកផ្គត់ផ្គង់...',
    'nav.allCategories': 'មើលប្រភេទទាំងអស់ ២៤+ ក្នុងទីផ្សារ',
    'nav.switchBack': 'ត្រឡប់ទៅហាងបច្ចេកវិទ្យាដើម',
    'nav.viewMarketplace': 'ទិដ្ឋភាពទីផ្សារទំនិញទំនើប JomnenhKH-Shop',
    'nav.alternateBadge': 'ទំព័រដើម',
    'nav.selectLanguage': 'ជ្រើសរើសភាសា',

    // Categories
    'cat.home': 'ការតុបតែងផ្ទះ',
    'cat.homeCount': '៤៥០+ មុខទំនិញ',
    'cat.apparel': 'សម្លៀកបំពាក់',
    'cat.apparelCount': '៣២០+ មុខទំនិញ',
    'cat.office': 'កន្លែងធ្វើការ',
    'cat.officeCount': '១៨០+ មុខទំនិញ',
    'cat.furniture': 'ការរស់នៅសុខស្រួល',
    'cat.furnitureCount': '២១០+ មុខទំនិញ',
    'cat.ceramics': 'សម្ភារៈផ្ទះបាយ',
    'cat.ceramicsCount': '១៤០+ មុខទំនិញ',

    // Hero Section
    'hero.tag': 'ទីផ្សារទំនិញបោះដុំ និងផ្ទាល់ទំនើប B2B',
    'hero.heading1': 'ស្វែងរកប្រភពទំនិញឆ្លាតវៃ។',
    'hero.heading2': 'រីកចម្រើន W ជាមួយគ្នា។',
    'hero.description': 'ទំនិញបោះដុំគុណភាពខ្ពស់។ អ្នកផ្គត់ផ្គង់ឯករាជ្យ។ ឱកាសថ្មីៗគ្មានដែនកំណត់សម្រាប់អាជីវកម្មរបស់អ្នក។',
    'hero.cta': 'ស្វែងរកផលិតផល',
    'hero.secondaryCta': 'មើលហាងលេចធ្លោ',
    'hero.statMakers': 'អ្នកផលិតឯករាជ្យ',
    'hero.statProducts': 'ផលិតផលត្រួតពិនិត្យរួច',
    'hero.statFulfillment': 'អត្រាដឹកជញ្ជូនជោគជ័យ',
    'hero.badgeCertified': 'បញ្ជាក់គុណភាពដោយ JomnenhKH-Shop',
    'hero.badgeInspected': 'ត្រួតពិនិត្យរួចរាល់ ១០០%',
    'hero.badgeDirect': 'ផ្ទាល់ពីដៃអ្នកផលិត',
    'hero.badgeWholesale': 'តម្លៃបោះដុំពីរោងចក្រ',

    // Featured Stores
    'stores.heading': 'ហាងល្បីៗគួរស្គាល់',
    'stores.subtitle': 'ស្គាល់ពីអ្នកផលិតនៅពីក្រោយផលិតផលល្អៗបន្ទាប់របស់អ្នក។',
    'stores.explore': 'រុករកហាងទាំងអស់',
    'stores.productsSuffix': 'ផលិតផល',

    // Store names & descriptions
    'store.homestyle.category': 'ការតុបតែងផ្ទះ',
    'store.homestyle.desc': 'កុលាលភាជន៍ និងថូផ្កាធ្វើដោយដៃ ព្រមទាំងគ្រឿងតុបតែងផ្ទះបែបតិចនិកទំនើបពីដីឥដ្ឋធម្មជាតិ។',
    'store.trendwear.category': 'សម្លៀកបំពាក់',
    'store.trendwear.desc': 'សម្លៀកបំពាក់កប្បាសសរីរាង្គទន់ស្រួលពាក់ និងក្រណាត់ទេសឯកធម្មជាតិសម្រាប់មនុស្សគ្រប់រូប។',
    'store.officepro.category': 'កន្លែងធ្វើការ',
    'store.officepro.desc': 'គ្រឿងបន្ថែមលើតុធ្វើការ ការពារសុខភាពឆ្អឹងខ្នង ជើងទ្រកុំព្យូទ័រឈើ និងរុក្ខជាតិលម្អបង្កើនការផ្តោតអារម្មណ៍។',
    'store.comfort.category': 'ការរស់នៅសុខស្រួល',
    'store.comfort.desc': 'ភួយរោមចៀមទន់កក់ក្តៅ ខ្នើយសាឡុងពណ៌បៃតង និងកម្រាលព្រំធ្វើដោយដៃដើម្បីបន្ថែមភាពកក់ក្តៅដល់គេហដ្ឋាន។',
    'store.daily.category': 'សម្ភារៈផ្ទះបាយ',
    'store.daily.desc': 'កែវកាហ្វេ និងថូផ្កាធ្វើដោយដៃសម្រាប់បន្ថែមភាពស្រស់បំព្រងក្នុងជីវិតរស់នៅប្រចាំថ្ងៃ។',

    // Store Modal
    'modal.verifiedMaker': 'អ្នកផលិតបានផ្ទៀងផ្ទាត់',
    'modal.aboutSupplier': 'អំពីអ្នកផ្គត់ផ្គង់នេះ',
    'modal.leadTime': 'រយៈពេលរៀបចំ',
    'modal.leadTimeVal': '២–៤ ថ្ងៃ',
    'modal.positiveReviews': 'ការវាយតម្លៃវិជ្ជមាន',
    'modal.lowMoq': 'ការបញ្ជាទិញអប្បបរមា',
    'modal.lowMoqVal': 'ចាប់ពី ៥ គ្រឿងឡើង',
    'modal.popularItems': 'ទំនិញពេញនិយម',
    'modal.close': 'បិទ',
    'modal.exploreStore': 'ស្វែងរកទំនិញរបស់ហាងនេះ',

    // Search
    'search.suggested': 'លទ្ធផលដែលត្រូវគ្នា',
    'search.popular': 'ពាក្យស្វែងរកពេញនិយមក្នុងទីផ្សារ',
    'search.pressEnter': 'ចុច Enter ដើម្បីស្វែងរក',

    // Products page
    'products.title': 'ផលិតផល និងគ្រឿងបន្លាស់',
    'products.addNew': 'បន្ថែមផលិតផលថ្មី',
    'products.searchPlaceholder': 'ស្វែងរកតាមឈ្មោះ ឬលក្ខណៈពិសេស...',
    'products.allCategories': 'ប្រភេទទាំងអស់',
    'products.inStock': 'ក្នុងស្តុក',
    'products.backorder': 'អស់ពីស្តុក',
    'products.addToCart': 'ដាក់ក្នុងកន្ត្រក',
    'products.added': 'បានបញ្ចូលក្នុងកន្ត្រក',
    'products.contactTelegram': 'ទាក់ទងតាម Telegram',
    'products.viewDetails': 'មើលលម្អិត',
    'products.noProducts': 'រកមិនឃើញផលិតផលឡើយ។',

    // Services page
    'services.title': 'សេវាកម្មសូហ្វវែរ និង Cloud',
    'services.subtitle': 'វិស្វកម្មសូហ្វវែរ ប្រព័ន្ធគេហទំព័រ និងកម្មវិធីទូរស័ព្ទកម្រិតខ្ពស់សម្រាប់អាជីវកម្មរីកចម្រើន។',
    'services.portfolio': 'គម្រោងការងារលេចធ្លោ',
    'services.inquiryTitle': 'ស្នើសុំការប្រឹក្សា និងតម្លៃគម្រោង',
    'services.inquirySubtitle': 'ទំនាក់ទំនងផ្ទាល់ជាមួយក្រុមវិស្វករ និងស្ថាបត្យករប្រព័ន្ធចម្បងរបស់យើង។',
    'services.submitBtn': 'ផ្ញើសំណើពិគ្រោះយោបល់',

    // About Us page
    'about.title': 'ក្រុមវិស្វករប្រព័ន្ធ និងស្ថាបត្យកម្ម',
    'about.subtitle': 'ស្គាល់ពីវិស្វករ និងអ្នករចនាប្រព័ន្ធនៅពីក្រោយ Jomnenh-KH។',
    'about.leadArchitect': 'ស្ថាបត្យករចម្បង',
    'about.uiEngineer': 'វិស្វករ UI',
    'about.cloudInfra': 'វិស្វករ Cloud',

    // Footer
    'footer.tagline': 'សេវាកម្មផ្នែករឹង និងសូហ្វវែរ · រាជធានីភ្នំពេញ កម្ពុជា។',
    'footer.location': 'រាជធានីភ្នំពេញ កម្ពុជា',
    'footer.marketplace': 'ទីផ្សារទំនិញ',
    'footer.allProducts': 'ផលិតផលទាំងអស់',
    'footer.featuredStores': 'ហាងលេចធ្លោ',
    'footer.shoppingCart': 'កន្ត្រកទំនិញ',
    'footer.services': 'សេវាកម្ម',
    'footer.softwareServices': 'សេវាកម្មសូហ្វវែរ',
    'footer.contactUs': 'ទំនាក់ទំនងពួកយើង',
    'footer.company': 'ក្រុមហ៊ុន',
    'footer.aboutUs': 'អំពីយើង',
    'footer.myAccount': 'គណនីរបស់ខ្ញុំ',
    'footer.copyright': '© ២០២៦ Jomnenh-KH · រក្សាសិទ្ធិគ្រប់យ៉ាង។',
    'footer.buyerProtection': 'ធានាសុវត្ថិភាពការទូទាត់ និងការពារអ្នកទិញ ១០០%',
  },

  FR: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.browseProducts': 'Parcourir les produits',
    'nav.products': 'Produits',
    'nav.manage': 'Gérer',
    'nav.services': 'Services',
    'nav.aboutUs': 'À propos',
    'nav.exploreStores': 'Explorer les boutiques',
    'nav.categories': 'Catégories',
    'nav.getStarted': 'Commencer',
    'nav.signIn': 'Connexion',
    'nav.cart': 'Panier d’achat',
    'nav.accountSettings': 'Paramètres du compte',
    'nav.adminDashboard': 'Tableau de bord Admin',
    'nav.deployProduct': 'Déployer un produit (Client)',
    'nav.signOut': 'Déconnexion',
    'nav.searchPlaceholder': 'Rechercher des produits ou fournisseurs...',
    'nav.allCategories': 'Voir les 24+ catégories du marché',
    'nav.switchBack': 'Retour à la boutique Tech',
    'nav.viewMarketplace': 'Vue Marketplace Moderne JomnenhKH-Shop',
    'nav.alternateBadge': 'Page d’accueil alternative',
    'nav.selectLanguage': 'Choisir la langue',

    // Categories
    'cat.home': 'Maison & Décoration',
    'cat.homeCount': '450+ articles',
    'cat.apparel': 'Vêtements & Textiles',
    'cat.apparelCount': '320+ articles',
    'cat.office': 'Bureau & Tech',
    'cat.officeCount': '180+ articles',
    'cat.furniture': 'Meubles & Déco',
    'cat.furnitureCount': '210+ articles',
    'cat.ceramics': 'Céramiques & Arts de la table',
    'cat.ceramicsCount': '140+ articles',

    // Hero Section
    'hero.tag': 'Marché B2B et Vente Directe Moderne',
    'hero.heading1': 'Achetez plus intelligemment.',
    'hero.heading2': 'Grandissez W ensemble.',
    'hero.description': 'Produits de gros. Fournisseurs indépendants. De nouvelles possibilités pour votre entreprise.',
    'hero.cta': 'Explorer les produits',
    'hero.secondaryCta': 'Voir les boutiques à la une',
    'hero.statMakers': 'Artisans indépendants',
    'hero.statProducts': 'Produits vérifiés',
    'hero.statFulfillment': 'Taux d’expédition',
    'hero.badgeCertified': 'Certifié JomnenhKH-Shop',
    'hero.badgeInspected': 'Qualité vérifiée',
    'hero.badgeDirect': 'Directement des créateurs',
    'hero.badgeWholesale': 'Prix de gros',

    // Featured Stores
    'stores.heading': 'Des boutiques à découvrir',
    'stores.subtitle': 'Rencontrez les créateurs derrière votre prochaine trouvaille.',
    'stores.explore': 'Explorer les boutiques',
    'stores.productsSuffix': 'produits',

    // Store names & descriptions
    'store.homestyle.category': 'Décoration',
    'store.homestyle.desc': 'Céramiques sur mesure, vases en grès et accessoires minimalistes en argile nordique naturelle.',
    'store.trendwear.category': 'Mode',
    'store.trendwear.desc': 'Vêtements unisexes éco-responsables, basiques en coton biologique et pièces décontractées en lin.',
    'store.officepro.category': 'Espace de travail',
    'store.officepro.desc': 'Accessoires ergonomiques de bureau, supports d’ordinateur en noyer massif et touches végétales.',
    'store.comfort.category': 'Salon & Confort',
    'store.comfort.desc': 'Plaids en laine douce, coussins vert sauge et textiles conçus pour apaiser votre espace.',
    'store.daily.category': 'Arts de la table',
    'store.daily.desc': 'Essentiels du quotidien, tasses à espresso mates et récipients sculpturaux faits à la main.',

    // Store Modal
    'modal.verifiedMaker': 'Créateur vérifié',
    'modal.aboutSupplier': 'À propos du fournisseur',
    'modal.leadTime': 'Délai moyen',
    'modal.leadTimeVal': '2–4 Jours',
    'modal.positiveReviews': 'Avis positifs',
    'modal.lowMoq': 'Commande min.',
    'modal.lowMoqVal': 'Dès 5 unités',
    'modal.popularItems': 'Articles populaires',
    'modal.close': 'Fermer',
    'modal.exploreStore': 'Voir les produits de la boutique',

    // Search
    'search.suggested': 'Suggestions',
    'search.popular': 'Recherches populaires',
    'search.pressEnter': 'Appuyez sur Entrée pour rechercher',

    // Products page
    'products.title': 'Produits et Matériel',
    'products.addNew': 'Ajouter un produit',
    'products.searchPlaceholder': 'Rechercher par nom, spécification...',
    'products.allCategories': 'Toutes catégories',
    'products.inStock': 'en stock',
    'products.backorder': 'Rupture',
    'products.addToCart': 'Ajouter au panier',
    'products.added': 'Ajouté !',
    'products.contactTelegram': 'Contacter via Telegram',
    'products.viewDetails': 'Voir détails',
    'products.noProducts': 'Aucun produit trouvé.',

    // Services page
    'services.title': 'Services Logiciels et Cloud',
    'services.subtitle': 'Ingénierie à fort impact, systèmes web et architectures mobiles conçues pour évoluer.',
    'services.portfolio': 'Portfolio de réalisations',
    'services.inquiryTitle': 'Demande de devis d’ingénierie',
    'services.inquirySubtitle': 'Contact direct avec notre équipe d’architectes full-stack.',
    'services.submitBtn': 'Envoyer la demande',

    // About Us page
    'about.title': 'Équipe d’ingénierie et architecture',
    'about.subtitle': 'Rencontrez les ingénieurs et concepteurs de systèmes derrière Jomnenh-KH.',
    'about.leadArchitect': 'Architecte principal',
    'about.uiEngineer': 'Ingénieur UI',
    'about.cloudInfra': 'Infrastructure Cloud',

    // Footer
    'footer.tagline': 'Services informatiques et matériels · Phnom Penh, Cambodge.',
    'footer.location': 'Phnom Penh, Cambodge',
    'footer.marketplace': 'Marché',
    'footer.allProducts': 'Tous les produits',
    'footer.featuredStores': 'Boutiques à la une',
    'footer.shoppingCart': 'Panier d’achat',
    'footer.services': 'Services',
    'footer.softwareServices': 'Services logiciels',
    'footer.contactUs': 'Contactez-nous',
    'footer.company': 'Entreprise',
    'footer.aboutUs': 'À propos de nous',
    'footer.myAccount': 'Mon compte',
    'footer.copyright': '© 2026 Jomnenh-KH · Tous droits réservés.',
    'footer.buyerProtection': 'Garantie de protection de l’acheteur',
  },

  ES: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.browseProducts': 'Explorar Productos',
    'nav.products': 'Productos',
    'nav.manage': 'Gestionar',
    'nav.services': 'Servicios',
    'nav.aboutUs': 'Sobre nosotros',
    'nav.exploreStores': 'Explorar Tiendas',
    'nav.categories': 'Categorías',
    'nav.getStarted': 'Comenzar',
    'nav.signIn': 'Iniciar sesión',
    'nav.cart': 'Carrito de compras',
    'nav.accountSettings': 'Ajustes de cuenta',
    'nav.adminDashboard': 'Panel de Admin',
    'nav.deployProduct': 'Desplegar producto (Cliente)',
    'nav.signOut': 'Cerrar sesión',
    'nav.searchPlaceholder': 'Buscar productos o proveedores...',
    'nav.allCategories': 'Ver las más de 24 categorías',
    'nav.switchBack': 'Volver a la tienda Tech',
    'nav.viewMarketplace': 'Vista Marketplace Moderno JomnenhKH-Shop',
    'nav.alternateBadge': 'Página de inicio alternativa',
    'nav.selectLanguage': 'Seleccionar idioma',

    // Categories
    'cat.home': 'Hogar y Decoración',
    'cat.homeCount': '450+ artículos',
    'cat.apparel': 'Ropa y Textiles',
    'cat.apparelCount': '320+ artículos',
    'cat.office': 'Oficina y Tecnología',
    'cat.officeCount': '180+ artículos',
    'cat.furniture': 'Muebles y Decoración',
    'cat.furnitureCount': '210+ artículos',
    'cat.ceramics': 'Cerámica y Vajilla',
    'cat.ceramicsCount': '140+ artículos',

    // Hero Section
    'hero.tag': 'Mercado B2B y Venta Directa Moderna',
    'hero.heading1': 'Abastécete mejor.',
    'hero.heading2': 'Crece W juntos.',
    'hero.description': 'Productos al por mayor. Proveedores independientes. Nuevas oportunidades para tu negocio.',
    'hero.cta': 'Explorar Productos',
    'hero.secondaryCta': 'Ver tiendas destacadas',
    'hero.statMakers': 'Creadores independientes',
    'hero.statProducts': 'Productos inspeccionados',
    'hero.statFulfillment': 'Tasa de cumplimiento',
    'hero.badgeCertified': 'Certificado JomnenhKH-Shop',
    'hero.badgeInspected': 'Calidad comprobada',
    'hero.badgeDirect': 'Directo de los fabricantes',
    'hero.badgeWholesale': 'Precios de mayorista',

    // Featured Stores
    'stores.heading': 'Tiendas que vale la pena conocer',
    'stores.subtitle': 'Conoce a las personas detrás de tu próximo gran hallazgo.',
    'stores.explore': 'Explorar tiendas',
    'stores.productsSuffix': 'productos',

    // Store names & descriptions
    'store.homestyle.category': 'Hogar',
    'store.homestyle.desc': 'Cerámica artesanal, jarrones esculpidos y accesorios minimalistas de arcilla nórdica natural.',
    'store.trendwear.category': 'Moda',
    'store.trendwear.desc': 'Prendas unisex sostenibles, básicos de algodón orgánico y ropa cómoda de lino.',
    'store.officepro.category': 'Espacio de trabajo',
    'store.officepro.desc': 'Accesorios ergonómicos de oficina, soportes de nogal para portátiles y toques botánicos.',
    'store.comfort.category': 'Comodidad',
    'store.comfort.desc': 'Mantas de lana suaves, cojines verde salvia y textiles para llenar de calidez tu hogar.',
    'store.daily.category': 'Vajilla',
    'store.daily.desc': 'Artículos esenciales para tus rituales diarios, tazas de café y piezas escultóricas hechas a mano.',

    // Store Modal
    'modal.verifiedMaker': 'Fabricante verificado',
    'modal.aboutSupplier': 'Acerca del proveedor',
    'modal.leadTime': 'Tiempo de preparación',
    'modal.leadTimeVal': '2–4 Días',
    'modal.positiveReviews': 'Reseñas positivas',
    'modal.lowMoq': 'Pedido mínimo bajo',
    'modal.lowMoqVal': 'Desde 5 unidades',
    'modal.popularItems': 'Artículos populares',
    'modal.close': 'Cerrar',
    'modal.exploreStore': 'Ver productos de esta tienda',

    // Search
    'search.suggested': 'Sugerencias',
    'search.popular': 'Búsquedas populares',
    'search.pressEnter': 'Presiona Enter para buscar',

    // Products page
    'products.title': 'Productos y Hardware',
    'products.addNew': 'Añadir nuevo producto',
    'products.searchPlaceholder': 'Buscar por nombre, especificación...',
    'products.allCategories': 'Todas las categorías',
    'products.inStock': 'en stock',
    'products.backorder': 'Agotado',
    'products.addToCart': 'Añadir al carrito',
    'products.added': '¡Añadido!',
    'products.contactTelegram': 'Contactar por Telegram',
    'products.viewDetails': 'Ver detalles',
    'products.noProducts': 'No se encontraron productos.',

    // Services page
    'services.title': 'Servicios de Software y Cloud',
    'services.subtitle': 'Ingeniería de alto impacto, sistemas web y arquitecturas móviles diseñadas para escalar.',
    'services.portfolio': 'Portafolio de proyectos',
    'services.inquiryTitle': 'Solicitud de presupuesto de ingeniería',
    'services.inquirySubtitle': 'Consulta directa con nuestro equipo de arquitectos full-stack.',
    'services.submitBtn': 'Enviar solicitud',

    // About Us page
    'about.title': 'Equipo de Ingeniería y Arquitectura',
    'about.subtitle': 'Conoce a los ingenieros y diseñadores de sistemas detrás de Jomnenh-KH.',
    'about.leadArchitect': 'Arquitecto Principal',
    'about.uiEngineer': 'Ingeniero de UI',
    'about.cloudInfra': 'Infraestructura Cloud',

    // Footer
    'footer.tagline': 'Servicios de hardware y software · Phnom Penh, Camboya.',
    'footer.location': 'Phnom Penh, Camboya',
    'footer.marketplace': 'Mercado',
    'footer.allProducts': 'Todos los productos',
    'footer.featuredStores': 'Tiendas destacadas',
    'footer.shoppingCart': 'Carrito de compras',
    'footer.services': 'Servicios',
    'footer.softwareServices': 'Servicios de software',
    'footer.contactUs': 'Contáctanos',
    'footer.company': 'Empresa',
    'footer.aboutUs': 'Sobre nosotros',
    'footer.myAccount': 'Mi cuenta',
    'footer.copyright': '© 2026 Jomnenh-KH · Todos los derechos reservados.',
    'footer.buyerProtection': 'Protección al comprador garantizada',
  },

  ZH: {
    // Navigation
    'nav.home': '首页',
    'nav.browseProducts': '浏览商品',
    'nav.products': '商品',
    'nav.manage': '管理',
    'nav.services': '服务',
    'nav.aboutUs': '关于我们',
    'nav.exploreStores': '探索店铺',
    'nav.categories': '全部分类',
    'nav.getStarted': '立即开启',
    'nav.signIn': '登录',
    'nav.cart': '购物车',
    'nav.accountSettings': '账户设置',
    'nav.adminDashboard': '管理后台',
    'nav.deployProduct': '发布商品 (客户)',
    'nav.signOut': '退出登录',
    'nav.searchPlaceholder': '搜索优质商品或源头供应商...',
    'nav.allCategories': '查看全市场 24+ 精选分类',
    'nav.switchBack': '返回原科技商城',
    'nav.viewMarketplace': 'JomnenhKH-Shop 现代批发集市',
    'nav.alternateBadge': '备用精选主页',
    'nav.selectLanguage': '选择语言',

    // Categories
    'cat.home': '家居生活',
    'cat.homeCount': '450+ 款好物',
    'cat.apparel': '服饰与棉麻',
    'cat.apparelCount': '320+ 款好物',
    'cat.office': '办公与科技',
    'cat.officeCount': '180+ 款好物',
    'cat.furniture': '家具与陈设',
    'cat.furnitureCount': '210+ 款好物',
    'cat.ceramics': '陶瓷与器皿',
    'cat.ceramicsCount': '140+ 款好物',

    // Hero Section
    'hero.tag': '现代化 B2B 独立源头批发集市',
    'hero.heading1': '精明采购，智选源头。',
    'hero.heading2': '共赢共创 W 卓越未来。',
    'hero.description': '优质批发货源。独立原创供应商。为您的商业版图开启无限崭新可能。',
    'hero.cta': '即刻探索商品',
    'hero.secondaryCta': '浏览精选名店',
    'hero.statMakers': '认证独立手作人',
    'hero.statProducts': '严选质检商品',
    'hero.statFulfillment': '准时履约交付率',
    'hero.badgeCertified': 'JomnenhKH-Shop 官方认证',
    'hero.badgeInspected': '100% 严格质检',
    'hero.badgeDirect': '工厂源头直供',
    'hero.badgeWholesale': '一手批发底价',

    // Featured Stores
    'stores.heading': '值得关注的宝藏店铺',
    'stores.subtitle': '走近匠心工坊，发现令人心动的源头佳品。',
    'stores.explore': '探索所有店铺',
    'stores.productsSuffix': '款商品',

    // Store names & descriptions
    'store.homestyle.category': '家居饰品',
    'store.homestyle.desc': '北欧原矿陶土手作陶瓷、极简花器与自然生活雅物。',
    'store.trendwear.category': '服饰生活',
    'store.trendwear.desc': '环保有机棉质基本款，天然亚麻轻松自在的剪裁穿着。',
    'store.officepro.category': '工作空间',
    'store.officepro.desc': '胡桃木笔记本支架、人体工学桌垫与绿植美学办公配件。',
    'store.comfort.category': '舒适生活',
    'store.comfort.desc': '亲肤羊毛毯、鼠尾草绿抱枕与温馨空间织物。',
    'store.daily.category': '日常器皿',
    'store.daily.desc': '哑光浓缩咖啡杯、手冲咖啡滤杯与极简餐厨艺术器皿。',

    // Store Modal
    'modal.verifiedMaker': '平台认证工坊',
    'modal.aboutSupplier': '关于该供应商',
    'modal.leadTime': '出货周期',
    'modal.leadTimeVal': '2–4 个工作日',
    'modal.positiveReviews': '买家好评率',
    'modal.lowMoq': '起订门槛',
    'modal.lowMoqVal': '低至 5 件起批',
    'modal.popularItems': '当季热销款式',
    'modal.close': '关闭',
    'modal.exploreStore': '浏览此店铺商品',

    // Search
    'search.suggested': '智能推荐搜索',
    'search.popular': '市场热门热搜词',
    'search.pressEnter': '按 Enter 开始检索',

    // Products page
    'products.title': '商品与智能硬件',
    'products.addNew': '添加新商品',
    'products.searchPlaceholder': '按名称、规格或产地搜索...',
    'products.allCategories': '全部分类',
    'products.inStock': '件现货',
    'products.backorder': '缺货补货中',
    'products.addToCart': '加入购物车',
    'products.added': '已加入！',
    'products.contactTelegram': '通过 Telegram 咨询',
    'products.viewDetails': '查看详情',
    'products.noProducts': '未找到相关商品。',

    // Services page
    'services.title': '软件与云端架构服务',
    'services.subtitle': '高并发工程、现代化 Web 系统与跨平台移动应用架构。',
    'services.portfolio': '核心工程案例展示',
    'services.inquiryTitle': '工程方案咨询与报价',
    'services.inquirySubtitle': '与我们的全栈架构师及核心工程团队直接沟通。',
    'services.submitBtn': '提交咨询',

    // About Us page
    'about.title': '核心工程团队与技术架构',
    'about.subtitle': '认识打造 Jomnenh-KH 平台的资深工程师与系统架构师。',
    'about.leadArchitect': '全栈首席架构师',
    'about.uiEngineer': 'UI系统工程师',
    'about.cloudInfra': '云基础设施工程师',

    // Footer
    'footer.tagline': '硬件与软件专业服务 · 柬埔寨金边。',
    'footer.location': '柬埔寨金边',
    'footer.marketplace': '批发集市',
    'footer.allProducts': '所有商品',
    'footer.featuredStores': '名店推荐',
    'footer.shoppingCart': '购物车',
    'footer.services': '服务',
    'footer.softwareServices': '软件定制服务',
    'footer.contactUs': '联系我们',
    'footer.company': '公司',
    'footer.aboutUs': '关于我们',
    'footer.myAccount': '我的账户',
    'footer.copyright': '© 2026 Jomnenh-KH · 保留所有权利。',
    'footer.buyerProtection': '官方交易资金安全保障',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'EN';
  });

  const setLanguage = (langCode) => {
    const valid = TRANSLATIONS[langCode] ? langCode : 'EN';
    setLanguageState(valid);
    localStorage.setItem('app_language', valid);
    document.documentElement.lang = valid.toLowerCase();
  };

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.EN;
    return dict[key] || TRANSLATIONS.EN[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'EN',
      setLanguage: () => {},
      t: (key, fallback = '') => TRANSLATIONS.EN[key] || fallback || key,
    };
  }
  return context;
};
