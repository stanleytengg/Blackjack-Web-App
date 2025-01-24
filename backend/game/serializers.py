from rest_framework import serializers
from .models import Game, Player, BalanceHistory
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
        
class BalanceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BalanceHistory
        fields = ['balance', 'timestamp']

class PlayerStatsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    balance_history = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('username', 'balance', 'games_played', 'games_won', 
                 'total_won', 'total_lost', 'net_profit', 'balance_history',
                 'win_rate')

    def get_balance_history(self, object):
        history = BalanceHistory.objects.filter(player=object).order_by('timestamp')
        return [{'balance': h.balance, 'timestamp': h.timestamp} for h in history]

    def get_win_rate(self, object):
        return 0 if object.games_played == 0 else round((object.games_won / object.games_played) * 100, 2)