const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Transaction = sequelize.define("Transaction", {
  from: { type: DataTypes.STRING, allowNull: false },
  to: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.STRING, allowNull: false },
  txHash: { type: DataTypes.STRING, unique: true, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Synchronize table
(async () => {
  await Transaction.sync();
  console.log("Transaction table created (if not exists).");
})();

module.exports = {
  saveTransaction: async (transaction) => {
    return await Transaction.create(transaction);
  },
  getAllTransactions: async () => {
    return await Transaction.findAll();
  },
};
