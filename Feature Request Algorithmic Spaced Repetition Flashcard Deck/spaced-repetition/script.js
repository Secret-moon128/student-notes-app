/**
 * 🎓 LEITNER SYSTEM SPACED-REPETITION ENGINE
 * Core Architecture: 3-Tiered Object-Relational Memory Queues with Time-Gate Filtering
 */

const STORAGE_KEY = 'leitner_deck';

const REVIEW_INTERVALS = {
  box1: 0,
  box2: 2 * 60 * 1000,
  box3: 5 * 60 * 1000,
};

const DEFAULT_DECK = {
  box1: [
    { id: 'q1', q: 'What is the time complexity of a binary search?', a: 'O(log n)', nextReview: 0 },
    { id: 'q2', q: 'What HTML5 API allows elements to be dragged across the DOM?', a: 'The Drag and Drop API', nextReview: 0 },
  ],
  box2: [],
  box3: [],
};

let deck = cloneDeck(DEFAULT_DECK);
let currentCard = null;
let currentBoxKey = null;
let currentCardIndex = null;

function cloneDeck(sourceDeck) {
  return JSON.parse(JSON.stringify(sourceDeck));
}

function validateDeckSchema(candidate) {
  if (!candidate || typeof candidate !== 'object') return false;
  const keys = ['box1', 'box2', 'box3'];
  return keys.every((key) => Array.isArray(candidate[key]) && candidate[key].every(validateCardSchema));
}

function validateCardSchema(card) {
  return (
    card &&
    typeof card === 'object' &&
    typeof card.id === 'string' &&
    typeof card.q === 'string' &&
    typeof card.a === 'string' &&
    typeof card.nextReview === 'number'
  );
}

function loadDeck() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return cloneDeck(DEFAULT_DECK);
  }

  try {
    const parsed = JSON.parse(storedValue);
    if (!validateDeckSchema(parsed)) {
      throw new Error('Invalid deck schema');
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to load deck from localStorage:', error);
    return cloneDeck(DEFAULT_DECK);
  }
}

function persistDeck() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
}

function getNextDueCard() {
  currentCard = null;
  currentBoxKey = null;
  currentCardIndex = null;
  const now = Date.now();

  for (const boxKey of ['box1', 'box2', 'box3']) {
    const queue = deck[boxKey];
    for (let i = 0; i < queue.length; i += 1) {
      if (queue[i].nextReview <= now) {
        currentBoxKey = boxKey;
        currentCardIndex = i;
        currentCard = queue[i];
        return true;
      }
    }
  }

  return false;
}

function processUserResponse(isCorrect) {
  if (!getNextDueCard()) return;

  const queue = deck[currentBoxKey];
  const [extractedCard] = queue.splice(currentCardIndex, 1);
  const now = Date.now();

  if (isCorrect) {
    if (currentBoxKey === 'box1') {
      extractedCard.nextReview = now + REVIEW_INTERVALS.box2;
      deck.box2.push(extractedCard);
    } else {
      extractedCard.nextReview = now + REVIEW_INTERVALS.box3;
      deck.box3.push(extractedCard);
    }
  } else {
    extractedCard.nextReview = now + REVIEW_INTERVALS.box1;
    deck.box1.push(extractedCard);
  }

  persistDeck();
  document.getElementById('answer-wrapper').style.display = 'none';
  renderEngine();
}

function calculateNextAvailableSession(containerElement) {
  const now = Date.now();
  const nextReviewTimes = [];

  ['box1', 'box2', 'box3'].forEach((key) => {
    deck[key].forEach((card) => {
      if (typeof card.nextReview === 'number') {
        nextReviewTimes.push(card.nextReview);
      }
    });
  });

  if (nextReviewTimes.length === 0) {
    containerElement.innerHTML = `Deck is completely empty. Add cards to start.`;
    return;
  }

  const nextUp = Math.min(...nextReviewTimes);
  const secondsLeft = Math.max(1, Math.ceil((nextUp - now) / 1000));

  containerElement.innerHTML = `
    🎉 All caught up for now!<br /><br />
    Next session unlocks automatically in <strong>${secondsLeft}s</strong>.
  `;
}

function renderEngine() {
  const cardBody = document.getElementById('card-body');
  const questionEl = document.getElementById('card-question');
  const answerEl = document.getElementById('card-answer');
  const emptyStateEl = document.getElementById('empty-state');
  const flashcardEl = document.getElementById('flashcard-container');

  document.getElementById('count-box1').innerText = deck.box1.length;
  document.getElementById('count-box2').innerText = deck.box2.length;
  document.getElementById('count-box3').innerText = deck.box3.length;

  if (getNextDueCard()) {
    flashcardEl.style.display = 'grid';
    emptyStateEl.hidden = true;
    questionEl.innerText = currentCard.q;
    answerEl.innerText = currentCard.a;
    return;
  }

  flashcardEl.style.display = 'none';
  emptyStateEl.hidden = false;
  calculateNextAvailableSession(emptyStateEl);
}

function initEventHandlers() {
  document.getElementById('btn-reveal').addEventListener('click', () => {
    document.getElementById('answer-wrapper').style.display = 'block';
  });

  document.getElementById('btn-correct').addEventListener('click', () => processUserResponse(true));
  document.getElementById('btn-incorrect').addEventListener('click', () => processUserResponse(false));

  const addCardForm = document.getElementById('form-add-card');
  addCardForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const qInput = document.getElementById('input-q');
    const aInput = document.getElementById('input-a');
    const question = qInput.value.trim();
    const answer = aInput.value.trim();

    if (!question || !answer) return;

    const newCard = {
      id: `q_${Date.now()}`,
      q: question,
      a: answer,
      nextReview: 0,
    };

    deck.box1.push(newCard);
    persistDeck();
    qInput.value = '';
    aInput.value = '';
    renderEngine();
  });

  setInterval(renderEngine, 5000);
}

function initializeApp() {
  deck = loadDeck();
  renderEngine();
  initEventHandlers();
}

document.addEventListener('DOMContentLoaded', initializeApp);
