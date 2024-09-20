//ЗНАХОДИМО ЕЛЕМЕНТИ ------------------------------------------------

//кнопки зі звуком
const soundsOffBtn = document.querySelector('#soundsOffBtn');
const soundsOnBtn = document.querySelector('#soundsOnBtn');

//вибір різних параметрів
const selectbigBreak = document.querySelector('#selectbigBreak');
const selectSessionsCount = document.querySelector('#selectSessionsCount');
const selectSounds = document.querySelector('#selectSounds');
const selectSeccion = document.querySelector('#selectSeccion');
const selectTheme = document.querySelector('#selectTheme');
const selectBreak = document.querySelector('#selectBreak');

//все, що стосуэться to-do
const toDoBody = document.querySelector('#toDoBody');
const toDoBtn = document.querySelector('#toDoBtn');
const form = document.querySelector('#form');
const toDoInput = document.querySelector('#toDoInput');
const toDoList = document.querySelector('#toDoList');

//інформація про додаток
const infoBtn = document.querySelector('#infoBtn')
const infoEl = document.querySelector('.info-body');

const startBtn = document.querySelector('#startBtn');
const time = document.getElementById("time");

//кнопки "пауза" та "скинути"
const pauseBtn = document.querySelector('#pauseBtn')
const resetBtn = document.querySelector('#resetBtn')

const settingBtn = document.querySelector('#settingBtn');
const type = document.querySelector('#type'); //тип роботи

document.body.style.backgroundImage = `url('./img/stars-bg.png')`  //задаємо фон на сторінці
//-----------------------------------------------------------------

//TO-DO --------------------------------------------------------------

let tasks = [] //масив з задачи

//завантажуємо список задач з локального сховища
if (localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'))
}

//Відображення масиву з задачами

tasks.forEach(function (task){
  const taskHTML = `<li class="to-do__task" id="${task.id}">
              <span>${task.text}</span>
                <button class="task__btn" data-action="done">
                  &#10003
                </button>
            </li>`
            toDoList.insertAdjacentHTML('beforeend', taskHTML)
})

form.addEventListener('submit', (event)=>{ //при зміненні форми ствоюємо нову задачу
  event.preventDefault()
  const taskText = toDoInput.value
  const newTask = {
		id: Date.now(),
		text: taskText,
	}
  tasks.push(newTask)
  saveToLocalStorage()
  console.log(tasks);
  

  //добавляэмо задачу
  const taskHTML = `<li class="to-do__task" id="${newTask.id}">
              <span>${newTask.text}</span>
                <button class="task__btn" data-action="done">
                  &#10003
                </button>
            </li>`
    toDoList.insertAdjacentHTML('beforeend', taskHTML)        

    toDoInput.value = ''
toDoInput.focus() 
})

toDoList.addEventListener('click', (event)=>{ //видаляємо задачу
if (event.target.dataset.action === "done"){
  const parentNode = event.target.closest('li')
  const id = parentNode.id
  const index = tasks.findIndex((task)=>task.id == id)
  tasks.splice(index, 1)
  saveToLocalStorage()
  parentNode.remove()
  
}
})

function saveToLocalStorage(){ //функція зберіфгання даних до локального сховища
	localStorage.setItem('tasks', JSON.stringify(tasks))
}
toDoBtn.addEventListener('click', ()=>{
  toDoBody.classList.toggle('active')
  })
// кінець TO-DO ------------------------------------------------------------------------------------------


// ІНФОРМАЦІЯ
infoBtn.addEventListener('click', ()=>{
 infoEl.classList.toggle('active')
 
})


let bigBreakMinutes = selectbigBreak.value
let sessionsCount = selectSessionsCount.value
let currentSession = 0 //яка зараз сесія за рахунком

selectbigBreak.addEventListener('change', ()=>{
  bigBreakMinutes = selectbigBreak.value
})

selectSessionsCount.addEventListener('change', ()=>{
  sessionsCount = selectSessionsCount.value
})


selectSeccion.addEventListener('change', function(){
  if (itIsCession){
    time.textContent = `${selectSeccion.value}:00`;
  }
})
// -------------------------------------------------------------------------------


// АУДІО ---------------------------------------------------------------------------------------
let audio;
let isSounds = false;
let audioId = audio
audio = selectSounds.value
selectSounds.addEventListener('change', ()=>{ //користувач змінює аудіо
  document.querySelector(`#${audio}`).pause();
  audio = selectSounds.value;
  if (isSounds){
    playAudio()
  }
})

function playAudio() {
  document.querySelector(`#${audio}`).play();
  isSounds = true;
}

function pauseAudio() {
document.querySelector(`#${audio}`).pause();
isSounds = false;
}

//кнопки для вмикання та вимикання звуку
soundsOffBtn.addEventListener('click', function(){
  pauseAudio()
  soundsOffBtn.classList.add('hide')
  soundsOnBtn.classList.remove('hide')
})

