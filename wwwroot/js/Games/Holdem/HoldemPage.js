﻿import * as CardData from "./CardData.js";
import * as Globals from "../Globals/Globals.js";
const cardPath = "/img/Games/CardsResizing";
const cardBackPath = `${cardPath}/BACK.png`;
const fetchDataUrl = '/api/HoldemGame';
const comboBorderStyle = "border: 5px solid"
const player1_borderColor = Globals.PLAYER_DATA.PLAYER_1_HEX_COLOR;
const player2_borderColor = Globals.PLAYER_DATA.PLAYER_2_HEX_COLOR;

const DEBUG = true;

const getStyleByColor = (color) => {
    return `${comboBorderStyle} ${color};`;
}

const soundsData = {
    FLIP: 'flip',
    DEALING: 'dealing',
    SHUFFLE: 'shuffle'
}

const delayToFetchMs = 2000;
let lastMatchId = -1;
let isGameInProcess = false;

const CardElements = {
    Player1_Card1: null,
    Player1_Card2: null,
    Player2_Card1: null,
    Player2_Card2: null,
    Table_Card1: null,
    Table_Card2: null,
    Table_Card3: null,
    Table_Card4: null,
    Table_Card5: null
}

const MatchInfoElements = {
    WinnerText: null,
    ComboName: null,
    WinnerContainer: null
}

document.addEventListener('DOMContentLoaded', function () {

    MatchInfoElements.WinnerText = document.getElementById('winnerNameText');
    MatchInfoElements.ComboName = document.getElementById('combinationName');
    MatchInfoElements.WinnerContainer = document.getElementById('matchInfoRow');

    MatchInfoElements.WinnerContainer.hidden = true;

    initializeCardImagesDOM();
    setInterval(handleServerData, delayToFetchMs);
    
});

function initializeCardImagesDOM() {
    for (let imgIdKey in CardElements) {
        CardElements[imgIdKey] = document.getElementById(imgIdKey);
        if (!CardElements[imgIdKey])
            log(`Cannot find card img with id ${imgIdKey} !`,true)
    }
}

async function handleServerData() {
    let response = await fetch(fetchDataUrl);

    if (response.ok) { 
        let json = await response.json();
        await handleMatchCardsAsync(json);
    } else {
        log("HTTP ERROR: " + response.status, true);
    }
}

const TABLE_SHOW_DELAY_MS = 1850;

async function showCardByDelayAsync() {
    await waitAsync(TABLE_SHOW_DELAY_MS);
    playSound(soundsData.FLIP);
}

function waitAsync(waitTime) {
    return new Promise(resolve => setTimeout(resolve, waitTime));
}

async function handleMatchCardsAsync(matchData) {

    if (isGameInProcess === true) {
        return;
    }

    if (matchData.gameResultJson === null) {
        hideAllCards();
        return;
    }

    const gameResult = JSON.parse(matchData.gameResultJson);

    if (lastMatchId === matchData.matchID)
        return;

    lastMatchId = matchData.matchID;

    log(`GameResult!: \n ${JSON.stringify(gameResult)}`);

    isGameInProcess = true;

    const player1_data = gameResult.Player1;
    const player2_data = gameResult.Player2;
    const table_data = gameResult.CardTable;

    const player1_cards = player1_data.Cards;
    const player2_cards = player2_data.Cards;
    const tableCards = table_data.Cards;

    playSound(soundsData.DEALING);

    CardElements.Player1_Card1.src = getCardImagePath(player1_cards[0]); 
    CardElements.Player1_Card2.src = getCardImagePath(player1_cards[1]); 

    CardElements.Player2_Card1.src = getCardImagePath(player2_cards[0]);
    CardElements.Player2_Card2.src = getCardImagePath(player2_cards[1]); 

    await showCardByDelayAsync();
    CardElements.Table_Card1.src = getCardImagePath(tableCards[0]);
    await showCardByDelayAsync();
    CardElements.Table_Card2.src = getCardImagePath(tableCards[1]);
    await showCardByDelayAsync();
    CardElements.Table_Card3.src = getCardImagePath(tableCards[2]);
    await showCardByDelayAsync();
    CardElements.Table_Card4.src = getCardImagePath(tableCards[3]);
    await showCardByDelayAsync();
    CardElements.Table_Card5.src = getCardImagePath(tableCards[4]);

    await waitAsync(TABLE_SHOW_DELAY_MS);

    showWinners(gameResult);  

    await waitAsync(TABLE_SHOW_DELAY_MS);

    isGameInProcess = false;
}

function showWinners(matchResult) {

    MatchInfoElements.WinnerContainer.hidden = false;
    MatchInfoElements.WinnerText.innerText = "";

    const winners = matchResult.Winners;
    for (let playerWinnerID of winners) {
        const playerKeyInData = playerWinnerID === 'PLAYER_1' ? 'Player1' : 'Player2';
        const player = matchResult[playerKeyInData];
        highlightCombo(player.ComboCards, playerWinnerID);

        MatchInfoElements.WinnerText.innerText += `${Globals.BotNames[playerWinnerID]}\n`;
        MatchInfoElements.ComboName.innerText = CardData.ComboPrettyNames[player.Combination];
    }
}

function highlightCombo(comboCards, playerType) {
    if (!comboCards)
        return;

    let borderColor = playerType === "PLAYER_1" ? player1_borderColor : player2_borderColor;
    for (let card of comboCards) {
        const cardImgName = getNameOfCard(card.Rank, card.Suit);
        let frontCards = Object.values(CardElements);
        frontCards.find((element, index, array) =>
        {
            if (element.src.includes(cardImgName)) {
                const colorStyle = getStyleByColor(borderColor);
                element.style = colorStyle;
            }
        });
    }
}

function hideAllCards() {
    MatchInfoElements.WinnerContainer.hidden = true;
    for (let imgIdKey in CardElements) {
        const cardImgElem = CardElements[imgIdKey];
        cardImgElem.style = "";
        if (cardImgElem.src != cardBackPath) {
            cardImgElem.src = cardBackPath;
        }
    }
}

function playSound(clipName) {
    let audio = null;
    log(`SoundPlaying: ${clipName}`);
    switch (clipName) {
        case soundsData.FLIP: {
            audio = new Audio('/sounds/cards/card_flip_sound.wav');
            break;
        }
        case soundsData.SHUFFLE: {
            audio = new Audio('/sounds/cards/shuffling-cards.wav');
            break;
        }
        case soundsData.DEALING: {
            audio = new Audio('/sounds/cards/dealing-card.wav');
            break;
        }
        default: {
            log(`Cannot find sound with clipname: ${clipName}!`, true);
            break;
        }
    };
    if (audio) {     
        try {
            audio.play();
        } catch (err) {
            log(`cannot play sounds: \n ${err.toString()}`, true);
        }
    }
        
}

function getCardImagePath(cardData) {
    let cardName = getNameOfCard(cardData.Rank, cardData.Suit);
    return `${cardPath}/${cardName}`;
}

function getNameOfCard(rank, suit) {
    let convertedRank = CardData.RanksDict[rank];
    let convertedSuit = CardData.SuitDict[suit];
    return `${convertedRank}_${convertedSuit}.png`;
}

function log(message, isError = false) {

    if(!DEBUG)
        return;

    if(isError === true) {
        console.error(message);
    }  else {
        console.log(message);
    }
    
}