// Select Element
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answresArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let theResultsContainer = document.querySelector(".results");
let countDownEle = document.querySelector(".countdown");



// set option
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;




function getQuestions () {
    let myRequest = new XMLHttpRequest ();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            // console.log(questionCount)
            // craete bullets & set count
            createBullets (qCount);
            // add question Data
            addQuestionData(questionObject[currentIndex], qCount);

            // countdown duration
            countDown(150, qCount);


            // click on sumbit
            submitButton.onclick =  () => {
                // get right answer
                let rightAnswer = questionObject[currentIndex].right_answer;
                // console.log(rightAnswer);
                // increase index
                currentIndex++;
                // check the answer
                checkAnswer(rightAnswer, qCount);

                // remove provious element
                quizArea.innerHTML = '';
                answresArea.innerHTML = '';

            // add question Data
            addQuestionData(questionObject[currentIndex], qCount);

            // handle bullets clases
            handleBullets();

            // countdown duration
            clearInterval(countDownInterval);
            countDown(150, qCount);


            // show results
            showResults(qCount);
            }
        }
    }
    myRequest.open("Get","htmlQuestion.json",true);
    myRequest.send();
}
getQuestions ();

// creat function Bullets
function createBullets (num) {
    countSpan.innerHTML = num;
    // craete bullets
    for (let i = 0 ; i < num ; i++) {
        // create span
        let thebullet = document.createElement("span");
        // check if the first question is display
        if (i === 0) {
            thebullet.className = "on";
        }
        // append span to the bullets container
        bulletsSpanContainer.appendChild(thebullet)
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");
    // create text question
    let questionText = document.createTextNode(obj["title"]);
    // append questionText to questionTitle
    questionTitle.appendChild(questionText);
    // append questionTitle to quizArea
    quizArea.appendChild(questionTitle)

    // create the answers
    for (let i = 0 ; i < 4 ; i++){
        // create maindiv
    let mainDiv = document.createElement("div");
    // add class to maindiv
    mainDiv.className = 'answer';
    let radioInput = document.createElement("input");
    // craete radio + id +type +name + data Attributte
        radioInput.type = "radio";
        radioInput.name = "question";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // make first element checked
        if (i === 1) {
            radioInput.checked = true;
        };

        // create th label
        let theLabel = document.createElement("label");
        // add for attributte
        theLabel.htmlFor = `answer_${i}`;
        // craete label text
        let theLabelText =document.createTextNode(obj[`answer_${i}`]);
        // the appending
        theLabel.appendChild(theLabelText);
        // append label+input to the maindiv
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)
        // append main div to answers-area
        answresArea.appendChild(mainDiv)
        };
    };
};
function checkAnswer(rAnswer, count) {
    let answers =document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0 ; i < answers.length ; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    // console.log(`The Right answer is ${rAnswer}`);
    // console.log(`the choosen answer is ${theChoosenAnswer}`);

    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
        // console.log("GOood");
    }
}

function handleBullets () {
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        };
    });
};

function showResults (count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answresArea.remove();
        bullets.remove();
        submitButton.remove();
        if (rightAnswer > (count / 2) && rightAnswer < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
        }else if (rightAnswer === count) {
            theResults = `<span class="perfect">Perfect</span>, You Are Hero.`;
        }else{
            theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
        }
        theResultsContainer.innerHTML = theResults;
        theResultsContainer.style.padding = "15px";
        theResultsContainer.style.backgroundColor = "white";
        theResultsContainer.style.margin = "10px";
    }
}

function countDown (duration , count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
        
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            
            countDownEle.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.onclick();
                // console.log("finish")
            };
        },1000);
    };
};