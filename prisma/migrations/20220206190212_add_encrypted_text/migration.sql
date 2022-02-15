-- CreateTable
CREATE TABLE "EncryptedText" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "encryptedText" TEXT NOT NULL,

    CONSTRAINT "EncryptedText_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "EncryptedText" ENABLE ROW LEVEL SECURITY;

-- AddForeignKey
ALTER TABLE "EncryptedText" ADD CONSTRAINT "EncryptedText_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION encrypt_text_on_insert_update() 
    RETURNS trigger AS $$
    DECLARE
    BEGIN
        NEW."encryptedText" = PGP_SYM_ENCRYPT(NEW."encryptedText" :: TEXT,'willow-scret');
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_encryptedtext_insert_or_update
    BEFORE INSERT OR UPDATE ON public."EncryptedText" 
    FOR EACH ROW EXECUTE PROCEDURE encrypt_text_on_insert_update();

-- CREATE OR REPLACE FUNCTION decryptText(rowid BIGINT)
--     RETURNS TABLE (decrypted text)
--     language sql
--     security INVOKER
--     stable
--     as $$
--         SELECT PGP_SYM_DECRYPT("encryptedText"::bytea, 'willow-scret'::text)::text as decrypted 
--         FROM public."EncryptedText" 
--         WHERE id = rowid
--     $$;