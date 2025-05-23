# Instagram Integration Help

Skedlii allows you to connect and publish content to **Instagram** through the Meta Business Platform. Because these services are governed by Meta’s APIs, integration requires proper setup and permissions.

---

## ✅ Supported Account Types

Skedlii supports:

- **Instagram Business accounts**
- **Instagram Creator accounts**

> ❌ Personal Instagram accounts are **not supported** due to Meta API restrictions.

---

## 🔗 Required Setup

To ensure a successful connection:

1. Your Instagram account must be a **Business** or **Creator** account.
2. It must be **linked to a Facebook Page**.
3. You must accept **all required permissions** during authentication, including:
   - `instagram_basic`
   - `pages_show_list`
   - `instagram_content_publish`
   - `business_management`

---

## 🔐 Authentication & Token Expiry

Meta access tokens can expire for several reasons:

- Lack of activity for 60+ days
- Manual revocation of permissions
- Meta requiring reauthorization for policy updates

When this happens:

- Skedlii will flag the account as **"Expired"**
- Scheduled posts will be **paused** or **skipped**
- You’ll be prompted to **Reconnect**

> Clicking “Reconnect” will refresh your token and restore posting capabilities. Your scheduled content is preserved.

---

## ✍️ Posting Rules

### 1. **Supported Media Types**

- ✅ Single Image
- ✅ Single Video (as a Reel)
- ✅ Text-only post (caption with no media)

> ❌ Carousel posts (multi-image) are **not supported** by Meta’s Content Publishing API.

---

### 2. **Caption Guidelines**

- Max length: **2,200 characters**
- Emojis and hashtags are supported
- Links are allowed but **not clickable**

---

### 3. **Scheduling Behavior**

- Skedlii queues Instagram posts and publishes them via background workers
- If your token expires before a post is sent, it will **fail gracefully** and appear in the **Activity Logs** with a red "Token Expired" notice

---

## 🚫 Common Issues & Fixes

### ❌ “Account Not Connected to Facebook Page”

- Fix: Go to Instagram → Profile Settings → Linked Accounts and confirm a Facebook Page is attached.
- Must be an admin of that Page.

---

### ❌ “Insufficient Permissions”

- Fix: Reconnect and **grant all requested permissions**. Skipping any may result in partial or broken functionality.

---

### ❌ “Post Failed – Unsupported Format”

- Carousel (multi-image) and some advanced reels may not be supported.
- Fix: Use single image or video only. Stick to standard aspect ratios (1:1, 4:5, or 9:16).

---

## 🧠 Best Practices

- Keep media file sizes below 8MB for images and 100MB for videos.
- Always reconnect accounts proactively if you haven’t posted in over 30 days.
- Use Skedlii’s platform preview to verify formatting and caption fit before posting.

---

### Still Stuck?

- Visit **Dashboard → Social Accounts** to manage connections
- Contact [hello@skedlii.xyz](mailto:hello@skedlii.xyz) for any blocked connections or token issues
