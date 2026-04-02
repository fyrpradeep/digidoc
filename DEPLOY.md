# PMCare Deployment Guide

## BACKEND — Render

1. Push to GitHub
2. Go to render.com → New Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: (EMPTY)
   - Build Command: npm run build
   - Start Command: npm start
5. Add Environment Variables (from backend/.env):
   - MONGODB_URI
   - AGORA_APP_ID
   - AGORA_APP_CERTIFICATE
   - RAZORPAY_KEY_ID (add when ready)
   - RAZORPAY_KEY_SECRET (add when ready)
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - PORT = 10000
   - NODE_ENV = production
   - FRONTEND_URL = https://www.pmcare.org

## FRONTEND — Vercel

1. Go to vercel.com → New Project
2. Connect GitHub repo
3. Root Directory: frontend
4. Add Environment Variables:
   - NEXT_PUBLIC_API_URL = https://YOUR-RENDER-URL.onrender.com/api
   - NEXT_PUBLIC_AGORA_APP_ID = df9a9d941e3743daaeb6a418ddb26f04
   - NEXT_PUBLIC_RAZORPAY_KEY_ID = (add when ready)
5. Deploy!

## ADDING RAZORPAY (when website goes live)

1. Get live keys from razorpay.com
2. Add to Render env vars:
   - RAZORPAY_KEY_ID = rzp_live_xxx
   - RAZORPAY_KEY_SECRET = xxx
3. Add to Vercel env vars:
   - NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxx
4. Redeploy both

## GOOGLE OAUTH CALLBACK URLs (update in Google Console)

Add these to Authorized Redirect URIs:
- https://YOUR-RENDER-URL.onrender.com/api/auth/google/patient/callback
- https://YOUR-RENDER-URL.onrender.com/api/auth/google/doctor/callback
- http://localhost:10000/api/auth/google/patient/callback (for local dev)

## VPS SETUP (Hostinger ₹299/month)

```bash
# 1. SSH into VPS
ssh root@YOUR_IP

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Install MongoDB
apt-get install -y gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update && apt-get install -y mongodb-org
systemctl start mongod && systemctl enable mongod

# 4. Install PM2 + Nginx
npm install -g pm2
apt-get install -y nginx certbot python3-certbot-nginx

# 5. Clone and setup
git clone https://github.com/fyrpradeep/digidoc
cd digidoc
cd backend && npm install && npm run build
pm2 start dist/main.js --name pmcare-backend
pm2 startup && pm2 save

# 6. Configure Nginx
# Add reverse proxy config in /etc/nginx/sites-available/pmcare
# Point api.pmcare.org → localhost:10000

# 7. SSL
certbot --nginx -d pmcare.org -d www.pmcare.org -d api.pmcare.org

# 8. Auto backup setup
crontab -e
# Add: 0 2 * * * mongodump --out /backup/$(date +%Y-%m-%d) && find /backup -mtime +30 -delete
```
