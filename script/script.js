let callFunction = getQuizzes();
let loadingS1 = loading('screen1','screen1');
let arrayWithObjects = [];
let qtdQuestions = null;
let choiced = 0;
let hits = 0;
let objectTemp=null;



let createdQuizz = {};
let questionNumber = 0;
let questionsQuantity = 0;
let levelsQuantity = 0;
let zeroPercentageLevelExists = false;
let idCreatedQuizz = 0;

let quizzBeingEdited = null;
let editingQuizz = false;


function getQuizzes(){
    const getQuizServer = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    getQuizServer.then(loadQuizzes);
    getQuizServer.catch( function (){alert("Erro ao recarregar os Quizzes.");  window.location.reload(); } )
    
    
}

function loadQuizzes(response){
    

    const allquizes = document.querySelector(".allQuizzes");
    const userQuizzes = document.querySelector(".userQuizzes");
    const noUserQuizzes = document.querySelector(".noUserQuizzes");
    let userHasQuizzes = false;

    allquizes.innerHTML = "";
    userQuizzes.innerHTML = `
        <div class="userQuizzesTitle">
            <h1>Seus Quizzes</h1>
            <ion-icon name="add-circle" onclick="createQuizz();"></ion-icon>
        </div>
    `;

    for(let i = 0; i<response.data.length; i++){
        object = response.data[i];
        arrayWithObjects[i] = object;
        
        const isAUsersQuizz = object.id == localStorage.getItem(object.title);
        if (isAUsersQuizz) {
            userQuizzes.innerHTML += `
            <article class="quizz">
                <img onclick="quizz(${i})" src="${object.image}">
                <span onclick="quizz(${i})" >${object.title}</span>
                <div class="quizzOptions">
                    <ion-icon onclick="editQuizz(this);" name="create-outline"></ion-icon>
                    <ion-icon onclick="deleteQuizz(this);" name="trash-outline"></ion-icon>                
                </div>
            </article>
            `;
            userHasQuizzes = true;
        } else {
            allquizes.innerHTML += `
            <article class="quizz">
                <img onclick="quizz(${i})" src="${object.image}">
                <span onclick="quizz(${i})" >${object.title}</span>
            </article>
            `;
        }
    }
    if (userHasQuizzes) {
        noUserQuizzes.classList.add("disabled");
        userQuizzes.classList.remove("disabled");
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

    loading('screen1', 'screen2');
    
    let toTop = document.querySelector(".bottomBoxHeader"); 
    toTop.scrollIntoView({block: "end", behavior: 'smooth'}); 

}

function sounds(effect){
    let sound = document.querySelector(".sonoresEffects");
    if(effect == "correct"){
        sound.innerHTML = `<audio audio autoplay src="mp3/sucess.mp3" type="audio/mp3"></audio>`
    }
    else{
        sound.innerHTML = `<audio audio autoplay src="mp3/beep.mp3" type="audio/mp3"></audio>`
    }
}

function selected (obj, p1, p2){
    let verifyChoices = arrayWithObjects[obj];
   
    let lastQuestion = verifyChoices.questions[p1].answers.length
    for(let j = 0; j< lastQuestion; j++){
       
        if(j==p2){
           
            if(verifyChoices.questions[p1].answers[j].isCorrectAnswer == true){
                const change = document.querySelector(`.option.opt${p1}${j}`);
                change.classList.add("correct");
                sounds('correct');
                hits++;
                
            }else{
                const change = document.querySelector(`.option.opt${p1}${j}`);
                change.classList.add("wrong");
                sounds('wrong');
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
     }
     let next = document.querySelector(`.opt${p1+1}`);
     if(next != null){
        
        setTimeout( () => { next.scrollIntoView({behavior: 'smooth'})}, 2000);
    }
     choiced++;

    if(choiced == qtdQuestions){
        setTimeout(finish,1000);   
    }      
}

function finish (){
    
    let score = (100/qtdQuestions)*hits;
    let round = Math.ceil(score);
    let biggest = 0;
  
    for(let i = 0; i<objectTemp.levels.length; i++){
        biggest = objectTemp.levels[i].minValue;
        if(score<=objectTemp.levels[i].minValue){
          
            let result = document.querySelector(".boxResult");
            result.innerHTML = `
            <h1 class="title-result">${round}% de acerto: ${objectTemp.levels[i].title}!</h1>
            <img src="${objectTemp.levels[i].image}">
            <h1 class="coments-result">${objectTemp.levels[i].text}</h1>
            `
            
            let showBoxResult = document.querySelector(".boxResult");
            let showBoxButtons = document.querySelector(".returnOrReload");
            showBoxResult.classList.remove("disabled");
            showBoxButtons.classList.remove("disabled");
            showBoxButtons.scrollIntoView({behavior: 'smooth'});
            break;
        }
        else if(i+1 == objectTemp.levels.length){
            if(score>=biggest){
                     
            let result = document.querySelector(".boxResult");
            result.innerHTML = `
            <h1 class="title-result">${round}% de acerto: ${objectTemp.levels[i].title}!</h1>
            <img src="${objectTemp.levels[i].image}">
            <h1 class="coments-result">${objectTemp.levels[i].text}</h1>
            `
            let showBoxResult = document.querySelector(".boxResult");
            showBoxResult.classList.remove("disabled");
            let showBoxButtons = document.querySelector(".returnOrReload");
            showBoxButtons.classList.remove("disabled");
            showBoxButtons.scrollIntoView({behavior: 'smooth'});

            }
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
    
    
    
    let ocultScreen2 = document.querySelector(".screen2");
    let boxResult = document.querySelector(".boxResult");
    let ocultBottoms = document.querySelector(".boxResult");
    ocultScreen2.classList.add("disabled");
    boxResult.classList.add("disabled");
    


}

function backToHome(){
    window.location.reload();
}
function loading(screenA, screenB){
    
    let disabled = document.querySelector("."+screenA);
    disabled.classList.add("disabled");

    let activeLoading = document.querySelector(".loading");
    activeLoading.classList.remove("disabled");

    setTimeout(function(){
        let disabledLoading = document.querySelector(".loading");
        disabledLoading.classList.add("disabled");
    }, 2500);

    setTimeout(function(){
        let activeScreenB = document.querySelector("."+screenB);
        activeScreenB.classList.remove("disabled");}, 2450);

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
        levelsQuantity = parseInt(quizzLevelsQuantity);

        const quizzCreationStart = document.querySelector(".quizzCreationStart");
        quizzCreationStart.classList.add("disabled");

        const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
        quizzCreationQuestions.classList.remove("disabled");

        let selector = null;
        let question = null;

        for (let i = 0; i < questionsQuantity; i++) {
            let questionForm = "disabled";
            let questionMinimized = "enabled";
            if (i === 0) {
                questionForm = "enabled";
                questionMinimized = "disabled";
            }

            quizzCreationQuestions.innerHTML += `
            <section>
                <article class="question ${questionForm}">
                    <div class="questionTextImg">
                        <h2>Pergunta ${i + 1}</h2>
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
                <article class="minimized ${questionMinimized}" onclick="maximizeQuestion(this);">
                    <h3>Pergunta ${i + 1}</h3>
                    <ion-icon name="create-outline"></ion-icon>
                </article>
            </section>
            `;
            if (editingQuizz) {
                selector = `.quizzCreationQuestions section:nth-child(${i + 2})`;
                question = document.querySelector(selector);
                console.log(quizzBeingEdited.questions[i].title)
                console.log(question)
                console.log(question.querySelector("#questionText"))
                question.querySelector("#questionText").value = quizzBeingEdited.questions[i].title;
                question.querySelector("#questionBackground-color").value = quizzBeingEdited.questions[i].color;
                question.querySelector("#correctAnswer").value = quizzBeingEdited.questions[i].answers[0].text;
                question.querySelector("#correctAnswerImgURL").value = quizzBeingEdited.questions[i].answers[0].image;
                question.querySelector("#incorrectAnswer1").value = quizzBeingEdited.questions[i].answers[1].text;
                question.querySelector("#incorrectAnswer1ImgURL").value = quizzBeingEdited.questions[i].answers[1].image;

                const thereIsAThirdAnswer = quizzBeingEdited.questions[i].answers[2] !== undefined
                if (thereIsAThirdAnswer) {
                    question.querySelector("#incorrectAnswer2").value = quizzBeingEdited.questions[i].answers[2].text;
                    question.querySelector("#incorrectAnswer2ImgURL").value = quizzBeingEdited.questions[i].answers[2].image;
                }
                if (quizzBeingEdited.questions[i].answers[2] !== undefined) {
                    question.querySelector("#incorrectAnswer3").value = quizzBeingEdited.questions[i].answers[3].text;
                    question.querySelector("#incorrectAnswer3ImgURL").value = quizzBeingEdited.questions[i].answers[3].image;
                }
            }
        }
        quizzCreationQuestions.innerHTML += `
            <button onclick="GoToQuizzLevels();">Prosseguir pra criar níveis</button>
            `;
        
        createdQuizz.questions = [];
        return
    }
    alert("Por favor preencha os dados corretamente");
}

function maximizeQuestion (question) {
    const enabledQuestion = document.querySelector(".question.enabled");
    const enabledQuestionSection = enabledQuestion.parentNode;
    const enabledQuestionMinimizedVersion = enabledQuestionSection.querySelector(".minimized")
    enabledQuestion.classList.remove("enabled");
    enabledQuestion.classList.add("disabled");
    enabledQuestionMinimizedVersion.classList.add("enabled");
    enabledQuestionMinimizedVersion.classList.remove("disabled");

    const selectedQuestionSection = question.parentNode;
    const selectedQuestionExpandedVersion = selectedQuestionSection.querySelector(".question")
    question.classList.add("disabled");
    question.classList.remove("enabled");
    selectedQuestionExpandedVersion.classList.add("enabled");
    selectedQuestionExpandedVersion.classList.remove("disabled");
}

function verifyAndSaveQuestion (question) {
    const questionText = question.querySelector("#questionText").value;
    const questionBackground_color = question.querySelector("#questionBackground-color").value;
    const questionTextIsAcceptable = questionText.length >= 20;
    const questionBackground_colorIsAcceptable = questionBackground_color.startsWith("#") && questionBackground_color.length === 7;
    
    const correctAnswer = question.querySelector("#correctAnswer").value;
    const correctAnswerImgURL = question.querySelector("#correctAnswerImgURL").value;
    const correctAnswerIsAcceptable = correctAnswer.length !== null;
    const correctAnswerImgURLIsAcceptable = (correctAnswerImgURL.startsWith("http://") || correctAnswerImgURL.startsWith("https://"));

    const incorrectAnswer1 = question.querySelector("#incorrectAnswer1").value;
    const incorrectAnswer1ImgURL = question.querySelector("#incorrectAnswer1ImgURL").value;
    const incorrectAnswer2 = question.querySelector("#incorrectAnswer2").value;
    const incorrectAnswer2ImgURL = question.querySelector("#incorrectAnswer2ImgURL").value;
    const incorrectAnswer3 = question.querySelector("#incorrectAnswer3").value;
    const incorrectAnswer3ImgURL = question.querySelector("#incorrectAnswer3ImgURL").value;
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
                createdQuizz.questions[questionNumber].answers.push({
                    text: incorrectAnswer2,
                    image: incorrectAnswer2ImgURL,
                    isCorrectAnswer: false
                    })
            }
            if (incorrectAnswer3IsAcceptable && incorrectAnswer3ImgURLIsAcceptable) {
                createdQuizz.questions[questionNumber].answers.push({
                    text: incorrectAnswer3,
                    image: incorrectAnswer3ImgURL,
                    isCorrectAnswer: false
                })
            }
        questionNumber++;
        return
    }
}

function GoToQuizzLevels () {
    const questions = document.querySelectorAll(".question");
    questions.forEach(verifyAndSaveQuestion);
    if (createdQuizz.questions.length === questionsQuantity) {
        const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
        quizzCreationQuestions.classList.add("disabled");

        const quizzCreationLevels = document.querySelector(".quizzCreationLevels");
        quizzCreationLevels.classList.remove("disabled");

        for (let i = 0; i < levelsQuantity; i++) {
            let levelExpanded = "disabled";
            let levelMinimized = "enabled";
            if (i === 0) {
                levelExpanded = "enabled";
                levelMinimized = "disabled";
            }
            quizzCreationLevels.innerHTML += `
                <section>
                    <article class="level ${levelExpanded}">
                            <h2>Nível ${i + 1}</h2>
                            <input id="levelTitle" placeholder="   Título do nível">
                            <input id="minimumPercentage" placeholder="   % de acerto mínima">
                            <input id="levelImgURL" placeholder="   URL da imagem do nível">
                            <input id="levelDescription" placeholder="   Descrição do nível">
                    </article>
                    <article class="minimized ${levelMinimized}" onclick="maximizeLevel(this);">
                            <h3>Nível ${i + 1}</h3>
                            <ion-icon name="create-outline"></ion-icon>
                    </article>
                </section>
                `;
        }
        quizzCreationLevels.innerHTML += `
            <button onclick="verifyAndGoToQuizzFinished();">Finalizar Quizz</button>
            `;

        createdQuizz.levels = [];
        return
    }
    createdQuizz.questions = []
    alert("Por favor preencha os dados corretamente");
}

function maximizeLevel (level) {
    const enabledLevel = document.querySelector(".level.enabled");
    const enabledLevelSection = enabledLevel.parentNode;
    const enabledLevelMinimizedVersion = enabledLevelSection.querySelector(".minimized")
    enabledLevel.classList.remove("enabled");
    enabledLevel.classList.add("disabled");
    enabledLevelMinimizedVersion.classList.add("enabled");
    enabledLevelMinimizedVersion.classList.remove("disabled");

    const selectedLevelSection = level.parentNode;
    const selectedLevelExpandedVersion = selectedLevelSection.querySelector(".level")
    level.classList.add("disabled");
    level.classList.remove("enabled");
    selectedLevelExpandedVersion.classList.add("enabled");
    selectedLevelExpandedVersion.classList.remove("disabled");
}

function verifyAndSaveLevel (level) {
    const levelTitle = level.querySelector("#levelTitle").value;
    const minimumPercentage = parseInt(level.querySelector("#minimumPercentage").value);
    const levelImgURL = level.querySelector("#levelImgURL").value;
    const levelDescription = level.querySelector("#levelDescription").value;

    const levelTitleIsAcceptable = levelTitle.length >= 10;
    const minimumPercentageIsAcceptable = (minimumPercentage >= 0 && minimumPercentage <= 100);
    const levelImgURLIsAcceptable = (levelImgURL.startsWith("http://") || levelImgURL.startsWith("https://"));
    const levelDescriptionIsAcceptable = levelDescription.length >= 30;
    const minimumPercentageIsZero =  minimumPercentage === 0;

    if (levelTitleIsAcceptable && minimumPercentageIsAcceptable && levelImgURLIsAcceptable && levelDescriptionIsAcceptable) {
        createdQuizz.levels.push({
            title: levelTitle,
            image: levelImgURL,
            text: levelDescription,
            minValue: minimumPercentage
        });
        if (minimumPercentageIsZero) {
            zeroPercentageLevelExists = true;
       }
    }

}

function verifyAndGoToQuizzFinished () {
    const levels = document.querySelectorAll(".level");
    levels.forEach(verifyAndSaveLevel);
    if (zeroPercentageLevelExists && createdQuizz.levels.length === levelsQuantity) {
        const quizzCreationFinished = document.querySelector(".quizzCreationFinished");
        quizzCreationFinished.innerHTML = `
            <h1>Seu quizz está pronto!</h1>
            <article class="quizzCreated">
                <img src="${createdQuizz.image}">
                <span>${createdQuizz.title}</span>
            </article>
            <button onclick="accessQuizz()">Acessar Quizz</button>
            <button onclick="backToHome();">Voltar pra home</button>
            `;

            loading('quizzCreationLevels','quizzCreationFinished');
        

        const createdQuizzPromisse =  axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", createdQuizz);
        createdQuizzPromisse.then(
            response => {
                localStorage.setItem(createdQuizz.title, response.data.id);
                localStorage.setItem(createdQuizz.title + "_KEY", response.data.key);
                getQuizzes();
                idCreatedQuizz = response.data.id;
            });
        return
    }
    createdQuizz.levels = [];
    alert("Por favor preencha os dados corretamente");
}

function deleteQuizz (trash_can_icon) {
    const quizz = trash_can_icon.parentNode.parentNode;
    const quizzTitle = quizz.querySelector("span").innerText;
    const quizzID = localStorage.getItem(quizzTitle);
    const quizzKEY = localStorage.getItem(quizzTitle + "_KEY").toString();
    const APIQuizzToDeleteLink = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzID}`;
    const objectHeader = { headers: { "Secret-Key": quizzKEY } };
    console.log(typeof objectHeader);
    console.log(objectHeader);
    const quizzDeletedPromisse = axios.delete(APIQuizzToDeleteLink, objectHeader);
    quizzDeletedPromisse.then(
        () => {
            console.log("Quizz deletado!");
            getQuizzes();
    });
}

function editQuizz (edit_icon) {
    const quizz = edit_icon.parentNode.parentNode;
    const quizzTitle = quizz.querySelector("span").innerText;
    const quizzID = localStorage.getItem(quizzTitle);
    const quizzAPI = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzID}`;
    const editQuizzPromisse = axios.get(quizzAPI);
    editQuizzPromisse.then(
        response => {
            document.getElementById("quizzTitle").value = response.data.title;
            document.getElementById("quizzImgURL").value = response.data.image;
            document.getElementById("quizzQuestionsQuantity").value = response.data.questions.length;
            document.getElementById("quizzLevelsQuantity").value = response.data.levels.length;
            quizzBeingEdited = response.data;
        }
    );
    createQuizz();
    editingQuizz = true;
    
}
function resetVariablesAndElements () {
    createdQuizz = {};
    questionNumber = 0;
    questionsQuantity = 0;
    levelsQuantity = 0;
    zeroPercentageLevelExists = false;
    editingQuizz = false;

    document.getElementById("quizzTitle").value = "";
    document.getElementById("quizzImgURL").value = "";
    document.getElementById("quizzQuestionsQuantity").value = "";
    document.getElementById("quizzLevelsQuantity").value = "";
    const quizzCreationQuestions = document.querySelector(".quizzCreationQuestions");
    quizzCreationQuestions.innerHTML = `<h1>Crie suas perguntas</h1>`;
    const quizzCreationLevels = document.querySelector(".quizzCreationLevels");
    quizzCreationLevels.innerHTML = `<h1>Agora, decida os níveis!</h1>`;
}

function accessQuizz(){
    resetVariablesAndElements;
    for(let i = 0; i<arrayWithObjects.length; i++){

        if(idCreatedQuizz == arrayWithObjects[i].id){
            console.log("achou!!")

            console.log(idCreatedQuizz);
            console.log(arrayWithObjects[i].id);
            quizz(i);
            
        }
    }

    let disabledScreen4 = document.querySelector(".quizzCreationFinished");
    disabledScreen4.classList.add("disabled");
    
  
}

