ALTER TABLE "shopshare_category" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopshare_item" ADD COLUMN "category_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopshare_item" ADD CONSTRAINT "shopshare_item_category_id_shopshare_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."shopshare_category"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
