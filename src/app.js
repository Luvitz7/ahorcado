const keyboard = document.querySelector("#keyboard");
const word = document.querySelector(".secret-word");
const ahorcado = document.querySelector(".image-container")
const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l","ñ"],
  ["z", "x", "c", "v", "b", "n", "m",",","."],
  ["new word", "space" , "restart"]
];

const ahorcadoDraw = [
    "assets/images/poste.png",
    "assets/images/piernaIzquierda.png",
    "assets/images/piernaDerecha.png",
    "assets/images/torso.png",
    "assets/images/brazoIzquierdo.png",
    "assets/images/brazoDerecho.png",
    "assets/images/cabeza.png",
    "assets/images/ahorcado.png"
];
const listElements = [];

keyboardLetters.map((letters) => {
    const list = document.createElement("ul");
    letters.map((letter) => {
      const listItem = document.createElement("li");
      switch (letter) {
        case "new word":
          listItem.innerHTML = `
            <button onclick="newWord()" class="comandBtn revelated" id=${letter}>${letter}</button>
          `;
          break;
        case "restart":
          listItem.innerHTML = `
            <button onclick="restart()" class="comandBtn restart" id=${letter}>${letter}</button>
          `;
          break;
          case "space":
            listItem.innerHTML = `
            <button onclick="pressLetter()" class="comandBtn" id=${' '}>${letter}</button>
          `;
          break;
        default:
          listItem.innerHTML = `
            <button onclick="pressLetter()" id=${letter}>${letter}</button>
          `;
          break;
      }
      list.appendChild(listItem);
    });
    listElements.push(list);
  });
  
  keyboard.append(...listElements);

  let secretWord = [];
  let playerWord = [];
  let counterPlayer = 0;
  let game = true;

  const renderWord = () => {
    secretWord.forEach(letter => {
        const letters = document.createElement('DIV');
        letters.setAttribute('value', letter);
        letters.setAttribute('class', "word");
        word.appendChild(letters);
      })
  }

  const fetchWord = () => {
    fetch("https://random-word-api.herokuapp.com/word?lang=es")
      .then((response) => response.json())
      .then((data) => {
        secretWord = data[0].toLocaleLowerCase().split("");
        renderWord();
      });

  };

  const newWord = () => {
    fetchWord();
    word.innerHTML = "";
    playerWord = [];
    counterPlayer = 0;
    game = true;
    cleanKeyboard();
    ahorcado.setAttribute('SRC', ahorcadoDraw[0])
  }
  
  const pressLetter = () => {
    if (secretWord.length != 0 && game == true) {
        const evento = event.target.id;
        checkKey(evento);
        event.srcElement.classList.add('restart');
    } else {
        alert("Selecciona new word para iniciar")
    }
  }

  const restart = () => {
    word.innerHTML = "";
    renderWord();
    playerWord = [];
    counterPlayer = 0;
    game = true;
    cleanKeyboard();
    ahorcado.setAttribute('SRC', ahorcadoDraw[0])
  }

  const cleanKeyboard = () => {
    for (let i = 0; i < 3; i++) {
      // accede al tecladoo y a los primeros 3 ul
      const arrayRowKeyboard = keyboard.children[i].children;
      console.log(arrayRowKeyboard);
      for (let i = 0; i < arrayRowKeyboard.length; i++) {
      // esta ruta accesa al boton en cada elemento de la lista
      arrayRowKeyboard[i].children[0].classList.remove('restart');
      }
    }
  }

  addEventListener('keyup', event => {
    if (secretWord.length != 0 && game == true ) {
      checkKey(event.key)
    } else {
        alert("Selecciona new word para iniciar")
    }
  });

  const checkKey = (evento) => {
    if ( secretWord.includes(evento)) {
        for (let index = 0; index <= secretWord.length; index++) {
            if (secretWord[index] === evento) {
                word.children[index].classList.add('revelated');
                word.children[index].innerText = secretWord[index].toLocaleUpperCase();
                playerWord[index] = secretWord[index];
            }
        }
        if (playerWord.join() === secretWord.join()) {
            game = false;
            setTimeout(() => alert("¡Felicidades Ganaste!"), 500 )
        } 
    } else if (counterPlayer < 7) {
        counterPlayer++;
        ahorcado.setAttribute('SRC', ahorcadoDraw[counterPlayer]);
    } else {
        alert(`Perdiste la palabra era ${secretWord.join('')}`);
        game = false
    }
  }