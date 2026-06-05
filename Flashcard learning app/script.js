// Backup Local Decks (App will seamlessly fall back to these if the API drops or throttles)
const backupDecks = {
  "23": [ // History
    { question: "Who built the Great Pyramid of Giza?", answer: "Pharaoh Khufu built it around 2560 BCE." },
    { question: "Which document signed in 1215 limited the powers of the English king?", answer: "The Magna Carta." },
    { question: "Who was executed during the English Civil War and ended the monarchy in 1649?", answer: "King Charles I." },
    { question: "Which war was fought between the North and South of the United States from 1861 to 1865?", answer: "The American Civil War." },
    { question: "What ancient city was destroyed by the eruption of Mount Vesuvius in 79 CE?", answer: "Pompeii." },
    { question: "Who led the Indian independence movement using nonviolent civil disobedience?", answer: "Mahatma Gandhi." },
    { question: "Which empire built the Colosseum in Rome?", answer: "The Roman Empire under Emperor Vespasian." },
    { question: "What event sparked the start of World War I?", answer: "The assassination of Archduke Franz Ferdinand." },
    { question: "What wall divided East and West Berlin until 1989?", answer: "The Berlin Wall." },
    { question: "Which ancient civilization created pyramids and hieroglyphic writing?", answer: "Ancient Egypt." }
  ],
  "17": [ // Science & Nature
    { question: "What is considered the powerhouse of the cell?", answer: "The mitochondria." },
    { question: "What is the primary gas produced during photosynthesis?", answer: "Oxygen." },
    { question: "What is H2O commonly called?", answer: "Water." },
    { question: "What force keeps planets in orbit around the sun?", answer: "Gravity." },
    { question: "What organ pumps blood through the body?", answer: "The heart." },
    { question: "What planet is known as the Red Planet?", answer: "Mars." },
    { question: "What do bees produce from nectar?", answer: "Honey." },
    { question: "What particle carries a negative electric charge?", answer: "An electron." },
    { question: "Which process do plants use to make food from sunlight?", answer: "Photosynthesis." },
    { question: "Which system includes the brain and spinal cord?", answer: "The nervous system." }
  ],
  "18": [ // Computer Science
    { question: "What does CPU stand for?", answer: "Central Processing Unit." },
    { question: "What is the time complexity of searching in a balanced binary search tree?", answer: "O(log n)." },
    { question: "Which language is commonly used to style web pages?", answer: "CSS." },
    { question: "What does HTML stand for?", answer: "HyperText Markup Language." },
    { question: "What is the name of the rule that separates objects from their implementation?", answer: "Encapsulation." },
    { question: "What is an algorithm?", answer: "A step-by-step procedure for solving a problem." },
    { question: "Which device stores data permanently on a computer?", answer: "A hard drive or SSD." },
    { question: "What does API stand for?", answer: "Application Programming Interface." },
    { question: "What is the main browser scripting language?", answer: "JavaScript." },
    { question: "Which data structure uses first-in, first-out ordering?", answer: "A queue." }
  ],
  "22": [ // Geography
    { question: "What is the capital city of Australia?", answer: "Canberra." },
    { question: "Which is the largest ocean on Earth?", answer: "The Pacific Ocean." },
    { question: "What continent is Egypt mostly located on?", answer: "Africa." },
    { question: "Which river is the longest in the world?", answer: "The Nile." },
    { question: "What country has the largest population?", answer: "China." },
    { question: "Which continent is also a country?", answer: "Australia." },
    { question: "What is the tallest mountain in the world?", answer: "Mount Everest." },
    { question: "Which U.S. state is known as the Sunshine State?", answer: "Florida." },
    { question: "What is the capital city of France?", answer: "Paris." },
    { question: "What line divides the Earth into Northern and Southern Hemispheres?", answer: "The Equator." }
  ],
  "19": [ // Mathematics
    { question: "What is the value of Pi rounded to two decimal places?", answer: "3.14." },
    { question: "What is the derivative of sin(x) with respect to x?", answer: "cos(x)." },
    { question: "What is 8 times 7?", answer: "56." },
    { question: "What is 12 divided by 4?", answer: "3." },
    { question: "What is the next number after 9?", answer: "10." },
    { question: "What is the shape with three sides called?", answer: "A triangle." },
    { question: "What is 5 squared?", answer: "25." },
    { question: "How many degrees are in a right angle?", answer: "90 degrees." },
    { question: "What do you call the result of multiplication?", answer: "The product." },
    { question: "What is 10 minus 4?", answer: "6." }
  ]
};

// Application State Parameters
let currentDeck = [];
let reviewPile = [];
let currentIndex = 0;
let masterCount = 0;
let totalCardsInSession = 0;
let activeSessionType = "full";
let activeFetchAbortController = null;

// DOM Elements
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const flashcard = document.getElementById('flashcard');
const deckSelect = document.getElementById('deck-select');

const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const cardCounter = document.getElementById('card-counter');
const accuracyCounter = document.getElementById('accuracy-counter');
const progressBarFill = document.getElementById('progress-bar-fill');

const flipBtnFront = document.getElementById('flip-btn-front');
const masterBtn = document.getElementById('master-btn');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');
const studyReviewBtn = document.getElementById('study-review-btn');

const finalMastered = document.getElementById('final-mastered');
const finalReview = document.getElementById('final-review');
const resultsSummary = document.getElementById('results-summary');

