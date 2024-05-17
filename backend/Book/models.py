from django.db import models
from Profile.models import Profile

class Book(models.Model):
    owner = models.ForeignKey(Profile, related_name='owning_books', on_delete=models.CASCADE)
    article = models.TextField()
    price = models.IntegerField() 
    readers = models.ManyToManyField(Profile, related_name='readable_books') 
    
    class Meta:
        db_table = "book"

    def __str__(self):
        return f"(ID:{self.id}), Book by {self.owner.name}"


class LP(models.Model):
    owner = models.ForeignKey(Profile, related_name='lps', on_delete=models.CASCADE)
    book = models.OneToOneField(Book, on_delete=models.CASCADE)
    article = models.TextField()
    
    class Meta:
        db_table = "lp"

    def __str__(self):
        return f"(ID:{self.id}), LP for {self.book.name}"


class Review(models.Model):
    owner = models.ForeignKey(Profile, related_name='reviews', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='reviews', on_delete=models.CASCADE)
    is_parent = models.BooleanField(default=True)
    is_child = models.BooleanField(default=False)
    order_within_thread = models.IntegerField()
    order = models.IntegerField()
    
    class Meta:
        db_table = "review"

    def __str__(self):
        return f"(ID:{self.id}), {self.owner.name}'s review of {self.book.title}"

