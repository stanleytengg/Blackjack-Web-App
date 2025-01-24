from rest_framework import serializers
from .models import Game, Player
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        Player.objects.create(user=user)
        
        return user

class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Player
        fields = ('username', 'balance', 'games_played', 'games_won', 
                 'total_won', 'total_lost', 'net_profit')
        
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id', 'player', 'status', 'player_cards', 'dealer_cards',
                 'player_score', 'dealer_score', 'bet', 'created_at')