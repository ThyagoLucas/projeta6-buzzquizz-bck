let callFunction = getQuizzes();
let arrayWithObjects = [];
let qtdQuestions = null;
let choiced = 0;
let hits = 0;
let objectTemp=null;


let createdQuizz = {};
let questionsNumber = 0;
let questionsQuantity = null;

function getQuizzes(){
    const getQuizServer = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    getQuizServer.then(loadQuizzes); 
}

function loadQuizzes(data){
   
    const allquizes = document.querySelector(".allQuizzes");
    
    for(let i = 0; i<data.data.length; i++){
        object = data.data[i];
        arrayWithObjects[i] = object;
        
        allquizes.innerHTML += `
        <article class="quizz" onclick="quizz(${i})">
            <img src="${object.image}">
            <span>${object.title}</span>
        </article>
        `
    }
}

function quizz(number){
     let object = arrayWithObjects[number];
     qtdQuestions = object.questions.length;
     objectTemp = object;

    let header = document.querySelector(".bottomBoxHeader");
    header.innerHTML = `
    <h1>${object.title}</h1>
    <img src="${object.image}">`
     
    
    let quizzesOptions = document.querySelector(".options");
    quizzesOptions.innerHTML = ``;
    
    for(let i = 0; i<object.questions.length; i++){
        quizzesOptions.innerHTML += `
            <article class="option-quizz-selected opt${i}">`
            let choices = document.querySelector('.option-quizz-selected.opt'+i);
            choices.innerHTML += `<h1>${object.questions[i].title}</h1>`
            let response = object.questions[i].answers.sort(comparador);
        for(let j = 0; j< response.length;j++){
 
            choices.innerHTML += `
            <figure class="option opt${i}${j}" onclick="selected(${number}, ${i}, ${j})">
                <img src="${response[j].image}">
                <figcaption>${response[j].text}</figcaption>
            </figure>
         `          
        }   
    }

    header.scrollIntoView(backToHome);

    let disabled = document.querySelector(".screen1");
    disabled.classList.add("disabled");
    let enabled = document.querySelector(".screen2");
    enabled.classList.remove("disabled");  

}

function selected (obj, p1, p2){
    let verifyChoices = arrayWithObjects[obj];
   
    console.log(objectTemp);
    
    
    for(let j = 0; j< verifyChoices.questions[p1].answers.length; j++){
       
        if(j==p2){
           
            if(verifyChoices.questions[p1].answers[j].isCorrectAnswer == true){
                const change = document.querySelector(`.option.opt${p1}${j}`);
                change.classList.add("correct");
                hits++;
                
            }else{
                const change = document.querySelector(`.option.opt${p1}${j}`);
                change.classList.add("wrong");
            }
            
        }else{
            if(verifyChoices.questions[p1].answers[j].isCorrectAnswer == true){
                const change = document.querySelector(`.option.opt${p1}${j}`);
                change.classList.add("opacity");
                change.classList.add("correct");
                
                
            }else{
                const change = document.querySelector(`.option.opt${p1}${j}`);
                
                change.classList.add("opacity");
                change.classList.add("wrong");
                
            }
        }
        
        let next = document.querySelector(`.option.opt${p1+1}${j}`);

        setTimeout(() => {if(next!= null){next.scrollIntoView();}}, 2000);
        
            
        
     }
     choiced++;
     
     console.log("Choiced e hits");
     console.log(choiced);
     console.log(hits);

    if(choiced == qtdQuestions){
        setTimeout(finish,1000);   
    } 
        
}

   
    

