// src/controllers/tokenController.js
module.exports.mintTokens = async (
  req,
  res,
  next,
  blockchain,
  transactionRepo
) => {
  try {
    console.log("Inside mintTokens function..."); // Debugging log

    const { to, amount } = req.body;
    if (!to || !amount) {
      return res
        .status(400)
        .json({ error: "Missing 'to' or 'amount' in request body" });
    }

    const txReceipt = await blockchain.mintTokens(to, amount);

    const transaction = {
      from: "Contract",
      to,
      amount,
      txHash: txReceipt.transactionHash,
    };

    await transactionRepo.saveTransaction(transaction); // Save transaction

    res.json({ success: true, transaction });
  } catch (err) {
    console.error("Error in mintTokens:", err); // Debugging error
    next(err);
  }
};
