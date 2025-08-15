# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 CV/Resume generator application that uses AI to create tailored CVs based on job descriptions. The application consists of two main parts:

1. **Frontend (Next.js App)**: React application with TypeScript and Tailwind CSS
2. **Backend (Firebase Functions)**: Cloud Functions that integrate with Google's Gemini AI API

## Architecture

### Frontend Structure (`src/`)
- `app/page.tsx` - Main page with job description input form
- `app/cv/page.tsx` - CV display and export page  
- `app/layout.tsx` - Root layout with Geist fonts
- `components/` - Reusable CV section components (PersonalInfo, Summary, Experience, Education, Skills)
- `firebase/config.ts` - Firebase client configuration

### Backend Structure (`functions/`)
- `src/index.ts` - Firebase Cloud Function that calls Gemini AI API
- Uses Google Drive API to fetch CV template data
- Processes job descriptions through Gemini 2.0 Flash model

### Data Flow
1. User inputs job description on main page
2. Frontend calls Firebase Cloud Function `generateCv`
3. Function processes job description through Gemini AI
4. AI returns structured CV data as JSON
5. Data stored in localStorage and displayed on CV page
6. User can export CV as HTML file

## Development Commands

### Frontend Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application
npm start            # Start production server
npm run lint         # Run ESLint
```

### Firebase Functions Development
```bash
cd functions
npm run build        # Compile TypeScript to JavaScript
npm run serve        # Start Firebase emulator with functions
npm run deploy       # Deploy functions to Firebase
npm run logs         # View function logs
npm run dev          # Run with ts-node for development
```

## Environment Variables

The application requires Firebase configuration environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Functions require:
- `GEMINI_API` - Google Gemini AI API key

## Key Technologies

- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Firebase Functions** for serverless backend
- **Google Gemini AI** for CV generation
- **Google Drive API** for template data access

## Firebase Configuration

The project is configured for Firebase hosting and functions:
- Hosting serves from `out/` directory (static export)
- Functions run on Node.js 20 runtime
- Uses service account credentials for Google APIs

## Component Data Structure

CV components expect specific data structure:
```typescript
{
  personalInfo: { name, email, phone, linkedin },
  summary: string,
  experience: [{ title, company, date, description }],
  education: [{ degree, university, date }],
  skills: string[]
}
```