const envelopeButton = document.getElementById('envelope-button');
const instruction = document.getElementById('instruction');
const letter = document.getElementById('letter');
const heartBurst = document.getElementById('heart-burst');
const loveMusic = document.getElementById('love-music');
const daysTogether = document.getElementById('days-together');
const playlist = [
  'music/song-1.mp3',
];
let previousTrack = -1;
let audioContext;
let fallbackPlaying = false;

function updateDaysTogether() {
  const relationshipStart = new Date(2026, 0, 26);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const elapsedDays = Math.max(0, Math.floor((startOfToday - relationshipStart) / 86400000));
  daysTogether.textContent = elapsedDays.toLocaleString();
}

function setLetterState(isOpen) {
  envelopeButton.classList.toggle('open', isOpen);
  envelopeButton.setAttribute('aria-expanded', String(isOpen));
  envelopeButton.setAttribute('aria-label', isOpen ? 'Close your letter' : 'Open your letter');
  letter.setAttribute('aria-hidden', String(!isOpen));
  instruction.textContent = isOpen ? 'Tap the letter to tuck it away' : 'Tap the envelope to open';
  if (!isOpen) loveMusic.pause();
}

function launchHearts() {
  const colors = ['#ad3e52', '#d16c76', '#efaaa7', '#9f5360'];

  for (let index = 0; index < 16; index += 1) {
    const heart = document.createElement('span');
    const angle = (Math.PI * 2 * index) / 16 + (Math.random() - 0.5) * 0.24;
    const distance = 74 + Math.random() * 105;

    heart.className = 'burst-heart';
    heart.textContent = '\u2665';
    heart.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--y', `${Math.sin(angle) * distance - 30}px`);
    heart.style.setProperty('--size', `${14 + Math.random() * 16}px`);
    heart.style.setProperty('--turn', `${-25 + Math.random() * 50}deg`);
    heart.style.setProperty('--delay', `${Math.random() * 110}ms`);
    heart.style.color = colors[index % colors.length];
    heartBurst.appendChild(heart);
  }

  window.setTimeout(() => heartBurst.replaceChildren(), 1400);
}

function playNextSong() {
  if (!playlist.length) return;

  let nextTrack = Math.floor(Math.random() * playlist.length);
  if (playlist.length > 1) {
    while (nextTrack === previousTrack) {
      nextTrack = Math.floor(Math.random() * playlist.length);
    }
  }

  previousTrack = nextTrack;
  loveMusic.src = playlist[nextTrack];
  loveMusic.currentTime = 0;
  loveMusic.play().catch(playOriginalMelody);
}

function playOriginalMelody() {
  if (fallbackPlaying) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  fallbackPlaying = true;
  audioContext = audioContext || new AudioContext();
  const melodies = [
    [523.25, 659.25, 783.99, 659.25, 698.46, 783.99],
    [587.33, 698.46, 880, 783.99, 698.46, 587.33],
    [659.25, 783.99, 880, 1046.5, 880, 783.99],
  ];
  const melody = melodies[Math.floor(Math.random() * melodies.length)];
  const start = audioContext.currentTime + 0.04;

  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const noteStart = start + index * 0.28;

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.1, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.5);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.52);
  });

  window.setTimeout(() => { fallbackPlaying = false; }, 2300);
}

loveMusic.addEventListener('error', playOriginalMelody);
updateDaysTogether();

envelopeButton.addEventListener('click', () => {
  if (envelopeButton.classList.contains('open')) {
    setLetterState(false);
  } else {
    setLetterState(true);
    launchHearts();
    playNextSong();
  }
});
