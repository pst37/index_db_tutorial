import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import {
  initIndexDBFactory,
  addTodo,
  getAllTodos,
  deleteItemById,
  searchItemByIndex,
  sortBy,
  doRandomThings,
} from './counter.js';

const getATodoItem = (id, name, expiration) => {
  return `
    <div class="item">
      <h4 class="itemName">${name}</h4>
      <div class="expiration">${expiration}</div>
      <button id="${id}" data-action-type="delete">Delete</button>
    </div>
  `;
};

document.querySelector('#app').innerHTML = `
  <h1>Index DB TODOs</h1>
  <div class="card">
    <label for="addTodoItem"> Add Todo</label>
    <input type="text" id="addTodoItem"/>
    <label for="expirationTime">Expiration Time<label>
    <input type="datetime-local" id="expirationTime"/>
    <button id="saveButton">Save</button>
  </div>
  <div class="listSection">
    <div>
      <h2> Search Todo</h2>
      <button id="searchByNameButton">By Name</button>
      <button id="searchByTimeButton">By Exp Time</button>
      <input type="text" id="searchByNameTodo" placeholder="Search By Name"/>
      <input type="datetime-local" id="searchByTimeTodo" placeholder="search By time" style="display:none;"/>

      <button id="searchSearch">Search</button>
    </div>

    <div>
      <h3>All Todos</h3>
      <div id="todoList">
      </div>
    </div>
  </div>
  <div>
  <h3>SORT BY</h3>
  <select id="sortByIndex" placeholder="Search By Name"/>
  <option value="name">None</option>
    <option value="name">name</option>
    <option expiration="expiration">expiration</option>
  </select>
    <button id="randomThings"> Random Things</button>
  </div>
`;

saveButton.addEventListener('click', () => {
  const name = addTodoItem.value;
  const expiration = expirationTime.value;
  const addToDoDetails = { id: Date.now().toString(), name, expiration };

  console.log('aaddToDoDetails', addToDoDetails);
  addTodo(addToDoDetails)
    .then((value) => {
      addSingleItem(value, name, expiration);
    })
    .catch((e) => {
      console.error(e);
    });
});

let currentActiveSearchEle = searchByNameTodo;
let currentActiveSearchType = 'name';

function addSingleItem(value, name, expiration) {
  console.log('todoList', todoList);
  const todoItems = [];
  todoItems.push(getATodoItem(value, name, expiration));

  todoList.innerHTML += todoItems.join('');
}

todoList.addEventListener('click', (e) => {
  const actionType = e.target.dataset.actionType;
  const id = e.target.id;

  if (actionType === 'delete') {
    deleteItemById(Number(id))
      .then(() => {
        getAllTodos().then(displayAllTodos).catch(console.error);
      })
      .catch((e) => {
        console.error(e);
      });
  }
});

function displayAllTodos(values) {
  console.log('values', values);
  const todoItems = [];
  for (let item of values) {
    todoItems.push(getATodoItem(item.id, item.name, item.expiration));
  }

  todoList.innerHTML = todoItems.join('');
}

searchByNameButton.addEventListener('click', (e) => {
  searchByTimeTodo.style.display = 'none';
  searchByNameTodo.style.display = 'block';
  currentActiveSearchEle = searchByNameTodo;
  currentActiveSearchType = 'name';
});

searchByTimeButton.addEventListener('click', (e) => {
  console.log('clicked');
  searchByTimeTodo.style.display = 'block';
  searchByNameTodo.style.display = 'none';
  currentActiveSearchEle = searchByTimeTodo;
  currentActiveSearchType = 'expiration';
});

searchSearch.addEventListener('click', () => {
  const value = currentActiveSearchEle.value;
  searchItemByIndex(currentActiveSearchType, value)
    .then((value) => {
      console.log('value', value);
    })
    .catch((e) => {
      console.error(e);
    });
});

window.addEventListener('load', () => {
  initIndexDBFactory('todos', 1)
    .then(() => {
      getAllTodos().then(displayAllTodos).catch(console.error);
    })
    .catch((e) => {
      console.error(e);
    });
});

sortByIndex.addEventListener('change', (e) => {
  const value = e.target.value;
  console.log('sortBy', value);
  sortBy(value, false)
    .then(console.log.bind(null, 'values on sort'))
    .catch(console.error.bind(null, 'Error'));
});

randomThings.addEventListener('click', (e) => {
  doRandomThings()
    .then(console.log.bind(null, 'values on random'))
    .catch(console.error.bind(null, 'Error'));
});
