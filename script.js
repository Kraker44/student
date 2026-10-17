/* =========================================================
   0. КУРСОР-ПОДСВЕТКА
========================================================= */
const cursorGlow = document.getElementById('cursorGlow');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;

window.addEventListener('mousemove', e => {
  tx = e.clientX; ty = e.clientY;
  cursorGlow.style.opacity = '1';
});

function animateCursor() {
  cx += (tx - cx) * 0.12;
  cy += (ty - cy) * 0.12;
  cursorGlow.style.left = cx + 'px';
  cursorGlow.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* =========================================================
   1. REVEAL ПРИ СКРОЛЛЕ
========================================================= */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* =========================================================
   2. СЧЁТЧИКИ
========================================================= */
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let n = 0;
    const step = Math.max(1, Math.round(target / 30));
    const tick = () => {
      n += step;
      if (n >= target) { el.textContent = target; }
      else { el.textContent = n; requestAnimationFrame(tick); }
    };
    tick();
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => counterIO.observe(el));

/* =========================================================
   3. МАГНИТНЫЕ КНОПКИ
========================================================= */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* =========================================================
   4. МОБИЛЬНОЕ МЕНЮ
========================================================= */
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');

burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  burger.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   5. МОДАЛЬНЫЕ ОКНА
========================================================= */
const modal = document.getElementById('modal');
const modalBodies = {
  report: document.getElementById('modalReport'),
  volunteer: document.getElementById('modalVolunteer'),
  success: document.getElementById('modalSuccess'),
};

function openModal(type) {
  Object.values(modalBodies).forEach(b => (b.hidden = true));
  modalBodies[type].hidden = false;
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.querySelectorAll('.form').forEach(f => f.reset());
}
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.openModal));
});
document.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeModal);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal();
});
document.querySelectorAll('.form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    Object.values(modalBodies).forEach(b => (b.hidden = true));
    modalBodies.success.hidden = false;
  });
});

/* =========================================================
   6. ТЕСТ
========================================================= */
const quizData = [
  {
    question: 'Тебе звонит человек и представляется сотрудником банка. Он говорит, что с твоей карты пытаются украсть деньги, и просит назвать код из SMS, чтобы отменить операцию. Как ты поступишь?',
    options: [
      'Назову код, ведь нужно срочно спасти деньги.',
      'Завершу звонок и самостоятельно позвоню в банк по официальному номеру.',
      'Попрошу собеседника назвать номер моей карты.'
    ],
    correct: 1,
    explanation: 'Правильно — завершить разговор, не сообщать коды и самостоятельно позвонить в банк по номеру с официального сайта или банковской карты.'
  },
  {
    question: 'Тебе приходит сообщение: «Вам положена выплата 25 000 рублей! Получите деньги сегодня, перейдя по ссылке». Отправитель неизвестен, а на сайте просят ввести данные банковской карты. Что делать?',
    options: [
      'Перейду по ссылке, вдруг выплата настоящая.',
      'Перешлю сообщение друзьям, чтобы они тоже получили выплату.',
      'Не буду открывать ссылку и проверю информацию через официальный сайт ведомства.'
    ],
    correct: 2,
    explanation: 'Не переходите по ссылке и не вводите банковские данные. Проверьте информацию о выплате на официальном сайте ведомства, самостоятельно открыв его через браузер.'
  },
  {
    question: 'Ты нашёл смартфон по очень низкой цене. Продавец торопит тебя и просит перевести предоплату на карту, обещая отправить товар сразу после оплаты. У магазина почти нет отзывов. Как поступить?',
    options: [
      'Переведу деньги, пока товар не купил кто-то другой.',
      'Проверю продавца и отзывы, а оплату буду проводить безопасным способом.',
      'Отправлю продавцу фотографию банковской карты для подтверждения заказа.'
    ],
    correct: 1,
    explanation: 'Проверьте историю продавца, отзывы и условия покупки. Не переводите предоплату незнакомому продавцу под давлением и используйте безопасный способ оплаты через проверенную площадку.'
  },
  {
    question: 'Твой друг пишет в мессенджере: «Срочно одолжи денег, переведи на эту карту. Объясню позже». Сообщение кажется необычным, а на звонки он не отвечает. Что ты сделаешь?',
    options: [
      'Сразу переведу деньги, ведь это мой друг.',
      'Спрошу в переписке, почему ему нужны деньги.',
      'Свяжусь с другом другим способом и проверю, действительно ли он просит деньги.'
    ],
    correct: 2,
    explanation: 'Не переводите деньги сразу. Позвоните другу по сохранённому номеру или свяжитесь с ним другим способом, чтобы убедиться, что сообщение отправил именно он.'
  },
  {
    question: 'Тебе пишет незнакомец и предлагает подработку: нужно получать деньги на свою банковскую карту и переводить их другим людям. За каждый перевод обещают заплатить несколько тысяч рублей. Собеседник утверждает, что работа полностью легальная и никаких рисков нет. Как ты поступишь?',
    options: [
      'Соглашусь: я просто перевожу чужие деньги и не участвую в мошенничестве.',
      'Попрошу предоплату, а затем решу, соглашаться ли на работу.',
      'Откажусь, не буду переводить чужие деньги через свою карту и сообщу о подозрительном предложении в банк или платформу.'
    ],
    correct: 2,
    explanation: 'Через твою карту могут переводить украденные деньги. Даже если ты просто пересылаешь их за вознаграждение, тебя могут привлечь к ответственности и заблокировать банковские счета.'
  }
];

