ALTER TABLE "shopshare_item" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopshare_list_item" ALTER COLUMN "list_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopshare_list_item" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopshare_list" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopshare_list_item" ADD CONSTRAINT "shopshare_list_item_list_id_item_id_pk" PRIMARY KEY("list_id","item_id");--> statement-breakpoint
ALTER TABLE "shopshare_list_item" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;