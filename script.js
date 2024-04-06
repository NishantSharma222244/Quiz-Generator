// script.js
function generateQuiz() {
    const selectedTopics = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const selectedDifficulty = document.getElementById('difficulty').value;
  
    const filteredQuestions = selectedTopics.reduce((acc, topic) => {
      acc = acc.concat(questionBank[selectedDifficulty].filter(question => question.topic === topic));
      return acc;
    }, []);
  
    const quizQuestions = [];
  
    for (let i = 0; i < Math.min(filteredQuestions.length, 5); i++) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      quizQuestions.push(filteredQuestions[randomIndex]);
      filteredQuestions.splice(randomIndex, 1);
    }
  
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';
  
    quizQuestions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.innerHTML = `
        <h3>Question ${index + 1}:</h3>
        <p>${question.question}</p>
      `;
      question.options.forEach(option => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question${index}`;
        input.value = option;
        const label = document.createElement('label');
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        questionElement.appendChild(label);
      });
      quizContainer.appendChild(questionElement);
    });
  
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.onclick = calculateScore;
    quizContainer.appendChild(submitButton);
  }
  
  function calculateScore() {
    const selectedDifficulty = document.getElementById('difficulty').value;
    const quizQuestions = Array.from(document.querySelectorAll('#quiz div')).map((questionElement, index) => {
      const selectedOption = questionElement.querySelector('input:checked');
      return {
        question: selectedOption ? questionElement.querySelector('p').textContent : '',
        selectedAnswer: selectedOption ? selectedOption.value : null,
        correctAnswer: selectedOption ? questionBank[selectedDifficulty].find(q => q.question === questionElement.querySelector('p').textContent)?.correctAnswer : '',
        explanation: selectedOption ? questionBank[selectedDifficulty].find(q => q.question === questionElement.querySelector('p').textContent)?.explanation : ''
      };
    });
  
    let score = 0;
    const feedbackContainer = document.getElementById('feedback');
    feedbackContainer.innerHTML = '<h2>Quiz Results:</h2>';
  
    quizQuestions.forEach(question => {
      const questionFeedback = document.createElement('div');
      questionFeedback.innerHTML = `<h3>${question.question}</h3>`;
      if (question.selectedAnswer === question.correctAnswer) {
        questionFeedback.innerHTML += '<p>Correct!</p>';
        score++;
      } else {
        questionFeedback.innerHTML += `<p>Incorrect. Correct answer: ${question.correctAnswer}</p>`;
        questionFeedback.innerHTML += `<p>Explanation: ${question.explanation}</p>`;
      }
      feedbackContainer.appendChild(questionFeedback);
    });
  
    feedbackContainer.innerHTML += `<h3>Total Score: ${score}/${quizQuestions.length}</h3>`;
  }
  