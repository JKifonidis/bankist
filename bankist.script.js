// Data
const account1 = {
  owner: "Janis Kifonidis",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1111,
  movementsDates: [
    "2019-11-19T02:59:00.904Z",
    "2020-10-10T10:26:33.185Z",
    "2020-12-30T22:01:15.194Z",
    "2021-07-02T23:18:15.929Z",
    "2022-03-05T12:34:50.178Z",
    "2022-06-16T07:33:12.383Z",
    "2023-01-01T00:00:00.604Z",
    "2023-04-12T11:44:26.790Z",
  ],
  currency: "PLN",
  locale: "pl-PL",
};

const account2 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 2222,

  movementsDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-03-08T14:11:59.604Z",
    "2020-03-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account3 = {
  owner: "Dave Weckl",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    "2018-02-01T08:02:50.904Z",
    "2019-02-06T11:32:41.185Z",
    "2019-07-13T16:00:01.194Z",
    "2019-09-03T22:26:56.929Z",
    "2021-10-01T12:44:36.178Z",
    "2021-12-29T02:32:24.383Z",
    "2022-01-11T23:12:16.604Z",
    "2022-04-24T11:31:28.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "George Kollias",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 4444,
  movementsDates: [
    "2019-02-28T10:52:03.904Z",
    "2019-07-07T01:23:17.185Z",
    "2019-11-20T12:01:21.194Z",
    "2020-03-03T13:58:22.929Z",
    "2021-03-18T21:13:28.178Z",
    "2021-10-03T02:55:47.383Z",
    "2022-07-01T06:00:59.604Z",
    "2022-11-12T12:11:03.790Z",
  ],
  currency: "EUR",
  locale: "el-GR",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let isLoggedIn = false;
let isSorted = false;
let isCurrencyChanged = false;
let currentAccount;
let currentDate = new Date().toLocaleDateString();
let datesUnsorted = [];
let datesSorted = [];
let movementsUnsorted = [];
let movementsSorted = [];
let timerOn = false;
let time;

// Reset inputs
const resetInputs = () => {
  inputLoginUsername.value = null;
  inputLoginPin.value = null;
  inputTransferTo.value = null;
  inputTransferAmount.value = null;
  inputLoanAmount.value = null;
  inputCloseUsername.value = null;
  inputClosePin.value = null;
};

// Change app visibility status
const checkAppStatus = function () {
  if (isLoggedIn === true) {
    if (Number(inputLoginPin.value) !== currentAccount.pin) return;
    login();
    containerApp.style.opacity = 100;
    openAccountPanel();
  }
  if (!isLoggedIn) return;
};
// Reset outputs
const resetOutputs = () => {
  labelDate.textContent = null;
  labelBalance.textContent = null;
  labelSumIn.textContent = null;
  labelSumOut.textContent = null;
  labelSumInterest.textContent = null;
  labelTimer.textContent = null;
  containerMovements.innerHTML = null;
};

// Login
const login = () => {
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (Number(inputLoginPin.value) === currentAccount.pin) {
    isLoggedIn = true;
    timerOn = true;
    isSorted = false;
    currentAccount.currency !== "EUR"
      ? (isCurrencyChanged = true)
      : (isCurrencyChanged = false);
    movementsUnsorted = [];
    movementsSorted = [];
    datesUnsorted = [];
    datesSorted = [];
    // changeCurrency();
  } else return;
};

// Logout
const logout = () => {
  timerOn = false;
  isLoggedIn = false;
  currentAccount = null;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log in to get started";
  resetInputs();
  resetOutputs();
};

// Change currency
const changeCurrency = () => {
  if (!isCurrencyChanged) return;
  const euroToPln = 0.21;
  const euroToUsd = 1.11;
  if (currentAccount.currency === "PLN")
    currentAccount.movements = currentAccount.movements.map((mov) =>
      Math.round((mov *= euroToPln))
    );
  if (currentAccount.currency === "USD")
    currentAccount.movements = currentAccount.movements.map((mov) =>
      Math.round((mov *= euroToUsd))
    );
  isCurrencyChanged = true;
};

// Check currency symbol
const checkCurrencySymbol = () => {
  currentAccount.currency === "EUR" ? "€" : "$";
  switch (currentAccount.currency) {
    case "PLN":
      return "zł";
      break;
    case "EUR":
      return "€";
      break;
    case "USD":
      return "$";
      break;
  }
};

// Check if current date is today
const checkIfToday = (date, i) => {
  const dateFormatted = new Date(date).toLocaleDateString(
    currentAccount.locale
  );
  if (dateFormatted === currentDate) return "TODAY";
  else return dateFormatted;
};

