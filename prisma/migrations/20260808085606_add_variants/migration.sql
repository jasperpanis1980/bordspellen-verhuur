-- CreateTable
CREATE TABLE "GameVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "productImageUrl" TEXT,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GameVariant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "variantId" TEXT,
    "userId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rental_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rental_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GameVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rental" ("createdAt", "endDate", "gameId", "id", "note", "startDate", "status", "updatedAt", "userId") SELECT "createdAt", "endDate", "gameId", "id", "note", "startDate", "status", "updatedAt", "userId" FROM "Rental";
DROP TABLE "Rental";
ALTER TABLE "new_Rental" RENAME TO "Rental";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