function finish (){
    
    let score = (100/qtdQuestions)*hits;
    let round = Math.ceil(score);
    

    console.log(score);
    console.log("Entrou");
    for(let i = 0; i<objectTemp.levels.length; i++){
        console.log("score e object level"+1);
        console.log(score);
        console.log(objectTemp.levels[i].minValue);
        if(score<=objectTemp.levels[i].minValue){
            console.log("Entrou no if");

           
            let result = document.querySelector(".boxResult");
            result.innerHTML = `
            <h1 class="title-result">${round}% de acerto: ${objectTemp.levels[i].title}}!</h1>
            <img src="${objectTemp.levels[i].image}">
            <h1 class="coments-result">${objectTemp.levels[i].text}</h1>
            `
            result.scrollIntoView();
            let showBoxResult = document.querySelector(".boxResult");
            showBoxResult.classList.remove("disabled");
            let showBoxButtons = document.querySelector(".returnOrReload");
            showBoxButtons.classList.remove("disabled");
            
            break;
        }

    }
}

function reload(){

    let foundIn= 0;
    for(let i = 0; i<arrayWithObjects.length;i++){
        let obj = arrayWithObjects[i];
        if(obj.id == objectTemp.id){
            foundIn = i;
        }
    }
    
    
    qtdQuestions = null;
    choiced = 0;
    hits = 0;
    objectTemp=null;
    quizz(foundIn);
    

    let ocultboxResult = document.querySelector(".boxResult");
    let ocultBoxButtons = document.querySelector(".returnOrReload");
    ocultboxResult.classList.add("disabled");
    ocultBoxButtons.classList.add("disabled");


}

function backToHome(){
    window.location.reload();
}


function comparador() { 
	return Math.random() - 0.5; 
}

// Third screen interactions

function createQuizz () {
    const screen1 = document.querySelector(".screen1");
    screen1.classList.add("disabled");

    const screen3 = document.querySelector(".screen3");
    screen3.classList.remove("disabled");
    const quizzCreationStart = document.querySelector(".quizzCreationStart");
    quizzCreationStart.classList.remove("disabled");
}

function verifyAndGoToQuizzQuestions () {
    const quizzTitle = document.getElementById("quizzTitle").value;
    const quizzImgURL = document.getElementById("quizzImgURL").value;
    const quizzQuestionsQuantity = document.getElementById("quizzQuestionsQuantity").value;
    const quizzLevelsQuantity = document.getElementById("quizzLevelsQuantity").value;

    const quizzTitleIsAcceptable = quizzTitle.length >= 20 && quizzTitle.length <= 65;
    const quizzImgURLIsAcceptable = (quizzImgURL.startsWith("http://") || quizzImgURL.startsWith("https://"));
    const quizzQuestionsQuantityIsAcceptable = parseInt(quizzQuestionsQuantity) >= 3;
    const quizzLevelsQuantityIsAcceptable = parseInt(quizzLevelsQuantity) >= 2;

    if (quizzTitleIsAcceptable && quizzImgURLIsAcceptable && quizzQuestionsQuantityIsAcceptable && quizzLevelsQuantityIsAcceptable) {
        createdQuizz.title = quizzTitle;
        createdQuizz.image = quizzImgURL;
        questionsQuantity = parseInt(quizzQuestionsQuantity);

        const quizzCreationStart = document.querySelector(".quizzCreationStart");
        quizzCreationStart.classList.add("disabled");

        const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
        quizzCreationQuestions.classList.remove("disabled");

        quizzCreationQuestions.innerHTML = `
            <h1>Crie suas perguntas</h1>
            <article class="question">
                <div class="questionTextImg">
                    <h2>Pergunta 1</h2>
                    <input id="questionText" placeholder="   Texto da pergunta">
                    <input id="questionBackground-color" placeholder="   Cor de fundo da pergunta">
                </div>
                
                <div class="correctAnswer">
                    <h2>Resposta correta</h2>
                    <input id="correctAnswer" placeholder="   Resposta correta">
                    <input id="correctAnswerImgURL" placeholder="   URL da imagem">
                </div>

                <div class="incorrectAnswers">
                    <h2>Respostas incorretas</h2>
                    <input id="incorrectAnswer1" placeholder="   Resposta incorreta 1">
                    <input id="incorrectAnswer1ImgURL" placeholder="   URL da imagem 1">
                    <input id="incorrectAnswer2" placeholder="   Resposta incorreta 2">
                    <input id="incorrectAnswer2ImgURL" placeholder="   URL da imagem 2">
                    <input id="incorrectAnswer3" placeholder="   Resposta incorreta 3">
                    <input id="incorrectAnswer3ImgURL" placeholder="   URL da imagem 3">
                </div>
            </article>
            `;

        for (let i = 0; i < parseInt(quizzQuestionsQuantity) - 1; i++) {
            quizzCreationQuestions.innerHTML += `
                <article class="minimized" onclick="maximizeQuestion(this);">
                    <h3>Pergunta ${i + 2}</h3>
                    <ion-icon name="create-outline"></ion-icon>
                </article>
                `;
        }
        quizzCreationQuestions.innerHTML += `
            <button onclick="GoToQuizzLevels();">Prosseguir pra criar níveis</button>
            `;
        
        createdQuizz.questions = [];
        return
    }

    alert("Por favor preencha os dados corretamente");
}

