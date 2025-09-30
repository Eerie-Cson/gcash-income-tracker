CREATE TABLE IF NOT EXISTS "Profit" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  "min_amount" NUMERIC NOT NULL,
  "max_amount" NUMERIC NOT NULL,
  "account_id" UUID REFERENCES "Account"("id") ON DELETE CASCADE,
  "fee" DECIMAL(19, 2) NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP      
);
