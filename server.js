const app = require("./app");
require("./config/db");

const main = async () => {
  await app.listen(app.get('port'));
  console.log("server is on");
};

main();
