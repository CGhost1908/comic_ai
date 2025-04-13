from django.db import models

# Create your models here.


class Image(models.Model):
    phrase = models.CharField(max_length=200)
    ai_image = models.ImageField(upload_to='images')

    def __str__(self):
        return str(self.phrase)
    
class PageContent(models.Model):
    html_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)