import convertCurrencies from "./convertCurriencies.js";
let allTransaction = [];
const createTransactions = document.getElementById("pop-up-transaction");
const showCreateTransactions = document.getElementById(
  "showCreateTransactions"
);
const closeCreateTransaction = document.getElementById("close-transaction");
const selectCurrencies = document.getElementById("currencies");
const filterCurrency = document.getElementById("filterCurrency");
const transactionForm = document.getElementById("addTransactionForm");
const transactionName = document.getElementById("name");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const date = document.getElementById("date");
const incomeBody = document.getElementById("income-data");
const expenseBody = document.getElementById("expense-data");
const showConverter = document.getElementById("showConverter");
const ConverterForm = document.getElementById("pop-up-convert");
const closeConverter = document.getElementById("close-converter");
const fromSelect = document.getElementById("fromSelect");
const toSelect = document.getElementById("toSelect");
const editTransaction = document.getElementById("pop-up-editTransaction");
const editTransactionForm = document.getElementById("editTransactionForm");
const editName = document.getElementById("editName");
const editAmount = document.getElementById("editAmount");
const editType = document.getElementById("editType");
const editCurrencies = document.getElementById("editcurrencies");
const editDate = document.getElementById("editDate");
let selectedTransaction;
let createdTransactionId = 1;
const fromAmount = document.getElementById("fromAmount");
const toAmount = document.getElementById("toAmount");
fetch("https://crowded-cyan-wildebeest.cyclic.app/students/available")
  .then((response) => {
    const data = response.json();
    return data;
  })
  .then((data) => {
    const option = document.createElement("option");
    option.value = "Choose Currency";
    option.textContent = "Choose Currency";
    filterCurrency.appendChild(option);
    data.forEach((element) => {
      const filterOption = document.createElement("option");
      filterOption.value = element.code.toLowerCase();
      filterOption.textContent = element.code;
      filterCurrency.appendChild(filterOption);

      const editOption = document.createElement("option");
      editOption.value = element.code.toLowerCase();
      editOption.textContent = element.code;
      editCurrencies.appendChild(editOption);

      const fromOption = document.createElement("option");
      fromOption.value = element.code.toLowerCase();
      fromOption.textContent = element.code;
      fromSelect.appendChild(fromOption);

      const toOption = document.createElement("option");
      toOption.value = element.code.toLowerCase();
      toOption.textContent = element.code;
      toSelect.appendChild(toOption);

      const selectOption = document.createElement("option");
      selectOption.value = element.code.toLowerCase();
      selectOption.textContent = element.code;
      selectCurrencies.appendChild(selectOption);
    });
  });

async function addTransactionToLocalStorage() {
  await localStorage.setItem("transactions", JSON.stringify(allTransaction));
}
async function convertCurrenciesToUSD(transaction) {
  const result = await convertCurrencies(
    transaction.currencie,
    "USD",
    transaction.amount
  );
  const convertCurrenciesValue = result.data;

  return convertCurrenciesValue;
}

