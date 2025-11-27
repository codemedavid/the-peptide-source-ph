# 🚀 Quick Setup: Automatic Viber Order Messaging

## ✅ What's Been Set Up

1. **Orders Database Table** - All orders are now saved automatically
2. **Viber Integration Code** - Ready to send messages automatically
3. **Edge Function** - Created to handle Viber API calls

---

## 🎯 Two Options for Automatic Messaging

### Option 1: Viber Bot (Recommended - Fully Automatic)

**Follow the guide:** `VIBER_BOT_SETUP.md`

**What you get:**
- ✅ Orders automatically sent to your Viber
- ✅ No manual work needed
- ✅ Professional automated system

**Time to set up:** 15-20 minutes

---

### Option 2: Current Setup (Works Now - Semi-Automatic)

**What happens now:**
1. ✅ Order saved to database (you can view in Supabase)
2. ✅ Order details copied to clipboard automatically
3. ✅ Viber opens with your number ready
4. ✅ Customer pastes and sends (or you check database)

**To view orders:**
1. Go to Supabase Dashboard
2. Navigate to: **Table Editor → orders**
3. See all customer orders with full details

---

## 📋 Next Steps

### If you want FULLY AUTOMATIC messaging:

1. **Read:** `VIBER_BOT_SETUP.md`
2. **Create Viber Bot** (5 minutes)
3. **Add token to Supabase** (2 minutes)
4. **Deploy Edge Function** (5 minutes)
5. **Test** (2 minutes)

**Total time: ~15 minutes**

### If you want to keep current setup:

✅ **You're done!** Orders are saved and customers can send via Viber.

---

## 🔍 Check Your Orders

**In Supabase Dashboard:**
- Go to: **Table Editor → orders**
- See all orders with:
  - Customer details
  - Order items
  - Total price
  - Payment method
  - Status
  - Timestamp

---

## 💡 Recommendation

**For best customer experience:** Set up Viber Bot (Option 1)
- Customers don't need to do anything
- You get orders instantly
- Professional automated system

**For quick start:** Use current setup (Option 2)
- Works immediately
- Orders saved to database
- You can check and respond manually

---

## ❓ Questions?

- **Viber Bot Setup:** See `VIBER_BOT_SETUP.md`
- **Database Setup:** Run the migration SQL in Supabase
- **Edge Function:** Already created, just needs deployment

