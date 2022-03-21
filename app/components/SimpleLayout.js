import Head from "next/head";
import { styled } from "@stitches/react";

const PAGE_MARGIN = 64;

const SimpleLayout = ({ children }) => {
  return (
    <PageContent>
      <Head>
        <title>mintcart</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageMain>{children}</PageMain>
    </PageContent>
  );
};

const PageContent = styled("div", {
  color: "#111",
  backgroundColor: "#efefef",
  padding: `${PAGE_MARGIN}px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

const PageMain = styled("main", {
  backgroundColor: "#fff",
  padding: `4rem`,
  maxWidth: "750px",
  width: "100%",
  boxShadow: "0 15px 20px 0 rgb(0 0 0 / 10%)",
});

export default SimpleLayout;
