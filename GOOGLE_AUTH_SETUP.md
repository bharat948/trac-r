# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, etc.)
   - Add your email to test users
   - Save and continue through the scopes (default is fine)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Expense Tracker (or any name)
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-vercel-domain.vercel.app` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for local development)
     - `https://your-vercel-domain.vercel.app` (for production)
   - Click **Create**
7. Copy the **Client ID** (it looks like: `xxxxx.apps.googleusercontent.com`)

## Step 2: Configure Environment Variables

### For Local Development

Create a `.env.local` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: Your Google Client ID
   - **Environment**: Production, Preview, Development (select all)
4. Redeploy your application

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. You should see a login screen with "Sign in with Google" button
3. Click the button and complete the Google sign-in flow
4. After successful login, you'll be redirected to the dashboard

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure you've added the correct redirect URIs in Google Cloud Console
- For local: `http://localhost:5173`
- For production: Your Vercel domain URL

### "Error 403: access_denied"
- Make sure you've added your email to test users in OAuth consent screen
- If using External app type, you may need to publish it (or add test users)

### Login button not showing
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Make sure the environment variable is loaded (restart dev server after adding .env.local)

## Security Notes

- Never commit `.env.local` or `.env` files to git
- Keep your Client ID secure (though it's safe to expose in frontend code)
- For production, always use HTTPS
- Consider adding domain restrictions in Google Cloud Console for additional security

