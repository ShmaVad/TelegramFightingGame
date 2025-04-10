// Игровые переменные
const playerHPLabel = document.getElementById('playerHPLabel');
const computerHPLabel = document.getElementById('computerHPLabel');
const logArea = document.getElementById('logArea');
const fightButton = document.getElementById('fightButton');

let playerHP = 30;
let computerHP = 30;
const targets = ["ГОЛОВА", "КОРПУС", "НОГИ"];

// Инициализация игры
function initGame() {
    // Проверка на запуск в Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        console.log("Running in Telegram WebApp");
    } else {
        console.log("Running in standalone mode");
    }

    // Добавление приветствия
    addToLog("------------------------------------------------");
    addToLog("=== ДОБРО ПОЖАЛОВАТЬ В SHMAVAD COMBATS! ===");
    addToLog("------------------------------------------------");

    // Обработчик кнопки боя
    fightButton.addEventListener('click', performRound);

    // Тестовые данные (можно удалить)
    console.log("Game initialized successfully");
}

// Выполнение раунда боя
function performRound() {
    console.log("Fight button clicked");

    const playerAttack = document.querySelector('input[name="attack"]:checked')?.value;
    const playerDefend = document.querySelector('input[name="defend"]:checked')?.value;

    console.log(`Player attack: ${playerAttack}, defend: ${playerDefend}`);

    if (!playerAttack || !playerDefend) {
        alert("Выберите цель для атаки и защиты!");
        return;
    }

    const computerAttack = targets[Math.floor(Math.random() * targets.length)];
    const computerDefend = targets[Math.floor(Math.random() * targets.length)];

    addToLog(`> КОМПЬЮТЕР атакует ${computerAttack} и защищает ${computerDefend}`);

    // Атака игрока
    if (computerDefend !== playerAttack) {
        computerHP -= 3;
        addToLog("! ВЫ попали по компьютеру на 3 урона!");
    } else {
        addToLog("- Компьютер заблокировал вашу атаку!");
    }

    // Атака компьютера
    if (playerDefend !== computerAttack) {
        playerHP -= 3;
        addToLog("! КОМПЬЮТЕР попал по вам на 3 урона!");
    } else {
        addToLog("- Вы блокировали атаку компьютера!");
    }

    updateHP();

    // Проверка условий победы
    if (playerHP <= 0 && computerHP <= 0) {
        addToLog("\n=== НИЧЬЯ! Оба бойца повержены! ===");
        disableControls();
    } else if (playerHP <= 0) {
        addToLog("\n=== ВЫ ПРОИГРАЛИ! Компьютер победил! ===");
        disableControls();
    } else if (computerHP <= 0) {
        addToLog("\n=== ВЫ ПОБЕДИЛИ! Компьютер повержен! ===");
        disableControls();
    }

    addToLog("----------------------------------------");
}

// Обновление HP на экране
function updateHP() {
    playerHPLabel.textContent = `ИГРОК: ${Math.max(0, playerHP)} ОЗ`;
    computerHPLabel.textContent = `КОМПЬЮТЕР: ${Math.max(0, computerHP)} ОЗ`;

    // Изменение цвета при низком HP
    playerHPLabel.style.color = playerHP < 5 ? "#FF0000" : playerHP < 10 ? "#FFA500" : "#4CAF50";
    computerHPLabel.style.color = computerHP < 5 ? "#FF0000" : computerHP < 10 ? "#FFA500" : "#F44336";
}

// Добавление сообщения в лог
function addToLog(message) {
    logArea.textContent += message + "\n";
    logArea.scrollTop = logArea.scrollHeight;
}

// Отключение элементов управления
function disableControls() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.disabled = true;
    });

    fightButton.disabled = true;
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);