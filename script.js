// ----- DOM References -----
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickReplies = document.getElementById('quickReplies');

// ================= Rule-Based Logic Engine =================
// Each rule has keywords to match against the user's message (case-insensitive)
// and a list of possible responses (one is picked at random for variety).
const rules = [
  {
    keywords: ['hello', 'hi', 'hey', 'yo'],
    responses: [
      "Hey there! How can I help you today?",
      "Hello! What can I do for you?",
      "Hi! Ask me anything.",
    ],
  },
  {
    keywords: ['how are you', "how're you", 'how you doing'],
    responses: [
      "I'm just a bunch of if-else rules, but I'm doing great! How about you?",
      "Running smoothly! Thanks for asking.",
    ],
  },
  {
    keywords: ['name', 'who are you'],
    responses: [
      "I'm Nova, a rule-based chatbot built with plain JavaScript.",
      "Call me Nova! I match keywords to give you answers.",
    ],
  },
  {
    keywords: ['what can you do', 'help', 'features'],
    responses: [
      "I can chat about basic things like greetings, time, jokes, and more. Try asking me a joke!",
      "Try things like 'tell me a joke', 'what time is it', or 'thanks'.",
    ],
  },
  {
    keywords: ['joke', 'funny'],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the developer go broke? Because they used up all their cache.",
      "I would tell you a UDP joke, but you might not get it.",
    ],
  },
  {
    keywords: ['time'],
    responses: ['dynamic-time'], // handled specially below
  },
  {
    keywords: ['date', 'today'],
    responses: ['dynamic-date'], // handled specially below
  },
  {
    keywords: ['thank', 'thanks', 'thank you'],
    responses: [
      "You're welcome! 😊",
      "Anytime! Let me know if you need anything else.",
    ],
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    responses: [
      "Goodbye! Have a great day.",
      "See you later! 👋",
    ],
  },
  {
    keywords: ['bored', 'boring'],
    responses: [
      "Want to hear a joke? Just type 'joke'!",
      "How about asking me something fun, like a joke?",
    ],
  },
  {
    keywords: ['weather'],
    responses: [
      "I can't check live weather, but you could try the Weather App project instead!",
    ],
  },
  {
    keywords: ['love', 'like you'],
    responses: [
      "Aww, that's sweet! I'm just code, but I appreciate it. 💜",
    ],
  },
];

const fallbackResponses = [
  "Hmm, I'm not sure I understand. Try asking something else!",
  "I didn't quite get that. Could you rephrase?",
  "I'm a simple rule-based bot, so I might not know that one. Try 'help' to see what I can do.",
];

// Suggested quick-reply buttons shown at the start
const suggestedReplies = ['Hi there!', 'Tell me a joke', 'What can you do?', 'What time is it?'];

// ----- Match user input against rules -----
function getBotResponse(userText) {
  const text = userText.toLowerCase();

  for (const rule of rules) {
    const matched = rule.keywords.some(keyword => text.includes(keyword));
    if (matched) {
      const response = rule.responses[Math.floor(Math.random() * rule.responses.length)];

      // Handle dynamic responses (time/date) instead of static text
      if (response === 'dynamic-time') {
        return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      }
      if (response === 'dynamic-date') {
        return `Today's date is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
      }

      return response;
    }
  }

  // No rule matched -> fallback
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// ----- Render a message bubble -----
function addMessage(text, sender) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messageEl.innerHTML = `${text}<span class="message-time">${timeStr}</span>`;

  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ----- Typing Indicator -----
function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  chatMessages.appendChild(indicator);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// ----- Handle Sending a Message -----
function sendMessage(text) {
  const message = text.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  quickReplies.innerHTML = ''; // hide quick replies after first real interaction

  showTypingIndicator();

  // Simulate a natural "thinking" delay before responding
  const delay = 600 + Math.random() * 500;
  setTimeout(() => {
    removeTypingIndicator();
    const reply = getBotResponse(message);
    addMessage(reply, 'bot');
  }, delay);
}

// ----- Render Quick Reply Buttons -----
function renderQuickReplies() {
  quickReplies.innerHTML = '';
  suggestedReplies.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply-btn';
    btn.textContent = text;
    btn.addEventListener('click', () => sendMessage(text));
    quickReplies.appendChild(btn);
  });
}

// ----- Event Listeners -----
sendBtn.addEventListener('click', () => sendMessage(userInput.value));

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage(userInput.value);
});

// ----- Init -----
addMessage("Hi! I'm Nova, a rule-based chatbot. Try one of the suggestions below or type your own message!", 'bot');
renderQuickReplies();