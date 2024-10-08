//Initial References
let draggableObjects;
let dropPoints;
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  { milestone: "milestone for date one", date: "one" },
  { milestone: "milestone for date two", date: "two" },
  { milestone: "milestone for date three", date: "three" },
  { milestone: "milestone for date four", date: "four" },
  { milestone: "milestone for date five", date: "five" },
  { milestone: "milestone for date six", date: "six" },
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

//Detect touch device
const isTouchDevice = () => {
  try {
    //We try to create Touch Event (It would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

//Random value from Array
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

//Win Game Display
const stopGame = () => {
  controls.classList.remove("hide");
};

//Drag & Drop Functions
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    //Start movement for touch
    moveElement = true;
    currentElement = e.target;
  } else {
    //For non touch devices set data to be transfered
    e.dataTransfer.setData("text", e.target.id);
  }
}

//Events fired on the drop target
function dragOver(e) {
  e.preventDefault();
}

//For touchscreen movement
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  //For touch screen
  if (isTouchDevice()) {
    moveElement = false;
    //Select country name div using the custom attribute
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    //Get boundaries of div
    const currentDropBound = currentDrop.getBoundingClientRect();
    //if the position of date falls inside the bounds of the countru name
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      //hide actual image
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      //Insert new img element
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "./img/dates/${currentElement.id}.png">`
      );
      count += 1;
      if (count < 5) playSound("matchSound");
    } else playSound("buzzerSound");
  } else {
    //Access data
    const draggedElementData = e.dataTransfer.getData("text");
    //Get custom attribute value
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      //dropped class
      e.target.classList.add("dropped");
      //hide current img
      draggedElement.classList.add("hide");
      //draggable set to false
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      //insert new img
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="./img/dates/${draggedElementData}.png">`
      );
      count += 1;
      if (count < 5) playSound("matchSound");
    } else playSound("buzzerSound");
  }
  //Win
  if (count >= 5) {
    stopGame();
    playSound("winSound");
  }
};

//Creates dates and milestones
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  //for string random values in array
  for (let i = 1; i <= 5; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      //If value already exists then decrement i by 1
      i -= 1;
    }
  }
  for (let i of randomData) {
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("draggable-image");
    dateDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      dateDiv.style.position = "absolute";
    }
    dateDiv.innerHTML = `<img src="./img/dates/${i.date}.png" id="${i.date}">`;
    dragContainer.appendChild(dateDiv);
  }
  //Sort the array randomly before creating country divs
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='milestones'>
    ${i.milestone}
    <div class="date-box" data-id='${i.date}'>+</div>
    </div>
    `;
    dropContainer.appendChild(countryDiv);
  }
};

//Start Game
const startGame = async () => {
  currentElement = "";
  controls.classList.add("hide");
  //This will wait for creator to create the images and then move forward
  await creator();
  count = 0;
  dropPoints = document.querySelectorAll(".milestones");
  draggableObjects = document.querySelectorAll(".draggable-image");

  //Events
  draggableObjects.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    //for touch screen
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove);
  });
  dropPoints.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", drop);
  });
};

function playSound(soundName) {
  document.getElementById(soundName).currentTime = 0;
  document.getElementById(soundName).volume = 0.1;
  document.getElementById(soundName).play();
}
