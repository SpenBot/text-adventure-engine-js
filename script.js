

////////////////////////// DOM VARIABLES ////////////////////////////////
/////////////////////////////////////////////////////////////////////////

let mainWindow = document.getElementById('mainWindow')
let gameOver = document.getElementById('gameOver')

let safariWindow = document.getElementById('safariWindow')
let safariButton = document.getElementById('safariButton')

let npcTextElement = document.getElementById('npcText')
let npcWindowElement = document.getElementById('npcTextWindow')
let npcPortraitImgElement = document.getElementById('npcPortraitImg')
let npcNextCursor = document.getElementById('nextCursor')


let userInputWindowElement = document.getElementById('userInput')

let talking = document.getElementById('talking')



////////////////////////// GLOBAL VARIABLES FOR APP STATE ///////////////
/////////////////////////////////////////////////////////////////////////

let stateObj = null
let stateText = null




////////////////////////// SET STATE AND ANIMATE ON WINDOW LOAD /////////
/////////////////////////////////////////////////////////////////////////

window.onload = () => {

  if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {

    mainWindow.style.display = 'none'
    safariWindow.style.display = 'block'
    safariButton.addEventListener('click', ()=> {
      mainWindow.style.display = 'block'
      safariWindow.style.display = 'none'
      setStates(npcManager.resp1, npcManager)
      setTimeout( ()=> animateNpcAll(npcManager.resp1), 500 )
      document.getElementById('muzak').play()
    })

  } else {

    setStates(npcManager.resp1, npcManager)
    setTimeout( ()=> animateNpcAll(npcManager.resp1), 500 )
    document.getElementById('muzak').play()

  }

}


////////////////////////// DECLARE SET STATES FOR GLOABAL APP STATES ////
/////////////////////////////////////////////////////////////////////////

function setStates (response, object) {
  stateObj = object
  stateText = response
  npcPortraitImgElement.src = object.closed
}











////////////////////////// DECLARE FUNCTION TO ANIMATE NPC ALL //////////
/////////////////////////////////////////////////////////////////////////

function animateNpcAll() {

  talking.play()

  ////////////////////////// Animate Portrait //////////////////////////

  // declare portrait image toggler
  let currentFace = 1

  // start portrait animation at intervals
  let animateFace = setInterval ( ()=> {

      currentFace *= -1

      if (currentFace == 1) {
        npcPortraitImgElement.src = stateObj.closed
      } else if (currentFace == -1) {
        npcPortraitImgElement.src = stateObj.open
      }

    }, 110)




  ////////////////////////// Animate Text /////////////////////////////

  // split passed in string into an Array of string characters
  let textSplitArray = stateText.text.split("")
  // create an empty array of the characters that will be displayed
  let textToDisplayArray = []

  // declare loop variable
  let i = 0

  // run text animation at intervals
  let animateText = setInterval( ()=> {

      // if there are characters to display, add them to display array
      if (i < textSplitArray.length) {
        textToDisplayArray.push(textSplitArray[i])
        npcTextElement.innerHTML = textToDisplayArray.join("")
        i += 1
      // else stop animations and run readyForUser()
      } else {
        clearInterval(animateFace)
        npcPortraitImgElement.src = stateObj.closed
        clearInterval(animateText)
        console.log("animation stopped")

        talking.pause()
        readyForUser()
      }

  }, 40)


}




////////////////////////// DECLARE FUNCTION READY FOR USER'S ACTION //////
/////////////////////////////////////////////////////////////////////////

function readyForUser () {


  ////////////////////////// If text is query, activate user inputs ////
  if (stateText.type == "query") {
    activateUserInputs()
    return
  }


  // else

  ////////////////////////// Animate "Next" Cursor //////////////////////

  // npcNextCursor.style.visibility = 'visible'

  cursorState = 1

  let animateCursor = setInterval(setCursor, 400)

  function setCursor () {
    cursorState *= -1
    console.log("cursor")

    if (cursorState == -1) {
      npcNextCursor.style.visibility = 'visible'
    } else if (cursorState == 1) {
      npcNextCursor.style.visibility = 'hidden'
    }

  }

  ////////////////////////// Add "Next" Click Event /////////////////////

  npcWindowElement.classList.add("hoverElement")

  npcWindowElement.addEventListener('click', function npcWindowClick () {
    clearInterval(animateCursor)
    npcNextCursor.style.visibility = 'hidden'
    console.log("clicked")
    nextState()

    npcWindowElement.classList.remove("hoverElement")
    this.removeEventListener('click', npcWindowClick)
  })



}






