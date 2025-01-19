const questions = [
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "What is 2 + 2?",
        choices: ["3", "4", "5", "6"],
        correctAnswer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        choices: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
        correctAnswer: 1
    },
    {
        question: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1
    },
    {
        question: "Your new question here?",
        choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
        correctAnswer: 0  // Index of correct answer (0-3)
    }
];

class QuizApp {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.initElements();
        this.initEventListeners();
        this.showScreen('start-screen');
    }

    initElements() {
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.questionText = document.getElementById('question-text');
        this.choicesContainer = document.getElementById('choices');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.scoreSpan = document.getElementById('score');
        this.maxScoreSpan = document.getElementById('max-score');
        
        this.totalQuestionsSpan.textContent = this.questions.length;
        this.maxScoreSpan.textContent = this.questions.length;

        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        this.progressFill = progressBar.querySelector('.progress-fill');
        this.questionScreen.insertBefore(progressBar, this.questionText);
    }

    initEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
    }

    showScreen(screenId) {
        ['start-screen', 'question-screen', 'result-screen'].forEach(id => {
            document.getElementById(id).classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.showQuestion();
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    showQuestion() {
        this.showScreen('question-screen');
        const question = this.questions[this.currentQuestionIndex];
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.questionText.textContent = question.question;
        this.updateProgress();
        
        // Clear previous event listener if exists
        if (this.choiceClickHandler) {
            this.choicesContainer.removeEventListener('click', this.choiceClickHandler);
        }
        
        this.choicesContainer.innerHTML = '';
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice;
            button.dataset.index = index;
            this.choicesContainer.appendChild(button);
        });

        // Create bound event handler and store it
        this.choiceClickHandler = this.handleChoiceClick.bind(this);
        this.choicesContainer.addEventListener('click', this.choiceClickHandler);
    }

    handleChoiceClick(event) {
        const button = event.target;
        if (!button.classList.contains('choice-btn') || button.disabled) return;

        const choiceIndex = parseInt(button.dataset.index);
        this.handleAnswer(choiceIndex);
    }

    handleAnswer(choiceIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const buttons = this.choicesContainer.getElementsByClassName('choice-btn');
        
        // Disable all buttons and remove hover effects
        Array.from(buttons).forEach(button => {
            button.disabled = true;
            button.style.pointerEvents = 'none';
            button.style.transform = 'none';
            button.style.boxShadow = 'none';
        });
        
        // Store user's answer
        this.userAnswers[this.currentQuestionIndex] = choiceIndex;
        
        // Show correct/incorrect feedback
        const isCorrect = choiceIndex === question.correctAnswer;
        
        // Add feedback classes
        buttons[choiceIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            buttons[question.correctAnswer].classList.add('correct');
        }

        if (isCorrect) this.score++;

        // Add next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 
            this.currentQuestionIndex === this.questions.length - 1 
                ? 'Show Results' 
                : 'Next Question';
        nextButton.className = 'next-btn';
        nextButton.addEventListener('click', () => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.showQuestion();
            } else {
                this.showResults();
            }
        });

        // Remove existing next button if any
        const existingNextBtn = this.questionScreen.querySelector('.next-btn');
        if (existingNextBtn) {
            existingNextBtn.remove();
        }

        // Add next button to the question screen
        this.questionScreen.appendChild(nextButton);
    }

    showResults() {
        this.showScreen('result-screen');
        
        const resultScreen = document.getElementById('result-screen');
        resultScreen.innerHTML = ''; // Clear existing content
        
        const percentage = (this.score / this.questions.length) * 100;
        
        // Create and add score container
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'score-container';
        scoreContainer.innerHTML = `
            <h2>Quiz Complete!</h2>
            <div class="score-percentage">${percentage.toFixed(0)}%</div>
            <p>You scored ${this.score} out of ${this.questions.length}</p>
        `;
        resultScreen.appendChild(scoreContainer);
        
        // Create and add result details
        const resultDetails = document.createElement('div');
        resultDetails.className = 'result-details';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const questionResult = document.createElement('div');
            questionResult.className = 'question-result';
            
            questionResult.innerHTML = `
                <p class="question-text">
                    <span class="question-number">Q${index + 1}:</span> 
                    ${question.question}
                </p>
                <p class="user-answer ${userAnswer === question.correctAnswer ? 'correct' : 'incorrect'}">
                    Your Answer: ${question.choices[userAnswer]}
                </p>
                <p class="correct-answer">
                    Correct Answer: ${question.choices[question.correctAnswer]}
                </p>
            `;
            
            resultDetails.appendChild(questionResult);
        });
        resultScreen.appendChild(resultDetails);
        
        // Create and add restart button
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restart-btn';
        restartBtn.textContent = 'Restart Quiz';
        restartBtn.addEventListener('click', () => this.restartQuiz());
        resultScreen.appendChild(restartBtn);
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.startQuiz();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new QuizApp(questions);
}); 