const resetValues = (fullName, amount, type, currencie, date) => {
  fullName.value = "";
  amount.value = "";
  type.value = "";
  currencie.value = "";
  date.value = "";
};
function filterTransactionCurrency(currency) {
  return allTransaction.filter(
    (transaction) =>
      transaction.currencie.toUpperCase() === currency.toUpperCase()
  );
}
function renderFilteredTransactions(transactions) {
  incomeBody.innerHTML = "";
  expenseBody.innerHTML = "";
  transactions.forEach((row) => {
    if (row.type.toUpperCase() === "INCOME") {
      generateTableRow(row, incomeBody);
    } else if (row.type.toUpperCase() === "EXPENSE") {
      generateTableRow(row, expenseBody);
    }
  });
}
function loadTransactions() {
  const transactionString = localStorage.getItem("transactions");
  if (transactionString) {
    allTransaction = JSON.parse(transactionString);
  }
  renderTransactions();
  return allTransaction;
}
function renderTransactions() {
  incomeBody.innerHTML = "";
  expenseBody.innerHTML = "";
  allTransaction.forEach((row) => {
    if (row.type.toUpperCase() === "INCOME") {
      generateTableRow(row, incomeBody);
    } else if (row.type.toUpperCase() === "EXPENSE") {
      generateTableRow(row, expenseBody);
    }
  });
}
function createNewTransaction() {
  const data = {
    id: createdTransactionId,
    fullName: transactionName.value,
    amount: amount.value,
    type: type.value.toUpperCase(),
    currencie: selectCurrencies.value.toUpperCase(),
    date: date.value,
  };

  resetValues(transactionName, amount, type, selectCurrencies, date);
  allTransaction.push(data);
  createdTransactionId += 1;
  addTransactionToLocalStorage();

  loadTransactions();
  calculateTotal(allTransaction);
}
function attachEventListeners() {
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
      const id = parseInt(event.target.dataset.id);
      editTransaction.classList.add("show");
      selectedTransaction = allTransaction.filter(
        (transaction) => transaction.id === id
      );
      fillData(selectedTransaction);
    } else if (event.target.classList.contains("delete")) {
      const id = parseInt(event.target.dataset.id);
      deleteTransaction(id);
    }
  });
}
function fillData(transaction) {
  editName.value = transaction[0].fullName;
  editAmount.value = transaction[0].amount;
  editDate.value = transaction[0].date;
  console.log(transaction[0].type);
}
async function editTransactionAction() {
  const id = selectedTransaction[0].id;
  const data = {
    fullName: editName.value,
    amount: editAmount.value,
    type: editType.value.toUpperCase(),
    currencie: editCurrencies.value.toUpperCase(),
    date: editDate.value,
  };
  const index = allTransaction.findIndex(
    (transaction) => transaction.id === id
  );
  if (index !== -1) {
    allTransaction[index] = { ...allTransaction[index], ...data };
    await addTransactionToLocalStorage();
    loadTransactions();
    calculateTotal(allTransaction);
  }
}
function deleteTransaction(id) {
  allTransaction = allTransaction.filter(
    (transaction) => transaction.id !== id
  );
  localStorage.setItem("transactions", JSON.stringify(allTransaction));
  calculateTotal(allTransaction);
  loadTransactions();
}
function generateTableRow(row, table) {
  const tableRow = document.createElement("tr");
  const cells = ["id", "fullName", "amount", "type", "currencie", "date"];

  cells.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = row[key];
    tableRow.appendChild(cell);
  });

  const actionCell = document.createElement("td");
  const actionCellImageOne = document.createElement("img");
  const actionCellImageTwo = document.createElement("img");

  actionCell.classList.add("d-flex", "gap-5");
  actionCellImageOne.src = "./assets/pen-to-square-solid.svg";
  actionCellImageOne.classList.add("edit");
  actionCellImageOne.dataset.id = row.id;

  actionCellImageTwo.src = "./assets/trash-solid.svg";
  actionCellImageTwo.classList.add("delete");
  actionCellImageTwo.dataset.id = row.id;

  actionCell.appendChild(actionCellImageOne);
  actionCell.appendChild(actionCellImageTwo);
  tableRow.appendChild(actionCell);
  table.appendChild(tableRow);
}

async function calculateTotal(transactions) {
  const incomeText = document.getElementById("totalIncome");
  const expenseText = document.getElementById("totalExpense");
  const totalBalanceText = document.getElementById("totalBalance");
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "INCOME") {
      try {
        const convertedAmount = await convertCurrenciesToUSD(transaction);
        totalIncome += convertedAmount;
      } catch (error) {}
    }
    if (transaction.type === "EXPENSE") {
      try {
        const convertedAmount = await convertCurrenciesToUSD(transaction);
        totalExpense += convertedAmount;
      } catch (error) {}
    }
  }

  incomeText.innerHTML = `$ ${Math.ceil(totalIncome)}`;
  expenseText.innerHTML = `$ ${Math.ceil(totalExpense)}`;
  totalBalanceText.innerHTML = `$ ${
    Math.ceil(totalIncome) - Math.ceil(totalExpense)
  }`;
}
function filterTransactionByAmount(from, to) {
  if (to > from) {
    return allTransaction.filter((transaction) => {
      const transactionAmount = parseFloat(transaction.amount);
      return transactionAmount >= from && transactionAmount <= to;
    });
  }
}
function handleAmountChange() {
  const filteredAmountTransactions = filterTransactionByAmount(
    fromAmount.value,
    toAmount.value
  );
  if (filteredAmountTransactions) {
    renderFilteredTransactions(filteredAmountTransactions);
  } else {
    loadTransactions();
  }
}
showCreateTransactions.addEventListener("click", () => {
  createTransactions.classList.add("show");
});
closeCreateTransaction.addEventListener("click", () => {
  createTransactions.classList.remove("show");
});
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createNewTransaction();
  createTransactions.classList.remove("show");
});
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
  attachEventListeners();
  calculateTotal(loadTransactions());
});
showConverter.addEventListener("click", () => {
  ConverterForm.classList.add("show");
});
closeConverter.addEventListener("click", () => {
  ConverterForm.classList.remove("show");
});
document.addEventListener("keyup", async function () {
  const convertedAmount = document.getElementById("convertedAmount").value;
  const result = document.getElementById("result");

  try {
    const response = await convertCurrencies(
      fromSelect.value,
      toSelect.value,
      convertedAmount
    );
    result.value = response.data;
  } catch (e) {}
});
editTransactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  editTransactionAction();
  editTransaction.classList.remove("show");
});
filterCurrency.addEventListener("change", () => {
  console.log(filterCurrency.value);
  const selectedCurrency = filterCurrency.value;
  if (selectedCurrency === "Choose Currency") {
    loadTransactions();
  } else {
    const filteredTransactions = filterTransactionCurrency(selectedCurrency);
    renderFilteredTransactions(filteredTransactions);
  }
});
fromAmount.addEventListener("keyup", handleAmountChange);
toAmount.addEventListener("keyup", handleAmountChange);
