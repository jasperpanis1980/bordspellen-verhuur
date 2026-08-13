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
    "purchasePrice" REAL NOT NULL DEFAULT 0,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minAge", "minPlayers", "playTime", "pricePerDay", "productImageUrl", "rating", "reviewCount", "shortDescription", "theme", "title", "totalCopies") SELECT "category", "complexity", "createdAt", "description", "id", "imageUrl", "maxPlayers", "minAge", "minPlayers", "playTime", "pricePerDay", "productImageUrl", "rating", "reviewCount", "shortDescription", "theme", "title", "totalCopies" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "variantId" TEXT,
    "userId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "pickedUpAt" DATETIME,
    "returnedAt" DATETIME,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidAt" DATETIME,
    "refundAmount" REAL,
    "refundPaid" BOOLEAN NOT NULL DEFAULT false,
    "refundPaidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rental_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rental_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GameVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rental" ("createdAt", "endDate", "gameId", "id", "note", "startDate", "status", "updatedAt", "userId", "variantId") SELECT "createdAt", "endDate", "gameId", "id", "note", "startDate", "status", "updatedAt", "userId", "variantId" FROM "Rental";
DROP TABLE "Rental";
ALTER TABLE "new_Rental" RENAME TO "Rental";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
