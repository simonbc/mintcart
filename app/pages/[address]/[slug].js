import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { ethers } from "ethers";
import Loading from "../../components/ui/Loading";

import { getProductContract } from "../../utils";
import {
  Web3Provider,
  useSigner,
  useChainId,
  useAddress,
} from "../../context/Web3Context";

import SimpleLayout from "../../components/SimpleLayout";
import Button from "../../components/ui/Button";

const CheckoutContent = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const chainId = useChainId();
  const signer = useSigner();
  const buyer = useAddress();
  const router = useRouter();

  const { address, slug } = router.query;

  useEffect(() => {
    if (!chainId || !address || !slug) return;

    axios.get(`/api/${chainId}/${address}/products/${slug}`).then((result) => {
      setProduct(result.data.product);
      setLoading(false);
    });
  }, [chainId, address, slug]);

  const buyProduct = async () => {
    setLoading(true);

    const contract = await getProductContract(address, signer);
    const value = ethers.utils.parseUnits(
      (product.price * quantity).toString(),
      "ether"
    );
    const tx = await contract.buy(quantity, {
      value,
    });
    await tx.wait();
  };

  if (!product && !loading) {
    return <div>Error: product not found</div>;
  }

  if (loading) {
    return <Loading />;
  }

  const placeOrder = async (e) => {
    e.preventDefault();

    await buyProduct();

    const order = await axios.post(`/api/${chainId}/${address}/orders`, {
      productId: product.id,
      amount: Number(quantity),
      buyer,
    });

    router.push(`/order-summary/${product.id}/${order.data.orderId}`);
  };

  return (
    <form onSubmit={placeOrder}>
      <>
        <div className="flex mb-8 text-2xl font-bold">
          <div>
            <div className="mb-2 uppercase">{product.name}</div>
            <div className="text-base font-light">
              {product.sold} out of {product.supply} sold.
            </div>
          </div>
          <div className="flex grow justify-end align-center font-bold">
            {product.price}{" "}
            <span className="mt-1 ml-1 text-base font-light">ETH</span>
          </div>
        </div>

        {product.description ? (
          <div className="mb-8">{product.description}</div>
        ) : null}
      </>

      <div className="flex mb-4 text-xl">
        <div className="flex flex-col align-center w-full">Total</div>
        <div className="flex grow justify-end align-center font-bold">
          {quantity ? product.price * quantity : 0}{" "}
          <span className="mt-1 ml-1 text-sm font-light">ETH</span>
        </div>
      </div>

      {product.sold < product.supply ? (
        <div className="flex justify-between">
          <input
            className="mr-4 py-2 pr-2 pl-4 center border border-black w-24 h-10 text-center text-sm"
            type="number"
            min={1}
            max={product.supply - product.sold}
            value={quantity}
            required
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <Button className="px-12">Buy</Button>
        </div>
      ) : (
        <Button disabled>Sold out</Button>
      )}
    </form>
  );
};

const Checkout = (props) => {
  return (
    <Web3Provider>
      <SimpleLayout>
        <CheckoutContent {...props} />
      </SimpleLayout>
    </Web3Provider>
  );
};

export default Checkout;
