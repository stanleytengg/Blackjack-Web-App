from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.IntegerField(default=1000)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    total_won = models.IntegerField(default=0)
    total_lost = models.IntegerField(default=0)
    
    @property
    def net_profit(self):
        return self.total_won - self.total_lost

    def log_balance_change(self):
        BalanceHistory.objects.create(
            player=self,
            balance=self.balance
        )

    def __str__(self):
        return f"{self.user.username} (Balance: ${self.balance})"

class BalanceHistory(models.Model):
    player = models.ForeignKey('Player', on_delete=models.CASCADE)
    balance = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

class Game(models.Model):
    GAME_STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('PLAYER_WON', 'Player Won'),
        ('DEALER_WON', 'Dealer Won'),
        ('TIE', 'Tie'),
    )

    player = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=GAME_STATUS_CHOICES, default='ACTIVE')
    player_cards = models.JSONField(default=list)
    dealer_cards = models.JSONField(default=list)
    deck = models.JSONField(default=list)
    player_score = models.IntegerField(default=0)
    dealer_score = models.IntegerField(default=0)
    bet = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'game'