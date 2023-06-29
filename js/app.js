window.onload = function () {
  loadTasksFromLocalStorage();
  loadFontFromLocalStorage();
  displayEncouragementToast();
  loadPicPathFromLocalStorage();
};

function loadTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage("tasks");
  if (tasks) {
    for (const e of tasks) {
      const { task, id, done } = e;
      addTasksToPage(task, id);
      for (const elem of document.querySelectorAll(".task")) {
        if (elem.dataset.id == id) {
          done ? elem.classList.add("done") : elem.classList.remove("done");
        }
      }
    }
  } else {
    const tasksArray = [];
    addTasksToLocalStorage("tasks", tasksArray);
  }
}

function loadFontFromLocalStorage() {
  const fontSetting = getTasksFromLocalStorage("font");
  if (fontSetting) {
    for (const e of fontSetting) {
      if (e.family) {
        backgroundDiv.style.fontFamily = e.family;
      }
      if (e.style) {
        backgroundDiv.style.fontStyle = e.style;
      }
      if (e.weight) {
        backgroundDiv.style.fontWeight = e.weight;
      }
    }
  } else {
    const font = [];
    addTasksToLocalStorage("font", font);
  }
}

function loadPicPathFromLocalStorage() {
  const picPath = getTasksFromLocalStorage("picPath");
  if (picPath) {
    updateBackgroundDivImage(`url('${picPath}') no-repeat center/cover`);
    for (const elem of document.querySelectorAll("[type='radio']")) {
      if (elem.nextElementSibling.dataset.src == picPath) {
        elem.setAttribute("checked", "");
      } else {
        elem.removeAttribute("checked");
      }
    }
  } else {
    const defaultPicPath = "img/todo.jpg";
    addTasksToLocalStorage("picPath", defaultPicPath);
    updateBackgroundDivImage(`url('${defaultPicPath}') no-repeat center/cover`);
  }
}

const input = document.querySelector("input[type='text']");
const btn = document.querySelector("input[type='submit']");
const tasks = document.querySelector(".tasks");
const backgroundDiv = document.querySelector(".background");
const notificationBtn = document.querySelector(".notification");

function getTasksFromLocalStorage(item) {
  return JSON.parse(localStorage.getItem(item));
}

function addTasksToLocalStorage(taskId, task) {
  return localStorage.setItem(taskId, JSON.stringify(task));
}

function addTasksToPage(txt, id) {
  const newTask = document.createElement("div");
  newTask.textContent = txt;
  newTask.className = "task animate__animated animate__fadeInDown";
  newTask.setAttribute("data-id", id);
  const delBtn = document.createElement("input");
  delBtn.type = "submit";
  delBtn.value = "Delete";
  delBtn.className = "delBtn";
  newTask.appendChild(delBtn);
  tasks.prepend(newTask);
  // Event for all of the newTasks
  newTask.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("delBtn")) {
      // Events for delete btn
      delTask(evt.target);
    } else if (evt.target.classList.contains("task")) {
      // togle done class and done bool value in storage when clicked
      toggleDone(evt.target);
    }
  });
  return id;
}

function addTask() {
  let taskText = input.value.trim();
  if (taskText !== "") {
    input.value = "";
    // add to localStorage
    let arrayOfTasks = getTasksFromLocalStorage("tasks");
    arrayOfTasks.push({
      id: addTasksToPage(taskText, Date.now()),
      task: taskText,
      done: false,
    });
    addTasksToLocalStorage("tasks", arrayOfTasks);
  }
}

btn.addEventListener("click", addTask);
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    btn.click();
  }
});

// deleting task with animation
function delTask(delbtn) {
  let task = delbtn.parentElement;
  let taskId = task.dataset.id;
  let arrayOfTasks = getTasksFromLocalStorage("tasks").filter(
    (e) => e.id != taskId
  );
  addTasksToLocalStorage("tasks", arrayOfTasks);
  task.classList.add("done");
  task.classList.toggle("animate__fadeOutUp");
  setTimeout(() => {
    task.remove();
  }, 600);
}