function GoToQuizzLevels () {
    if (verifyAndSaveQuestion() && createdQuizz.questions.length === questionsQuantity) {
        const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
        quizzCreationQuestions.classList.add("disabled");

        const quizzCreationLevels = document.querySelector(".quizzCreationLevels");
        quizzCreationLevels.classList.remove("disabled");
        return
    }

    alert("Por favor preencha os dados corretamente");
}

function verifyAndGoToQuizzFinished () {
    const levelTitle = document.getElementById("levelTitle").value;
    const minimumPercentage = document.getElementById("minimumPercentage").value;
    const levelImgURL = document.getElementById("levelImgURL").value;
    const levelDescription = document.getElementById("levelDescription").value;

    const levelTitleIsAcceptable = levelTitle.length >= 10;
    const minimumPercentageIsAcceptable = (minimumPercentage >= 0 && minimumPercentage <= 100);
    const levelImgURLIsAcceptable = (levelImgURL.startsWith("http://") || levelImgURL.startsWith("https://"));
    const levelDescriptionIsAcceptable = levelDescription.length >= 30;

    if (quizzTitleIsAcceptable && quizzImgURLIsAcceptable && quizzQuestionsQuantityIsAcceptable && quizzLevelsQuantityIsAcceptable) {
        const quizzCreationStart = document.querySelector(".quizzCreationStart");
        quizzCreationStart.classList.add("disabled");

        const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
        quizzCreationQuestions.classList.remove("disabled");
        return
    }

    alert("Por favor preencha os dados corretamente");
}

function maximizeQuestion (question) {
    if (question.classList.contains("question") || question.classList.contains("answered")) {
        return
    }

    if (verifyAndSaveQuestion()) {
        const maximizedQuestion = document.querySelector(".question");
        const maximizedQuestionNumber = maximizedQuestion.querySelector("h2:first-child").textContent;
        maximizedQuestion.innerHTML = `
            <h3>${maximizedQuestionNumber}</h3>
            <ion-icon name="create-outline"></ion-icon>
            `;
        maximizedQuestion.classList.remove("question");
        maximizedQuestion.classList.add("minimized");
        maximizedQuestion.classList.add("answered");

        const minimizedQuestionNumber = question.querySelector("h3").textContent;
        question.innerHTML = `
            <div class="questionTextImg">
                <h2>${minimizedQuestionNumber}</h2>
                <input id="questionText" placeholder="   Texto da pergunta">
                <input id="questionBackground-color" placeholder="   Cor de fundo da pergunta">
            </div>
        
            <div class="correctAnswer">
                <h2>Resposta correta</h2>
                <input id="correctAnswer" placeholder="   Resposta correta">
                <input id="correctAnswerImgURL" placeholder="   URL da imagem">
            </div>
        
            <div class="incorrectAnswers">
                <h2>Respostas incorretas</h2>
                <input id="incorrectAnswer1" placeholder="   Resposta incorreta 1">
                <input id="incorrectAnswer1ImgURL" placeholder="   URL da imagem 1">
                <input id="incorrectAnswer2" placeholder="   Resposta incorreta 2">
                <input id="incorrectAnswer2ImgURL" placeholder="   URL da imagem 2">
                <input id="incorrectAnswer3" placeholder="   Resposta incorreta 3">
                <input id="incorrectAnswer3ImgURL" placeholder="   URL da imagem 3">
            </div>
            `;
        question.classList.add("question");
        question.classList.remove("minimized");
        return
    }

    alert("Termine de preencher corretamente a pergunta atual para passar preencher a próxima");
}

