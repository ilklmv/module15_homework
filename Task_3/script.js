// Создание WebSocket
const socket = new WebSocket('wss://echo-ws-service.herokuapp.com');

//Получение элементов из DOM
const inputMessage = document.getElementById('inputMessage');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messages');
const status = document.getElementById('status');
const mapLink = document.getElementById('map-link');
const btn = document.querySelector('.j-btn-geo');

//Добавление обработчика событий при открытии соединения
socket.addEventListener('open', (event) => {
  console.log('WebSocket соединение установлено');
});

//Добавление обработчика событий при получении сообщения
socket.addEventListener('message', (event) => {
  console.log(`Получено сообщение: ${event.data}`);
  appendMessage(event.data);
});

//Добавление обработчика событий при закрытии сообщения
socket.addEventListener('close', (event) => {
  console.log('WebSocket соединение закрыто');
});

//Добавление обработчика при ошибке соединения 
socket.addEventListener('error', (event) => {
  console.log('Ошибка WebSocket соединения');
});

//Добавляем обработчик событий при нажатии на кнопку отправки сообщения
sendButton.addEventListener('click', (event) => {
  const message = inputMessage.value;
  sendMessage(message);
});

//Функция для отправки сообщения
function sendMessage(message) {
  socket.send(message);
  inputMessage.value = '';
  console.log(`Отправлено сообщение: ${message}`);
}

// Функция для добавления сообщения в окно переписки
function appendMessage(message) {
  messagesContainer.innerHTML += `<div>${message}</div>`;
}

//Добавление геолокации
// Функция, выводящая текст об ошибке
const error = () => {
  status.textContent = 'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  status.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  mapLink.textContent = 'Ссылка на карту';
}

btn.addEventListener('click', (event) => {
  mapLink.href = '';
  mapLink.textContent = '';
  
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation не поддерживается вашим браузером';
  } else {
    status.textContent = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
});