import os
import base64
from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.7,
)

image_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an expert LinkedIn ghostwriter.

Write creative, professional, copy-ready LinkedIn posts.

Rules:
- Return exactly 4 LinkedIn posts.
- Do not add explanations.
- Do not add image suggestions.
- Do not add headings like Option 1, Option 2.
- Each post should be directly copy-paste ready.
- Separate each post using this line only:
---"""
    ),
    (
        "human",
        "Generate LinkedIn posts on this topic: {topic}"
    ),
])

image_prompt_chain = ChatPromptTemplate.from_messages([
    (
        "system",
        """You create professional LinkedIn image prompts.

Rules:
- Return only one image prompt.
- No explanation.
- No markdown.
- Image should look modern, clean, professional.
- Suitable for LinkedIn post banner."""
    ),
    (
        "human",
        "Create an image prompt for this topic: {topic}"
    ),
]) | llm

chain = prompt | llm


@app.post("/generate")
async def generate_content(topic: str):
    # text content
    text_response = await chain.ainvoke({
        "topic": topic
    })

    # image prompt
    image_prompt_response = await image_prompt_chain.ainvoke({
        "topic": topic
    })

    image_prompt = image_prompt_response.content

    # image generation
    image_response = image_client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=image_prompt,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        ),
    )

    image_base64 = None

    for part in image_response.candidates[0].content.parts:
        if part.inline_data:
            image_base64 = base64.b64encode(
                part.inline_data.data
            ).decode("utf-8")

    return {
        "topic": topic,
        "content": text_response.content,
        "image_prompt": image_prompt,
        "image_base64": image_base64
    }