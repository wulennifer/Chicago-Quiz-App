let questionNumber = 0;
let score = 0;

// HTML for how each question will generate
function appendQuestionForm() {
  $('.questionForm-section').html(
    `<div class='form-wrapper'>
      <header class='question-container' role='banner'>
        <h2 id='question'>${STORE[questionNumber].question}</h2>
      </header>
      <form>
        <fieldset>
          <legend>Chicago Quiz Answer Options</legend>
          <label class='answerOption'>
            <input type='radio' value='${STORE[questionNumber].answers[0]}' name='answer1' required />
            <span>${STORE[questionNumber].answers[0]}</span>
          </label>
          <label class='answerOption'>
            <input type='radio' value='${STORE[questionNumber].answers[1]}' name='answer2' required />
            <span>${STORE[questionNumber].answers[1]}</span>
          </label>
          <label class='answerOption'>
            <input type='radio' value='${STORE[questionNumber].answers[2]}' name='answer3' required />
            <span>${STORE[questionNumber].answers[2]}</span>
          </label>
          <label class='answerOption'>
            <input type='radio' value='${STORE[questionNumber].answers[3]}' name='answer4' required />
            <span>${STORE[questionNumber].answers[3]}</span>
          </label>
          <button type='submit' class='submitButton'>Submit</button>
        </fieldset>
      </form>
      </div>`);
}

function appendQuestionNumber() {
  $('#count').text(`${questionNumber+1}`);
}

function appendScore() {
  $('#score').text(`${score}`);
}

function generateQuestionSection() {
  $('.quiz-wrapper').html(
    `<div class="question-tracker">
      <span id="question-count"><strong id="count">${questionNumber+1}</strong>/10</span>
     </div>
     <section class="questionForm-section"></section>
     <div class="score-tracker">
      <span id="score-count">Score: <strong id="score">${score}</strong></span>
     </div>`);
  renderQuestion();
}

// Start quiz when "BEGIN" is clicked
function startQuiz() {
  // generateQuestion #1
  $('.startPage-section').on('click', '.startButton', function (event) {
      generateQuestionSection();
  });
}

// Render question in DOM
function renderQuestion() {

    if (questionNumber < STORE.length) {
      // renderCurrentQuestion
      appendQuestionForm();
      // updateQuestionNumber
      appendQuestionNumber();
      // upateScore
      appendScore();
    } else {
      // User has reached the end of the quiz
      displayResults();
      restartQuiz();
    }
}

// User clicks Submit button for a question and Result page shows
function userSubmitAnswer() {

  // Tried .on('click', '.submitButton') and kept returning undefined!
  // .on('click') can be used on anything and indicates that something has been clicked. It will execute and miss catches taht .on('submit') provides
  // .on('submit')is used on a form only and indicates that information is being submitted.
  
  $('main').on('submit', 'form', function(event) {
    // Stops default submission behavior
    event.preventDefault();
    $('.question-tracker').hide();
    $('.score-tracker').hide();
    let selectedAnswer = $('input[name=answer]:checked').val();
    let correctAnswer = `${STORE[questionNumber].correctAnswer}`;
    if (questionNumber < 9){
      determineFeedback(selectedAnswer, correctAnswer);
      appendNextButton();
    } else {
      determineFeedback(selectedAnswer, correctAnswer);
      appendResultsButton();
    }
  }); 
}

function determineFeedback(select, correct) {
  if (select === correct) {
    renderFeedback('correctFeedback');
    updateScore();
  } else {
    renderFeedback('wrongFeedback');
    $('p').append('<p>The correct answer is: <strong>' + correct + '</strong></p>');
  }
}

function appendNextButton() {
  $('.feedback').append('<button type="button" class="nextButton">Next</button>');
}

function appendResultsButton() {
  $('.feedback').append('<button type="button" class="resultsButton">Results</button>');
}

let feedbackText = {
  'correctFeedback': [
    'Correct!',
    'You\'re a true Chicagoan!'
    ],
  'wrongFeedback': [
    'Incorrect!',
    'You\'re obviously not from Chicago...'
    ]    
};

function renderFeedback(feedbackCondition) {
  $('.questionForm-section').html(
    `<div class='feedback'>
      <h3>${feedbackText[feedbackCondition][0]}</h3>
        <p>${feedbackText[feedbackCondition][1]}</p>
     </div>`);
}

function clickResults() {
  $('main').on('click', '.resultsButton', function(event) {
    $('.question-tracker').hide();
    $('.score-tracker').hide();
    changeQuestionNumber();
    renderQuestion();
  });
}

// Increment question # by 1 and then render it into the DOM
function nextQuestion() {
  $('main').on('click', '.nextButton', function(event) {
    $('.question-tracker').show();
    $('.score-tracker').show();
    changeQuestionNumber();
    renderQuestion();
  });
}

let resultText =  {
  'goodResult':[
    'Wow!',
    'You really know your Chi-Town!',
  ],
  
  'badResult':[
    'Better luck next time...',
    'Plan your next vacation to Chicago to learn more about the greatest city!'
  ]
};

function renderResults(resultCondition) { 
  $('.questionForm-section').html(
    `<div class='results'>
      <h3>${resultText[resultCondition][0]}</h3>
        <p>${resultText[resultCondition][1]}</p>
        <p>You got <strong>${score}</strong> out of 10 questions correct.</p>
        <button type='button' class='restartButton'>Restart</button>
     </div>
    `);
}

function appendRestartButton() {
  $('div').append('<button type="button" class="restartButton">Restart</button>');
}

function displayResults() {
  if (score > 7) {
    renderResults('goodResult');
  }
  else {
    renderResults('badResult');
  }
}

// Go back to startPage and set questionNumber and score back to 0
function restartQuiz() {
  $('.questionForm-section').on('click', '.restartButton', function(event) {
    questionNumber = 0;
    score = 0;
    location.reload();
  });
}

// Increment question number
function changeQuestionNumber () {
  if (questionNumber === STORE.length) {
    return;
  }
  questionNumber++;
}

// Increment score
function changeScore () {
  score ++;
}

// Change score in DOM
function updateScore() {
  changeScore();
  $('#score').text(score);
}

// Start quiz, render the first question, load form, then watch for .nextButton click
function createQuiz() {
  startQuiz();
  userSubmitAnswer();
  nextQuestion();
  clickResults();
}

$(createQuiz());