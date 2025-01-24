import random

class Gameplay:
    @staticmethod
    def create_deck(num_decks=1):
        ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
        suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
        deck = [{'rank': rank, 'suit': suit} for rank in ranks for suit in suits] * num_decks
        random.shuffle(deck)

        return deck
    
    @staticmethod
    def get_card_value(card):
        rank = card['rank']
        if rank in ['J', 'Q', 'K']:
            return [10]
        elif rank == 'A':
            return [1, 11]
        else:
            return [int(rank)]
        
    @staticmethod
    def calculate_score(cards):
        if not cards:
            return 0
            
        # Get all possible scores considering Aces
        possible_scores = [0]
        for card in cards:
            card_values = Gameplay.get_card_value(card)
            new_scores = []
            
            for value in card_values:
                for score in possible_scores:
                    new_scores.append(score + value)
                    
            possible_scores = new_scores

        # Get best score that doesn't bust
        valid_scores = [s for s in possible_scores if s <= 21]
        if valid_scores:
            return max(valid_scores)
        
        # If all scores bust, return lowest bust score
        return min(possible_scores)
    
    @staticmethod
    def check_game_status(player_cards, dealer_cards, is_dealer_turn_complete):
        player_score = Gameplay.calculate_score(player_cards)
        dealer_score = Gameplay.calculate_score(dealer_cards)

        # Check for blackjack
        player_blackjack = Gameplay.is_blackjack(player_cards)
        dealer_blackjack = Gameplay.is_blackjack(dealer_cards)

        if player_blackjack and dealer_blackjack:
            return 'TIE'
        elif player_blackjack:
            return 'PLAYER_WON'
        elif dealer_blackjack:
            return 'DEALER_WON'

        # Regular game flow
        if player_score > 21:
            return 'DEALER_WON'
        elif dealer_score > 21:
            return 'PLAYER_WON'
        elif is_dealer_turn_complete:
            if player_score > dealer_score:
                return 'PLAYER_WON'
            elif dealer_score > player_score:
                return 'DEALER_WON'
            else:
                return 'TIE'
            
        return 'ACTIVE'
    
    @staticmethod
    def is_blackjack(cards):
        return len(cards) == 2 and Gameplay.calculate_score(cards) == 21
    
    @staticmethod
    def deal_initial_cards(deck):
        if len(deck) < 4:
            raise ValueError("Not enough cards in the deck to deal initial hands.")
        
        player_cards = [deck.pop(), deck.pop()]
        dealer_cards = [deck.pop(), deck.pop()]

        return player_cards, dealer_cards, deck

    @staticmethod
    def hit(deck, cards):
        if not deck:
            raise ValueError("Deck is empty.")
        
        new_card = deck.pop()
        cards.append(new_card)
        
        return deck, cards, new_card
    
    @staticmethod
    def play_dealer_hand(deck, dealer_cards):
        while Gameplay.calculate_score(dealer_cards) < 17 and deck:
            deck, dealer_cards, _ = Gameplay.hit(deck, dealer_cards)
            
        return deck, dealer_cards
    
    @staticmethod
    def settling(game, player_bet):
        if game.status == 'PLAYER_WON':
            game.chips += player_bet
        elif game.status == 'DEALER_WON':
            game.chips -= player_bet
    
    