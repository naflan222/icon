/* Storefront catalog and public order settings. */
window.ICONIC_STORE = {
  whatsapp: "94717300145",
  deliveryFee: null,
  // Set bankTransfer to { bank, accountHolder, accountNumber, branch } after verification.
  bankTransfer: null,
};

window.ICONIC_PRODUCTS = (() => {
  const directory = "assets/images/product/real/";
  const oils = [
    { name: "Golden Vault", gallery: [
      ["oil-golden-vault.jpg", "bottle and box"],
      ["gallery-golden-vault-trio.jpg", "in the fragrance collection"],
    ] },
    { name: "Amber Throne" },
    { name: "Victory Pulse", studio: true, notes: [
      "Bergamot, lemon, pineapple", "Lavender, cardamom, marine accord", "Tonka bean, amber, cedarwood",
    ] },
    { name: "Urban Rush", studio: true, notes: [
      "Bergamot, lemon, green apple", "Lavender, cardamom, aromatic spices", "Cedarwood, amber, soft musk",
    ] },
    { name: "Clean Form" },
    { name: "Urban Drive", studio: true, notes: [
      "Green apple, grapefruit, mint", "Lavender, geranium, sage", "Cedarwood, patchouli, soft musk",
    ] },
    { name: "Desert Gold" },
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

  return oils.map(({ name, gallery, studio = false, notes = [] }) => {
    const id = name.toLowerCase().replace(/ /g, "-");
    if (studio) {
      gallery = [
        [`studio/${id}-set.webp`, "bottle and box"],
        [`studio/${id}-bottle.webp`, "bottle"],
        [`studio/${id}-box.webp`, "box"],
        [`studio/${id}-label.webp`, "back of box"],
      ];
    }
    return {
      id,
      name,
      studio,
      notes,
      category: "Perfume Oil",
      size: "10 ml",
      price: 2390,
      gallery: (gallery || [[`oil-${id}.jpg`, "bottle and box"]]).map(([file, view]) => ({
        src: directory + file,
        alt: `${name} perfume oil, ${view}`,
      })),
    };
  });
})();