// toggle done status
function toggleDone(task) {
  task.classList.toggle("done");
  let oldArr = getTasksFromLocalStorage("tasks");
  for (let i = 0; i <= oldArr.length; i++) {
    if (Object(oldArr[i]).id === Number(task.dataset.id)) {
      oldArr[i].done = !oldArr[i].done;
      addTasksToLocalStorage("tasks", oldArr);
    }
  }
}

// reset To Do List
document.querySelector(".reset").addEventListener("click", () => {
  for (const e of document.querySelectorAll(".delBtn")) {
    e.click();
  }
  addTasksToLocalStorage("picPath", "img/todo.jpg");
  addTasksToLocalStorage("font", []);
  window.location.reload();
});

// reset font setting
document.querySelector(".resetFont").addEventListener("click", () => {
  addTasksToLocalStorage("font", []);
  let background = backgroundDiv.style.background;
  backgroundDiv.style = "";
  updateBackgroundDivImage(background);
});

// change Font-Family
document.querySelector(".font").addEventListener("click", fontChanges);

function fontChanges(evt) {
  if (evt.target.nodeName === "A") {
    if (evt.target.hasAttribute("data-font")) {
      updateBackgroundDivFontFamily(evt.target.dataset.font);
      updateFontSettingInLocalStorage("family", evt.target.dataset.font);
    }
    if (evt.target.hasAttribute("data-fontStyle")) {
      updateBackgroundDivFontStyle(evt.target.dataset.fontstyle);
      updateFontSettingInLocalStorage("style", evt.target.dataset.fontstyle);
    }
    if (evt.target.hasAttribute("data-fontWeight")) {
      updateBackgroundDivFontWeight(evt.target.dataset.fontweight);
      updateFontSettingInLocalStorage("weight", evt.target.dataset.fontweight);
    }
  }
}

function updateBackgroundDivFontFamily(font) {
  backgroundDiv.style.fontFamily = font;
}

function updateBackgroundDivFontStyle(fontStyle) {
  backgroundDiv.style.fontStyle = fontStyle;
}

function updateBackgroundDivFontWeight(fontWeight) {
  backgroundDiv.style.fontWeight = fontWeight;
}

function updateBackgroundDivImage(url) {
  backgroundDiv.style.background = url;
}

function updateFontSettingInLocalStorage(key, value) {
  let newFontSetting = getTasksFromLocalStorage("font").filter(
    (e) => !Boolean(e[key])
  );
  newFontSetting.push({ [key]: value });
  addTasksToLocalStorage("font", newFontSetting);
}

// Change background from gallary
document
  .querySelector(".gallary")
  .addEventListener("click", changeGallaryImage);

function changeGallaryImage(evt) {
  if (evt.target.dataset.src) {
    let src = evt.target.dataset.src;
    updateBackgroundDivImage(`url('${src}') no-repeat center/cover`);
    addTasksToLocalStorage("picPath", src);
    document.querySelector(".btn-close").click();
  }
}

// Function to fetch encouraging quotes from the Zen Quotes API
async function fetchEncouragementQuote() {
  try {
    const response = await fetch("./js/api.json");
    const data = await response.json();
    const quote = data[Math.floor(Math.random() * data.length)];
    return quote; // Extracting the quote from the API response
  } catch (error) {
    console.log("Error:", error);
    return "Sorry, an error occurred while fetching the quote.";
  }
}

// Function to display the encouragement toast
async function displayEncouragementToast() {
  const toastElement = document.getElementById("encouragementToast");
  const toastBodyElement = toastElement.querySelector(".toast-body");
  // const spinner = document.querySelector(`.spinner-border-sm`);

  // Fetch an encouraging quote
  const quote = await fetchEncouragementQuote();

  // Show the toast
  const toast = new bootstrap.Toast(toastElement);

  // disable btn untill the toast is ready and show spinner
  notificationBtn.setAttribute("disabled", "");
  // spinner.classList.remove("d-none");
  notificationBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading`;

  setTimeout(() => {
  // Update the toast content
    toastBodyElement.innerHTML = quote.h;
  // show Updated Toast
    toast.show();
  // remove loading Btn spinner
    notificationBtn.removeAttribute("disabled");
    notificationBtn.innerHTML = `Encourage Me`;
  }, 2000);
}

notificationBtn.addEventListener("click", displayEncouragementToast);
