const addButtonElement = document.querySelector('#js-add-todo');
const todoInputElement = document.forms.todo;
const ulTodoElement = document.querySelector('.js-list-todo');

init();

function	init() {
	getTodos();
	createAddTodoEventListener();
	createDeleteTodoEventListener();
}

// LOGIC
function getTodos() {
	const promise = sendGetTodosRequest();
  	promise.then((todos) => {
  		renderTodos(todos);
  	});
}

function createTodo() {
	const todo = getTodoFormData();

	const promise = sendPostTodoRequest(todo);
	promise.then(todo => { 
		clearForm();
		renderTodo(todo);
	});
}

function deleteTodo(event) {
	const listElement = event.target.closest('li');
	const id = listElement.dataset.id;

	const promise = sendDeleteTodoRequest(id);
	promise.then(() => {
		const listId = ulTodoElement.querySelector(`li[data-id="${id}"]`);
		listId.remove();
	});
}

// Request
function sendGetTodosRequest() {
	return fetch('https://jsonplaceholder.typicode.com/todos').then((response) => response.json())
}

function sendPostTodoRequest(todo) {
	return fetch('https://jsonplaceholder.typicode.com/todos', {
  		method: 'POST',
  		body: JSON.stringify(todo),
  		headers: {
    		'Content-type': 'application/json; charset=UTF-8',
  		},
	})
  .then((response) => response.json())
}

function sendDeleteTodoRequest(id) {
   return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
   });
}

// RENDER 
function renderTodos(todos) {
	const lists = todos.map((todo) => getListElement(todo));
}

function renderTodo(todo) {
	const list = getListElement(todo);
}

function getListElement(todo) {
	const list = document.createElement('li');
	list.className = `list-group-item list-group-item-action d-flex 
	justify-content-between rounded-pill`;
	list.dataset.id = todo.id;

	if (todo.completed) {
		list.classList.add('list-group-item-success');
	} else {
		list.classList.add('list-group-item-warning');
	}

	list.textContent = todo.title;
	ulTodoElement.prepend(list);
	const closeButton = `<i class="bi bi-trash-fill"></i>`;
	list.insertAdjacentHTML('beforeend', closeButton);
}

// EVENT Listener
function createAddTodoEventListener() {
	addButtonElement.addEventListener('click', () => {
      createTodo();
   });
}

function createDeleteTodoEventListener() {
	ulTodoElement.addEventListener('click', (event) => {
      if(event.target.classList.contains('bi')) {
         deleteTodo(event);
      }
   });
}

// FORM UTILS
function getTodoFormData() {
	const formData = new FormData(todoInputElement);
	return {
      title: formData.get('name'),
      completed: false,
   }
}

function clearForm() {
	todoInputElement.reset();
}
