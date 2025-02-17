ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "organization_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "organization_members"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "organization_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "organization_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "organization_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "organizations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_member_of_organization("organizations"."id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "organizations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "organizations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "organizations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_member_of_team("schedules"."team_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((is_member_of_team("schedules"."team_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((is_member_of_team("schedules"."team_id"))) WITH CHECK ((is_member_of_team("schedules"."team_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((is_member_of_team("schedules"."team_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "team_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "team_members"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "team_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "team_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "team_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "teams" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_member_of_team("teams"."id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "teams" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "teams" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "teams" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);