function verifyAndSaveQuestion () {
    const questionText = document.getElementById("questionText").value;
    const questionBackground_color = document.getElementById("questionBackground-color").value;
    const questionTextIsAcceptable = questionText.length >= 20;
    const questionBackground_colorIsAcceptable = questionBackground_color.startsWith("#") && questionBackground_color.length === 7;
    
    const correctAnswer = document.getElementById("correctAnswer").value;
    const correctAnswerImgURL = document.getElementById("correctAnswerImgURL").value;
    const correctAnswerIsAcceptable = correctAnswer.length !== null;
    const correctAnswerImgURLIsAcceptable = (correctAnswerImgURL.startsWith("http://") || correctAnswerImgURL.startsWith("https://"));

    const incorrectAnswer1 = document.getElementById("incorrectAnswer1").value;
    const incorrectAnswer1ImgURL = document.getElementById("incorrectAnswer1ImgURL").value;
    const incorrectAnswer2 = document.getElementById("incorrectAnswer2").value;
    const incorrectAnswer2ImgURL = document.getElementById("incorrectAnswer2ImgURL").value;
    const incorrectAnswer3 = document.getElementById("incorrectAnswer3").value;
    const incorrectAnswer3ImgURL = document.getElementById("incorrectAnswer3ImgURL").value;
    const incorrectAnswer1IsAcceptable = incorrectAnswer1.length !== null;
    const incorrectAnswer1ImgURLIsAcceptable = (incorrectAnswer1ImgURL.startsWith("http://") || incorrectAnswer1ImgURL.startsWith("https://"));
    const incorrectAnswer2IsAcceptable = incorrectAnswer2.length !== null;
    const incorrectAnswer2ImgURLIsAcceptable = (incorrectAnswer2ImgURL.startsWith("http://") || incorrectAnswer2ImgURL.startsWith("https://"));
    const incorrectAnswer3IsAcceptable = incorrectAnswer3.length !== null;
    const incorrectAnswer3ImgURLIsAcceptable = (incorrectAnswer3ImgURL.startsWith("http://") || incorrectAnswer3ImgURL.startsWith("https://"));

    if (questionTextIsAcceptable && questionBackground_colorIsAcceptable && correctAnswerIsAcceptable && 
        correctAnswerImgURLIsAcceptable && incorrectAnswer1IsAcceptable && incorrectAnswer1ImgURLIsAcceptable) {
            createdQuizz.questions.push({
                title: questionText,
                color: questionBackground_color,
                answers: [
                    {
                    text: correctAnswer,
                    image: correctAnswerImgURL,
                    isCorrectAnswer: true
                    }, {
                    text: incorrectAnswer1,
                    image: incorrectAnswer1ImgURL,
                    isCorrectAnswer: false
                    }
                ]
            })

            if (incorrectAnswer2IsAcceptable && incorrectAnswer2ImgURLIsAcceptable) {
                createdQuizz.questions[questionsNumber].answers.push({
                    text: incorrectAnswer2,
                    image: incorrectAnswer2ImgURL,
                    isCorrectAnswer: false
                    })
            }

            if (incorrectAnswer3IsAcceptable && incorrectAnswer3ImgURLIsAcceptable) {
                createdQuizz.questions[questionsNumber].answers.push({
                    text: incorrectAnswer3,
                    image: incorrectAnswer3ImgURL,
                    isCorrectAnswer: false
                })
            }
        questionsNumber++;
        console.log(createdQuizz);
        return true
    }
    return false
}