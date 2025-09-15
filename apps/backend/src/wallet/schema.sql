CREATE TYPE WalletType AS ENUM ('Gcash', 'Cash');
CREATE TABLE IF NOT EXISTS "Wallet" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    "account_id" UUID REFERENCES "Account"("id") ON DELETE CASCADE,
    "balance" NUMERIC NOT NULL,
    "type" WalletType NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP             
);



