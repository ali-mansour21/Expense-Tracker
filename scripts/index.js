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
fetch("https://crowded-cyan-wildebeest.cyclic.app/students/available")
  .then((response) => {
    const data = response.json();
    return data;
  })
  .then((data) => {
    const filterOption = document.createElement("option");
    filterOption.value = "Choose Currency";
    filterOption.textContent = "Choose Currency";
    filterCurrency.appendChild(filterOption);

    const fromOption = document.createElement("option");
    fromOption.value = "Choose Currency";
    fromOption.textContent = "Choose Currency";
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = "Choose Currency";
    toOption.textContent = "Choose Currency";
    toSelect.appendChild(toOption);

    const selectOption = document.createElement("option");
    selectOption.value = "Choose Currency";
    selectOption.textContent = "Choose Currency";
    selectCurrencies.appendChild(selectOption);

    data.forEach((element) => {
      const filterOption = document.createElement("option");
      filterOption.value = element.code.toLowerCase();
      filterOption.textContent = element.code;
      filterCurrency.appendChild(filterOption);

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
// function getTransactionFromLocalStorage() {
//   const transactionString = localStorage.getItem("transactions");
//   if (transactionString) {
//     allTransaction = JSON.parse(transactionString);
//   }
//   return allTransaction;
// }

const resetValues = (fullName, amount, type, currencie, date) => {
  fullName.value = "";
  amount.value = "";
  type.value = "";
  currencie.value = "";
  date.value = "";
};

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
  loadTransactions();
  calculateTotal(allTransaction);
}
function attachEventListeners() {
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
      
      const id = event.target.dataset.id;
      // Implement  logic here...
    } else if (event.target.classList.contains("delete")) {
      const id = event.target.dataset.id;
      deleteTransaction(id);
    }
  });
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
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");
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
