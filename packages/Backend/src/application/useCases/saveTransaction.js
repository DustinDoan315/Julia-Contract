async function saveTransaction(transactionRepo, transaction) {
  return await transactionRepo.saveTransaction(transaction);
}

module.exports = saveTransaction;
