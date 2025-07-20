# Fast AI Boss

Fast AI Boss is a custom frontend for the GoHighLevel CRM built with Next.js. The application uses Firebase Authentication and Firestore for storing data and leverages the GoHighLevel API to manage contacts, opportunities and tasks in a single dashboard.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and provide your configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# GoHighLevel API keys
NEXT_PUBLIC_GHL_API_KEY=public_ghl_key
GHL_API_KEY=server_ghl_key
```

3. If you plan to deploy Firebase functions, install dependencies and deploy from the `ghlaccesscontrol` folder:

```bash
cd ghlaccesscontrol
npm install
npm run deploy
```

## Development

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

Create a production build and run it locally or on your hosting platform:

```bash
npm run build
npm start
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
