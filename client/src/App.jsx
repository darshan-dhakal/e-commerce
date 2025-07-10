import { useState } from "react";
import Layouts from "./layouts/Layouts";
import Products from "./components/Products";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layouts>
      <Products></Products>
    </Layouts>
  );
}

export default App;
// https://github.com/darshan-dhakal/e-commerce.git
