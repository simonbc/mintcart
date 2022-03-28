import Link from "next/link";

import { useState, useEffect } from "react";
import { styled } from "@stitches/react";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import ConnectWallet from "../../components/ConnectWallet";
import {
  useChainId,
  useSigner,
  useAddress,
  Web3Provider,
} from "../../context/Web3Context";
import { getSellerProducts } from "../../utils";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const chainId = useChainId();
  const signer = useSigner();
  const address = useAddress();

  const init = async () => {
    const products = await getSellerProducts(chainId, signer, address);
    setProducts(products);
    setLoading(false);
  };

  useEffect(() => init(), [chainId, signer, address]);

  if (!address) {
    return <ConnectWallet />;
  }

  return loading ? (
    <Loading>Loading ...</Loading>
  ) : (
    <div>
      <PageTitle>Products</PageTitle>
      {products && products.length ? (
        <ProductTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Sold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.address}>
                <td>
                  <a>
                    {p.name} {chainId}
                  </a>
                </td>
                <td>{parseFloat(p.price)} eth</td>
                <td>
                  {p.sold} out of {p.supply}
                </td>
                <td>
                  <Link href={`/${address}/${p.slug}`}>
                    <a target="_blank">View checkout page</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
      ) : (
        <NoProductsMsg>Create your first product...</NoProductsMsg>
      )}
      <div>
        <Link href="/products/create" passHref>
          <Button>Create New Product</Button>
        </Link>
      </div>
    </div>
  );
};

const PageTitle = styled("h2", {
  margin: "0 0 2rem",
});

const ProductTable = styled("table", {
  marginBottom: "1rem",
  width: "100%",
  tr: {
    display: "flex",
    width: "100%",
    marginBottom: "1rem",
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  th: {
    padding: "0 1rem 0 0  ",
    flex: "0 0 25%",
    textAlign: "left",
  },
  td: {
    padding: "1rem 1rem  1rem 0",
    flex: "0 0 25%",
  },
});

const Loading = styled("div", {
  padding: "1rem 0",
  marginBottom: "2rem",
});

const NoProductsMsg = styled("div", {
  marginBottom: "2rem",
  fontStyle: "italic",
  fontSize: "0.9rem",
});

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
