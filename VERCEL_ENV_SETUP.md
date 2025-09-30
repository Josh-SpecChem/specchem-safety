# 🔐 Vercel Environment Variables Setup

## Required Environment Variables for Production

### **Copy these exact values to your Vercel dashboard:**

#### **1. Supabase Configuration (Public - Safe to use):**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **2. Database Connection:**
```bash
DATABASE_URL=your_database_connection_string
```

#### **3. Service Role Key (Get from Supabase Dashboard):**
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role secret** key
4. Add to Vercel as:
```bash
SUPABASE_SERVICE_ROLE_KEY=[paste-your-service-role-key-here]
```

#### **4. OpenAI Key (Optional - for AI features):**
1. If you have OpenAI features, add your API key:
```bash
OPENAI_API_KEY=[your-openai-api-key]
```

## 🚀 Quick Deployment Steps

### **1. Vercel Import:**
- Visit [vercel.com/new](https://vercel.com/new)
- Import `Josh-SpecChem/specchem-safety`
- Framework: Next.js (auto-detected)

### **2. Add Environment Variables:**
- In Vercel dashboard → Settings → Environment Variables
- Add all 4 variables above
- Apply to: Production, Preview, Development

### **3. Deploy:**
- Click "Deploy"
- Build time: ~2-3 minutes
- Your app will be live!

### **4. Post-Deployment:**
- Update Supabase redirect URLs with your Vercel domain
- Test user registration and admin access
- Monitor performance in Vercel Analytics

## ✅ Your app is production-ready with enterprise features!