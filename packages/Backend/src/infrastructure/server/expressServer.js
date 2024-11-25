const express = require("express");

const createServer = (app, tokenController) => {
  if (!app) {
    app = express();
  }

  return app;
};

module.exports = createServer;
