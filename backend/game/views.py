from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Game, Player
from .serializers import UserSerializer, PlayerSerializer, GameSerializer
from .gameplay import Gameplay

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """ Register a new user """
    
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """ Authenticate a user """
    
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
        
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_profile(request):
    """ Get user profile """
    
    player = Player.objects.get(user=request.user)
    serializer = PlayerSerializer(player)
    return Response(serializer.data)

class GameViewSet(viewsets.ModelViewSet):
    
    # Formats the data
    serializer_class = GameSerializer
    
    # Restricts access to authenticated users
    permission_classes = [permissions.IsAuthenticated]
    
    # Defines the queryset
    def get_queryset(self):
        return Game.objects.filter(player=self.request.user)

    def create(self, request):
        """ Start a new game with a bet """
        
        player = Player.objects.get(user=request.user)
        bet = request.data.get('bet', 10)

        # Prevents bypass from the frontend
        if player.balance < bet:
            return Response(
                {'error': 'Insufficient funds'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Creates a new deck
        deck = Gameplay.create_deck()
        
        # Deals initial cards
        player_cards, dealer_cards, remaining_deck = Gameplay.deal_initial_cards(deck)
        
        # Calculates initial scores
        player_score = Gameplay.calculate_score(player_cards)
        dealer_score = Gameplay.calculate_score(dealer_cards)
        
        # Checks if anyone has blackjack
        initial_status = Gameplay.check_game_status(player_cards, dealer_cards, False)
        
        # Creates new game instance
        game = Game.objects.create(
            player=request.user,
            deck=remaining_deck,
            player_cards=player_cards,
            dealer_cards=dealer_cards,
            player_score=player_score,
            dealer_score=dealer_score,
            status=initial_status,
            bet=bet
        )
        
        # Updates player's balance
        player.balance -= bet
        player.save()
        
        # Updates player's stats if natural blackjack is hit
        if initial_status == 'PLAYER_WON':
            self.update_game_statistics(game, player)
            
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update_game_statistics(self, game, player):
        """ Update player's stats when game ends """
        winnings = 0
        
        if game.status == 'PLAYER_WON':
            if game.player_score == 21 and len(game.player_cards) == 2:
                winnings = game.bet * 2.5
            else:
                winnings = game.bet * 2
                
            player.balance += winnings
            player.total_won += (winnings - game.bet)
            player.games_won += 1
        
        elif game.status == 'DEALER_WON':
            player.total_lost += game.bet
            
        else:
            player.balance += game.bet
        
        player.games_played += 1
        player.save()

    @action(detail=True, methods=['post'])
    def hit(self, request, pk=None):
        """Player draws another card"""
        
        game = self.get_object()
        
        # Checks if game is still active
        if game.status != 'ACTIVE':
            return Response(
                {'error': 'Game is already complete'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            deck, new_player_cards, new_card = Gameplay.hit(game.deck, game.player_cards)
            
            # Calculates new score
            player_score = Gameplay.calculate_score(new_player_cards)
            
            # Checks game status
            game_status = Gameplay.check_game_status(new_player_cards, game.dealer_cards, False)
            
            # Updates game
            game.deck = deck
            game.player_cards = new_player_cards
            game.player_score = player_score
            game.status = game_status
            game.save()
            
            serializer = self.get_serializer(game)
            return Response(serializer.data)
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def stand(self, request, pk=None):
        """Player stands, dealer plays"""
        
        game = self.get_object()
        
        if game.status != 'ACTIVE':
            return Response(
                {'error': 'Game is already complete'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Dealer plays their hand
            final_deck, final_dealer_cards = Gameplay.play_dealer_hand(game.deck, game.dealer_cards)
            
            # Calculates final scores
            dealer_score = Gameplay.calculate_score(final_dealer_cards)
            
            # Determines final game status
            game_status = Gameplay.check_game_status(game.player_cards, final_dealer_cards, True)

            # Update game
            game.deck = final_deck
            game.dealer_cards = final_dealer_cards
            game.dealer_score = dealer_score
            game.status = game_status
            game.save()
            
            # Updates player statistics
            player = Player.objects.get(user=request.user)
            self.update_game_statistics(game, player)

            serializer = self.get_serializer(game)
            return Response(serializer.data)
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )