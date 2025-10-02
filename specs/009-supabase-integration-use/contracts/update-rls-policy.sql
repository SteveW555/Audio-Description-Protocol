-- Update RLS Policy for adp_usage to allow anonymous inserts
-- This allows the frontend to track usage without requiring user authentication

-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Allow authenticated inserts" ON adp_usage;

-- Create new policy that allows anonymous inserts
CREATE POLICY "Allow anonymous inserts"
  ON adp_usage
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'adp_usage';
