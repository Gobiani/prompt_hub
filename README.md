# Prompt Hub

A mini prompt management tool for Promptrun.ai, built with Next.js, PostgreSQL, and Gemini API.

## Setup
- **Prerequisites**: Node.js (v14+), PostgreSQL, Gemini API key.
- **Install**: `npm install`
- **Database**: Install PostgreSQL, create `prompt_hub` database.
- **Env**: Copy `.env.example` to `.env.local`, set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `GEMINI_API_KEY`.
- **Run**: `npm run dev`, visit `http://localhost:3000`.

## Usage
- Create prompts with titles and templates (e.g., "Translate to {language}: {text}").
- View all prompts.
- Execute with variable values.

## Features
- Save, view, and execute prompt templates.
- Dynamic variable replacement with Gemini API.

## Notes
- Ensure PostgreSQL is running.
- Get a Gemini API key for execution.