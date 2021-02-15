const addButtonElement = document.querySelector('#js-add-todo');
const todoInputElement = document.forms.todo;
const ulTodoElement = document.querySelector('.js-list-todo');

class TodoRequests {
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

	static createTodos() {
		const todo = getTodoFormData();

		const promise = TodoRequests.sendPostTodoRequest(todo);
		promise.then(todo => { 
			clearInput();
			renderTodo(todo);
			todosRopository.todos.push(todo); 
		});
	}

	static deleteTodo(event) {
		const listElement = event.target.closest('li');
		const id = parseInt(listElement.dataset.id, 10);

		const promise = TodoRequests.sendDeleteTodoRequest(id);
		promise.then(() => {
			const listElementId = ulTodoElement.querySelector(`li[data-id="${id}"]`);
			listElementId.remove();
			todosRopository.todos = todosRopository.todos.filter(todo => todo.id !== id);
		});
	}

	static updateTodo(event) {
		const listElement = event.target.closest('li');
		const id = parseInt(listElement.dataset.id, 10);
		const todo = todosRopository.getTodoById(id);
		
		todoAssignUpdateData(todo);
		const promise = TodoRequests.sendPutTodoRequest(id,todo);

		promise.then(todo => { 
			const listElementId = ulTodoElement.querySelector(`li[data-id="${id}"]`);
	   	listElementId.classList.toggle('list-group-item-info');
		});
	}
}

// EVENT LISTENERS

function createAddTodoEventListener() {
	addButtonElement.addEventListener('click', () => {
      TodoLogic.createTodos();
   })
}

function createTodoActionEventListener() {
	ulTodoElement.addEventListener('click', (event) => {

		if(event.target.closest('li')) {
		   TodoLogic.updateTodo(event);
		}
      if(event.target.closest('i')) {
         TodoLogic.deleteTodo(event);
      }
   })
}

// RENDER 

function renderTodos(todos) {
	const lists = todos.map((todo) => createListElement(todo));
}

function renderTodo(todo) {
	const list = createListElement(todo);	
}

function createListElement(todo) {
	const list = document.createElement('li');
	list.className = `list-group-item list-group-item-action d-flex 
	justify-content-between rounded-pill list-group-item-secondary`;
	list.dataset.id = todo.id;
	list.textContent = todo.title;
	const closeButton = `<i class="bi bi-trash-fill"></i>`;
	
	if (todo.completed) {
		list.classList.add('list-group-item-info');
	}  

	ulTodoElement.prepend(list);
	list.insertAdjacentHTML('beforeend', closeButton);
}

// FORM UTILS

function getTodoFormData() {
	const formData = new FormData(todoInputElement);
	return {
      title: formData.get('name'),
      completed: false,
   }
}

function todoAssignUpdateData(todo) {
	if (todo.completed) {
		todo.completed = false;
	} else {
		todo.completed = true;
	}
}

function clearInput() {
	todoInputElement.reset();
}

// INIT TODOS

const todosRopository = new TodosRopository();

init();

function	init() {
	TodoLogic.getTodos();
	createAddTodoEventListener();
	createTodoActionEventListener();
}