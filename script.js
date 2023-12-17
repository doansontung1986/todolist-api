const API_URL = "http://localhost:8000/todos";
let todos = [];

const inputTitle = document.getElementById("input-todo");
const addButton = document.getElementById("btn-add");
const searchButton = document.getElementById("btn-search");
const taskList = document.getElementById("task-list");

// Gọi API để lấy dữ liệu todos từ server và hiển thị lên giao diện
const getAllTodos = async () => {
  try {
    // Gọi dữ liệu từ API
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);

    // Lưu dữ liệu trả về từ server
    todos = data;

    // Hiển thị dữ liệu
    renderTaskList(todos);
  } catch (error) {
    // console.log(error);
  }
};

const renderTaskList = todoList => {
  taskList.innerHTML = "";

  if (todoList.length === 0) {
    taskList.insertAdjacentHTML(
      "afterbegin",
      "<li>Không có công việc nào trong danh sách</li>"
    );
    return;
  }

  let html = "";

  todoList.forEach(task => {
    html += `
      <li>
        <input type="checkbox" ${
          task.status ? "checked" : ""
        } onchange="toggleStatus(${task.id})"/>
        <span ${task.status ? "class='active'" : ""}>${task.title}</span>
        <button onclick=editTask(${task.id})>Edit</button>
        <button onclick=deleteTask(${task.id})>Delete</button>
      </li>
  `;
  });

  taskList.innerHTML = html;
};

const addNewTask = async () => {
  const value = inputTitle.value;

  if (value.trim() === "") {
    alert("Tiêu đề công việc không được để trống");
    return;
  }

  const newTodo = {
    title: value,
    status: false,
  };

  // Gọi API gửi dữ liệu lên server
  try {
    let response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();
    console.log(data);

    // Reload
    // C1: window.location.reload();
    // C2: getAllTodos();

    todos.push(newTodo);

    renderTaskList(todos);

    inputTitle.value = "";
  } catch (error) {
    console.log(error);
  }
};

const editTask = async id => {
  const task = todos.find(task => task.id === id);

  let newTitle = window.prompt("Nhập tiêu đề công việc mới", task.title);

  if (newTitle === null) {
    return;
  }

  if (newTitle === "") {
    alert("Tiêu đề công việc không được để trống");
    return;
  }

  const editTodo = {
    title: newTitle,
    status: task.status,
  };

  // Gọi API gửi dữ liệu lên server
  try {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(editTodo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = response.json();
    console.log(data);

    if (response.ok) {
      task.title = newTitle;

      renderTaskList(todos);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async id => {
  const isConfirm = window.confirm(
    "Bạn có chắc chắn muốn xóa công việc này không ?"
  );

  if (!isConfirm) {
    return;
  }

  // Gọi API gửi dữ liệu lên server
  try {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      todos = todos.filter(task => task.id === id);
      renderTaskList(todos);
    }
  } catch (error) {
    console.log(error);
  }
};

const toggleStatus = async id => {
  const task = todos.find(task => task.id === id);

  const toggleData = {
    title: task.title,
    status: !task.status,
  };

  // Gọi API gửi dữ liệu lên server
  try {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(toggleData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = response.json();
    console.log(data);

    if (response.ok) {
      task.status = !task.status;
      renderTaskList(todos);
    }
  } catch (error) {
    console.log(error);
  }
};

const searchTitle = () => {
  const searchValue = inputTitle.value;

  if (searchValue === null) {
    return;
  }

  if (searchValue.trim() === "") {
    alert("Tiêu đề cần tìm không được để trống");
    return;
  }

  const filteredTitles = todos.filter(task => task.title.includes(searchValue));

  renderTaskList(filteredTitles);
};

addButton.addEventListener("click", addNewTask);

searchButton.addEventListener("click", searchTitle);

getAllTodos();
