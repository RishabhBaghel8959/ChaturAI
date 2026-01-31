import google.generativeai as genai
from fastapi import UploadFile
from typing import List, Optional
from app.config import GEMINI_API_KEY
import io
from PIL import Image

class GeminiService:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def generate_response(self, question: str, files: Optional[List[UploadFile]] = None):
        try:
            content_parts = [question]
            
            if files:
                for file in files:
                    file_content = await file.read()
                    
                    if file.content_type.startswith('image/'):
                        image = Image.open(io.BytesIO(file_content))
                        content_parts.append(image)
                    else:
                        text_content = file_content.decode('utf-8', errors='ignore')
                        content_parts.append(f"\n\nDocument: {file.filename}\n{text_content}")
            
            response = self.model.generate_content(content_parts)
            return response.text
        
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")