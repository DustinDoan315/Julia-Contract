// src/routes/tokenRoutes.js
const express = require("express");
const { mintTokens } = require("../controllers/tokenController");
const { ethers } = require("ethers");

module.exports = (blockchain, transactionRepo) => {
  const router = express.Router();

  router.post("/mint", async (req, res, next) => {
    try {
      await mintTokens(req, res, next, blockchain, transactionRepo);
    } catch (error) {
      console.error("Error in /mint route:", error);
      next(error);
    }
  });

  router.get("/balance/:address", async (req, res, next) => {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    try {
      const balanceInWei = await blockchain.contract.getBalance(address);
      if (balanceInWei === null) {
        return res.status(404).json({ error: "Address not found or invalid" });
      }

      // Convert the balance from Wei to BNB (1 BNB = 10^18 Wei)
      const balanceInBNB = ethers.formatUnits(balanceInWei, 18);

      res.json({ address, balance: balanceInBNB });
    } catch (error) {
      console.error("Error in /balance route:", error);
      next(error);
    }
  });

  return router;
};
