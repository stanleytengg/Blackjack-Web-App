# game/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer
from .gameplay import Gameplay

class GameViewSet(viewsets.ModelViewSet):
    # Tells Django which data to use
    queryset = Game.objects.all()
    
    # Formats the data
    serializer_class = GameSerializer

    def create(self, request):
        """Start a new game"""
        
        # Create a new deck
        deck = Gameplay.create_deck()
        
        # Deal initial cards
        player_cards, dealer_cards, remaining_deck = Gameplay.deal_initial_cards(deck)
        
        # Calculate initial scores
        player_score = Gameplay.calculate_score(player_cards)
        dealer_score = Gameplay.calculate_score(dealer_cards)
        
        # Check if anyone has blackjack
        initial_status = Gameplay.check_game_status(player_cards, dealer_cards, False)
        
        # Create new game instance
        game = Game.objects.create(
            deck=remaining_deck,
            player_cards=player_cards,
            dealer_cards=dealer_cards,
            player_score=player_score,
            dealer_score=dealer_score,
            status=initial_status
        )
        
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def hit(self, request, pk=None):
        """Player draws another card"""
        
        game = self.get_object()
        
        # Check if game is still active
        if game.status != 'ACTIVE':
            return Response(
                {'error': 'Game is already complete'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            deck, new_player_cards, new_card = Gameplay.hit(game.deck, game.player_cards)
            
            # Calculate new score
            player_score = Gameplay.calculate_score(new_player_cards)
            
            # Check game status
            game_status = Gameplay.check_game_status(new_player_cards, game.dealer_cards, False)
            
            # Update game
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
            # Dealer play their hand
            final_deck, final_dealer_cards = Gameplay.play_dealer_hand(game.deck, game.dealer_cards)
            
            # Calculate final scores
            dealer_score = Gameplay.calculate_score(final_dealer_cards)
            
            # Determine final game status
            game_status = Gameplay.check_game_status(game.player_cards, final_dealer_cards, True)

            # Update game
            game.deck = final_deck
            game.dealer_cards = final_dealer_cards
            game.dealer_score = dealer_score
            game.status = game_status
            game.save()

            serializer = self.get_serializer(game)
            return Response(serializer.data)
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )