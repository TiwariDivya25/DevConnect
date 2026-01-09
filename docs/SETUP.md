# DevConnect Setup Guide

## Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or higher  
- **npm** v9 or higher (comes with Node.js)  
- **Git**  
- A **Supabase account** (free tier works)  
- A **GitHub account** (for OAuth authentication)  

---

## Installation

### 1. Fork the repository

```bash
git clone https://github.com/yourusername/DevConnect.git
cd DevConnect
```

### 2. Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Get your Supabase credentials

1. Go to your Supabase project dashboard  
2. Navigate to **Settings → API**  
3. Copy **Project URL** → `VITE_SUPABASE_URL`  
4. Copy **anon public key** → `VITE_SUPABASE_ANON_KEY`  

### Set up GitHub OAuth in Supabase

1. Go to **Authentication → Providers**  
2. Enable **GitHub** provider  
3. Add your GitHub OAuth credentials  
4. Set redirect URL to:  
   ```
   http://localhost:5173/auth/callback
   ```

---

## Running the Project

### Start the development server

```bash
npm run dev
```

Application will be available at:  
`http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

---

## Linting & Formatting

```bash
# Format code
npm run format

# Check for linting errors
npm run lint
```

---

## Troubleshooting

### Issue: Environment variables missing
**Solution:**  
Ensure `.env` file exists in project root with correct Supabase credentials.

---

### Issue: Authentication not working
**Solution:**

- Verify GitHub OAuth is enabled in Supabase  
- Ensure redirect URL matches  
  ```
  http://localhost:5173/auth/callback
  ```
- Check GitHub OAuth app callback URL  

---

### Issue: Images not uploading
**Solution:**

1. In Supabase Storage, create a bucket named `post-images`  
2. Set bucket visibility to **public**  
3. Create another bucket named `message-files` (private)  

---

### Issue: Port already in use
**Solution:**

```bash
npm run dev -- --port 3000
```

---

### Issue: Database tables not found
**Solution:**  
Run the SQL schema from  
[DATABASE.md](DATABASE.md)

---

### Issue: Build errors
**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- Review project structure:  
  [ARCHITECTURE.md](ARCHITECTURE.md)

- Start contributing:  
  [CONTRIBUTING.md](CONTRIBUTING.md)

- Database schema details:  
  [DATABASE.md](DATABASE.md)

- For additional help, open an issue on GitHub or check  
  [README.md](README.md)
