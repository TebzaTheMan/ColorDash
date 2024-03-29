import Head from "next/head";
import { Flex, Heading, Select, Spacer } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { HighScore } from "features/Highscore";
import Link from "next/link";
import { useState } from "react";
import Logo from "images/logo.png";
import { TMode } from "types";
import Image from "next/image";
// import Footer from "components/Footer";
export default function Home() {
  const [gameMode, setGameMode] = useState("rgb");
  return (
    <>
      <Head>
        <title>Color Dash - Engaging RGB and HSL Color Matching Game</title>
        <meta
          name="description"
          content="Immerse yourself in the thrilling world of Color Dash, the ultimate RGB and HSL color matching game. Start playing now and experience the exhilaration of Color Dash!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          direction="column"
          alignItems="center"
          height={["60vh", "80vh"]}
          marginTop="8"
        >
          <HighScore mode={gameMode as TMode} />
          <Spacer />
          <Flex alignItems={"center"}>
            <Image src={Logo} />
            <Heading size={["2xl", "4xl"]}>Color Dash</Heading>
          </Flex>
          <Spacer />
          <Select
            size={["md", "lg"]}
            width={"320px"}
            borderColor={"black"}
            onChange={(e) => {
              setGameMode(e.currentTarget.value);
            }}
            name="game modes"
          >
            <option value="rgb">RGB Mode</option>
            <option value="hsl">HSL Mode</option>
          </Select>
          <Spacer />
          <Link href={`/play/${gameMode}`} passHref>
            <Button size="lg" colorScheme={"brand"}>
              PLAY
            </Button>
          </Link>
          <Spacer />
        </Flex>
      </main>
      {/* <Footer />*/}
    </>
  );
}