// Helper utility: Decodes raw HTML entities safely
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function createFetchWithTimeout(url, timeoutMs = 8000, signal) {
  const timeoutController = new AbortController();
  const combinedController = new AbortController();

  const onAbort = () => combinedController.abort();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  if (signal) signal.addEventListener('abort', onAbort);
  timeoutController.signal.addEventListener('abort', onAbort);

  return fetch(url, { signal: combinedController.signal }).finally(() => {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onAbort);
    timeoutController.signal.removeEventListener('abort', onAbort);
  });
}

function abortOngoingFetch() {
  if (activeFetchAbortController) {
    activeFetchAbortController.abort();
    activeFetchAbortController = null;
  }
}

function resetSessionStateForFetch() {
  abortOngoingFetch();
  currentDeck = [];
  reviewPile = [];
  currentIndex = 0;
  masterCount = 0;
  totalCardsInSession = 0;
  activeSessionType = "full";

  flashcard.classList.remove('flipped');
  questionText.textContent = "Preparing your deck...";
  answerText.textContent = "";
  cardCounter.textContent = "Cards Progress: 0/0";
  accuracyCounter.textContent = "Accuracy: 0%";
  progressBarFill.style.width = '0%';
}

async function fetchDeckFromAPI(categoryId) {
  resetSessionStateForFetch();
  activeFetchAbortController = new AbortController();

  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`;

  try {
    const response = await createFetchWithTimeout(apiUrl, 8000, activeFetchAbortController.signal);
    if (!response.ok) throw new Error(`Network response failed with status ${response.status}`);

    const data = await response.json();
    const hasValidResults = data && data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0;
    if (!hasValidResults) {
      throw new Error(`Invalid API response code ${data?.response_code}`);
    }

    currentDeck = data.results.map(item => ({
      question: decodeHTML(item.question),
      answer: decodeHTML(item.correct_answer)
    }));
    initSession();
  } catch (error) {
    loadFallback(categoryId);
  } finally {
    activeFetchAbortController = null;
  }
}

function loadFallback(categoryId) {
  const fallbackDeck = backupDecks[categoryId] || backupDecks['17'];
  currentDeck = [...fallbackDeck];
  initSession();
}

function initSession() {
  activeSessionType = 'full';
  reviewPile = [];
  currentIndex = 0;
  masterCount = 0;
  totalCardsInSession = currentDeck.length;

  quizScreen.classList.remove('hidden');
  resultsScreen.classList.add('hidden');
  updateCardContents();
}

function loadReviewDeck(dynamicData) {
  currentDeck = [...dynamicData];
  activeSessionType = 'review';
  currentIndex = 0;
  totalCardsInSession = currentDeck.length;

  quizScreen.classList.remove('hidden');
  resultsScreen.classList.add('hidden');
  updateCardContents();
}

function updateCardContents() {
  flashcard.classList.remove('flipped');

  if (currentDeck.length === 0 || currentIndex >= totalCardsInSession) {
    showResults();
    return;
  }

  questionText.textContent = currentDeck[currentIndex].question;
  answerText.textContent = currentDeck[currentIndex].answer;

  cardCounter.textContent = `Cards Progress: ${currentIndex}/${totalCardsInSession}`;
  const progressPercent = (currentIndex / totalCardsInSession) * 100;
  progressBarFill.style.width = `${progressPercent}%`;

  if (currentIndex > 0) {
    const accuracy = Math.round((masterCount / currentIndex) * 100);
    accuracyCounter.textContent = `Accuracy: ${accuracy}%`;
  } else {
    accuracyCounter.textContent = `Accuracy: 100%`;
  }
}

function flipCard() {
  flashcard.classList.toggle('flipped');
}

function handleResponse(isMastered) {
  if (isMastered) {
    masterCount++;
  } else {
    reviewPile.push(currentDeck[currentIndex]);
  }

  currentIndex++;
  flashcard.classList.remove('flipped');

  setTimeout(() => {
    updateCardContents();
  }, 250);
}

function showResults() {
  quizScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');

  finalMastered.textContent = masterCount;
  finalReview.textContent = reviewPile.length;

  if (reviewPile.length === 0) {
    resultsSummary.textContent = "Spectacular work! You have completely mastered this deck! 🌟";
    studyReviewBtn.classList.add('hidden');
  } else {
    resultsSummary.textContent = `Good effort! You mastered ${masterCount} concepts, but still have a few remaining weak spots.`;
    studyReviewBtn.classList.remove('hidden');
    studyReviewBtn.textContent = `Study Review Pile Now (${reviewPile.length} Cards)`;
  }
}

flashcard.addEventListener('click', (e) => {
  if (e.target.closest('.action-buttons') || e.target.closest('#flip-btn-front')) {
    return;
  }
  flipCard();
});

flipBtnFront.addEventListener('click', (e) => {
  e.stopPropagation();
  flipCard();
});

masterBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  handleResponse(true);
});

reviewBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  handleResponse(false);
});

deckSelect.addEventListener('change', (e) => fetchDeckFromAPI(e.target.value));
restartBtn.addEventListener('click', () => fetchDeckFromAPI(deckSelect.value));

studyReviewBtn.addEventListener('click', () => {
  const currentReviewSet = [...reviewPile];
  reviewPile = [];
  masterCount = 0;
  loadReviewDeck(currentReviewSet);
});

document.addEventListener('keydown', (e) => {
  if (quizScreen.classList.contains('hidden')) return;

  if (e.code === 'Space') {
    e.preventDefault();
    flipCard();
  } else if (flashcard.classList.contains('flipped')) {
    if (e.code === 'ArrowLeft') {
      handleResponse(false);
    } else if (e.code === 'ArrowRight') {
      handleResponse(true);
    }
  }
});

fetchDeckFromAPI(deckSelect.value);
