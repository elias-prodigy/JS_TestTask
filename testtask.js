let data = {
    "accounts" : [
        {
        "title" : "Jordan Dou",
        "img" : "https://www.svgrepo.com/show/129839/avatar.svg"
        },
        {
        "title" : "Alex Drifter",
        "img" : "https://www.svgrepo.com/show/129839/avatar.svg"
        },
        {
        "title" : "Casey Barracuda",
        "img" : "https://www.svgrepo.com/show/129839/avatar.svg"
        }
    ]
};
// Создаю Screen1
window.onload = screen1(data);
function screen1(data) {
    let screen1div = document.createElement("div")
    screen1div.id = 'screen1';
    screen1div.style.display = 'block';
    screen1div.innerHTML = `<button id = 'add_button_screen_1'
        style='position: fixed; left: 300px; top: 80px'>ADD</button>`;
    data.accounts.forEach(el => {
        let accs = document.createElement("div");
        accs.innerHTML = `<img src = '${el.img}' width='50' height='50'>
        <span tabIndex='0' style='vertical-align: 20px'>${el.title}</span>`
        screen1div.appendChild(accs);
        }
    )
    document.body.appendChild(screen1div);
}

// Ставлю фокус в Screen1 на первый элемент из accounts
document.querySelector('span').focus();

// Создаю Screen2
window.onload = screen2(data);
function screen2(data) {
    let screen2div = document.createElement("div");
    screen2div.id = 'screen2';
    screen2div.style.textAlign = 'center';
    screen2div.style.display = 'none';

    let input = document.createElement("div");
    input.innerHTML = `<input id = "input" type = "text" style='margin-top: 50px'>`;
    screen2div.appendChild(input);

    let buttons = document.createElement("div");
    buttons.innerHTML =
        `<button id = 'add_button_screen_2' style='margin-top: 20px'>ADD</button>
        <button id = 'cancel_button' style='margin-top: 20px'>Cancel</button>`;
    screen2div.appendChild(buttons);
    document.body.appendChild(screen2div);
}

// Функция смены экранов со Screen1 на Screen2. Ставлю фокус на поле Input на Screen2
function change_screen_1_to_2() {
    document.getElementById("screen2").style.display = "block";
    document.getElementById("screen1").style.display = "none";
    document.querySelector('input').focus();
}

/* Функция смены экранов со Screen2 на Screen1. В случае если на Screen1 больше
нет аккаунтов ставлю фокус на кнопку ADD. В противном случае фокус на первый в
списке аккаунт */
function change_screen_2_to_1() {
    document.getElementById("screen1").style.display = "block";
    document.getElementById("screen2").style.display = "none";
    if (data.accounts.length === 0) {
        add_button_screen_1.focus();
    } else {document.querySelector('span').focus()}
}

/* Функция перерисовки Screen1. Удаляю все элементы Screen1 и отрисовываю их заново
согласно измененным данным в data */
function redraw_screen1() {
    document.getElementById("screen1").remove();
    screen1(data);
}

/* Задаю глобальную переменную в которой хранится массив со всеми элементами
которые находились в фокусе */
let lastfocused = [];

