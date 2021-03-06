import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import ConnectWallet from "../../components/ConnectWallet";
import {
  useChainId,
  useAddress,
  Web3Provider,
} from "../../context/Web3Context";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ProductsTable from "../../components/ProductsTable";
import OrdersTable from "../../components/OrdersTable";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const chainId = useChainId();
  const address = useAddress();

  useEffect(() => {
    if (!chainId || !address) return;

    Promise.all([
      axios.get(`/api/${chainId}/${address}/products`),
      axios.get(`/api/${chainId}/${address}/orders`),
    ]).then(([resProducts, resOrders]) => {
      setProducts(resProducts.data.products);
      setOrders(
        resOrders.data.orders.map((o) => ({
          product: resProducts.data.products.find((p) => p.id == o.productId),
          ...o,
        }))
      );
      setLoading(false);
    });
  }, [chainId, address]);

  if (!address) {
    return <ConnectWallet />;
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      {products && products.length ? (
        <>
          <div className="mb-8 md:mb-16 flex w-full items-center">
            <h2 className="grow font-bold text-2xl">Products</h2>
            <Link href="/products/create" passHref>
              <Button className="hidden md:block">Create Product</Button>
            </Link>
          </div>

          <div className="md:mb-16">
            <ProductsTable products={products} />
          </div>

          <Link href="/products/create" passHref>
            <Button className="mb-16 block md:hidden">Create Product</Button>
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center  md:h-96">
          <h2 className="mb-4 text-3xl font-semibold max-w-4xl	text-center">
            Dashboard
          </h2>
          <p className="mb-6 max-w-2xl text-center">
            Create your first product to get started.
          </p>
          <Link href="/products/create" passHref>
            <Button>Create product</Button>
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <>
          <h2 className="mb-8 md:mb-16 font-bold text-2xl">Sales</h2>

          <OrdersTable orders={orders} />
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  return (
    <Web3Provider>
      <Layout>
        <DashboardContent />
      </Layout>
    </Web3Provider>
  );
};

export default Dashboard;
