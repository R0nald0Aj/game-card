const state ={
    score:{
            playerScore:0,
            cumputerScore :0,
            scoreBox:document.getElementById("score_points")
        },
        cardSprites:{
            avatar:document.getElementById("card-image"),
            name:document.getElementById("card-name"),
            type:document.getElementById("card-type")
        },
        fieldCards:{
            player:document.getElementById("player-field-card"),
            computer:document.getElementById("computer-field-card"),
        },
        actions:{
          button: document.getElementById("next-duel")
    },
    players :{
            player1:"player-card",
            playerBox: document.querySelector("#player-card"),
            cumputer: "computer-card",
            computerBox:  document.querySelector("#computer-card")
        }
}

const pathImage ="./src/assets/icons/";
const cardData=[
    {
        id:0,
        name :"Blue Eyes White Dragon",
        type :"Paper",
        img :`${pathImage}dragon.png`,
        winOf:[1],
        loserOf :[2]
    },
    {
        id:1,
        name :"Dark Magician",
        type :"Rock",
        img :`${pathImage}magician.png`,
        winOf:[2],
        loserOf :[0]
    },
    {
        id:2,
        name :"Exodia",
        type :"Scissors",
        img :`${pathImage}exodia.png`,
        winOf:[0],
        loserOf :[1]
    },
]

async function getRandomCardId(){
    const ranadomIndex =  Math.floor( Math.random() * cardData.length);
    return cardData[ranadomIndex].id;
}

async function creatCardImage(idCard,fieldSide){
    const cardImage =document.createElement("img")
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src",`${pathImage}card-back.png`);
    cardImage.setAttribute("data-id",idCard);
    
    cardImage.classList.add("card")

    if (fieldSide === state.players.playerBox) {
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover",()=>{
            drawSelectedCard(idCard);
        });
    }
    return cardImage;
}
async function drawSelectedCard(idCard){
    state.cardSprites.avatar.src = cardData[idCard].img
    state.cardSprites.name.innerText = cardData[idCard].name
    state.cardSprites.type = "Attribute" + cardData[idCard].type
}

async function setCardsField(cardId){
     await removeAllCardImages();
     let computerCardId = await getRandomCardId();
       
     showHiddenCardFieldsImage(true);

     state.cardSprites.name.innerText =""
     state.cardSprites.avatar.src =""
     state.cardSprites.type.innerText =""

    await drawCardInFlield(cardId,computerCardId);
      
    let duelResult = await checkDuelResult(cardId,computerCardId);
    
    await updateScore();
    await drawButton(duelResult);
        
}

async function drawCardInFlield(cardId,computerCardId){

     state.fieldCards.player.setAttribute("src",`${cardData[cardId].img}`);
     state.fieldCards.computer.setAttribute("src",`${cardData[computerCardId].img}`);
}

async function showHiddenCardFieldsImage(value){
    if (value) {
        state.fieldCards.player.style.display ="block" 
        state.fieldCards.computer.style.display ="block"
        state.actions.button.style.display = "block"
    } else {
        state.fieldCards.player.style.display ="none" 
        state.fieldCards.computer.style.display ="none"
        state.actions.button.style.display = "none" 
    }
}

async function  updateScore(){
      state.score.scoreBox.innerText = `Win:${state.score.playerScore}
      | Lose:${state.score.cumputerScore}`
}

async function  removeAllCardImages(){
   
    let {computerBox,playerBox} =state.players
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((element) => {element.remove()});
    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((element) =>{ element.remove()});
}

async function checkDuelResult(playerCardId,computerCardId){
   let dualResult ="Draw";
   let playerCard = cardData[playerCardId];
    
   if(playerCard.winOf.includes(computerCardId)){
      dualResult ="Win"
      await playAudio(dualResult)
      state.score.playerScore++
    }
    if (playerCard.loserOf.includes(computerCardId)) {
        dualResult ="lose"
        await playAudio(dualResult)
        state.score.cumputerScore++
    }
    return dualResult;
}
 async function drawButton(duelResult){
    console.log(duelResult.toUpperCase());
    state.actions.button.innerText= duelResult.toUpperCase();
    state.actions.button.style.display= "block";
 }

async function  drawCard(cardNumber,fieldSide) {
    
    for (let i = 0; i < cardNumber; i++) {   
        const randoIdCard =  await getRandomCardId();
        const cardImage = await creatCardImage(randoIdCard,fieldSide)
        
       fieldSide.appendChild(cardImage)
    } 
}
async function playAudio(status){
  const audio=new  Audio(`../src/assets/audios/${status}.wav`)
  try {
    audio.play()
  } catch (error) {
      
  }
}

async function resetDuel(){
    state.cardSprites.avatar.src =""
    state.actions.button.style.display ="none"
    
    state.fieldCards.player.style.display ="none"
    state.fieldCards.computer.style.display ="none"

    init();
}

async function  init(){
      await showHiddenCardFieldsImage(false)

      await drawCard(5,state.players.playerBox);
      await drawCard(5,state.players.computerBox);

      const bgm = document.getElementById("bgm");
      await bgm.play();
    
} 
init()