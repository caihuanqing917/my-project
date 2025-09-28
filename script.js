// 游戏状态
let playerScore = 0;
let computerScore = 0;

// 游戏选项
const choices = {
    rock: { emoji: '🪨', name: '石头' },
    paper: { emoji: '📄', name: '布' },
    scissors: { emoji: '✂️', name: '剪刀' }
};

// DOM 元素
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const playerChoiceElement = document.getElementById('player-choice');
const computerChoiceElement = document.getElementById('computer-choice');
const resultMessageElement = document.getElementById('result-message');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-btn');
const musicToggle = document.getElementById('music-toggle');
const soundToggle = document.getElementById('sound-toggle');

// 初始化游戏
function initGame() {
    // 为每个选择按钮添加点击事件
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playerChoice = button.dataset.choice;
            audioManager.playClickSound(); // 播放点击音效
            playRound(playerChoice);
        });
    });

    // 重置按钮事件
    resetButton.addEventListener('click', () => {
        audioManager.playClickSound();
        resetGame();
    });

    // 音频控制按钮事件
    musicToggle.addEventListener('click', () => {
        audioManager.playClickSound();
        const isMusicOn = audioManager.toggleMusic();
        updateMusicButton(isMusicOn);
    });

    soundToggle.addEventListener('click', () => {
        // 先播放音效再切换状态，这样用户能听到这个点击
        audioManager.playClickSound();
        setTimeout(() => {
            const isSoundOn = audioManager.toggleSounds();
            updateSoundButton(isSoundOn);
        }, 100);
    });

    // 初始化音频控制按钮状态
    updateMusicButton(audioManager.musicEnabled);
    updateSoundButton(audioManager.soundEnabled);

    // 初始化显示
    updateScore();
    showMessage('选择您的出招！', '');

    // 启动背景音乐
    setTimeout(() => {
        audioManager.startBackgroundMusic();
    }, 1000);
}

// 更新音乐按钮状态
function updateMusicButton(isOn) {
    if (isOn) {
        musicToggle.className = 'audio-btn music-on';
        musicToggle.innerHTML = '🎵 音乐';
    } else {
        musicToggle.className = 'audio-btn music-off';
        musicToggle.innerHTML = '🔇 音乐';
    }
}

// 更新音效按钮状态
function updateSoundButton(isOn) {
    if (isOn) {
        soundToggle.className = 'audio-btn sound-on';
        soundToggle.innerHTML = '🔊 音效';
    } else {
        soundToggle.className = 'audio-btn sound-off';
        soundToggle.innerHTML = '🔇 音效';
    }
}

// 玩一轮游戏
function playRound(playerChoice) {
    // 禁用按钮防止重复点击
    disableButtons();

    // 生成电脑选择
    const computerChoice = getComputerChoice();

    // 显示选择
    showChoices(playerChoice, computerChoice);

    // 添加一个短暂的延迟以增加悬念
    setTimeout(() => {
        // 判断胜负
        const result = determineWinner(playerChoice, computerChoice);

        // 播放结果音效
        playResultSound(result);

        // 更新分数
        updateScoreBasedOnResult(result);

        // 显示结果
        showResult(result, playerChoice, computerChoice);

        // 重新启用按钮
        enableButtons();
    }, 1000);
}

// 播放结果音效
function playResultSound(result) {
    switch (result) {
        case 'win':
            audioManager.playWinSound();
            break;
        case 'lose':
            audioManager.playLoseSound();
            break;
        case 'tie':
            audioManager.playTieSound();
            break;
    }
}

// 获取电脑选择
function getComputerChoice() {
    const choiceArray = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * choiceArray.length);
    return choiceArray[randomIndex];
}

// 显示选择
function showChoices(playerChoice, computerChoice) {
    playerChoiceElement.textContent = choices[playerChoice].emoji;

    // 电脑选择添加动画效果
    let counter = 0;
    const animationInterval = setInterval(() => {
        const randomChoice = getComputerChoice();
        computerChoiceElement.textContent = choices[randomChoice].emoji;
        counter++;

        if (counter >= 10) {
            clearInterval(animationInterval);
            computerChoiceElement.textContent = choices[computerChoice].emoji;
        }
    }, 100);
}

// 判断胜负
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    if (winConditions[playerChoice] === computerChoice) {
        return 'win';
    } else {
        return 'lose';
    }
}

// 根据结果更新分数
function updateScoreBasedOnResult(result) {
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        computerScore++;
    }
    updateScore();
}

// 更新分数显示
function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

// 显示结果
function showResult(result, playerChoice, computerChoice) {
    const playerName = choices[playerChoice].name;
    const computerName = choices[computerChoice].name;

    let message = '';
    let className = '';

    switch (result) {
        case 'win':
            message = `🎉 您赢了！${playerName} 击败 ${computerName}`;
            className = 'win';
            // 添加胜利效果
            playerChoiceElement.classList.add('winner');
            computerChoiceElement.classList.add('loser');
            break;
        case 'lose':
            message = `😔 您输了！${computerName} 击败 ${playerName}`;
            className = 'lose';
            // 添加失败效果
            playerChoiceElement.classList.add('loser');
            computerChoiceElement.classList.add('winner');
            break;
        case 'tie':
            message = `🤝 平局！都选择了${playerName}`;
            className = 'tie';
            break;
    }

    showMessage(message, className);

    // 检查是否有人率先达到5分
    if (playerScore >= 5 || computerScore >= 5) {
        setTimeout(() => {
            showGameOver();
        }, 2000);
    }
}

// 显示消息
function showMessage(message, className) {
    resultMessageElement.textContent = message;
    resultMessageElement.className = `result-message ${className}`;
}

// 游戏结束
function showGameOver() {
    let finalMessage = '';
    const isPlayerWin = playerScore >= 5;

    if (isPlayerWin) {
        finalMessage = '🏆 恭喜！您获得了最终胜利！';
        showMessage(finalMessage, 'win');
        audioManager.playGameOverSound(true);
    } else {
        finalMessage = '💻 电脑获得了最终胜利！再试一次吧！';
        showMessage(finalMessage, 'lose');
        audioManager.playGameOverSound(false);
    }

    disableButtons();
}

// 重置游戏
function resetGame() {
    playerScore = 0;
    computerScore = 0;

    updateScore();

    playerChoiceElement.textContent = '❓';
    computerChoiceElement.textContent = '❓';

    // 清除所有效果类
    playerChoiceElement.className = 'choice-display';
    computerChoiceElement.className = 'choice-display';

    showMessage('选择您的出招！', '');

    enableButtons();
}

// 禁用按钮
function disableButtons() {
    choiceButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

// 启用按钮
function enableButtons() {
    choiceButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);