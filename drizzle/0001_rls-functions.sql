-- Custom SQL migration file, put your code below!

-- This is a workaround to bypass RLS for the functions
-- Doing this directly in a RLS policy would create an infinite recurion
CREATE FUNCTION is_member_of_organization(_organization_id integer) RETURNS bool AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.organization_members AS om
  WHERE om.organization_id = _organization_id
  AND om.user_id = auth.user_id()
);
$$ LANGUAGE sql SECURITY DEFINER;

-- This is a workaround to bypass RLS for the functions
-- Doing this directly in a RLS policy would create an infinite recurion
CREATE FUNCTION is_member_of_team(_team_id integer) RETURNS bool AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.team_members AS tm
  WHERE tm.team_id = _team_id
  AND tm.user_id = auth.user_id()
);
$$ LANGUAGE sql SECURITY DEFINER;
