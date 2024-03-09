let allTransaction = [];
const createTransactions = document.getElementById("pop-up-transaction");
const showCreateTransactions = document.getElementById(
  "showCreateTransactions"
);
const closeCreateTransaction = document.getElementById("close-transaction");
const selectCurrencies = document.getElementById("currencies");
const transactionForm = document.getElementById("addTransactionForm");
const transactionName = document.getElementById("name");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const date = document.getElementById("date");
const incomeBody = document.getElementById("income-data");
const expenseBody = document.getElementById("expense-data");
const currencies = fetch(
  "https://ivory-ostrich-yoke.cyclic.app/students/available"
)
  .then((response) => {
    const data = response.json();
    return data;
  })
  .then((data) => {
    const option = document.createElement("option");
    option.value = "Choose Currency";
    option.innerHTML = "Choose Currency";
    selectCurrencies.appendChild(option);
    data.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.code.toLowerCase();
      option.innerHTML = element.code;
      selectCurrencies.appendChild(option);
    });
  });
function addTransactionToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(allTransaction));
}
function getTransactionFromLocalStorage() {
  const transactionString = localStorage.getItem("transactions");
  if (transactionString) {
    allTransaction = JSON.parse(transactionString);
  }
}
function resetValues(fullName, amount, type, currencie, date) {
  fullName.value = "";
  amount.value = "";
  type.value = "";
  currencie.value = "";
  date.value = "";
}
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
showCreateTransactions.addEventListener("click", () => {
  createTransactions.classList.add("show");
});
closeCreateTransaction.addEventListener("click", () => {
  createTransactions.classList.remove("show");
});
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createNewTransaction();
});
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions(allTransaction);
});
