# GHL Custom Frontend

This project provides a custom dashboard for GoHighLevel built with **Next.js 15**, **Firebase**, and **TailwindCSS**. It includes a collapsible sidebar, top status bar, contact management, and an opportunities widget.

## Features
- 🔐 Firebase authentication with role based layout
- 📋 Contact list with pagination and search
- 🔄 Manual and automatic syncing of GHL contacts to Firestore
- 🕒 Top status bar showing user info and last sync time
- 🎯 Opportunities widget displaying current opportunity data

## Development
```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` with your Firebase and GHL credentials.

## Deployment
The project is ready for Vercel. Environment variables are mapped in `vercel.json` so they can be configured via the Vercel dashboard.