const quizApp = document.getElementById('quizApp');
const quizScreens = quizApp.querySelectorAll('.quiz__screen');
const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl = document.getElementById('quizOptions');
const quizFeedbackEl = document.getElementById('quizFeedback');
const quizFeedbackTitle = document.getElementById('quizFeedbackTitle');
const quizFeedbackText = document.getElementById('quizFeedbackText');
const quizProgressText = document.getElementById('quizProgressText');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizNextBtn = document.getElementById('quizNext');
const quizScoreEl = document.getElementById('quizScore');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultText = document.getElementById('quizResultText');

let quizIndex = 0;
let quizScore = 0;
let answered = false;

function showQuizScreen(name) {
  quizScreens.forEach(s => s.classList.toggle('quiz__screen--active', s.dataset.screen === name));
}
function startQuiz() {
  quizIndex = 0; quizScore = 0;
  showQuizScreen('question');
  renderQuestion();
}
function renderQuestion() {
  answered = false;
  const q = quizData[quizIndex];
  quizProgressText.textContent = `Вопрос ${quizIndex + 1} из ${quizData.length}`;
  quizProgressBar.style.width = `${(quizIndex / quizData.length) * 100}%`;
  quizQuestionEl.textContent = q.question;
  quizOptionsEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.innerHTML = `<strong>${letters[i]}.</strong> ${opt}`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    quizOptionsEl.appendChild(btn);
  });
  quizFeedbackEl.hidden = true;
}
function selectAnswer(index) {
  if (answered) return;
  answered = true;
  const q = quizData[quizIndex];
  const isCorrect = index === q.correct;
  if (isCorrect) quizScore++;
  quizOptionsEl.querySelectorAll('.option').forEach((b, i) => {
    b.disabled = true;
    if (i === q.correct) b.classList.add('option--correct');
    if (i === index && !isCorrect) b.classList.add('option--wrong');
  });
  quizFeedbackTitle.textContent = isCorrect ? 'Верно!' : 'Есть безопаснее решение';
  quizFeedbackTitle.className = 'quiz__feedback-title ' + (isCorrect ? 'ok' : 'fail');
  quizFeedbackText.textContent = q.explanation;
  quizFeedbackEl.hidden = false;
  quizNextBtn.textContent = quizIndex === quizData.length - 1 ? 'Показать результат' : 'Далее';
}
quizNextBtn.addEventListener('click', () => {
  if (quizIndex < quizData.length - 1) { quizIndex++; renderQuestion(); }
  else { showResult(); }
});
function showResult() {
  quizProgressBar.style.width = '100%';
  showQuizScreen('result');
  const total = quizData.length;
  quizScoreEl.textContent = `Правильных ответов: ${quizScore} из ${total}`;
  if (quizScore === total) {
    quizResultTitle.textContent = 'Отлично!';
    quizResultText.textContent = 'Вы уверенно распознаёте мошеннические схемы. Поделитесь этими знаниями с близкими.';
  } else if (quizScore >= 3) {
    quizResultTitle.textContent = 'Хороший результат';
    quizResultText.textContent = 'Вы знаете основные правила, но стоит повторить советы по безопасности и пройти тест ещё раз.';
  } else {
    quizResultTitle.textContent = 'Стоит подучиться';
    quizResultText.textContent = 'Мошенники используют хитрые схемы. Изучите советы по безопасности и попробуйте снова.';
  }
}
document.getElementById('quizStart').addEventListener('click', startQuiz);
document.getElementById('quizRestart').addEventListener('click', startQuiz);

/* =========================================================
   7. ИНСТРУКТАЖ
========================================================= */
const stepsApp = document.getElementById('stepsApp');
const stepsScreens = stepsApp.querySelectorAll('.steps__screen');
const stepsProgress = document.getElementById('stepsProgress');
const stepsPrev = document.getElementById('stepsPrev');
const stepsNext = document.getElementById('stepsNext');

let stepIndex = 0;
const totalSteps = stepsScreens.length;

for (let i = 0; i < totalSteps; i++) {
  const dot = document.createElement('span');
  dot.className = 'steps__dot';
  stepsProgress.appendChild(dot);
}
const dots = stepsProgress.querySelectorAll('.steps__dot');

function renderStep() {
  stepsScreens.forEach(s => s.classList.toggle('steps__screen--active', Number(s.dataset.step) === stepIndex));
  dots.forEach((d, i) => d.classList.toggle('steps__dot--done', i <= stepIndex));
  stepsPrev.disabled = stepIndex === 0;
  stepsNext.textContent = stepIndex === totalSteps - 1 ? 'Завершить' : 'Далее';
  stepsNext.disabled = stepIndex === totalSteps - 1;
}
stepsPrev.addEventListener('click', () => { if (stepIndex > 0) { stepIndex--; renderStep(); } });
stepsNext.addEventListener('click', () => { if (stepIndex < totalSteps - 1) { stepIndex++; renderStep(); } });
renderStep();

const memoLink = document.getElementById('memoDownload');
memoLink?.addEventListener('click', async (e) => {
  try {
    const res = await fetch('памятка.jpg');
    if (!res.ok) throw new Error('Файл не найден');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Памятка_Стоп_Обман.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    e.preventDefault();
  } catch (err) {
    // если fetch не сработал (например, file://), даём браузеру открыть напрямую
    console.warn('Скачивание через fetch недоступно, используется обычная ссылка.', err);
  }
});