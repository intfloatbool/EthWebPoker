﻿using EthWebPoker.Games.CardGames.CardBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EthWebPoker.Games.CardGames.HoldemPoker.ComboSerachers.ConcreteSearchers
{
    public class StraightSearcher : CardSearcherBase
    {
        protected const int ORDERED_COUNT = 5;
        public override Combo SearcingCombo => Combo.STRAIGHT;

        protected override void SearchCards()
        {

            //remove duplicates
            var cardsWithoutRankDuplicates = _cardSource.Distinct(new CardRanksComparer());

            //from lowest to harder
            var sortedCardsByRank = cardsWithoutRankDuplicates.OrderBy(card => card.Rank).ToArray();
            for(int i = 0; i < sortedCardsByRank.Length; i++)
            {
                var nextCardIndex = i + 1;
                if(nextCardIndex < sortedCardsByRank.Length)
                {
                    var currentCard = sortedCardsByRank[i];
                    var nextCard = sortedCardsByRank[nextCardIndex];

                    var currentCardRankInt = (int) currentCard.Rank;
                    var nextCardRankInt = (int) nextCard.Rank;

                    var differenceBetweenRanks = nextCardRankInt - currentCardRankInt;

                    if(differenceBetweenRanks == 1)
                    {
                        if(!_searchedCards.Contains(currentCard))
                            _searchedCards.Add(currentCard);

                        _searchedCards.Add(nextCard);

                        if (_searchedCards.Count == ORDERED_COUNT)
                            break;
                    } else
                    {
                        _searchedCards.Clear();
                    }
                }           
            }

            if (_searchedCards.Count != ORDERED_COUNT)
            {
                _searchedCards.Clear();
            }
        }
    }
}
