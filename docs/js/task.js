class TodoRequests {
	static sendPutTodoRequest(id,todo) {
		return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
  		method: 'PUT',
  		body: JSON.stringify(todo),
  		headers: {
    		'Content-type': 'application/json; charset=UTF-8',
  		},
	})
  .then((response) => response.json())
	}

	static sendGetTodosRequest() {
		return fetch('https://jsonplaceholder.typicode.com/todos').then((response) => response.json())
	}

	static sendPostTodoRequest(todo) {
		return fetch('https://jsonplaceholder.typicode.com/todos', {
  			method: 'POST',
  			body: JSON.stringify(todo),
  			headers: {
    			'Content-type': 'application/json; charset=UTF-8',
  			},
		})
  	.then((response) => response.json())
	}

	static sendDeleteTodoRequest(id) {
   	return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      	method: 'DELETE',
   	});
	}
}

class TodosRopository {
	constructor() {
		this._todos = [];
	}
	get todos() {
		return this._todos;
	}
	set todos(todos) {
		this._todos = todos;
	}
	getTodoById(id) {
		return this._todos.find(todo => todo.id === id);
	}
}

class TodoLogic {
	static getTodos() {
		const promise = TodoRequests.sendGetTodosRequest();

	  	promise.then((todos) => {
	  		renderTodos(todos);
	  		todosRopository.todos = todos;
	  	});
	}

	static createTodo() {
		const todo = getTodoFormData();

		const promise = TodoRequests.sendPostTodoRequest(todo);
		promise.then(todo => { 
			clearForm();
			renderTodo(todo);
			todosRopository.todos.push(todo); 
		});
	}

	static deleteTodo(event) {
		const listElement = event.target.closest('li');
		const id = parseInt(listElement.dataset.id, 10);

		const promise = TodoRequests.sendDeleteTodoRequest(id);
		promise.then(() => {
			const listId = ulTodoElement.querySelector(`li[data-id="${id}"]`);
			listId.remove();
			todosRopository.todos = todosRopository.todos.filter(todo => todo.id !== id);
		});
	}

	static upDateTodo(event) {
		const listElement = event.target.closest('li');
		const id = parseInt(listElement.dataset.id, 10);
		const todo = todosRopository.getTodoById(id);
		
		todoAssignBooleanData(todo);
		const promise = TodoRequests.sendPutTodoRequest(id,todo);

		promise.then(todo => { 
			const listId = ulTodoElement.querySelector(`li[data-id="${id}"]`);
	   	listId.classList.toggle('list-group-item-info');
	   	listId.classList.toggle('list-group-item-secondary');
		});
	}
}

// INIT TODOS

const todosRopository = new TodosRopository();
const addButtonElement = document.querySelector('#js-add-todo');
const todoInputElement = document.forms.todo;
const ulTodoElement = document.querySelector('.js-list-todo');

init();

function	init() {
	TodoLogic.getTodos();
	createAddTodoEventListener();
	createTodoActionEventListener();
}

// EVENT LISTENERS

function createAddTodoEventListener() {
	addButtonElement.addEventListener('click', () => {
      TodoLogic.createTodo();
   });
}

function createTodoActionEventListener() {
	ulTodoElement.addEventListener('click', (event) => {
      if(event.target.classList.contains('bi')) {
         TodoLogic.deleteTodo(event);
      }
      if(event.target.closest('li')) {
         TodoLogic.upDateTodo(event);
      }
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
	list.textContent = todo.title;
	ulTodoElement.prepend(list);

	const closeButton = `<i class="bi bi-trash-fill"></i>`;
	list.insertAdjacentHTML('beforeend', closeButton);
	renderTodosCompleted(todo,list);
}

function renderTodosCompleted(todo,list) {
	if (todo.completed) {
		list.classList.add('list-group-item-info');
	}  else {
		list.classList.add('list-group-item-secondary');
	}
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

function todoAssignBooleanData(todo) {
	if (todo.completed) {
		todo.completed = false;
	} else {
		todo.completed = true;
	}
}
