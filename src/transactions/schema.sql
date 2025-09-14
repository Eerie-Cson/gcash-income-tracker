CREATE TYPE TransactionType AS ENUM ('Cash-in', 'Cash-out');
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    "account_id" UUID REFERENCES "Account"("id") ON DELETE CASCADE,
    "description" TEXT,                              
    "amount" NUMERIC NOT NULL,
    "type" TransactionType NOT NULL,
    "reference_number" TEXT,                  
    "transaction_date" TIMESTAMP NOT NULL,
    "transaction_code" TEXT,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP                 
);



