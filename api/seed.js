require('dotenv').config({ path: '../docker/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import des modèles
const User = require('./models/user');
const Category = require('./models/category');
const Component = require('./models/component');
const Partner = require('./models/partner');
const PartnerPrice = require('./models/partnerPrice');
const Configuration = require('./models/configuration');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

// Données de seed
const seedData = async () => {
  try {
    // Nettoyer la base de données
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Component.deleteMany({});
    await Partner.deleteMany({});
    await PartnerPrice.deleteMany({});
    await Configuration.deleteMany({});

    // 1. Créer les utilisateurs
    console.log('👤 Création des utilisateurs...');
    const hashedPassword_admin = await bcrypt.hash('password123', 10);
    const hashedPassword_jeana = await bcrypt.hash('jeana', 10);
    const hashedPassword_marie = await bcrypt.hash('marie', 10);
    const users = await User.insertMany([
      {
        firstName: 'Admin',
        lastName: 'System',
        role: 'admin',
        email: 'admin@configpc.fr',
        password: hashedPassword_admin,
      },
      {
        firstName: 'Jeana',
        lastName: 'Dupont',
        email: 'jeana.dupont@example.com',
        password: hashedPassword_jeana,
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        password: hashedPassword_marie,
      },
    ]);
    console.log(`   ✓ ${users.length} utilisateurs créés`);

    // 2. Créer les catégories
    console.log('📁 Création des catégories...');
    const categories = await Category.insertMany([
      { name: 'CPU', description: 'Processeurs' },
      { name: 'GPU', description: 'Cartes graphiques' },
      { name: 'RAM', description: 'Mémoire vive' },
      { name: 'Carte Mère', description: 'Cartes mères' },
      { name: 'SSD', description: 'Stockage SSD' },
      { name: 'HDD', description: 'Disques durs' },
      { name: 'Alimentation', description: 'Blocs d\'alimentation' },
      { name: 'Boîtier', description: 'Boîtiers PC' },
      { name: 'Refroidissement', description: 'Systèmes de refroidissement' },
    ]);
    console.log(`   ✓ ${categories.length} catégories créées`);

    // Map des catégories par nom
    const categoryMap = {};
    categories.forEach(cat => categoryMap[cat.name] = cat._id);

    // 3. Créer les partenaires
    console.log('🏪 Création des partenaires...');
    const partners = await Partner.insertMany([
      {
        name: 'Amazon',
        url: 'https://www.amazon.fr',
        description: 'Le plus grand marketplace en ligne',
        contactEmail: 'partner@amazon.fr',
        priceSync: { enabled: true, lastSync: new Date() },
      },
      {
        name: 'LDLC',
        url: 'https://www.ldlc.com',
        description: 'Spécialiste français du matériel informatique',
        contactEmail: 'partner@ldlc.com',
        priceSync: { enabled: true, lastSync: new Date() },
      },
      {
        name: 'Materiel.net',
        url: 'https://www.materiel.net',
        description: 'Expert en composants PC',
        contactEmail: 'partner@materiel.net',
        priceSync: { enabled: true, lastSync: new Date() },
      },
      {
        name: 'TopAchat',
        url: 'https://www.topachat.com',
        description: 'Vente de matériel informatique',
        contactEmail: 'partner@topachat.com',
        priceSync: { enabled: false },
      },
    ]);
    console.log(`   ✓ ${partners.length} partenaires créés`);

    // Map des partenaires par nom
    const partnerMap = {};
    partners.forEach(p => partnerMap[p.name] = p._id);

    // 4. Créer les composants
    console.log('🔧 Création des composants...');
    const components = await Component.insertMany([
      // CPUs
      {
        title: 'AMD Ryzen 9 7950X',
        description: 'Processeur 16 cœurs / 32 threads',
        brand: 'AMD',
        model: 'Ryzen 9 7950X',
        category: categoryMap['CPU'],
        specifications: new Map([
          ['Cœurs', '16'],
          ['Threads', '32'],
          ['Fréquence Base', '4.5 GHz'],
          ['Fréquence Boost', '5.7 GHz'],
          ['TDP', '170W'],
          ['Socket', 'AM5'],
        ]),
        basePrice: 549,
        inStock: true,
      },
      {
        title: 'Intel Core i9-14900K',
        description: 'Processeur 24 cœurs / 32 threads',
        brand: 'Intel',
        model: 'Core i9-14900K',
        category: categoryMap['CPU'],
        specifications: new Map([
          ['Cœurs', '24'],
          ['Threads', '32'],
          ['Fréquence Base', '3.2 GHz'],
          ['Fréquence Boost', '6.0 GHz'],
          ['TDP', '125W'],
          ['Socket', 'LGA1700'],
        ]),
        basePrice: 589,
        inStock: true,
      },
      {
        title: 'AMD Ryzen 5 7600X',
        description: 'Processeur 6 cœurs / 12 threads',
        brand: 'AMD',
        model: 'Ryzen 5 7600X',
        category: categoryMap['CPU'],
        specifications: new Map([
          ['Cœurs', '6'],
          ['Threads', '12'],
          ['Fréquence Base', '4.7 GHz'],
          ['Fréquence Boost', '5.3 GHz'],
          ['TDP', '105W'],
          ['Socket', 'AM5'],
        ]),
        basePrice: 249,
        inStock: true,
      },
      // GPUs
      {
        title: 'NVIDIA GeForce RTX 4090',
        description: 'Carte graphique haut de gamme',
        brand: 'NVIDIA',
        model: 'GeForce RTX 4090',
        category: categoryMap['GPU'],
        specifications: new Map([
          ['VRAM', '24 Go GDDR6X'],
          ['CUDA Cores', '16384'],
          ['Fréquence Boost', '2520 MHz'],
          ['TDP', '450W'],
          ['Bus', 'PCIe 4.0 x16'],
        ]),
        basePrice: 1799,
        inStock: true,
      },
      {
        title: 'AMD Radeon RX 7900 XTX',
        description: 'Carte graphique haute performance',
        brand: 'AMD',
        model: 'Radeon RX 7900 XTX',
        category: categoryMap['GPU'],
        specifications: new Map([
          ['VRAM', '24 Go GDDR6'],
          ['Stream Processors', '6144'],
          ['Fréquence Boost', '2500 MHz'],
          ['TDP', '355W'],
          ['Bus', 'PCIe 4.0 x16'],
        ]),
        basePrice: 999,
        inStock: true,
      },
      {
        title: 'NVIDIA GeForce RTX 4070',
        description: 'Carte graphique milieu de gamme',
        brand: 'NVIDIA',
        model: 'GeForce RTX 4070',
        category: categoryMap['GPU'],
        specifications: new Map([
          ['VRAM', '12 Go GDDR6X'],
          ['CUDA Cores', '5888'],
          ['Fréquence Boost', '2475 MHz'],
          ['TDP', '200W'],
        ]),
        basePrice: 599,
        inStock: true,
      },
      // RAM
      {
        title: 'Corsair Vengeance DDR5 32Go (2x16Go)',
        description: 'Kit mémoire DDR5 haute performance',
        brand: 'Corsair',
        model: 'Vengeance DDR5',
        category: categoryMap['RAM'],
        specifications: new Map([
          ['Capacité', '32 Go (2x16 Go)'],
          ['Type', 'DDR5'],
          ['Fréquence', '6000 MHz'],
          ['Latence', 'CL36'],
        ]),
        basePrice: 129,
        inStock: true,
      },
      {
        title: 'G.Skill Trident Z5 RGB 32Go (2x16Go)',
        description: 'Kit mémoire DDR5 RGB',
        brand: 'G.Skill',
        model: 'Trident Z5 RGB',
        category: categoryMap['RAM'],
        specifications: new Map([
          ['Capacité', '32 Go (2x16 Go)'],
          ['Type', 'DDR5'],
          ['Fréquence', '6400 MHz'],
          ['Latence', 'CL32'],
        ]),
        basePrice: 169,
        inStock: true,
      },
      // Cartes mères
      {
        title: 'ASUS ROG Strix X670E-E Gaming',
        description: 'Carte mère ATX pour AMD Ryzen 7000',
        brand: 'ASUS',
        model: 'ROG Strix X670E-E Gaming',
        category: categoryMap['Carte Mère'],
        specifications: new Map([
          ['Socket', 'AM5'],
          ['Chipset', 'X670E'],
          ['Format', 'ATX'],
          ['RAM Max', '128 Go DDR5'],
          ['PCIe', '5.0'],
        ]),
        basePrice: 449,
        inStock: true,
      },
      {
        title: 'MSI MAG Z790 TOMAHAWK',
        description: 'Carte mère ATX pour Intel 12/13/14e gen',
        brand: 'MSI',
        model: 'MAG Z790 TOMAHAWK',
        category: categoryMap['Carte Mère'],
        specifications: new Map([
          ['Socket', 'LGA1700'],
          ['Chipset', 'Z790'],
          ['Format', 'ATX'],
          ['RAM Max', '128 Go DDR5'],
          ['PCIe', '5.0'],
        ]),
        basePrice: 299,
        inStock: true,
      },
      // SSD
      {
        title: 'Samsung 990 Pro 2To',
        description: 'SSD NVMe PCIe 4.0 haute performance',
        brand: 'Samsung',
        model: '990 Pro',
        category: categoryMap['SSD'],
        specifications: new Map([
          ['Capacité', '2 To'],
          ['Interface', 'PCIe 4.0 NVMe'],
          ['Lecture', '7450 Mo/s'],
          ['Écriture', '6900 Mo/s'],
        ]),
        basePrice: 189,
        inStock: true,
      },
      {
        title: 'WD Black SN850X 1To',
        description: 'SSD NVMe pour gaming',
        brand: 'Western Digital',
        model: 'WD Black SN850X',
        category: categoryMap['SSD'],
        specifications: new Map([
          ['Capacité', '1 To'],
          ['Interface', 'PCIe 4.0 NVMe'],
          ['Lecture', '7300 Mo/s'],
          ['Écriture', '6300 Mo/s'],
        ]),
        basePrice: 99,
        inStock: true,
      },
      // Alimentation
      {
        title: 'Corsair RM1000x',
        description: 'Alimentation modulaire 1000W 80+ Gold',
        brand: 'Corsair',
        model: 'RM1000x',
        category: categoryMap['Alimentation'],
        specifications: new Map([
          ['Puissance', '1000W'],
          ['Certification', '80+ Gold'],
          ['Modulaire', 'Oui'],
        ]),
        basePrice: 179,
        inStock: true,
      },
      {
        title: 'be quiet! Dark Power Pro 12 850W',
        description: 'Alimentation premium silencieuse',
        brand: 'be quiet!',
        model: 'Dark Power Pro 12',
        category: categoryMap['Alimentation'],
        specifications: new Map([
          ['Puissance', '850W'],
          ['Certification', '80+ Titanium'],
          ['Modulaire', 'Oui'],
        ]),
        basePrice: 269,
        inStock: true,
      },
      // Boîtiers
      {
        title: 'NZXT H7 Flow',
        description: 'Boîtier ATX avec excellent airflow',
        brand: 'NZXT',
        model: 'H7 Flow',
        category: categoryMap['Boîtier'],
        specifications: new Map([
          ['Format', 'ATX'],
          ['Baies 3,5"', '2'],
          ['Baies 2,5"', '4'],
          ['Ventilateurs inclus', '2x 120mm'],
        ]),
        basePrice: 149,
        inStock: true,
      },
      // Refroidissement
      {
        title: 'Noctua NH-D15',
        description: 'Ventirad haut de gamme double tour',
        brand: 'Noctua',
        model: 'NH-D15',
        category: categoryMap['Refroidissement'],
        specifications: new Map([
          ['Type', 'Air'],
          ['Hauteur', '165mm'],
          ['TDP supporté', '250W'],
          ['Niveau sonore', '24.6 dB(A)'],
        ]),
        basePrice: 99,
        inStock: true,
      },
      {
        title: 'Corsair iCUE H150i Elite',
        description: 'AIO 360mm RGB',
        brand: 'Corsair',
        model: 'iCUE H150i Elite',
        category: categoryMap['Refroidissement'],
        specifications: new Map([
          ['Type', 'AIO'],
          ['Radiateur', '360mm'],
          ['Ventilateurs', '3x 120mm'],
        ]),
        basePrice: 189,
        inStock: true,
      },
    ]);
    console.log(`   ✓ ${components.length} composants créés`);

    // 5. Créer des configurations complètes
    console.log('💻 Création des configurations...');

    // Map des composants par title pour faciliter la référence
    const componentMap = {};
    components.forEach(comp => componentMap[comp.title] = comp);

    const configurations = await Configuration.insertMany([
      // Configuration 1: PC Bureautique - Entrée de gamme
      {
        user: users[2]._id, // Marie Martin
        name: 'PC Bureautique Efficace',
        description: 'Configuration idéale pour la bureautique, navigation web et travail quotidien',
        components: [
          {
            component: componentMap['AMD Ryzen 5 7600X']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 249,
            quantity: 1,
          },
          {
            component: componentMap['Corsair Vengeance DDR5 32Go (2x16Go)']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 129,
            quantity: 1,
          },
          {
            component: componentMap['MSI MAG Z790 TOMAHAWK']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 299,
            quantity: 1,
          },
          {
            component: componentMap['WD Black SN850X 1To']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 99,
            quantity: 1,
          },
          {
            component: componentMap['Corsair RM1000x']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 179,
            quantity: 1,
          },
          {
            component: componentMap['NZXT H7 Flow']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 149,
            quantity: 1,
          },
          {
            component: componentMap['Noctua NH-D15']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 99,
            quantity: 1,
          },
        ],
        totalCost: 1203,
        status: 'finalized',
        isPublic: false,
        notes: 'Configuration équilibrée pour un usage bureautique professionnel',
      },

      // Configuration 2: PC Gaming Milieu de Gamme
      {
        user: users[2]._id, // Marie Martin
        name: 'Gaming PC 1440p',
        description: 'Configuration gaming performante pour jouer en 1440p à 144Hz',
        components: [
          {
            component: componentMap['AMD Ryzen 9 7950X']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 549,
            quantity: 1,
          },
          {
            component: componentMap['NVIDIA GeForce RTX 4070']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 599,
            quantity: 1,
          },
          {
            component: componentMap['G.Skill Trident Z5 RGB 32Go (2x16Go)']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 169,
            quantity: 1,
          },
          {
            component: componentMap['ASUS ROG Strix X670E-E Gaming']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 449,
            quantity: 1,
          },
          {
            component: componentMap['Samsung 990 Pro 2To']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 189,
            quantity: 1,
          },
          {
            component: componentMap['Corsair RM1000x']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 179,
            quantity: 1,
          },
          {
            component: componentMap['NZXT H7 Flow']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 149,
            quantity: 1,
          },
          {
            component: componentMap['Corsair iCUE H150i Elite']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 189,
            quantity: 1,
          },
        ],
        totalCost: 2472,
        status: 'finalized',
        isPublic: true,
        notes: 'Setup gaming optimisé pour 1440p avec refroidissement AIO',
      },

      // Configuration 3: PC Gaming Ultra Haut de Gamme
      {
        user: users[0]._id, // Admin
        name: 'Beast Mode 4K Gaming',
        description: 'Configuration extrême pour gaming 4K, streaming et création de contenu',
        components: [
          {
            component: componentMap['Intel Core i9-14900K']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 589,
            quantity: 1,
          },
          {
            component: componentMap['NVIDIA GeForce RTX 4090']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 1799,
            quantity: 1,
          },
          {
            component: componentMap['G.Skill Trident Z5 RGB 32Go (2x16Go)']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 169,
            quantity: 2, // 64Go total (2x kit de 32Go)
          },
          {
            component: componentMap['ASUS ROG Strix X670E-E Gaming']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 449,
            quantity: 1,
          },
          {
            component: componentMap['Samsung 990 Pro 2To']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 189,
            quantity: 2, // 4To total en RAID 0
          },
          {
            component: componentMap['be quiet! Dark Power Pro 12 850W']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 269,
            quantity: 1,
          },
          {
            component: componentMap['NZXT H7 Flow']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 149,
            quantity: 1,
          },
          {
            component: componentMap['Corsair iCUE H150i Elite']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 189,
            quantity: 1,
          },
        ],
        totalCost: 4140,
        status: 'finalized',
        isPublic: true,
        notes: 'Configuration flagship pour les performances ultimes en 4K 144Hz',
      },

      // Configuration 4: PC Workstation Création de Contenu
      {
        user: users[1]._id, // Jeana Dupont
        name: 'Workstation Créative',
        description: 'Station de travail pour montage vidéo 4K, 3D et design graphique',
        components: [
          {
            component: componentMap['AMD Ryzen 9 7950X']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 549,
            quantity: 1,
          },
          {
            component: componentMap['AMD Radeon RX 7900 XTX']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 999,
            quantity: 1,
          },
          {
            component: componentMap['G.Skill Trident Z5 RGB 32Go (2x16Go)']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 169,
            quantity: 2, // 64Go pour les workloads lourds
          },
          {
            component: componentMap['ASUS ROG Strix X670E-E Gaming']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 449,
            quantity: 1,
          },
          {
            component: componentMap['Samsung 990 Pro 2To']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 189,
            quantity: 1,
          },
          {
            component: componentMap['WD Black SN850X 1To']._id,
            selectedPartner: partnerMap['LDLC'],
            price: 99,
            quantity: 2, // 2To de stockage supplémentaire
          },
          {
            component: componentMap['Corsair RM1000x']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 179,
            quantity: 1,
          },
          {
            component: componentMap['NZXT H7 Flow']._id,
            selectedPartner: partnerMap['Materiel.net'],
            price: 149,
            quantity: 1,
          },
          {
            component: componentMap['Corsair iCUE H150i Elite']._id,
            selectedPartner: partnerMap['Amazon'],
            price: 189,
            quantity: 1,
          },
        ],
        totalCost: 3139,
        status: 'draft',
        isPublic: false,
        notes: 'En cours d\'optimisation pour workflows Adobe et DaVinci Resolve',
      },
    ]);
    console.log(`   ✓ ${configurations.length} configurations créées`);

    // 6. Créer les prix partenaires
    console.log('💰 Création des prix partenaires...');
    const partnerPrices = [];

    for (const component of components) {
      // Prix Amazon (généralement proche du prix de base)
      partnerPrices.push({
        component: component._id,
        partner: partnerMap['Amazon'],
        price: Math.round(component.basePrice * (0.95 + Math.random() * 0.1)),
        inStock: Math.random() > 0.1,
        shippingCost: 0,
        link: `https://www.amazon.fr/dp/${Math.random().toString(36).substr(2, 10)}`,
      });

      // Prix LDLC
      partnerPrices.push({
        component: component._id,
        partner: partnerMap['LDLC'],
        price: Math.round(component.basePrice * (0.98 + Math.random() * 0.08)),
        inStock: Math.random() > 0.15,
        shippingCost: 4.99,
        link: `https://www.ldlc.com/fiche/${Math.random().toString(36).substr(2, 8)}`,
      });

      // Prix Materiel.net
      partnerPrices.push({
        component: component._id,
        partner: partnerMap['Materiel.net'],
        price: Math.round(component.basePrice * (0.97 + Math.random() * 0.09)),
        inStock: Math.random() > 0.2,
        shippingCost: 5.99,
        link: `https://www.materiel.net/produit/${Math.random().toString(36).substr(2, 12)}`,
      });

      // Prix TopAchat (pas toujours disponible)
      if (Math.random() > 0.3) {
        partnerPrices.push({
          component: component._id,
          partner: partnerMap['TopAchat'],
          price: Math.round(component.basePrice * (0.93 + Math.random() * 0.12)),
          inStock: Math.random() > 0.25,
          shippingCost: 6.99,
          link: `https://www.topachat.com/pages/detail/${Math.random().toString(36).substr(2, 10)}`,
        });
      }
    }

    await PartnerPrice.insertMany(partnerPrices);
    console.log(`   ✓ ${partnerPrices.length} prix partenaires créés`);

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - ${users.length} utilisateurs`);
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${partners.length} partenaires`);
    console.log(`   - ${components.length} composants`);
    console.log(`   - ${configurations.length} configurations`);
    console.log(`   - ${partnerPrices.length} prix partenaires`);

    console.log('\n🔐 Comptes de test :');
    console.log('   - admin@configpc.fr / password123');
    console.log('   - jeana.dupont@example.com / jeana');
    console.log('   - marie.martin@example.com / marie');

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
};

// Exécuter le seed
seedData();
