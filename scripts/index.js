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

fetch("https://ivory-ostrich-yoke.cyclic.app/students/available")
  .then((response) => {
    const data = response.json();
    return data;
  })
  .then((data) => {
    const filterOption = document.createElement("option");
    filterOption.value = "Choose Currency";
    filterOption.textContent = "Choose Currency";
    filterCurrency.appendChild(filterOption);

    const selectOption = document.createElement("option");
    selectOption.value = "Choose Currency";
    selectOption.textContent = "Choose Currency";
    selectCurrencies.appendChild(selectOption);

    data.forEach((element) => {
      const filterOption = document.createElement("option");
      filterOption.value = element.code.toLowerCase();
      filterOption.textContent = element.code;
      filterCurrency.appendChild(filterOption);

      const selectOption = document.createElement("option");
      selectOption.value = element.code.toLowerCase();
      selectOption.textContent = element.code;
      selectCurrencies.appendChild(selectOption);
    });
  });

function addTransactionToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(allTransaction));
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
function getTransactionFromLocalStorage() {
  const transactionString = localStorage.getItem("transactions");
  if (transactionString) {
    allTransaction = JSON.parse(transactionString);
  }
  return allTransaction;
}

const resetValues = (fullName, amount, type, currencie, date) => {
  fullName.value = "";
  amount.value = "";
  type.value = "";
  currencie.value = "";
  date.value = "";
};

function loadTransactions() {
  getTransactionFromLocalStorage();
  incomeBody.innerHTML = "";
  expenseBody.innerHTML = "";
  allTransaction.forEach((row) => {
    if (row.type === "INCOME") {
      generateTableRow(row, incomeBody);
    } else if (row.type === "EXPENSE") {
      generateTableRow(row, expenseBody);
    }
  });
}

function createNewTransaction() {
  const data = {
    id: allTransaction.length + 1,
    fullName: transactionName.value,
    amount: amount.value,
    type: type.value.toUpperCase(),
    currencie: selectCurrencies.value.toUpperCase(),
    date: date.value,
  };

  resetValues(transactionName, amount, type, selectCurrencies, date);
  allTransaction.push(data);
  addTransactionToLocalStorage();
  incomeBody.innerHTML = "";
  expenseBody.innerHTML = "";
  allTransaction = getTransactionFromLocalStorage();
  loadTransactions(allTransaction);
  calculateTotal(allTransaction);
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
  actionCellImageTwo.src = "./assets/trash-solid.svg";
  actionCellImageTwo.classList.add("delete");

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
  loadTransactions(allTransaction);
  calculateTotal(getTransactionFromLocalStorage());
});