// Обработчик событий по нажатию клавиш
window.addEventListener("keydown", event => {
// Добавляю в lastfocused все активные элементы
lastfocused.unshift(document.activeElement);
// Создаю массив из всех элементов span (список всех аккаунтов)
let accs = Array.from(document.querySelectorAll('span'));

switch (event.key) {

    case "ArrowDown":
/*      Обработчик нажатия стрелки вниз на Screen1. В конце списка аккаунтов,
        фокус переходит на первый элемент списка */
        if (accs.includes(document.activeElement)) {
            let index = accs.indexOf(document.activeElement)
            if (index === (accs.length - 1)) {
                accs[0].focus();
            break;
            }
            accs[index+1].focus();
        }
/*      Обработчик нажатия стрелки вниз на Screen2. Не самое элегантное решение
        просто перебрал все возможные случаи */
        let down_filter = lastfocused.filter((el,index) => {
            return index === lastfocused.indexOf(el);
        });
        if (document.activeElement === input && down_filter[1] ===
            add_button_screen_2) {
            add_button_screen_2.focus()
        }
        else if (document.activeElement === input && down_filter[1] ===
            cancel_button) {
            cancel_button.focus()
        }
        else if (down_filter[0] === cancel_button && down_filter[1] ===
            add_button_screen_2) {
            break;
        }
        else if (down_filter[0] === cancel_button && down_filter[1] === input) {
            break;
        } else {add_button_screen_2.focus()}
        break;

    case "ArrowUp":
/*      Обработчик нажатия стрелки вверх на Screen1. В конце списка аккаунтов,
        фокус переходит на последний элемент списка */
        if (accs.includes(document.activeElement)) {
            let index = accs.indexOf(document.activeElement)
            if (index === 0) {
                accs[accs.length - 1].focus();
            break;
            }
            accs[index-1].focus();
        }
/*      Обработчик нажатия стрелки вверх на Screen2. Если фокус на кнопке ADD
        или на кнопке Cancel, ставлю фокус на Input */
        if (document.activeElement === add_button_screen_2 ||
            document.activeElement === cancel_button) {
            input.focus();
        }
        break;

    case "ArrowLeft":
/*      Обработчик нажатия стрелки влево на Screen1. Меняю фокус с кнопки ADD на
        последний активный элемент из accounts. Фильтрую список lastfocused
        и получаю список из уникальных обьектов бывших в фокусе. Далее в
        полученном списке присваиваю фокус элементу с индексом 1, т.к с индексом
        0 будет элемент span (один из аккаунтов) */
        if (document.activeElement === add_button_screen_1) {
            let left_filter = lastfocused.filter((el,index) => {
                return index === lastfocused.indexOf(el);
            });
            left_filter[1].focus();
        break;
        }
/*      Обработчик нажатия стрелки влево на Screen1. Удаление записей "аккаунт"
        из объекта data и с экрана. При удалении страница перерисовывается и
        фокус задается согласно указанному условию */
        if (accs.includes(document.activeElement)) {
            data.accounts.some((el,index) => {
                let name = el.title;
                if (name === document.activeElement.innerHTML) {
                    data.accounts.splice(index, 1);
                    document.activeElement.parentNode.remove();
                    redraw_screen1();
                    if (data.accounts.length === 0) {
                        add_button_screen_1.focus();
                    } else {document.querySelector('span').focus()}
                }
            });
        }
//      Обработчик нажатия стрелки влево на Screen2. Ставлю фокус на кнопку ADD
        if (document.activeElement === cancel_button) {
            add_button_screen_2.focus();
        }
        break;

    case "ArrowRight":
/*      Обработчик нажатия стрелки вправо на Screen1. Если фокус на элементе
        аккаунта ставлю фокус на кнопку ADD */
        if (accs.includes(document.activeElement)) {
            add_button_screen_1.focus();
        }
/*      Обработчик нажатия стрелки вправо на Screen2. Если фокус на кнопке ADD
        ставлю фокус на кнопку Cancel*/
        if (document.activeElement === add_button_screen_2) {
            cancel_button.focus();
        }
        break;

    case "Enter":
/*      Обработчик нажатия Enter на Screen1 на кнопку ADD. При нажатии запускаю
        функцию по смене Screen1 на Screen2 */
        if (document.activeElement === add_button_screen_1) {
            change_screen_1_to_2();
        }
/*      Обработчик нажатия Enter на Screen2 на кнопку ADD. При нажатии берем
        данные введенные в Input и записываем в data.accounts. Перерисовываю
        Screen1. Очищаю Input. Меняю Screen2 на Screen1. */
        if (document.activeElement === add_button_screen_2) {
            let title = input.value;
            data.accounts.push({title: title,
                img:"https://www.svgrepo.com/show/129839/avatar.svg"});
            redraw_screen1();
            input.value = "";
            change_screen_2_to_1();
        }
/*      Обработчик нажатия Enter на Screen2 на кнопку Cancel. При нажатии очищаю
        Input и меняю Screen2 на Screen1. */
        if (document.activeElement === cancel_button) {
            input.value = "";
            change_screen_2_to_1();
        }
        break;

    default:
        return;
    }
}, true)

