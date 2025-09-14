CREATE TABLE IF NOT EXISTS "Account" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    "email" TEXT UNIQUE NOT NULL,                                
    "password" TEXT NOT NULL,                              
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP                 
);



