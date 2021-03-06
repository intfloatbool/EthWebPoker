﻿using EthWebPoker.Games.CardGames.CardBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EthWebPoker.Games.CardGames.HoldemPoker.Gameplay
{
    public class CardTable : ICardHolder
    {
        public List<Card> Cards { get; private set; }
        
        public CardTable()
        {
            Cards = new List<Card>();
        }

        public void AddCard(Card card)
        {
            Cards.Add(card);
        }

        public void FoldCards()
        {
            Cards.Clear();
        }
    }
}
