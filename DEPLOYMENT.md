# 🚀 Stockify Deployment Checklist

Use this checklist to deploy Stockify to production (testnet).

---

## Pre-Deployment Checklist

### ✅ Prerequisites Verified
- [ ] Node.js 18+ installed
- [ ] Clarinet installed (for contract deployment)
- [ ] Git repository set up
- [ ] Hiro Wallet with testnet STX
- [ ] Domain name ready (optional)

### ✅ Smart Contract Preparation
- [ ] All contracts compile successfully (`clarinet check`)
- [ ] All tests pass (`clarinet test`)
- [ ] Contract security review completed
- [ ] Admin wallet address confirmed
- [ ] Initial stock prices verified

### ✅ Frontend Preparation
- [ ] All TypeScript compiles without errors
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Wallet integration verified
- [ ] UI/UX reviewed and approved
- [ ] All components render correctly

---

## Deployment Steps

### Step 1: Deploy Smart Contracts to Testnet

#### 1.1 Generate Deployment Plan
```bash
cd /workspaces/Stockify
clarinet deployments generate --testnet
```

#### 1.2 Review Deployment Plan
```bash
cat deployments/default.testnet-plan.yaml
```

Verify:
- [ ] Correct contract names
- [ ] Proper deployment order
- [ ] Sufficient STX balance for fees

#### 1.3 Execute Deployment
```bash
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

#### 1.4 Record Contract Addresses
After deployment, note the contract addresses:
```
stockify-core: ST.....................stockify-core
stock-token: ST.....................stock-token
sip-010-trait: ST.....................sip-010-trait
```

#### 1.5 Verify on Explorer
- [ ] Visit https://explorer.hiro.so/?chain=testnet
- [ ] Search for each contract address
- [ ] Verify deployment success
- [ ] Check contract code is correct

---

### Step 2: Configure Frontend

#### 2.1 Update Environment Variables
Edit `frontend/.env.local`:
```env
# Update with your deployed contract addresses
NEXT_PUBLIC_STOCKIFY_CONTRACT=ST1234...YOUR_ADDRESS.stockify-core
NEXT_PUBLIC_DSTOCK_CONTRACT=ST1234...YOUR_ADDRESS.stock-token

# Optional: Add OpenAI key for enhanced AI
OPENAI_API_KEY=sk-...your_key_here

