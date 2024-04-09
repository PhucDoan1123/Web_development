const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    saveData(); // Chỉ gọi hàm lưu dữ liệu sau khi thêm nội dung mới vào danh sách
  }
  inputBox.value = "";
}

listContainer.addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

const saveData = () => {
    localStorage.setItem('tasks', listContainer.innerHTML); // Sửa key thành 'tasks'
  }
  
  const showTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      listContainer.innerHTML = savedTasks;
    }
  }
  
  showTasks();
