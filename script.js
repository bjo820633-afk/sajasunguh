// =============================
// 1. 전역 변수
// =============================
let quizData = [];
let currentQuiz;
let FalseCount = 0;
let score = 0;
const inputEL = document.getElementById("user-answer");
const scoreBox = document.getElementById("scoreTime-box");


// =============================
// 2. CSV 불러오기
// =============================
async function loadCSV() {      
    const response = await fetch("sajasunguh.csv");
    const text = await response.text();

    const rows = text.split("\n").slice(1);

    quizData = rows.map(row => {
        const cols = row.split(",");
        return {
            idiom: cols[0],
            meaning: cols[1],
            hanja: cols[2],
            chosung: cols[3]
        };
    });
}


// =============================
// 3. 랜덤 문제 선택
// =============================
function getRandomQuiz() {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    return quizData[randomIndex];
}


// =============================
// 4. 문제 화면에 출력
// =============================
function showQuiz() {
    currentQuiz = getRandomQuiz();
    scoreBox.innerText=
    "점수: " + score;
    FalseCount = 0;

    document.getElementById("chosung").innerText = currentQuiz.chosung;

    // 입력창 초기화
    document.getElementById("user-answer").value = "";

    // 힌트 초기화
    document.getElementById("hint-meaning").innerText = "뜻: ";
    document.getElementById("hint-hanja").innerText = "한자: ";
}


// =============================
// 5. 정답 체크
// =============================
function checkAnswer() {
    const userAnswer = document.getElementById("user-answer").value.trim();

    if (userAnswer === currentQuiz.idiom) {
        showFeedback(true);
        scoreCheck(FalseCount);
        showQuiz();
    } else {
        FalseCount+=1;
        showFeedback(false);       
    }
    if(FalseCount === 1){
        document.getElementById("hint-meaning").innerText =
        "뜻: " + currentQuiz.meaning;       
    }
    else if(FalseCount === 2){
        document.getElementById("hint-hanja").innerText =
        "한자: " + currentQuiz.hanja;       
    }

    
}


// =============================
// 5+. 점수 표시
// =============================
function scoreCheck(falseScore){
    switch(falseScore){
        case 0:
            score += 300;
            break;
        case 1:
            score += 200;
            break;
        case 2:
            score += 100;
            break;
    }
}


// =============================
// 6. 이벤트 연결
// =============================
document.getElementById("submit-btn").addEventListener("click", checkAnswer);


// =============================
// 7. 시작 실행
// =============================
async function init() {
    await loadCSV();
    showQuiz();
    
    inputEL.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById("feedback");

    if (isCorrect) {
        feedback.innerText = "정답!";
        feedback.className = "show correct";
    } else {
        feedback.innerText = "오답!";
        feedback.className = "show wrong";
    }

    // 1초 뒤 사라짐
    setTimeout(() => {
        feedback.innerText = "";
        if(FalseCount===3){
            showQuiz();
        }
    }, 1200);
}

// 엔터 키 누르면 다음 문제(패스)
function questionPass(isEnter) {
    if (isEnter) {
        showQuiz();
    }
}

init();
