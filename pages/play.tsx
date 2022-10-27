import { Colorblocks } from "features/colorblocks";
import { Infobar } from "features/Infobar";
import Head from "next/head";
export default function Play() {
  return (
    <>
      <Head>
        <title>Guessing Colors Now</title>
        <meta
          name="description"
          content="Guess the color react game, objective of identifying as much colors as you can in the given time"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Infobar />
        <Colorblocks />
      </main>
    </>
  );
}
