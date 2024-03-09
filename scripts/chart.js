import convertCurrencies from "./convertCurriencies.js";
document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element
  let ctx = document.getElementById("myChart").getContext("2d");
  let transactions = [];
  let incomeTransactions = [];
  let expenseTransactions = [];
  const transactionString = localStorage.getItem("transactions");
  if (transactionString) {
    transactions = JSON.parse(transactionString);
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
  async function getTransactionFromLocalStorage() {
    const promises = transactions.map(async (transaction) => {
      if (transaction.type === "INCOME") {
        return convertCurrenciesToUSD(transaction);
      } else if (transaction.type === "EXPENSE") {
        return convertCurrenciesToUSD(transaction);
      }
    });

    const results = await Promise.all(promises);

    results.forEach((result, index) => {
      if (transactions[index].type === "INCOME") {
        incomeTransactions.push(result);
      } else if (transactions[index].type === "EXPENSE") {
        expenseTransactions.push(result);
      }
    });
    createChart();
  }
  function extractUniqueMonths() {
    const monthsSet = new Set();

    transactions.forEach((transaction) => {
      const dateString = transaction.date;
      const parts = dateString.split("-");
      const monthNumber = parseInt(parts[1]);
      const monthString = monthNumber.toString();
      monthsSet.add(monthString);
    });

    const uniqueMonths = Array.from(monthsSet).sort();
    return uniqueMonths;
  }
  const labels = extractUniqueMonths(transactions);
  getTransactionFromLocalStorage();

  function createChart() {
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Income",
            data: incomeTransactions,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Expenses",
            data: expenseTransactions,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
