from django.shortcuts import render
from django.http import JsonResponse
from PIL import Image
import io
import base64
import requests
import json
from .models import PageContent
from django.views.decorators.csrf import csrf_exempt
# from diffusers import DiffusionPipeline
# from datasets import load_dataset
# from transformers import Trainer, TrainingArguments


def home(request):
    all_saves = PageContent.objects.all()
    return render(request, "home.html", {'saves': all_saves})

def manga(request):
    return render(request, "manga.html")


API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"
HEADERS = {"Authorization": "Bearer API_KEY"}

def query(payload):
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")
    return response.content

def comic(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        prompt = data.get('prompt', '') + ' in comic style.'
        # resolution = data.get('image-aspect-ratio', '1080x1080')
        if prompt:
            image_bytes = query({"inputs": prompt})

            image = Image.open(io.BytesIO(image_bytes))
            img_io = io.BytesIO()
            image.save(img_io, format='PNG')
            img_io.seek(0)
            image_data = base64.b64encode(img_io.read()).decode('utf-8')

            return JsonResponse({
                'prompt': prompt,
                'image_data': image_data,
            })
    return render(request, 'comic.html')


def save_page(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            html_content = data.get('html_content', '')
            save_id = data.get('save_id', None)
            
            if html_content.strip():
                if save_id:
                    save = PageContent.objects.get(id=save_id)
                    save.html_content = html_content
                    save.save()
                    message = f"Page content # {save_id} updated successfully."
                else:
                    PageContent.objects.create(html_content=html_content)
                    message = "Page content saved successfully."
                
                return JsonResponse({"message": message}, status=200)
            else:
                return JsonResponse({"error": "No content to save."}, status=400)
        except PageContent.DoesNotExist:
            return JsonResponse({"error": "Save not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)

def view_save(request, save_id):
    try:
        save = PageContent.objects.get(id=save_id)
        return render(request, 'view_save.html', {'save': save})
    except PageContent.DoesNotExist:
        return render(request, 'error.html', {'message': 'Save not found'})

