-- Users (from Facebook login)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facebook_user_id TEXT UNIQUE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Instagram Business Accounts connected by user
CREATE TABLE instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ig_user_id TEXT UNIQUE,                -- Instagram Business Account ID
  ig_username TEXT,
  access_token TEXT,                      -- Long‑lived token
  token_expires_at TIMESTAMP,
  subscribed_to_webhooks BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts (synced via webhook or fetched manually)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_account_id UUID REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  ig_post_id TEXT UNIQUE,
  media_type TEXT,                        -- IMAGE, VIDEO, CAROUSEL_ALBUM, REEL
  permalink TEXT,
  caption TEXT,
  timestamp TIMESTAMP,
  insights JSONB,                          -- cached post insights
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments (from webhook or API)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  ig_comment_id TEXT UNIQUE,
  from_user TEXT,
  text TEXT,
  timestamp TIMESTAMP,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workflows (user‑defined automation rules)
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  trigger_type TEXT,                      -- 'new_post', 'new_comment'
  trigger_config JSONB,                    -- e.g., { keywords: [...] }
  action_type TEXT,                        -- 'auto_reply', 'save_post', 'send_email'
  action_config JSONB,                      -- e.g., { reply_text: "Thanks!" }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media uploads (pending posts)
CREATE TABLE media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ig_account_id UUID REFERENCES instagram_accounts(id),
  media_type TEXT,                         -- 'IMAGE','VIDEO','REEL','CAROUSEL'
  media_url TEXT,                           -- stored in cloud storage (Vercel Blob / S3)
  caption TEXT,
  status TEXT DEFAULT 'draft',               -- draft, published, failed
  created_at TIMESTAMP DEFAULT NOW()
);
