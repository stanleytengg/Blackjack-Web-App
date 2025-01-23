from django.db import models

# Create your models here.

class Game(models.Model):
    GAME_STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('PLAYER_WON', 'Player Won'),
        ('DEALER_WON', 'Dealer Won'),
        ('TIE', 'Tie'),
    )

    status = models.CharField(max_length=10, choices=GAME_STATUS_CHOICES, default='ACTIVE')
    player_cards = models.JSONField(default=list)
    dealer_cards = models.JSONField(default=list)
    deck = models.JSONField(default=list)
    player_score = models.IntegerField(default=0)
    dealer_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'game'