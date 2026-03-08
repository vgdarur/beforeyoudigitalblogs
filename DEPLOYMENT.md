# Google Compute Engine (VM) Deployment Guide

This guide will walk you through deploying Dealsagent to a free Google Compute Engine Virtual Machine.

## Prerequisites
1. A Google Cloud account with billing enabled (for the free tier).
2. A registered domain name (e.g., dealsagent.com).
3. The source code pushed to a Git provider (GitHub, GitLab, etc.).

## 1. Launch a Virtual Machine
1. Go to the **Google Cloud Console > Compute Engine > VM instances**.
2. Click **Create Instance**.
3. **Name**: `dealsagent-prod`
4. **Region**: `us-west1 (Oregon)`, `us-central1 (Iowa)`, or `us-east1 (South Carolina)` (These regions support the free tier).
5. **Machine configuration**: Series `E2`, Machine type `e2-micro` (2 vCPU, 1 GB memory).
6. **Boot disk**: Change to **Ubuntu 22.04 LTS**.
7. **Firewall**: Check **Allow HTTP traffic** and **Allow HTTPS traffic**.
8. Click **Create**.

## 2. Connect to the Server
1. Click the **SSH** button next to your new instance in the Google Cloud Console.

## 3. Install Dependencies
Run these commands in the SSH terminal:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs npm

# Install Git and Nginx
sudo apt install -y git nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

## 4. Setup the Application
```bash
# Clone your repository (Replace with your actual repo URL)
git clone https://github.com/yourusername/dealsagent.git
cd dealsagent

# Install dependencies
npm install

# Setup environment variables
echo "DATABASE_URL=\"file:./dev.db\"" > .env
# Important: ensure Next Auth or any other secrets are added to .env here.

# Push database schema
npx prisma db push

# Build the Next.js production app
npm run build
```

## 5. Start the Server with PM2
We use PM2 to keep the app running even if you close the SSH window or the server restarts.
```bash
# Start the app using the ecosystem file we created
pm2 start ecosystem.config.js

# Save the PM2 list and configure it to start on server boot
pm2 save
pm2 startup
```
*Follow the instructions printed by the `pm2 startup` command.*

## 6. Configure Nginx Reverse Proxy
We need Nginx to route standard Port 80 (HTTP) traffic to our Next.js backend running on Port 3000.

1. Open the Nginx config:
```bash
sudo nano /etc/nginx/sites-available/dealsagent
```
2. Paste the following (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
3. Save (`Ctrl+O`, `Enter`) and Exit (`Ctrl+X`).
4. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/dealsagent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Point Your Domain & Secure with SSL
1. Go to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare).
2. Create an **A Record** pointing to the **External IP Data** of your Google Cloud VM.
3. Once the DNS propagates (usually a few minutes), your site will be live!
4. Secure it with a free SSL certificate from Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your site is now securely deployed on Google Cloud for free!
