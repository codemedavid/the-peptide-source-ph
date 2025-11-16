# ✅ Real-Time Sync Checklist

## Follow These Steps in Order:

### 🔥 Step 1: Enable Real-Time in Supabase
**Status:** ⏳ TO DO

**Instructions:**
1. Go to https://supabase.com/dashboard
2. Open your project
3. Navigate to: **Database → Replication**
4. Enable replication for these 5 tables:
   - [ ] products
   - [ ] product_variations  
   - [ ] categories
   - [ ] payment_methods
   - [ ] site_settings

**Alternative:** Use SQL Editor and run:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE product_variations;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_methods;
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
```

---

### 🔄 Step 2: Restart Dev Server
**Status:** ⏳ TO DO

**Instructions:**
1. In your terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop
3. Run `npm run dev` again
4. Wait for it to start: `http://localhost:5173/`

---

### 🧪 Step 3: Test It Works
**Status:** ⏳ TO DO

**Instructions:**
1. **Open 2 browser windows side-by-side:**
   - Window A: `http://localhost:5173/` (Main Site)
   - Window B: `http://localhost:5173/admin` (Admin)

2. **Login to Admin (Window B):**
   - Password: `Peptide@Admin!2025`

3. **Make a change in Admin (Window B):**
   - Click "Manage Products"
   - Edit any product (pencil icon)
   - Change the name (add "TEST" to it)
   - Click "Save"

4. **Watch Main Site (Window A):**
   - Product should update AUTOMATICALLY
   - No need to refresh!

5. **Check Console (Window A):**
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for: `"Products changed, refetching..."`

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Product updates appear instantly on main site
- ✅ Console shows "Products changed, refetching..."
- ✅ NO manual refresh needed
- ✅ Changes sync in real-time

---

## ❌ Troubleshooting

### Problem: Changes still don't show automatically

**Solution 1: Verify Replication is Enabled**
- Go back to Supabase Dashboard
- Check Database → Replication
- Make sure toggles are ON (blue) for all 5 tables

**Solution 2: Check Browser Console**
- Press F12 on main website
- Look for error messages in Console tab
- Common errors:
  - WebSocket connection failed
  - Supabase credentials missing
  - CORS errors

**Solution 3: Verify Environment Variables**
- Check your `.env` file has:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- Restart dev server after any .env changes

**Solution 4: Clear Browser Cache**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or try in Incognito/Private mode

**Solution 5: Check Supabase Project Status**
- Make sure your Supabase project is active
- Check if you're on the free tier and haven't hit limits

---

## 📞 Still Not Working?

If you've tried everything above:

1. **Check Browser Console for Errors:**
   - Open DevTools (F12)
   - Look for red error messages
   - Take a screenshot of any errors

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for WebSocket connections
   - Should see `wss://` connections to Supabase

3. **Verify Tables Exist:**
   - Go to Supabase Dashboard → Table Editor
   - Confirm all tables exist and have data

4. **Test Direct Connection:**
   - In browser console, type:
     ```javascript
     localStorage.getItem('peptide_admin_auth')
     ```
   - Should return `"true"` if logged in

---

## 💡 What Real-Time Gives You

Once working, you get:
- 🚀 **Instant Updates** - No refresh needed
- 👥 **Multi-User** - Multiple admins can work together
- 🔄 **Auto Sync** - All changes sync across devices
- ⚡ **Better UX** - Customers see latest products immediately

---

**Last Updated:** November 12, 2025

