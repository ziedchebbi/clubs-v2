-- AlterTable
ALTER TABLE "Commentaire" ADD COLUMN     "eventId" TEXT,
ALTER COLUMN "annonceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
