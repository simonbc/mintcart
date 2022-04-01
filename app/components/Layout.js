import Head from "next/head";
import Link from "next/link";

import { styled } from "@stitches/react";

import {
  useAddress,
  useConnect,
  useDisconnect,
  useDisplayAddress,
} from "../context/Web3Context";

import Button from "../components/ui/Button";

const DRAWER_WIDTH = 250;
const HEADER_HEIGHT = 64;
const PAGE_MARGIN = 64;

const Layout = ({ children }) => {
  const address = useAddress();
  const displayAddress = useDisplayAddress();
  const connectWallet = useConnect();
  const disconnectWallet = useDisconnect();

  return (
    <div className="p-16 text-slate-900 bg-slate-50">
      <Head>
        <title>mintcart</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-10 flex items-center justify-between h-16">
        <h1 className="font-semibold font-mono text-2xl leading-10">
          <Link href="/">
            <a>mintcart</a>
          </Link>
        </h1>
        <div className="flex items-center justify-end grow">
          {address ? (
            <>
              <span className="sans mr-4 font-semibold">{displayAddress}</span>

              <Button onClick={disconnectWallet}>Disconnect wallet</Button>
            </>
          ) : (
            <Button onClick={connectWallet}>Connect wallet</Button>
          )}
        </div>
      </header>
      <main className="flex grow shrink flex-col">{children}</main>
    </div>
  );
};

const AddressLabel = styled("span", {
  fontFamily: "$sans",
  marginRight: "16px",
  fontWeight: 600,
});

export default Layout;
