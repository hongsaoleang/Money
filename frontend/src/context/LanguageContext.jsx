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
    'nav.searchPlaceholder': 'Search products or suppliers...',
    'nav.allCategories': 'View All 24+ Marketplace Categories',
    'nav.switchBack': 'Back to Tech Store Home',
    'nav.viewMarketplace': 'JomnenhKH-Shop Modern Marketplace View',
    'nav.alternateBadge': 'Alternate Homepage',

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

    // Footer
    'footer.tagline': 'The premier independent maker & wholesale marketplace.',
    'footer.marketplace': 'Marketplace',
    'footer.allProducts': 'All Products',
    'footer.featuredStores': 'Featured Stores',
    'footer.suppliers': 'Suppliers',
    'footer.applyMaker': 'Apply as Maker',
    'footer.wholesaleStandards': 'Wholesale Standards',
    'footer.logistics': 'Logistics Support',
    'footer.platform': 'Platform',
    'footer.switchToTech': 'Switch to Tech Store',
    'footer.about': 'About Jomnenh-KH',
    'footer.account': 'Account & Orders',
    'footer.copyright': '© 2026 JomnenhKH-Shop Marketplace · Independent Suppliers Worldwide.',
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
    'nav.searchPlaceholder': 'ស្វែងរកផលិតផល ឬអ្នកផ្គត់ផ្គង់...',
    'nav.allCategories': 'មើលប្រភេទទាំងអស់ ២៤+ ក្នុងទីផ្សារ',
    'nav.switchBack': 'ត្រឡប់ទៅហាងបច្ចេកវិទ្យាដើម',
    'nav.viewMarketplace': 'ទិដ្ឋភាពទីផ្សារទំនិញទំនើប JomnenhKH-Shop',
    'nav.alternateBadge': 'ទំព័រដើម',

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

    // Footer
    'footer.tagline': 'ទីផ្សារទំនិញបោះដុំ និងអ្នកផលិតឯករាជ្យឈានមុខគេ។',
    'footer.marketplace': 'ទីផ្សារទំនិញ',
    'footer.allProducts': 'ផលិតផលទាំងអស់',
    'footer.featuredStores': 'ហាងលេចធ្លោ',
    'footer.suppliers': 'អ្នកផ្គត់ផ្គង់',
    'footer.applyMaker': 'ចុះឈ្មោះជាអ្នកផលិត',
    'footer.wholesaleStandards': 'ស្តង់ដារបោះដុំ',
    'footer.logistics': 'សេវាភស្តុភារកម្ម',
    'footer.platform': 'វេទិកា',
    'footer.switchToTech': 'ត្រឡប់ទៅហាងបច្ចេកវិទ្យា',
    'footer.about': 'អំពី Jomnenh-KH',
    'footer.account': 'គណនី និងការបញ្ជាទិញ',
    'footer.copyright': '© ២០២៦ JomnenhKH-Shop Marketplace · អ្នកផ្គត់ផ្គង់ឯករាជ្យជុំវិញពិភពលោក។',
    'footer.buyerProtection': 'ធានាសុវត្ថិភាពការទូទាត់ និងការពារអ្នកទិញ ១០០%',
  },

  FR: {
    'nav.browseProducts': 'Parcourir les produits',
    'nav.exploreStores': 'Explorer les boutiques',
    'nav.categories': 'Catégories',
    'nav.getStarted': 'Commencer',
    'nav.searchPlaceholder': 'Rechercher des produits ou fournisseurs...',
    'nav.allCategories': 'Voir les 24+ catégories du marché',
    'nav.switchBack': 'Retour à la boutique Tech',
    'nav.viewMarketplace': 'Vue Marketplace Moderne JomnenhKH-Shop',
    'nav.alternateBadge': 'Page d’accueil alternative',

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

    'stores.heading': 'Des boutiques à découvrir',
    'stores.subtitle': 'Rencontrez les créateurs derrière votre prochaine trouvaille.',
    'stores.explore': 'Explorer les boutiques',
    'stores.productsSuffix': 'produits',

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

    'search.suggested': 'Suggestions',
    'search.popular': 'Recherches populaires',
    'search.pressEnter': 'Appuyez sur Entrée pour rechercher',

    'footer.tagline': 'La première place de marché pour artisans indépendants et grossistes.',
    'footer.marketplace': 'Marché',
    'footer.allProducts': 'Tous les produits',
    'footer.featuredStores': 'Boutiques à la une',
    'footer.suppliers': 'Fournisseurs',
    'footer.applyMaker': 'Devenir créateur',
    'footer.wholesaleStandards': 'Standards de vente de gros',
    'footer.logistics': 'Assistance logistique',
    'footer.platform': 'Plateforme',
    'footer.switchToTech': 'Basculer vers la boutique Tech',
    'footer.about': 'À propos de Jomnenh-KH',
    'footer.account': 'Compte & Commandes',
    'footer.copyright': '© 2026 JomnenhKH-Shop Marketplace · Fournisseurs indépendants du monde entier.',
    'footer.buyerProtection': 'Garantie de protection de l’acheteur',
  },

  ES: {
    'nav.browseProducts': 'Explorar Productos',
    'nav.exploreStores': 'Explorar Tiendas',
    'nav.categories': 'Categorías',
    'nav.getStarted': 'Comenzar',
    'nav.searchPlaceholder': 'Buscar productos o proveedores...',
    'nav.allCategories': 'Ver las más de 24 categorías',
    'nav.switchBack': 'Volver a la tienda Tech',
    'nav.viewMarketplace': 'Vista Marketplace Moderno JomnenhKH-Shop',
    'nav.alternateBadge': 'Página de inicio alternativa',

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

    'stores.heading': 'Tiendas que vale la pena conocer',
    'stores.subtitle': 'Conoce a las personas detrás de tu próximo gran hallazgo.',
    'stores.explore': 'Explorar tiendas',
    'stores.productsSuffix': 'productos',

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

    'search.suggested': 'Sugerencias',
    'search.popular': 'Búsquedas populares',
    'search.pressEnter': 'Presiona Enter para buscar',

    'footer.tagline': 'El mercado líder para artesanos independientes y venta al por mayor.',
    'footer.marketplace': 'Mercado',
    'footer.allProducts': 'Todos los productos',
    'footer.featuredStores': 'Tiendas destacadas',
    'footer.suppliers': 'Proveedores',
    'footer.applyMaker': 'Registrarse como creador',
    'footer.wholesaleStandards': 'Estándares de mayorista',
    'footer.logistics': 'Soporte logístico',
    'footer.platform': 'Plataforma',
    'footer.switchToTech': 'Volver a la tienda Tech',
    'footer.about': 'Acerca de Jomnenh-KH',
    'footer.account': 'Cuenta y Pedidos',
    'footer.copyright': '© 2026 JomnenhKH-Shop Marketplace · Proveedores independientes de todo el mundo.',
    'footer.buyerProtection': 'Protección al comprador garantizada',
  },

  ZH: {
    'nav.browseProducts': '浏览商品',
    'nav.exploreStores': '探索店铺',
    'nav.categories': '全部分类',
    'nav.getStarted': '立即开启',
    'nav.searchPlaceholder': '搜索优质商品或源头供应商...',
    'nav.allCategories': '查看全市场 24+ 精选分类',
    'nav.switchBack': '返回原科技商城',
    'nav.viewMarketplace': 'JomnenhKH-Shop 现代批发集市',
    'nav.alternateBadge': '备用精选主页',

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

    'stores.heading': '值得关注的宝藏店铺',
    'stores.subtitle': '走近匠心工坊，发现令人心动的源头佳品。',
    'stores.explore': '探索所有店铺',
    'stores.productsSuffix': '款商品',

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

    'search.suggested': '智能推荐搜索',
    'search.popular': '市场热门热搜词',
    'search.pressEnter': '按 Enter 开始检索',

    'footer.tagline': '值得信赖的独立匠人与现代商业批发集市。',
    'footer.marketplace': '批发集市',
    'footer.allProducts': '所有商品',
    'footer.featuredStores': '名店推荐',
    'footer.suppliers': '供应商',
    'footer.applyMaker': '入驻成为供应商',
    'footer.wholesaleStandards': '批发服务标准',
    'footer.logistics': '全球物流支持',
    'footer.platform': '平台支持',
    'footer.switchToTech': '切回原科技商城',
    'footer.about': '关于 Jomnenh-KH',
    'footer.account': '我的账户与订单',
    'footer.copyright': '© 2026 JomnenhKH-Shop Marketplace · 全球独立原创供应商精选。',
    'footer.buyerProtection': '官方交易资金安全保障',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'KH';
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
    // Graceful fallback if used outside provider
    return {
      language: 'EN',
      setLanguage: () => {},
      t: (key, fallback = '') => TRANSLATIONS.EN[key] || fallback || key,
    };
  }
  return context;
};
