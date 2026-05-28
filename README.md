# LinkedIn Content & Image Generator

A FastAPI + Gemini AI application that generates professional LinkedIn posts and matching LinkedIn banner images from a user-provided topic.

## Features

* Generate 4 copy-ready LinkedIn posts
* Generate a professional image prompt
* Generate an AI image using Gemini image model
* Return image as Base64
* CORS enabled for React frontend
* Async LangChain prompt execution

## Tech Stack

* Python
* FastAPI
* LangChain
* Google Gemini
* Gemini Image Generation
* dotenv
* React frontend support

## Project Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-project-name>
```

### 2. Create virtual environment

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn python-dotenv langchain-google-genai google-genai
```

### 4. Create `.env` file

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Run the FastAPI server

```bash
uvicorn main:app --reload
```

Server will run at:

```bash
http://127.0.0.1:8000
```

## API Endpoint

### Generate LinkedIn Content

```http
POST /generate?topic=your_topic_here
```

Example:

```bash
http://127.0.0.1:8000/generate?topic=using AI agents for automation
```

## Response Format

```json
{
  "topic": "using AI agents for automation",
  "content": "Generated LinkedIn posts...",
  "image_prompt": "Generated image prompt...",
  "image_base64": "base64_encoded_image"
}
```

## Frontend Usage

The backend allows requests from:

```txt
http://localhost:5173
http://127.0.0.1:5173
```

So it works directly with a Vite React frontend running on port `5173`.

## Notes

* Make sure your Gemini API key is valid.
* Keep your `.env` file private.
* Do not push API keys to GitHub.
* If you get CORS errors, confirm that your frontend is running on the allowed origin.
* If image generation fails, check whether the selected Gemini image model is available for your API account.

## License

This project is open-source and free to use.
