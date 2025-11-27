from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class User(models.Model):
    name = models.CharField(max_length=100)
    hash_password = models.CharField(max_length=16)

    def __str__(self):
        return self.name