/* Storefront catalog and public order settings. */
window.ICONIC_STORE = {
  whatsapp: "94717300145",
  deliveryFee: null,
  // Set bankTransfer to { bank, accountHolder, accountNumber, branch } after verification.
  bankTransfer: null,
};

window.ICONIC_COLLECTIONS = {
  oil: "Oil Collection",
  gifts: "Gift Sets",
  "pocket-perfumes": "Pocket Perfumes",
  "car-diffusers": "Car Air Diffusers",
  "reed-diffusers": "Reed Diffusers",
  "perfume-30ml": "30 ml Perfumes",
};

window.ICONIC_PRODUCTS = (() => {
  const directory = "assets/images/product/real/";
  const portrait = (folder, id, alt) => [{
    src: `${directory}${folder}/${id}.webp`,
    alt,
    width: 1122,
    height: 1402,
  }];
  const oilPhotoViews = {
    set: "bottle and box",
    bottle: "bottle",
    box: "box",
    "box-front": "front of box",
    "box-side": "side of box",
    label: "back of box",
  };
  const standardOilPhotos = ["set", "bottle", "box", "label"];
  const oils = [
    { name: "Golden Vault", photos: ["box", "bottle", "box-front", "box-side", "label"] },
    { name: "Amber Throne", photos: [...standardOilPhotos, "box-front", "box-side"] },
    { name: "Victory Pulse", studio: true, notes: [
      "Bergamot, lemon, pineapple", "Lavender, cardamom, marine accord", "Tonka bean, amber, cedarwood",
    ] },
    { name: "Urban Rush", studio: true, notes: [
      "Bergamot, lemon, green apple", "Lavender, cardamom, aromatic spices", "Cedarwood, amber, soft musk",
    ] },
    { name: "Clean Form", photos: [...standardOilPhotos, "box-side"] },
    { name: "Urban Drive", studio: true, notes: [
      "Green apple, grapefruit, mint", "Lavender, geranium, sage", "Cedarwood, patchouli, soft musk",
    ] },
    { name: "Desert Gold", photos: [...standardOilPhotos, "box-front"] },
    { name: "Wild Edge", studio: true, notes: [
      "Calabrian bergamot, pepper", "Lavender, geranium, Sichuan pepper", "Ambroxan, vetiver, cedarwood",
    ] },
    { name: "Midnight Orchid", studio: true, notes: [
      "Black orchid, spiced citrus", "Floral amber, soft rose", "Vanilla, musk, dark woods",
    ] },
    { name: "Pure Identity", studio: true, notes: [
      "Bergamot, neroli, green apple", "Lavender, jasmine, spicy accord", "Amber, musk, cedarwood",
    ] },
    { name: "Velvet Bloom", studio: true, notes: [
      "Orange blossom, sweet citrus", "Jasmine, rose, white florals", "Vanilla, musk, creamy woods",
    ] },
    { name: "Power Wave", studio: true, notes: [
      "Grapefruit, mandarin, marine accord", "Bay leaf, jasmine, aromatic notes", "Ambergris, oakmoss, guaiac wood",
    ] },
  ];

  const perfumeOils = oils.map(({ name, studio = false, photos = studio ? standardOilPhotos : [], notes = [] }) => {
    const id = name.toLowerCase().replace(/ /g, "-");
    return {
      id,
      name,
      notes,
      collections: ["oil"],
      category: "Perfume Oil",
      size: "10 ml",
      price: 1690,
      regularPrice: 2390,
      gallery: photos.map((view) => ({
        src: `${directory}studio/${id}-${view}.webp`,
        alt: `${name} perfume oil, ${oilPhotoViews[view]}`,
      })),
    };
  });

  const pocketPerfumes = [
    { id: "9-by-afnan", name: "9 by Afnan" },
    { id: "bombshell", name: "Bombshell by Victoria’s Secret" },
    { id: "invictus-aqua", name: "Invictus Aqua by Paco Rabanne" },
    { id: "kirke", name: "Kirké by Tiziana Terenzi" },
    { id: "the-most-wanted", name: "The Most Wanted by Azzaro" },
  ].map((product) => ({
    ...product,
    category: "Pocket Perfume",
    size: "10 ml",
    price: 1490,
    description: "A 10 ml eau de parfum spray in a pocket-sized bottle.",
    notes: [],
    collections: ["pocket-perfumes"],
    gallery: portrait("pocket", product.id, `${product.name}, ICONIC 10 ml pocket perfume bottle`),
  }));

  const carDiffusers = [
    { slug: "mint-fresh", name: "Mint Fresh" },
    { slug: "lush", name: "Lush", size: "6 ml" },
    { slug: "cinnamon-apple", name: "Cinnamon Apple" },
    { slug: "royal-jasmine", name: "Royal Jasmine" },
  ].map(({ slug, name, size = "" }) => ({
    id: `car-diffuser-${slug}`,
    name,
    category: "Car Air Diffuser",
    size,
    price: 990,
    description: `${name} car air diffuser in a glass bottle with a wooden cap and hanging cord.`,
    notes: [],
    collections: ["car-diffusers"],
    gallery: portrait("car-diffusers", slug, `${name} ICONIC car air diffuser with a hanging cord`),
  }));

  const reedDiffusers = [
    { slug: "juicy-fruit", name: "Juicy Fruit" },
    { slug: "mint-fresh", name: "Mint Fresh" },
    { slug: "cinnamon-apple", name: "Cinnamon Apple" },
    { slug: "royal-jasmine", name: "Royal Jasmine" },
    { slug: "lush", name: "Lush" },
  ].map(({ slug, name }) => ({
    id: `reed-diffuser-${slug}`,
    name,
    category: "Reed Diffuser",
    size: "50 ml",
    price: 2390,
    description: `${name} reed diffuser in a 50 ml square glass bottle with a gold-coloured cap.`,
    notes: [],
    collections: ["reed-diffusers"],
    gallery: portrait("reed-diffusers", slug, `${name} ICONIC 50 ml reed diffuser bottle`),
  }));

  const perfumes30ml = [
    { slug: "the-most-wanted", name: "The Most Wanted by Azzaro" },
    { slug: "invictus-aqua", name: "Invictus Aqua by Paco Rabanne" },
    { slug: "1-million", name: "1 Million by Paco Rabanne" },
    { slug: "9-by-afnan", name: "9 by Afnan" },
    { slug: "kirke", name: "Kirké by Tiziana Terenzi" },
    { slug: "bombshell", name: "Bombshell by Victoria’s Secret" },
  ].map(({ slug, name }) => ({
    id: `${slug}-30ml`,
    name,
    category: "Eau de Parfum",
    size: "30 ml",
    price: 2990,
    description: "A 30 ml eau de parfum spray in an ICONIC glass bottle with a gold-coloured cap.",
    notes: [],
    collections: ["perfume-30ml"],
    gallery: portrait("perfume-30ml", slug, `${name}, ICONIC 30 ml eau de parfum bottle`),
  }));

  return [...perfumeOils, ...pocketPerfumes, ...carDiffusers, ...reedDiffusers, ...perfumes30ml];
})();
