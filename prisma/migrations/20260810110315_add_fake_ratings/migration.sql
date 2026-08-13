-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Familie',
    "theme" TEXT NOT NULL DEFAULT 'Overig',
    "complexity" REAL NOT NULL DEFAULT 2,
    "minAge" INTEGER NOT NULL DEFAULT 8,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "playTime" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "productImageUrl" TEXT,
    "pricePerDay" REAL NOT NULL,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minAge", "minPlayers", "playTime", "pricePerDay", "productImageUrl", "shortDescription", "theme", "title", "totalCopies") SELECT "category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minAge", "minPlayers", "playTime", "pricePerDay", "productImageUrl", "shortDescription", "theme", "title", "totalCopies" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
