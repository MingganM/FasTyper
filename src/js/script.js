import "../css/style.css";

let GAME = (function(){

    // SELECTORS:
    let generalSelectors = (function(){
        let mainContent = document.querySelector('.main__content');
        let navLinks = document.querySelectorAll('.nav__a');
        
        return {
            mainContent,
            navLinks
        };
    })();

    function gameController(){
        // SELECTOR FOR GAME ONLY
        function gameSelector(){
            let game = document.querySelector('.game');
            let gameContainer = game.querySelector('.game__container');
            let gameScore = game.querySelector('.game__score');
            let gameHealth = game.querySelector('.game__heath-bar');

            //GAME UI SELECTORS
            let gameUI = game.querySelector('.game__UI'); 
            let gameUIBtn = game.querySelectorAll('.game__UI-btn'); 
            let gameTimer = game.querySelector('.gameTimer');
            let restart = game.querySelector('.restart');

            return {
                game,
                gameContainer,
                gameScore,
                gameHealth,
                //GAME UI SELECTORS
                gameUI,
                gameUIBtn,
                gameTimer,
                restart
            };
        };
        let gameSelectors = gameSelector();

        // FUNCTIONS:
        function randPosX(){
            let totalX = totalWidth; 
            return randNum(totalX);
        }

        function randPosY(){
            let totalY = totalHeight;
            return randNum(totalY);
        }

        function randNum(arg){
            return Math.floor(Math.random() * arg);
        }
        
        function makeButton(){
            let randID = randNum(alphabets.length);
            let newButton = document.createElement('span');
            newButton.classList.add('button');
            newButton.style.left = `${randPosX()}px`;
            newButton.style.top = `${randPosY()}px`;
            newButton.textContent = alphabets[randID];
            newButton.dataset.id = randID;

            gameSelectors.gameContainer.appendChild(newButton);
        };

        // Checks for btn in btn list
        function checkForBtn(key){
            let allBtns = gameSelectors.gameContainer.querySelectorAll('.button');
            let countBtn = 0;

            allBtns.forEach(function(btn){
                let curBtnID = parseInt(btn.dataset.id);
                //if btn === keypressed then call correctBtn
                
                if(curBtnID === key){
                    correctBtn(btn,curBtnID);
                    countBtn++;
                }
            });

            if (countBtn === 0 ) reduceHealth();
        }

        // adds class tapped on btn, removes it and adds score according to key pressed
        function correctBtn(btn,val){
            btn.classList.add('tapped');

            if(totalHealth < 500) totalHealth += val;

            refreshGame(val)

            setTimeout(function(){
                gameSelectors.gameContainer.removeChild(btn);
            },300);
        }

        // Checks, If more than 1 btn exist GAME IS OVER
        function reduceHealth(){
            if(totalHealth > 0){
                totalHealth -= 100;
                updateHealthBar();
            }
        }

        function updateScore(){
            gameSelectors.gameScore.textContent = totalScore;
        }
        
        function refreshGame(val){
            updateHealthBar();

            if(!gameOver){
                totalScore += val + 1;
                updateScore();
            }
            else{
                gameSelectors.gameHealth.style.width = `0px`;
            }
        }

        function hideUI(){
            gameSelectors.gameUI.style.opacity = '0';
            setTimeout(function(){
                delElement(gameSelectors.gameUI);
            },1000);
        }

        function delElement(elem){
            gameSelectors.game.removeChild(elem);
        }

        function startTimer(){
            gameSelectors.gameTimer.style.display = 'block';
            gameSelectors.gameTimer.textContent = '';
            let n = 3;

            let timer = setInterval(function(){
                if(n <= 0){
                    clearInterval(timer);
                    gameSelectors.gameTimer.style.display = 'none';
                }
                else gameSelectors.gameTimer.textContent = n--;
            },1000);
        }

        function btnDirection(){
            if(this.dataset.title === 'start'){
                hideUI();
                
                startTimer();

                setTimeout(function(){ //after 3 seconds start game
                    startGame();
                },4000);
            }

            if(this.dataset.title === 'exit'){
                window.location.hash = 'home';
            }
        }

        function updateHealthBar(){
            if(gameOver) {
                totalHealth = 0;
                totalScore = 0;
            }
            totalHealth <= 0 ? gameOver = true : gameOver = false;

            gameSelectors.gameHealth.style.width = `${totalHealth}px`;
        }

        // USABLE VARIABLES:
        let totalWidth = 800;
        let totalHeight = 500;
        let totalScore = 0;
        let totalHealth = 500;
        let updateTime = 800;
        let gameOver = false;
        let isDown = false;
        const alphabets = [
                            'a','b','c','d','e','f','g','h','i','j','k','l','m',
                            'n','o','p','q','r','s','t','u','v','w','x','y','z'
                        ];

        // startGame:
        function startGame(){
            totalScore = 0;
            totalHealth = 500;
            gameOver = false;
            updateHealthBar();

            let updateGame = setInterval(function(){
                if (gameSelectors.gameContainer.children.length >= 2) gameOver = true;
    
                // If gameOver is false run this code
                if(!gameOver){
                    makeButton();
                }else if(gameOver){
                    gameSelectors.restart.style.display = 'block';
                    updateHealthBar();
                    clearInterval(updateGame);
                }
    
            },updateTime);

            document.addEventListener('keyup',function(e){
                isDown = false;
            });

            document.addEventListener('keypress',function(e){
                // a === 97, z === 122 , -97 makes them start from 0 to 26
                if(isDown){
                    return;
                }
                isDown = true;
    
                if(isDown && gameOver === false){
                    let keyVal = e.keyCode - 97;
                    checkForBtn(keyVal);
                }
            });
        }

        // GAME UI CONTROLLER:
        gameSelectors.gameUIBtn.forEach(function(btn){
            btn.addEventListener('click',btnDirection);
        });

        gameSelectors.restart.addEventListener('click',function(){
            gameSelectors.gameContainer.innerHTML = '';
            startTimer();
            updateScore();
            gameSelectors.restart.style.display = 'none';

            setTimeout(function(){ //after 3 seconds start game
                startGame();
            },4000);
        });
    };

    // LOADER FUNCTIONS --- SHOULD RUN WHEN HASH CHANGES!!

    function displayPlay(){
        generalSelectors.mainContent.innerHTML = '';

        let HTML = `
            <section class="game">
                <h2 class="game__score">0</h2>
                <div class="game__health">
                    <div class="game__heath-bar"></div>
                </div>

                <div class="game__container">
                    
                    
                </div>

                <div class="game__UI">
                    <button class="game__UI-btn" data-title='start'>Start Game</button>
                    <button class="game__UI-btn" data-title='exit'>Exit</button>
                </div>

                <h1 class="gameTimer"></h1>
                <button class="restart">Play Again</button>
            </section>
        `;
        generalSelectors.mainContent.insertAdjacentHTML('beforeend',HTML);
    }

    function displayGuide(){
        generalSelectors.mainContent.innerHTML = '';

        let HTML = `
            <section class="guide">
                <h2 class="guide__title">FasTyper Guide</h2>
                
                <article class="article">
                    <h4 class="article__heading">How to play:</h4>

                    <p class="article__text">Game refreshes with equal interval. Players are given enough time to press the correct keys. If you lose song will stop playing.</p>
                </article>

                <article class="article">
                    <h4 class="article__heading">Game Rules And Bonus:</h4>
                    
                    <ul class="article__ul">
                        <li class="article__li">You have 500 health points.</li>
                        <li class="article__li">Each wrong keypress will cost you -100 health points.</li>
                        <li class="article__li">Each key has it's alphabatical order point which will increase your health bar. For example: 'Z' wil increase 26 points.</li>
                        <li class="article__li">If u dont press 3 keys in a row, It will result in "Game Over".</li>
                        <li class="article__li">If 2 keys appear with same value, just press that key once, you will get double points.</li>
                    </ul>
                </article>

                <article class="article">
                    <button class="display-btn">T</button>
                    <button class="display-btn">h</button>
                    <button class="display-btn">a</button>
                    <button class="display-btn">n</button>
                    <button class="display-btn MR-2">k</button>

                    <button class="display-btn">y</button>
                    <button class="display-btn">o</button>
                    <button class="display-btn">u</button>
                </article>

                <article class="article">
                    <button class="display-btn">f</button>
                    <button class="display-btn">o</button>
                    <button class="display-btn">r</button>
                </article>

                <article class="article">
                    <button class="display-btn">p</button>
                    <button class="display-btn">l</button>
                    <button class="display-btn">a</button>
                    <button class="display-btn">y</button>
                    <button class="display-btn">i</button>
                    <button class="display-btn">n</button>
                    <button class="display-btn">g</button>
                </article>

            </section>
        `;
        generalSelectors.mainContent.insertAdjacentHTML('beforeend',HTML);
    }

    function displayHome(){
        generalSelectors.mainContent.innerHTML = '';
        let HTML = `
        <section class="home">
                    
            <div class="banner">
                <h1 class="banner__title">FasTyper</h1>
                <h3 class="banner__text">Play it and increase your typing speed</h3>
            </div>

            <div class="services">
                <article class="service">
                    <h2 class="service__title">IT'S FUN</h2>
                    <p class="service__text">Who does'nt like playing a game? Especially a keypressing game, right? uhh... but you will enjoy this one. For sure! </p>
                </article>

                <article class="service">
                    <h2 class="service__title">YOU WILL ACTUALLY LEARN</h2>
                    <p class="service__text">Well pressing random buttons will help u memorize their location, Aswell as increase your typing speed!</p>
                </article>

                <article class="service">
                    <h2 class="service__title">YOU WILL GET FASTER REFLEX</h2>
                    <p class="service__text">Random keys are appearing at such a fast interval. If this can't increase your reflex, I don't know what else can.</p>
                </article>

                <article class="service">
                    <h2 class="service__title">IT'S SIMPLE AND EASY</h2>
                    <p class="service__text">Guide section will teach you how to play the game and explain the rules.</p>
                </article>
            </div>

            <div class="contact">
                <h2 class="contact__title">CONTACT US</h2>
                <h4 class="contact__text">Want to improve game and community? We are listening to your suggestions!</h4>

                <form action="mailto:m4mew1@gmail.com" class="form">
                    <input type="email" placeholder="Email" class="email" id="email" required>

                    <textarea name="text-content" placeholder="Enter your message here" class="text-content"></textarea>
                    <input type="submit" value="SEND" class="submit">
                </form>
            </div>

        </section>
        `;
        generalSelectors.mainContent.insertAdjacentHTML('beforeend',HTML);
    }

    // END OF LOADER FUNCTIONS

    window.addEventListener('load',function(){
        window.location.hash = '#home';

        if(generalSelectors.mainContent.innerHTML){
            displayHome();
            document.getElementById('home').classList.add('nav__active');
        }
    });

    window.addEventListener('hashchange',function(){
        let target = document.location.hash.slice(1);

        generalSelectors.navLinks.forEach(navLink => {

            if(navLink.classList.contains('nav__active')){
                navLink.classList.remove('nav__active');
            }
        });

        document.getElementById(target).classList.add('nav__active');
        
        switch(target){
            case 'home':
                displayHome();
            break;
            
            case 'play':
                displayPlay();
                
                gameController();
            break;

            case 'guide':
                displayGuide();
            break;
        }

    });

})();