# Network settings (already configured)
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_HIRO_API=https://api.testnet.hiro.so
```

#### 2.2 Update Contract References
If needed, update contract addresses in:
- [ ] `src/lib/stacksClient.ts`
- [ ] Any hardcoded references

#### 2.3 Test Locally
```bash
cd frontend
npm run build
npm run start
```

Test all features:
- [ ] Wallet connection
- [ ] Balance checking
- [ ] Stock purchase
- [ ] Stock sale
- [ ] Portfolio display
- [ ] Transaction history
- [ ] Logout functionality

---

### Step 3: Deploy Frontend to Vercel

#### 3.1 Prepare Repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 3.2 Import to Vercel
1. [ ] Go to https://vercel.com
2. [ ] Click "New Project"
3. [ ] Import your GitHub repository
4. [ ] Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 3.3 Add Environment Variables in Vercel
In Vercel project settings, add:
- [ ] `NEXT_PUBLIC_STOCKIFY_CONTRACT`
- [ ] `NEXT_PUBLIC_DSTOCK_CONTRACT`
- [ ] `NEXT_PUBLIC_STACKS_NETWORK`
- [ ] `NEXT_PUBLIC_HIRO_API`
- [ ] `OPENAI_API_KEY` (optional)

#### 3.4 Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify deployment success

#### 3.5 Test Production Deployment
Visit your Vercel URL and test:
- [ ] Page loads correctly
- [ ] Wallet connects
- [ ] Can read from contracts
- [ ] Can execute transactions
- [ ] All features work

---

### Step 4: Post-Deployment Configuration

#### 4.1 Initialize Contract State
If needed, set initial prices (as contract owner):
```bash
# Use Clarinet console or Stacks Explorer
# Call: (contract-call? .stockify-core set-price "AAPL" u175000000)
```

#### 4.2 Test with Real Users
- [ ] Share URL with test users
- [ ] Have them connect wallets
- [ ] Execute test trades
- [ ] Verify all transactions on Explorer

#### 4.3 Monitor Initial Activity
- [ ] Check Stacks Explorer for transactions
- [ ] Monitor Vercel logs for errors
- [ ] Watch for any user feedback

---

## Post-Deployment Verification

### ✅ Smart Contract Verification
- [ ] Contract is visible on Stacks Explorer
- [ ] Functions are callable
- [ ] State is readable
- [ ] Prices are set correctly
- [ ] No errors in contract calls

### ✅ Frontend Verification
- [ ] Site loads without errors
- [ ] All pages render correctly
- [ ] Wallet connection works
- [ ] AI agent responds correctly
- [ ] Portfolio displays data
- [ ] Transaction history shows trades
- [ ] Logout works properly

### ✅ Integration Verification
- [ ] Frontend can read contract state
- [ ] Transactions execute successfully
- [ ] Transaction hashes display correctly
- [ ] Explorer links work
- [ ] Post-conditions are enforced

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Monitor Vercel deployment status
- [ ] Check for any error logs
- [ ] Verify site uptime

### Weekly Checks
- [ ] Review transaction volume
- [ ] Check for unusual activity
- [ ] Update stock prices if needed
- [ ] Review user feedback

### Monthly Checks
- [ ] Dependency updates
- [ ] Security patches
- [ ] Performance optimization
- [ ] User analytics review

---

## Rollback Plan

If issues occur after deployment:

### Smart Contracts
1. [ ] Pause contract if emergency (`set-paused true`)
2. [ ] Deploy fixed version
3. [ ] Migrate state if necessary
4. [ ] Update frontend to use new contract

### Frontend
1. [ ] Revert to previous deployment in Vercel
2. [ ] Fix issues locally
3. [ ] Redeploy when ready

---

## Common Issues & Solutions

### Issue: Contract Calls Fail
**Solution:**
- Verify contract address in `.env.local`
- Check user has sufficient STX balance
- Ensure contract is not paused
- Verify function parameters are correct

### Issue: Wallet Won't Connect
**Solution:**
- Check wallet extension is installed
- Verify wallet is on testnet network
- Try different wallet (Hiro vs Leather)
- Clear browser cache

### Issue: Transactions Don't Appear
**Solution:**
- Wait for block confirmation (~10 minutes)
- Refresh transaction history
- Check Stacks Explorer directly
- Verify transaction was broadcast

### Issue: Prices Not Updating
**Solution:**
- Call `set-price` as contract owner
- Verify price registry is populated
- Check frontend is reading correct contract

---

## Success Criteria

Deployment is successful when:

- ✅ All contracts deployed and verified
- ✅ Frontend accessible via public URL
- ✅ Users can connect wallets
- ✅ Test trades execute successfully
- ✅ Portfolio displays correctly
- ✅ Transaction history shows trades
- ✅ No errors in logs
- ✅ Performance is acceptable
- ✅ All features working as expected

---

## Documentation Updates

After successful deployment:

- [ ] Update README.md with production URL
- [ ] Add deployment date to CHANGELOG.md
- [ ] Document any deployment-specific notes
- [ ] Update contract addresses in docs
- [ ] Share with community

---

## Announcement Template

Once deployed, announce to users:

```
🚀 Stockify is now live on Stacks Testnet!

Trade tokenized US stocks using STX tokens:
🌐 https://your-app.vercel.app

Features:
✅ 10 stock tickers available
✅ AI-powered trading agent
✅ Real-time portfolio tracking
✅ Complete transaction history
✅ Wallet integration (Hiro/Leather/Xverse)

⚠️ TESTNET ONLY - For demonstration purposes

Get started:
1. Install Hiro Wallet
2. Get testnet STX
3. Connect & trade!

#Stacks #Bitcoin #DeFi #Blockchain
```

---

## Next Steps After Deployment

### Phase 1: Gather Feedback
- [ ] Collect user feedback
- [ ] Monitor usage patterns
- [ ] Identify pain points
- [ ] Document feature requests

### Phase 2: Iterate & Improve
- [ ] Fix reported bugs
- [ ] Optimize performance
- [ ] Enhance UI/UX
- [ ] Add requested features

### Phase 3: Scale
- [ ] Add more stock tickers
- [ ] Integrate real price oracles
- [ ] Implement advanced features
- [ ] Consider mainnet deployment

---

## Emergency Contacts

**Smart Contract Issues:**
- Contract Owner: [Your address]
- Clarinet Docs: https://docs.hiro.so/clarinet

**Frontend Issues:**
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs

**Blockchain Issues:**
- Stacks Explorer: https://explorer.hiro.so
- Hiro Discord: https://discord.gg/stacks

---

## Final Checklist

Before announcing launch:

- [ ] All deployment steps completed
- [ ] All tests passed
- [ ] Documentation updated
- [ ] Monitoring in place
- [ ] Rollback plan ready
- [ ] Support channels ready
- [ ] Announcement prepared

---

**Deployment Date:** __________________

**Deployed By:** __________________

**Contract Addresses:**
- stockify-core: __________________
- stock-token: __________________

**Frontend URL:** __________________

**Status:** [ ] Successful [ ] Issues [ ] Rolled Back

**Notes:**
```
[Add any deployment-specific notes here]
```

---

🎉 **Congratulations on deploying Stockify!** 🎉

For questions or issues, refer to ARCHITECTURE.md and README.md.
