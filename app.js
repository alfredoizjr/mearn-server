const express = require('express');
const cors = require('cors');
const app = express();

// settings
app.set('port', process.env.PORT || 4000);
app.use(cors());
app.use(express.json({extended: true}));
// middlewares

// routers
app.use("/api/users",require('./routers/users'));
app.use("/api/auth",require('./routers/auth'));
app.use("/api/projects",require('./routers/projects'));
app.use("/api/tasks",require('./routers/tasks'));
  

module.exports = app;