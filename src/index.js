import "./styles.css";

const quizContainer = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");

const url = "https://my-json-server.typicode.com/ramneek2504/quiz-app";

// SELECTED MODE
let selectedMode = null;

// GET ALL THE INPUTS FOR MODE SELECT
const modeInputs = document.querySelectorAll('input[name="mode"');

// WHENEVER THE INPUT CHANGE, UPDATE THE SELECTED MODE
modeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    console.log(e.target.value);
    selectedMode = e.target.value;
  });
});

startBtn.addEventListener("click", startQuiz);

// fetch the questions from the server
async function getQuestions() {
  const response = await fetch(`${url}/modes?mode=${selectedMode}`);
  const data = await response.json();

  const questions = data[0].questions;

  return questions;
}

async function submitAnswers(data) {
  // console.log(data);
  data.forEach(async (answer) => {
    await fetch(`${url}/userAnswers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(answer)
    });
  });
}

// process and display the questions in the DOM
async function displayQuesitons() {
  const questions = await getQuestions();

  questions.forEach((question, index) => {
    // create a container for holding each question
    const quesContainer = document.createElement("div");
    quesContainer.setAttribute("class", "ques-container");

    // create a container for holding all the options
    const optionsContainer = document.createElement("div");
    optionsContainer.setAttribute("class", "options-container");

    // create element to display question heading
    const questionHeading = document.createElement("h4");
    questionHeading.setAttribute("class", "ques-heading");

    // set the text of question heading
    questionHeading.innerText = `${index + 1}.) ${question.question}`;

    // for every option of the current question in loop
    for (const option in question.options) {
      // get the option value
      const value = question.options[option];

      // add the option in the option container for the current question
      optionsContainer.innerHTML += `
		  <label class="option">
		    <input type='radio' value='${value}' name='${
        question.question
      }' class='answer-option' data-correct-answer='${
        question.options[question.correctKey]
      }'>
        <p>${value}</p>
		  </label>
		  `;
    }

    // add the heading to question container
    quesContainer.appendChild(questionHeading);

    // add all the options for the current question
    quesContainer.appendChild(optionsContainer);

    // display the quesiton in the DOM
    quizContainer.appendChild(quesContainer);
  });

  const quizSubmitBtn = document.createElement("button");
  quizSubmitBtn.innerText = "Submit";
  quizSubmitBtn.addEventListener("click", handleQuizSubmit);
  quizContainer.appendChild(quizSubmitBtn);
}

function handleQuizSubmit() {
  const quesContainer = document.querySelectorAll(".ques-container");

  const answers = [];

  quesContainer.forEach((ques) => {
    const options = Array.from(ques.querySelectorAll("input"));

    const answerElem = options.filter((elem) => elem.checked);

    if (answerElem.length === 0) {
      answers.push({
        ques: options[0].name,
        answer: null,
        correctAnswer: options[0].dataset.correctAnswer
      });
    } else {
      answers.push({
        ques: answerElem[0].name,
        answer: answerElem[0].value,
        correctAnswer: answerElem[0].dataset.correctAnswer
      });
    }
  });

  submitAnswers(answers);
}

async function startQuiz() {
  quizContainer.innerHTML = "";

  displayQuesitons();
}
