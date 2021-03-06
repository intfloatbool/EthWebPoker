﻿using EthWebPoker.Games.CardGames.CardBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EthWebPoker.Games.CardGames.HoldemPoker
{
    public class ComboCards
    {
        public static ComboCards Create(Combo combo, List<Card> cards)
        {
            return new ComboCards(combo, cards);
        }

        public static ComboCards CreateEmpty()
        {
            return new EmptyCombo();
        }
        public Combo Combo { get; private set; }
        public List<Card> Cards { get; private set; }

        protected ComboCards(Combo combo, List<Card> cards)
        {
            this.Combo = combo;
            this.Cards = cards;
        }
    }
}
