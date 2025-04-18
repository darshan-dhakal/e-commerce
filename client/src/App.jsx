import Layout from "./layouts/Layouts";
import Products from "./components/Products";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
function App() {
  return (
    <Layout>
      <Products>
        <Navbar />
      </Products>
      <Footer />
    </Layout>
  );
}

export default App;
// https://github.com/darshan-dhakal/e-commerce.git
