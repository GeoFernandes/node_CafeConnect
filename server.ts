import "dotenv/config";
import app from "./src/app";

const PORT = 8080;

app.listen(PORT, () => {
  console.log("servidor rodando!");
});
