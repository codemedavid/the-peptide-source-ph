# Viber Bot Setup Guide - Automatic Order Messaging

This guide will help you set up automatic Viber messaging so customer orders are automatically sent to your Viber number.

## 📋 Prerequisites

1. A Viber account with the number: **09953928293**
2. Access to Viber Business Account (free)
3. Supabase project with Edge Functions enabled

---

## 🚀 Step 1: Create a Viber Bot

1. **Go to Viber Admin Panel:**
   - Visit: https://partners.viber.com/
   - Sign in with your Viber account

2. **Create a New Bot:**
   - Click "Create Bot" or "Add Bot"
   - Fill in bot details:
     - **Bot Name:** The Peptide Source PH
     - **Description:** Order notifications for peptide products
     - **Avatar:** Upload your logo
   - Click "Create"

3. **Get Your Bot Token:**
   - After creating the bot, you'll receive an **Auth Token**
   - **SAVE THIS TOKEN** - you'll need it for Step 3
   - Example format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

---

## 🔧 Step 2: Set Up Webhook (Optional but Recommended)

1. **In Viber Admin Panel:**
   - Go to your bot settings
   - Find "Webhook" section
   - Set webhook URL to: `https://YOUR_PROJECT.supabase.co/functions/v1/viber-webhook`
   - (Replace YOUR_PROJECT with your Supabase project reference)

2. **This allows you to:**
   - Receive messages from customers
   - Auto-respond to common questions
   - Track order status

---

## 🔐 Step 3: Add Viber Token to Supabase Secrets

1. **Go to Supabase Dashboard:**
   - Open your project
   - Navigate to: **Settings → Edge Functions → Secrets**

2. **Add Secret:**
   - Click "Add Secret"
   - **Name:** `VIBER_BOT_TOKEN`
   - **Value:** Paste your bot token from Step 1
   - Click "Save"

3. **Add Recipient Number (Optional):**
   - **Name:** `VIBER_RECIPIENT_NUMBER`
   - **Value:** `639953928293` (your Viber number in international format)
   - Click "Save"

---

## 📦 Step 4: Deploy Edge Function

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Deploy the function:**
   ```bash
   supabase functions deploy send-viber-message
   ```

---

## ✅ Step 5: Test the Integration

1. **Place a test order** on your website
2. **Check your Viber** - you should receive the order automatically
3. **Check Supabase Dashboard:**
   - Go to **Table Editor → orders**
   - Verify the order was saved
   - Check `viber_sent` column (should be `true` if successful)

---

## 🔍 Troubleshooting

### Problem: Orders saved but no Viber message received

**Solutions:**
1. **Check Bot Token:**
   - Verify `VIBER_BOT_TOKEN` is set correctly in Supabase secrets
   - Token should start with numbers and contain letters/numbers

2. **Check Recipient Number:**
   - Must be in international format: `639953928293`
   - No + sign, no spaces
   - Must be the number registered with your Viber account

3. **Check Edge Function Logs:**
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for errors in `send-viber-message` function

4. **Verify Bot is Active:**
   - Go to Viber Admin Panel
   - Check that your bot status is "Active"

### Problem: "User not subscribed" error

**Solution:**
- The recipient number must have started a conversation with your bot first
- Send a test message to your bot from the recipient number
- Then try placing an order again

### Problem: Edge Function not found

**Solution:**
1. Make sure you deployed the function:
   ```bash
   supabase functions deploy send-viber-message
   ```

2. Check function exists in Supabase Dashboard → Edge Functions

---

## 📱 Alternative: Manual Setup (No Bot Required)

If you don't want to set up a Viber Bot, the system will:

1. ✅ **Save all orders to database** (you can view in Supabase)
2. ✅ **Copy order details to clipboard** (customer can paste in Viber)
3. ✅ **Open Viber app** with your number ready

You can then:
- View orders in Supabase Dashboard
- Manually send messages to customers
- Use the order details that are automatically copied

---

## 🎯 How It Works

1. **Customer places order** → Order saved to `orders` table
2. **Edge Function triggered** → Attempts to send via Viber Bot API
3. **If successful** → You receive order in Viber automatically
4. **If fails** → Order still saved, customer can send manually

---

## 📞 Support

If you need help:
- Viber Bot Documentation: https://developers.viber.com/docs/general/get-started/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

---

## ✅ Checklist

- [ ] Viber Bot created
- [ ] Bot Token obtained
- [ ] Token added to Supabase secrets
- [ ] Edge Function deployed
- [ ] Test order placed
- [ ] Viber message received successfully

---

**Note:** The Viber Bot API requires users to subscribe to your bot first. For automatic order notifications, you may need to use Viber Business Messages (requires business verification) or have customers start a conversation with your bot first.

