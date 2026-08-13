-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Familie',
    "complexity" REAL NOT NULL DEFAULT 2,
    "minAge" INTEGER NOT NULL DEFAULT 8,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "playTime" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "pricePerDay" REAL NOT NULL,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minPlayers", "playTime", "pricePerDay", "title", "totalCopies") SELECT "category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minPlayers", "playTime", "pricePerDay", "title", "totalCopies" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
