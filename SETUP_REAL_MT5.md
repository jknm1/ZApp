# 🚀 Setting Up Real MT5 Integration

## Step 1: Create MetaAPI Account (5 minutes)

1. **Go to**: https://app.metaapi.cloud/sign-up
2. **Sign up** (free - 10 accounts forever)
3. **Go to Dashboard** → https://app.metaapi.cloud/token
4. **Copy your API Token** (looks like: `eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...`)

---

## Step 2: Add API Token to Supabase (2 minutes)

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot
2. **Go to**: Project Settings → Edge Functions → Secrets
3. **Click**: "Add new secret"
4. **Name**: `METAAPI_TOKEN`
5. **Value**: Paste your MetaAPI token
6. **Click**: "Save"

---

## Step 3: Create Edge Functions (3 minutes)

In your Supabase Dashboard:

1. **Go to**: Edge Functions (left sidebar)
2. **Click**: "Create a new function"

### Create 3 functions (click "Create" for each):

#### Function 1: `mt5-get-account-info`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { server, login, password } = await req.json()
    const METAAPI_TOKEN = Deno.env.get('METAAPI_TOKEN')

    // Create MetaAPI account connection
    const createResponse = await fetch('https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts', {
      method: 'POST',
      headers: {
        'auth-token': METAAPI_TOKEN!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Account_${login}`,
        type: 'cloud',
        login: login,
        password: password,
        server: server,
        platform: 'mt5',
        magic: 0,
      }),
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.error('MetaAPI create error:', error)
      throw new Error('Failed to create MetaAPI account')
    }

    const account = await createResponse.json()
    console.log('Account created:', account.id)

    // Deploy account
    await fetch(`https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${account.id}/deploy`, {
      method: 'POST',
      headers: { 'auth-token': METAAPI_TOKEN! },
    })

    // Wait for deployment (max 30 seconds)
    let deployed = false
    let attempts = 0
    while (!deployed && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const statusResponse = await fetch(
        `https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${account.id}`,
        { headers: { 'auth-token': METAAPI_TOKEN! } }
      )
      const status = await statusResponse.json()
      if (status.connectionStatus === 'CONNECTED') {
        deployed = true
      }
      attempts++
    }

    if (!deployed) {
      throw new Error('Account deployment timeout')
    }

    // Get account information
    const accountInfoResponse = await fetch(
      `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${account.id}/account-information`,
      { headers: { 'auth-token': METAAPI_TOKEN! } }
    )

    if (!accountInfoResponse.ok) {
      throw new Error('Failed to fetch account info')
    }

    const accountInfo = await accountInfoResponse.json()

    return new Response(
      JSON.stringify({
        login: accountInfo.login || login,
        balance: accountInfo.balance || 0,
        equity: accountInfo.equity || 0,
        margin: accountInfo.margin || 0,
        freeMargin: accountInfo.freeMargin || 0,
        marginLevel: accountInfo.marginLevel || 0,
        profit: accountInfo.profit || 0,
        currency: accountInfo.currency || 'USD',
        leverage: accountInfo.leverage || 100,
        server: server,
        name: accountInfo.name || 'MT5 Account',
        metaApiAccountId: account.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

#### Function 2: `mt5-get-positions`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { metaApiAccountId } = await req.json()
    const METAAPI_TOKEN = Deno.env.get('METAAPI_TOKEN')

    const response = await fetch(
      `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${metaApiAccountId}/positions`,
      { headers: { 'auth-token': METAAPI_TOKEN! } }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch positions')
    }

    const positions = await response.json()

    const formattedPositions = positions.map((pos: any) => ({
      id: pos.id,
      symbol: pos.symbol,
      type: pos.type === 'POSITION_TYPE_BUY' ? 'BUY' : 'SELL',
      volume: pos.volume,
      openPrice: pos.openPrice,
      currentPrice: pos.currentPrice,
      profit: pos.profit,
      openTime: pos.time,
      stopLoss: pos.stopLoss,
      takeProfit: pos.takeProfit,
    }))

    return new Response(
      JSON.stringify(formattedPositions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

#### Function 3: `mt5-get-history`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { metaApiAccountId, startDate, endDate } = await req.json()
    const METAAPI_TOKEN = Deno.env.get('METAAPI_TOKEN')

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const end = endDate || new Date().toISOString()

    const response = await fetch(
      `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${metaApiAccountId}/history-orders/time/${start}/${end}`,
      { headers: { 'auth-token': METAAPI_TOKEN! } }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch history')
    }

    const history = await response.json()

    // Filter only closed positions and format
    const formattedHistory = history
      .filter((order: any) => order.type === 'ORDER_TYPE_BUY' || order.type === 'ORDER_TYPE_SELL')
      .filter((order: any) => order.state === 'ORDER_STATE_FILLED')
      .map((order: any) => ({
        id: order.id,
        symbol: order.symbol,
        type: order.type === 'ORDER_TYPE_BUY' ? 'BUY' : 'SELL',
        volume: order.volume,
        openPrice: order.openPrice,
        closePrice: order.currentPrice || order.openPrice,
        profit: order.profit || 0,
        openTime: order.time,
        closeTime: order.doneTime || order.time,
      }))

    return new Response(
      JSON.stringify(formattedHistory),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## Step 4: Deploy Functions

After creating each function:
1. **Paste the code** into the editor
2. **Click**: "Deploy"
3. **Wait** for deployment to complete (green checkmark)

---

## Step 5: Update Database Table

Add a column to store MetaAPI account ID:

Go to **SQL Editor** in Supabase and run:

```sql
-- Add metaapi_account_id column
ALTER TABLE mt5_accounts 
ADD COLUMN IF NOT EXISTS metaapi_account_id TEXT;
```

---

## Step 6: Test with Your Real MT5 Account

1. **Get your MT5 credentials**:
   - Open MetaTrader 5
   - Go to Tools → Options → Server
   - Note your: Server name, Login number
   - Create an **Investor Password**: 
     - Right-click on account → Change Password
     - Check "Change investor (read only) password"
     - Set a new password (e.g., "InvestorPass123")

2. **In your app**:
   - Click "View Performance"
   - Click "Link MT5 Account"
   - Enter:
     - Broker Server: (exact name from MT5, e.g., "ICMarkets-Live02")
     - Account Number: (your login)
     - Investor Password: (the investor password you just created)
   - Click "Link Account"

3. **Wait 30-60 seconds** for connection
4. **See your REAL trading data!** 🎉

---

## Troubleshooting

### "Failed to create MetaAPI account"
- Check that your server name is EXACT (case-sensitive)
- Verify investor password is correct
- Make sure account is active (not archived)

### "Account deployment timeout"
- Some brokers take longer to connect
- Wait 1-2 minutes and refresh
- Check MetaAPI dashboard to see connection status

### "Failed to fetch account info"
- Account might still be connecting
- Refresh after 1 minute
- Check MetaAPI dashboard for errors

---

## 🎊 You're Done!

Your app now connects to **REAL MT5 ACCOUNTS** and displays:
- ✅ Real-time balance and equity
- ✅ Live profit/loss
- ✅ Actual open positions
- ✅ Real trade history
- ✅ Accurate statistics

**MetaAPI Free Tier**: 10 accounts forever, perfect for your prop firm!

---

Need help? Check MetaAPI docs: https://metaapi.cloud/docs/
