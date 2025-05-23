# LinkedIn Integration Help

Skedlii integrates with the LinkedIn Marketing Developer Platform to enable scheduling and publishing posts to both **personal profiles** and **company pages**.

---

### Supported Use Cases

✅ Schedule posts to **your personal LinkedIn profile**  
✅ Schedule posts to **LinkedIn company pages** (must have admin role)

---

### Authentication Requirements

When connecting your LinkedIn account, Skedlii will request permissions for:

- `r_liteprofile`
- `r_emailaddress`
- `w_member_social`
- `rw_organization_admin`
- `w_organization_social`

These are required for posting on your behalf and managing company pages.

---

### Scheduling Rules

- LinkedIn does **not allow** backdating posts — scheduled time must be in the future.
- Media must meet LinkedIn's aspect ratio and file type requirements:
  - **Images:** JPEG, PNG, WebP, 7680x4320 max
  - **Videos:** MP4, 3–15 minutes recommended

---

### Common Issues

#### 🔁 Token Expired

If your token expires:

- The account will appear as **"Expired"**
- Reconnect it from **Settings → Social Accounts**
- You do not need to remove and re-add the account

#### 🚫 “You do not have permission to post to this page”

- You must be an **admin** of the company page you're trying to post to
- Make sure you select the correct account during scheduling
- Re-authenticate if your page list is out of date

---

### Best Practices

- Keep your media lightweight (under 10MB for images, 200MB for videos)
- Add line breaks to improve readability
- Use hashtags sparingly for reach — LinkedIn recommends 3–5 max

---

### Troubleshooting Tips

- Still not seeing your company page? Re-authenticate with full permissions and check if you have admin rights.
- Post fails with "Invalid Media"? Recheck file format and size.
- Reconnect often if you're a frequent poster — LinkedIn tokens expire silently after a few weeks of inactivity.

### Still Stuck?

- Visit **Dashboard → Social Accounts** to manage connections
- Contact [hello@skedlii.xyz](mailto:hello@skedlii.xyz) for any blocked connections or token issues