////////////////////////// DECLARE ACTIVATE USER INPUTS //////////////////
/////////////////////////////////////////////////////////////////////////

function activateUserInputs () {


  // action: enter name
  if (stateText == npcManager.resp5) {

    let newP = document.createElement("p")
    newP.innerHTML = "Enter name:"

    let newInput = document.createElement("input")
    newInput.setAttribute("type", "text")
    newInput.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        userObj.name = this.value
        npcManager.resp6.text = `${userObj.name}? You don't look like a ${userObj.name}.`
        userInputWindowElement.removeChild(newInput)
        userInputWindowElement.removeChild(newP)
        nextState ()
      }
    })

    userInputWindowElement.appendChild(newP)
    userInputWindowElement.appendChild(newInput)

  }



  // action: choose first stage
  else if (stateText == npcManager.resp12) {

    let button1 = document.createElement("button")
    let button2 = document.createElement("button")
    let button3 = document.createElement("button")
    let button4 = document.createElement("button")

    button1.innerHTML = 'Registers'
    button2.innerHTML = 'Loading dock'
    button3.innerHTML = 'Bathroom'
    button4.innerHTML = 'What about training?'

    button1.addEventListener('click', ()=> {
      userInputWindowElement.removeChild(button1)
      userInputWindowElement.removeChild(button2)
      userInputWindowElement.removeChild(button3)
      userInputWindowElement.removeChild(button4)
      setStates(npcRegister.resp1, npcManager)
      animateNpcAll()
    })

    button2.addEventListener('click', ()=> {
      userInputWindowElement.removeChild(button1)
      userInputWindowElement.removeChild(button2)
      userInputWindowElement.removeChild(button3)
      userInputWindowElement.removeChild(button4)
      setStates(npcDock.resp1, npcManager)
      animateNpcAll()
    })

    button3.addEventListener('click', ()=> {
      userInputWindowElement.removeChild(button1)
      userInputWindowElement.removeChild(button2)
      userInputWindowElement.removeChild(button3)
      userInputWindowElement.removeChild(button4)
      setStates(npcToilet.resp1, npcManager)
      animateNpcAll()
    })

    button4.addEventListener('click', ()=> {
      userInputWindowElement.removeChild(button1)
      userInputWindowElement.removeChild(button2)
      userInputWindowElement.removeChild(button3)
      userInputWindowElement.removeChild(button4)
      nextState ()
    })

    userInputWindowElement.appendChild(button1)
    userInputWindowElement.appendChild(button2)
    userInputWindowElement.appendChild(button3)
    userInputWindowElement.appendChild(button4)

  }


  console.log("user inputs")
}


















////////////////////////// USER OBJECT //////////////////////////////////
/////////////////////////////////////////////////////////////////////////

let userObj = {
  name: null,
}





////////////////////////// NPC OBJECTS //////////////////////////////////
/////////////////////////////////////////////////////////////////////////


