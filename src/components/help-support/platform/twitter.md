# Twitter Integration Help

Skedlii integrates with Twitter’s API to allow users to schedule and publish posts directly to their connected Twitter accounts. Below you'll find everything you need to know to get the most out of your Twitter integration.

---

## ✅ What You Can Do

- Schedule posts to one or more Twitter accounts simultaneously.
- Include text, links, and media (images, videos) in a single tweet.
- Reconnect accounts if access tokens expire.
- View post status and logs for troubleshooting.

---

## 🛡️ Authentication & Tokens

Skedlii uses OAuth 2.0 to connect to Twitter on your behalf. When you authorize your Twitter account:

- An access token is stored securely for future scheduling and posting.
- Skedlii only uses the permissions needed to read your account info and publish content.
- Twitter tokens can **expire** or become **invalid** due to:
  - You revoking app access from your Twitter settings.
  - Tokens expiring naturally after a certain period (e.g., 30 days without activity).
  - Twitter enforcing new security rules or API changes.

When this happens:

- Skedlii will mark the account as **"Expired"**
- Your scheduled posts will be **paused or skipped**
- You’ll see a **“Reconnect”** button in your Social Accounts page

> Reconnecting is safe and will **not delete** any drafts, posts, or scheduling configurations.

---

## ✍️ Posting Constraints

### 1. **Character Limit**

- Twitter supports **280 characters max** per tweet.
- URLs are automatically shortened using Twitter’s t.co — each takes up ~23 characters.
- Emojis count as 2 characters.

#### Solutions:

- Use concise messaging
- Move lengthy text to an image or linked blog post
- Use Skedlii’s post preview to check length

---

### 2. **Media Limitations**

- You can upload:
  - ✅ **1 video** OR
  - ✅ **1–4 images**
- Supported image types: JPG, PNG, WebP (up to 5MB each)
- Supported video types: MP4 (H.264), MOV (up to 512MB, <2min20s)

---

## 📦 Rate Limiting

Twitter imposes rate limits depending on the endpoint:

| Action              | Limit                                |
| ------------------- | ------------------------------------ |
| Post Tweets         | ~300 requests per 3 hours (per user) |
| OAuth Token Refresh | ~15 requests per 15 min (per app)    |

Skedlii spaces out posting across users and accounts to comply with these limits. If we hit a rate cap:

- Posts may be delayed
- You’ll see a “Rate Limit Hit” warning in the logs

---

## ⚠️ Common Issues & Fixes

### ❌ "Post Failed – Token Invalid"

- Your Twitter token may have expired.
- Fix: Go to **Settings → Social Accounts → Reconnect**

---

### ❌ "Exceeded Media Limit"

- You uploaded more than 4 images or a video + image combo.
- Fix: Use either **1 video** OR **up to 4 images**, not both.

---

### ❌ "Status is over 280 characters"

- Fix: Use Skedlii's **character counter** or preview feature to shorten text.

---

### ❌ "Account already connected"

- This may happen if you try reconnecting an account that is already linked.
- Fix: Skedlii now supports updating the account token without duplicating. Just click **Reconnect** — we’ll refresh the token if it's your account.

---

## 🧠 Best Practices

- Reconnect your account every few weeks to avoid silent expiry.
- Use Skedlii’s analytics to track Twitter post performance.
- Avoid rapid-fire posting to reduce the risk of triggering Twitter's rate limits.

---

### Still Stuck?

- Visit **Dashboard → Social Accounts** to manage connections
- Contact [hello@skedlii.xyz](mailto:hello@skedlii.xyz) for any blocked connections or token issues
