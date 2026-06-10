CREATE TABLE public.broker_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    broker text NOT NULL CHECK (broker IN ('angel_one','zerodha','upstox')),
    status text NOT NULL DEFAULT 'disconnected' CHECK (status IN ('disconnected','pending','connected')),
    mode text DEFAULT 'sandbox' CHECK (mode IN ('sandbox','live')),
    last_sync_at timestamptz,
    connected_at timestamptz,
    disconnected_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, broker)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.broker_connections TO authenticated;
GRANT ALL ON public.broker_connections TO service_role;

ALTER TABLE public.broker_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own broker connections"
ON public.broker_connections
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE TABLE public.broker_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    broker text NOT NULL,
    action text NOT NULL CHECK (action IN ('connect','disconnect','sync','error')),
    details text,
    created_at timestamptz DEFAULT now() NOT NULL
);

GRANT SELECT, INSERT ON public.broker_activity TO authenticated;
GRANT ALL ON public.broker_activity TO service_role;

ALTER TABLE public.broker_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own broker activity"
ON public.broker_activity
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own broker activity"
ON public.broker_activity
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE TRIGGER broker_connections_touch_updated_at
    BEFORE UPDATE ON public.broker_connections
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();