async function convertCurrencies(fromCurrency, toCurrency, amount) {
  const apiUrl = " https://ivory-ostrich-yoke.cyclic.app/students/convert";
  if (fromCurrency === "USD") {
    return amount;
  }
  try {
    const result = await axios.post(apiUrl, {
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount),
    });
    return result;
  } catch (error) {}
}
export default convertCurrencies;