soundsOnBtn.addEventListener('click', ()=>{
  playAudio()
  soundsOnBtn.classList.add('hide')
  soundsOffBtn.classList.remove('hide')
} )
// -------------------------------------------------------------------------------

// ПЕРЕРВА
selectBreak.addEventListener('change', ()=>{ //при зміненні перерви змінюється значення на годиннику
  if (!itIsCession){
  time.textContent = `${selectBreak.value}:00`;}
})

selectbigBreak.addEventListener('change', ()=>{
  if (!itIsCession && Number(currentSession) === Number(sessionsCount)){
    time.textContent = `${selectbigBreak.value}:00`;}
})


let breakMinutes = 5 //кількість хвилин в перерві за замовчуванням

let itIsCession //перевіряємо, зараз звичайна сесія чи перерва
itIsCession = true;

let pause = false;

let seconds = 59
let minutes = 24
let interval
time.textContent = `${minutes + 1}:00`;


// ТАЙМЕР
function doReset(){ //скидання таймеру
    seconds = 59
    minutes = selectSeccion.value - 1;
    pause = false
    if (itIsCession){
      time.textContent = `${minutes + 1}:00`;
      type.textContent = 'work'
      
    }
    else{
      console.log(currentSession);
      console.log(sessionsCount);
      
      
      if (Number(currentSession) === Number(sessionsCount)){
        type.textContent = 'big break'
        time.textContent = `${bigBreakMinutes}:00`;
      }
      else{
        type.textContent = 'break'
        time.textContent = `${breakMinutes}:00`;
      }
      
    }
   
    startBtn.classList.add("show");
    document.querySelector('#resetBtn').classList.remove('show');
    document.querySelector('#pauseBtn').classList.remove('show');
}

function doPause(){
  pause = true;
  clearInterval(interval);
  startBtn.classList.remove("hide");
  pauseBtn.classList.remove("show");

}

//при кліку на кнопку "Старт"
startBtn.addEventListener('click', ()=>{
  if (itIsCession){ //якщо не перерва
    if (!pause){
     
      minutes = selectSeccion.value - 1; 
      itIsCession = false;
      currentSession++;
    }
  }
  else{
    if (!pause){ //якщо перерва
      
      if (Number(currentSession) === Number(sessionsCount)){
        type.textContent = 'big break'
minutes = bigBreakMinutes - 1;
itIsCession = true;
currentSession = 0;
      }
      else{
        minutes = breakMinutes - 1;
        itIsCession = true;
      } 
    }
  }

  //зникнення та поява кнопок
    startBtn.classList.add("hide");
  startBtn.classList.remove("show");
    document.querySelector('#resetBtn').classList.add('show');
    document.querySelector('#pauseBtn').classList.add('show');

time.textContent = `${minutes}:${seconds}`;

interval = setInterval(() => { 
    seconds--;
    time.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    document.title = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    if (seconds == 0) {
      if (minutes != 0) {
        minutes--;
        seconds = 60;
      } else {
        clearInterval(interval);
        doReset()
      }
    }
  }, 1000);
})

//при клику на кнопку "Пауза"
pauseBtn.addEventListener('click', ()=>{ 
        doPause()
      
    
})
resetBtn.addEventListener('click', ()=>{
    doPause()
   doReset();
})
// ----------------------------------------------------------------------------
// ВИБІР ФОНУ
selectTheme.addEventListener('change', function() {
  const selectedValue = selectTheme.value;
  if (selectedValue != 'ownBg'){
document.body.style.backgroundImage = `url('./img/${selectTheme.value}')`
document.querySelector('.setting-image').classList.add('hide')
  }
  else{
    document.querySelector('.setting-image').classList.remove('hide')
  }
});
//----------------------------------------------------------------------

// ВИБІР ФАЙЛУ ДЛЯ ФОНА ------------------------------------

const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                
                reader.onload = function(e) {
                    document.body.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.onerror = function() {
                    fileInfo.textContent = 'Помилка при читанні файлу';
                };
            } else {
                fileInfo.textContent = 'Оберіть файл зображення';
            }
        }
    });
// ВИБІР КОЛЬОРУ ----------------------------
    const colorPicker = document.getElementById('colorPicker');
    const colorInfo = document.getElementById('colorInfo');

    colorPicker.addEventListener('input', function() {
        const selectedColor = colorPicker.value; // Получаем выбранный цвет
        document.body.style.color = selectedColor; // Устанавливаем фон
        const svgElements = document.querySelectorAll('svg path');
        svgElements.forEach((el)=>{
          el.setAttribute('fill', selectedColor)
        })   
    });





selectBreak.addEventListener('click', function(){ //користучач обирає знач. перерви
  breakMinutes = selectBreak.value;
})

//клік на кнопку з налаштуваннями
settingBtn.addEventListener('click', ()=>{
  document.querySelector('.settings-body').classList.toggle('active');
  document.querySelector('.settings-wrapper').classList.toggle('active');
})




