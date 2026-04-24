import app from "./src/app.js";
import { PORT } from "./src/utils/constants.js";

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
