DO $$ BEGIN
 CREATE TYPE "public"."oauth_providers" AS ENUM('github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."account_status" AS ENUM('OPEN', 'CLOSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."account_transaction_type" AS ENUM('FIXED-PRICE', 'BONUS', 'PAYMENT', 'WITHDRAWAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text,
	"email_verified" boolean NOT NULL,
	"hashed_password" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"provider_id" "oauth_providers" NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "oauth_accounts_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" "account_status" NOT NULL,
	"creation_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"type" "account_transaction_type" NOT NULL,
	"balance" numeric,
	"credit" numeric NOT NULL,
	"debit" numeric NOT NULL,
	"creation_date" timestamp NOT NULL,
	"review_due_date" timestamp,
	"settled_date" timestamp,
	"prev_balance" numeric,
	"prev_settled_date" timestamp,
	"related_transaction_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_transaction_meta" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_transaction_id" uuid NOT NULL,
	"meta_key" text NOT NULL,
	"meta_value" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_codes" ADD CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_transactions" ADD CONSTRAINT "related_transaction_idx" FOREIGN KEY ("related_transaction_id") REFERENCES "public"."account_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_transaction_meta" ADD CONSTRAINT "account_transaction_meta_account_transaction_id_account_transactions_id_fk" FOREIGN KEY ("account_transaction_id") REFERENCES "public"."account_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
