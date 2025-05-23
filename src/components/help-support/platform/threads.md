# Threads Integration Help

Skedlii allows you to post to **Threads** via Meta’s Content Publishing API. This requires special considerations because Threads shares backend infrastructure with Instagram and Facebook.

### Supported Account Types

✅ Creator accounts  
✅ Business accounts

❌ Personal accounts are not supported by Meta's API and will fail during authentication.

---

### Required Setup

To successfully connect a Threads account:

1. Your Threads account **must be linked** to a valid **Instagram business account**.
2. That Instagram account **must be connected** to a Facebook Page.
3. During the OAuth login, **grant all required permissions**, including:
   - `pages_show_list`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`

> If any permission is skipped or revoked later, Skedlii will lose access to post on your behalf.

---

### Token Expiry and Reconnection

Threads tokens may expire silently. Skedlii will:

- Automatically mark the account as **"Expired"**
- Prevent scheduled or manual posting
- Prompt you to **Reconnect**

Reconnecting will re-authorize the access token and allow Skedlii to resume posting.

---

### Content Guidelines for Threads

- Maximum caption length: **500 characters**
- Media: Single image or video only (no carousels)
- Links in captions are allowed, but not hyperlinked

---

### Troubleshooting

- **OAuth fails or loops:** Double-check that your Threads account is a creator or business profile and linked to a Facebook Page.
- **Account appears connected but posts fail:** Try reconnecting the account. This is usually a token expiration issue.
- **Multiple image uploads fail:** Threads API currently only supports a single media item per post.

### Still Stuck?

- Visit **Dashboard → Social Accounts** to manage connections
- Contact [hello@skedlii.xyz](mailto:hello@skedlii.xyz) for any blocked connections or token issues
