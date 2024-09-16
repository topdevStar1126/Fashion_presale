import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import Banner from "../sections/banner/v10/Banner";
import { ToastContainer } from 'react-toastify';


const HomeV10 = () => {
  return (
    <Layout pageTitle="FASH Pre-sale">
      <Header variant="v1" />
      <Banner />
        <ToastContainer/>
    </Layout>
  );
};

export default HomeV10;
