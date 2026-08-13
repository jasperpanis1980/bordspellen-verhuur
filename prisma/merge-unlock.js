const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.game.findFirst({
    where: { title: "Unlock!: Star Wars Escape Game" },
  });

  const data = {
    title: "Unlock!",
    shortDescription:
      "Los samen puzzels op tegen de klok\nin dit coöperatieve escape-kaartspel.",
    description:
      "Unlock! is een coöperatief escape-room-kaartspel waarbij je met een stapel kaarten en een gratis app tegen de klok raadsels oplost. Elke doos bevat een eigen avontuur met unieke scènes, voorwerpen en codes, maar het principe is steeds hetzelfde: zoek aanwijzingen, combineer voorwerpen slim en ontcijfer de juiste code om op tijd te ontsnappen. Er is geen bord nodig: alles gebeurt via de kaarten en de app, die ook geluidseffecten en hints toevoegt. Kies hieronder welke editie je wilt huren.",
    category: "Party",
    theme: "Avontuur",
    complexity: 1.7,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 6,
    playTime: 60,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
    productImageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
  };

  let gameId;
  if (existing) {
    await prisma.game.update({ where: { id: existing.id }, data });
    gameId = existing.id;
    console.log("Unlock! basisspel bijgewerkt.");
  } else {
    const created = await prisma.game.create({ data });
    gameId = created.id;
    console.log("Unlock! basisspel aangemaakt.");
  }

  await prisma.gameVariant.deleteMany({ where: { gameId } });
  await prisma.gameVariant.createMany({
    data: [
      {
        gameId,
        name: "Star Wars Escape Game",
        imageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
        productImageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
        totalCopies: 1,
        order: 0,
      },
      {
        gameId,
        name: "Secret Adventures",
        imageUrl:
          "https://cf.geekdo-images.com/AifgmNz_JX1PMZRsqOauVA__itemrep/img/t5Fl2fuqUQzGd605jHW_Is65guA=/fit-in/246x300/filters:strip_icc()/pic3945063.jpg",
        productImageUrl:
          "https://cf.geekdo-images.com/AifgmNz_JX1PMZRsqOauVA__itemrep/img/t5Fl2fuqUQzGd605jHW_Is65guA=/fit-in/246x300/filters:strip_icc()/pic3945063.jpg",
        totalCopies: 1,
        order: 1,
      },
      {
        gameId,
        name: "Mystery Adventures",
        imageUrl:
          "https://cf.geekdo-images.com/GeFlXKbZORHBWca3Sl8tSQ__itemrep/img/e5JFmBGQsxZ3v4Pj4KcI5BdXElw=/fit-in/246x300/filters:strip_icc()/pic3588255.jpg",
        productImageUrl:
          "https://cf.geekdo-images.com/GeFlXKbZORHBWca3Sl8tSQ__itemrep/img/e5JFmBGQsxZ3v4Pj4KcI5BdXElw=/fit-in/246x300/filters:strip_icc()/pic3588255.jpg",
        totalCopies: 1,
        order: 2,
      },
      {
        gameId,
        name: "Epic Adventures",
        imageUrl:
          "https://cf.geekdo-images.com/NNVWKOGOKLIkjXvhZKA_Dg__itemrep/img/lDnpkgG1QMu4iY_I_34IYFA9_HY=/fit-in/246x300/filters:strip_icc()/pic5009100.jpg",
        productImageUrl:
          "https://cf.geekdo-images.com/NNVWKOGOKLIkjXvhZKA_Dg__itemrep/img/lDnpkgG1QMu4iY_I_34IYFA9_HY=/fit-in/246x300/filters:strip_icc()/pic5009100.jpg",
        totalCopies: 1,
        order: 3,
      },
    ],
  });
  console.log("4 Unlock!-varianten aangemaakt.");
}

main().finally(() => prisma.$disconnect());
