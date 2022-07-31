const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const result = document.getElementById('result');
const correctScore = document.getElementById('correct-score');
const totalQuestion = document.getElementById('total-question');

let correctAnswer = '',
  askedCount = 0,
  correctScoreCount = 0,
  totalQuestionCount = 10;

// load question from API
async function loadQuestion() {
  const APIUrl = 'https://opentdb.com/api.php?amount=1';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  result.innerHTML = '';
  showQuestion(data.results[0]);
}

// event listeners
function eventListeners() {
  checkBtn.addEventListener('click', checkAnswer);
  playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  eventListeners();
  totalQuestion.textContent = totalQuestionCount;
  correctScore.textContent = correctScoreCount;
});

// display question and options
function showQuestion(data) {
  checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  console.log('correctAnswer: ', correctAnswer);
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

  question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
          )
          .join('')}
    `;
  selectOption();
}

// options selection
function selectOption() {
  options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if (options.querySelector('.selected')) {
        const activeOption = options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      option.classList.add('selected');
    });
  });
}

// answer checking
function checkAnswer() {
  checkBtn.disabled = true;
  if (options.querySelector('.selected')) {
    let selectedAnswer = options.querySelector('.selected span').textContent;
    if (selectedAnswer == correctAnswer) {
      correctScoreCount++;
      result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  } else {
    result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    checkBtn.disabled = false;
  }
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestionCount) {
    setTimeout(() => {
      console.log('You win!');
    }, 1000);

    result.innerHTML += `<p>Your score is ${correctScoreCount}.</p>`;
    playAgainBtn.style.display = 'block';
    checkBtn.style.display = 'none';
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  totalQuestion.textContent = totalQuestionCount;
  correctScore.textContent = correctScoreCount;
}

function restartQuiz() {
  correctScoreCount = askedCount = 0;
  playAgainBtn.style.display = 'none';
  checkBtn.style.display = 'block';
  checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