let npcManager = {
  resp1: {
    text: 'Get in here. Your paper work is done.',
    type: 'continue'},
  resp2: {
    text: 'Sit down.',
    type: 'continue'},
  resp3: {
    text: ' ... "Congratulations on completing the hiring process. PriceMart welcomes you into our family." ',
    type: 'continue'},
  resp4: {
    text: 'How wonderful for you.',
    type: 'continue'},
  resp5: {
    text: 'Now tell me your name again, so I can print this nametag.',
    type: 'query'},
  resp6: {
    // text: `${this.username}? You don't look like a ${this.username}.`,
    type: 'continue'},
  resp7: {
    text: 'Here.',
    type: 'continue'},
  resp8: {
    text: '... "PriceMart regulation states all employees must have their name tags visible while on store property."',
    type: 'continue'},
  resp9: {
    text: "Now lucky for you, we're under-staffed and backed up.",
    type: 'continue'},
  resp10: {
    text: "So take your pick between working the registers, unloading out back ...",
    type: 'continue'},
  resp11: {
    text: "... or the lovely job of fixing the clogged toilet by hardware.",
    type: 'continue'},
  resp12: {
    text: "So what's it gunna be?",
    type: 'query'},
  resp13: {
    text: "Training? What the hell do you need training for? You watched the videos didn't you?",
    type: 'continue'},





  closed: "./assets/manager-closed.png",
  open: "./assets/manager-open.png"

}


let npcRegister = {
  resp1: {
    text: 'Thats great. Now get the hell out of my office.',
    type: 'continue'},
  resp2: {
    text: 'Are you working the registers? Take the one on the right.',
    type: 'continue'},
  resp3: {
    text: "I'm going on break. You better not have any problems.",
    type: 'continue'},

  closed: "./assets/register-closed.png",
  open: "./assets/register-open.png"

}

let npcDock = {
  resp1: {
    text: 'Thats great. Now get the hell out of my office.',
    type: 'continue'},
  resp2: {
    text: "Are you the new recruit?",
    type: 'continue'},
  resp3: {
    text: "It's about time we got more people around here. I keep tellin them there's too much to do.",
    type: 'continue'},

  closed: "./assets/loader-closed.png",
  open: "./assets/loader-open.png"

}

let npcToilet = {
  resp1: {
    text: 'Thats great. Now get the hell out of my office.',
    type: 'continue'},
  resp2: {
    text: '[... the toilet is running and the floor is wet.]',
    type: 'continue'},

    closed: "./assets/toilet.png",
    open: "./assets/toilet.png"

}

////////////////////////// DECLARE NEXT STATE ///////////////////////////
/////////////////////////////////////////////////////////////////////////

function nextState () {

  if (stateText == npcManager.resp1) {
    setStates(npcManager.resp2, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp2) {
    setStates(npcManager.resp3, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp3) {
    setStates(npcManager.resp4, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp4) {
    setStates(npcManager.resp5, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp5) {
    setStates(npcManager.resp6, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp6) {
    setStates(npcManager.resp7, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp7) {
    setStates(npcManager.resp8, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp8) {
    setStates(npcManager.resp9, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp9) {
    setStates(npcManager.resp10, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp10) {
    setStates(npcManager.resp11, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp11) {
    setStates(npcManager.resp12, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp12) {
    setStates(npcManager.resp13, npcManager)
    animateNpcAll()
  } else if (stateText == npcManager.resp13) {
    setStates(npcManager.resp12, npcManager)
    animateNpcAll()
  }


    else if (stateText == npcRegister.resp1) {
    setStates(npcRegister.resp2, npcRegister)
    animateNpcAll()
  } else if (stateText == npcRegister.resp2) {
    setStates(npcRegister.resp3, npcRegister)
    animateNpcAll()
  } else if (stateText == npcRegister.resp3) {
    mainWindow.style.display = 'none'
    gameOver.style.display = 'block'
  }

  else if (stateText == npcDock.resp1) {
  setStates(npcDock.resp2, npcDock)
  animateNpcAll()
} else if (stateText == npcDock.resp2) {
  setStates(npcDock.resp3, npcDock)
  animateNpcAll()
} else if (stateText == npcDock.resp3) {
  mainWindow.style.display = 'none'
  gameOver.style.display = 'block'
}

else if (stateText == npcToilet.resp1) {
setStates(npcToilet.resp2, npcToilet)
animateNpcAll()
} else if (stateText == npcToilet.resp2) {
  mainWindow.style.display = 'none'
  gameOver.style.display = 'block'
}





  else {console.log("error in responses")}

}









// end //////////////////////////////////////////////////////////////////////
