from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'status', 'player_cards', 'dealer_cards', 
                 'player_score', 'dealer_score', 'created_at']