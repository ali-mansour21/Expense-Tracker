async function convertCurrencies(fromCurrency, toCurrency, amount) {
  const apiUrl = " https://crowded-cyan-wildebeest.cyclic.app/students/convert";
  try {
    const result = await axios.post(apiUrl, {
      from: fromCurrency.toUpperCase(),
      to: toCurrency.toUpperCase(),
      amount: parseFloat(amount),
    });
    return result;
  } catch (error) {}
}
export default convertCurrencies;
