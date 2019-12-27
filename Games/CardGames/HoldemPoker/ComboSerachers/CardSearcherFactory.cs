﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EthWebPoker.Games.CardGames.HoldemPoker.ComboSerachers
{
    public static class CardSearcherFactory
    {
        private static Dictionary<Combo, ICardSearcher> _cardSearchers = new Dictionary<Combo, ICardSearcher>()
        {
            { Combo.HIGH_CARD, null},
            { Combo.ONE_PAIR, null},
            { Combo.TWO_PAIR, null},
            { Combo.THREE_OF_A_KIND, null},
            { Combo.STRAIGHT, null},
            { Combo.FLUSH, null},
            { Combo.FULL_HOUSE, null},
            { Combo.FOUR_OF_A_KIND, null},
            { Combo.STRAIGHT_FLUSH, null},
            { Combo.ROYAL_FLUSH, null}
        };
        public static ICardSearcher GetCardSearcherByCombo(Combo combination)
        {
            return _cardSearchers[combination];
        }
    }
}