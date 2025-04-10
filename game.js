// Игровые переменные
const playerHPLabel = document.getElementById('playerHPLabel');
const computerHPLabel = document.getElementById('computerHPLabel');
const logArea = document.getElementById('logArea');
const fightButton = document.getElementById('fightButton');

let playerHP = 30;
let computerHP = 30;
const targets = ["ГОЛОВА", "КОРПУС", "НОГИ"];
let playerName = "ИГРОК";

// Статистика
let stats = {
    total: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    playerHits: 0,
    playerBlocks: 0,
    computerHits: 0,
    computerBlocks: 0
};

// Статистика текущего боя
let currentRoundStats = {
    playerHits: 0,
    playerBlocks: 0,
    computerHits: 0,
    computerBlocks: 0
};

// Инициализация игры
function initGame() {
    // Показываем модальное окно с вводом имени
    document.getElementById('nameModal').style.display = 'block';

    // Обработчик кнопки начала игры
    document.getElementById('startGameBtn').addEventListener('click', function() {
        const nameInput = document.getElementById('playerNameInput').value.trim();
        if (nameInput) {
            playerName = nameInput.toUpperCase();
        }
        document.getElementById('nameModal').style.display = 'none';
        startNewGame();
    });

    // Обработчик нажатия Enter
    document.getElementById('playerNameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('startGameBtn').click();
        }
    });
}

function startNewGame() {
    playerHPLabel.textContent = `${playerName}: ${playerHP} ОЗ`;
    addToLog("------------------------------------------------");
    addToLog(`=== ДОБРО ПОЖАЛОВАТЬ В SHMAVAD COMBATS, ${playerName}! ===`);
    addToLog("------------------------------------------------");

    fightButton.addEventListener('click', performRound);
}

// Выполнение раунда боя
function performRound() {
    const playerAttack = document.querySelector('input[name="attack"]:checked')?.value;
    const playerDefend = document.querySelector('input[name="defend"]:checked')?.value;

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
        addToLog(`! ${playerName} попали по компьютеру на 3 урона!`);
        currentRoundStats.playerHits++;
    } else {
        addToLog(`- Компьютер заблокировал вашу атаку!`);
        currentRoundStats.playerBlocks++;
    }

    // Атака компьютера
    if (playerDefend !== computerAttack) {
        playerHP -= 3;
        addToLog(`! КОМПЬЮТЕР попал по вам на 3 урона!`);
        currentRoundStats.computerHits++;
    } else {
        addToLog(`- Вы блокировали атаку компьютера!`);
        currentRoundStats.computerBlocks++;
    }

    updateHP();

    // Проверка условий победы
    if (playerHP <= 0 && computerHP <= 0) {
        addToLog("\n=== НИЧЬЯ! Оба бойца повержены! ===");
        stats.draws++;
        showResult("НИЧЬЯ!");
    } else if (playerHP <= 0) {
        addToLog("\n=== ВЫ ПРОИГРАЛИ! Компьютер победил! ===");
        stats.losses++;
        showResult("ПОРАЖЕНИЕ!");
    } else if (computerHP <= 0) {
        addToLog("\n=== ВЫ ПОБЕДИЛИ! Компьютер повержен! ===");
        stats.wins++;
        showResult("ПОБЕДА!");
    }

    addToLog("----------------------------------------");
}

// Обновление HP на экране
function updateHP() {
    playerHPLabel.textContent = `${playerName}: ${Math.max(0, playerHP)} ОЗ`;
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

// Показать результаты боя
function showResult(result) {
    stats.total++;
    stats.playerHits += currentRoundStats.playerHits;
    stats.playerBlocks += currentRoundStats.playerBlocks;
    stats.computerHits += currentRoundStats.computerHits;
    stats.computerBlocks += currentRoundStats.computerBlocks;

    // Заполняем модальное окно
    document.getElementById('resultTitle').textContent = result;
    document.getElementById('roundStats').innerHTML = `
        <h3>Статистика раунда:</h3>
        <p>${playerName}:<br>
        Удачных атак: ${currentRoundStats.playerHits}<br>
        Блоков: ${currentRoundStats.playerBlocks}</p>
        <p>Компьютер:<br>
        Удачных атак: ${currentRoundStats.computerHits}<br>
        Блоков: ${currentRoundStats.computerBlocks}</p>
    `;
    document.getElementById('totalStats').innerHTML = `
        <h3>Общая статистика:</h3>
        <p>Всего боёв: ${stats.total}<br>
        Побед: ${stats.wins}<br>
        Ничьих: ${stats.draws}<br>
        Поражений: ${stats.losses}</p>
    `;

    // Показываем модальное окно
    document.getElementById('resultModal').style.display = 'block';

    // Обработчик кнопки "Ещё бой" (сработает только один раз)
    document.getElementById('newFightBtn').addEventListener('click', resetGame, { once: true });

    // Отключаем элементы управления
    disableControls();
}

// Сброс игры для нового боя
function resetGame() {
    // Сброс параметров
    playerHP = computerHP = 30;
    currentRoundStats = {
        playerHits: 0,
        playerBlocks: 0,
        computerHits: 0,
        computerBlocks: 0
    };

    // Очистка интерфейса
    document.getElementById('resultModal').style.display = 'none';
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = false;
        input.checked = false;
    });
    fightButton.disabled = false;
    updateHP();

    // Очистка лога
    logArea.textContent = '';
    addToLog("------------------------------------------------");
    addToLog(`=== НОВЫЙ БОЙ! ===`);
    addToLog("------------------------------------------------");
}

// Отключение элементов управления
function disableControls() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.disabled = true;
    });

    fightButton.disabled = true;
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Проверка запуска в Telegram
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.expand(); // Раскрыть на весь экран
    tg.enableClosingConfirmation(); // Подтверждение закрытия

    tg.MainButton.setText("Меню");
    tg.MainButton.show();
    tg.MainButton.onClick(() => tg.close());

    console.log("Запущено в Telegram WebApp");
}

// Проверяем, что запущено в Telegram WebApp
if (window.Telegram?.WebApp) {
    // Растягиваем на всю доступную ширину
    Telegram.WebApp.expand();

    // Блокируем возможность ручного изменения размера
    Telegram.WebApp.MainButton.hide();
    Telegram.WebApp.enableClosingConfirmation();

    // Принудительно обновляем размеры при изменении ориентации
    window.addEventListener('orientationchange', () => {
        Telegram.WebApp.expand();
    });
}