// Open account panel
const openAccountPanel = () => {
  resetInputs();
  movementsUnsorted = [...currentAccount.movements];
  datesUnsorted = [...currentAccount.movementsDates];
  labelWelcome.textContent = `${
    Number(createTimestamp().split(":")[0]) < 12
      ? "Good Morning"
      : "Good Evening"
  }, ${currentAccount.owner.split(" ")[0]}!`;
  labelBalance.textContent = `${calcBalance()}${checkCurrencySymbol()}`;
  labelDate.textContent = `${
    createDatestamp().length < 9 ? "0" : ""
  }${createDatestamp().replaceAll(".", "/")}, ${createTimestamp().slice(
    0,
    -3
  )}`;
  displayMovements();
  calcDisplaySummary();
  time = 600;
};

// Display movements
const displayMovements = function () {
  containerMovements.innerHTML = "";
  currentAccount.movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${checkIfToday(
              currentAccount.movementsDates[i]
            )}</div>
            <div class="movements__value">${mov}${checkCurrencySymbol()}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display balance
const calcBalance = () =>
  currentAccount.movements.reduce(
    (acc, mov) => Number((acc += mov).toFixed(2)),
    0
  );

// Display summary
const calcDisplaySummary = function () {
  const income = Number(
    currentAccount.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0)
      .toFixed(2)
  );
  labelSumIn.textContent = `${income}${checkCurrencySymbol()}`;

  const outcome = Number(
    currentAccount.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0)
      .toFixed(2)
  );
  labelSumOut.textContent = `${Math.abs(outcome)}${checkCurrencySymbol()}`;

  const interest = Number(
    currentAccount.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * 1.2) / 100)
      .filter((int) => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0)
      .toFixed(2)
  );
  labelSumInterest.textContent = `${interest}${checkCurrencySymbol()}`;
};

// Update movements
const updateMovements = () => {
  if (isSorted) {
    currentAccount.movements = [...movementsSorted];
    currentAccount.movementsDates = [...datesSorted];
  } else currentAccount.movements = [...movementsUnsorted];
  currentAccount.movementsDates = [...datesUnsorted];
};

// Sort movements
const sortMovements = () => {
  if (!isSorted) return;
  movementsSorted = [];
  datesSorted = [];
  let lowestMovement;
  let movementIndex;
  let movementsReduced = [...currentAccount.movements];
  for (let i = 0; i < currentAccount.movements.length; i++) {
    lowestMovement = movementsReduced.reduce((acc, mov) => {
      if (acc > mov) return mov;
      else return acc;
    }, movementsReduced[0]);
    movementIndex = currentAccount.movements.indexOf(lowestMovement);
    movementsReduced.splice(movementsReduced.indexOf(lowestMovement), 1);
    movementsSorted.push(lowestMovement);
    datesSorted.push(currentAccount.movementsDates[movementIndex]);
  }
};

// Create usernames
const createUsernames = () => {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

// Create timestamp
const createDatestamp = () =>
  new Date().toLocaleDateString(currentAccount.locale);
const createTimestamp = () =>
  new Date().toLocaleTimeString(currentAccount.locale);

// Set logout timeout
const loggedInTimeout = () => {
  setInterval(() => {
    if (!timerOn) return;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const timer = `${time === 600 ? "" : "0"}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    labelTimer.textContent = timer;
    time -= 1;
    if (time === 0) logout();
  }, 1000);
};

// Transfer money
const transferMoney = () => {
  const amount = Number(inputTransferAmount.value);
  const targetAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount <= 0 ||
    targetAcc === undefined ||
    targetAcc.username === currentAccount.username ||
    amount > calcBalance()
  )
    return;
  currentAccount.movements.push(-Math.abs(amount));
  currentAccount.movementsDates.push(new Date());
  targetAcc.movements.push(amount);
  targetAcc.movementsDates.push(new Date());
  isSorted = false;
  openAccountPanel();
  updateMovements();
};

// Request loan
const requestLoan = () => {
  const minimumDeposit = Number(inputLoanAmount.value) * 0.1;
  if (
    currentAccount.movements.find((mov) => mov >= minimumDeposit) ===
      undefined ||
    inputLoanAmount.value <= 0
  )
    return;
  currentAccount.movements.push(Number(inputLoanAmount.value));
  currentAccount.movementsDates.push(new Date());
  isSorted = false;
  openAccountPanel();
  updateMovements();
};

// Close account
const closeAccount = () => {
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = 0;
    while (accounts[index].username.indexOf(currentAccount.username) === -1)
      index++;
    accounts.splice(index, 1);
    logout();
  }
};

// Initialization
createUsernames();
loggedInTimeout();

// Button actions
btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  login();
  checkAppStatus();
});
btnTransfer.addEventListener("click", (event) => {
  event.preventDefault();
  transferMoney();
});
btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  requestLoan();
});
btnClose.addEventListener("click", (event) => {
  event.preventDefault();
  closeAccount();
});
btnSort.addEventListener("click", (event) => {
  event.preventDefault();
  !isSorted ? (isSorted = true) : (isSorted = false);
  sortMovements();
  updateMovements();
  displayMovements();
});
