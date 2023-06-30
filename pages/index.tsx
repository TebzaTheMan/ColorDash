import Head from "next/head";
import { Flex, Heading, Select, Spacer } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { HighScore } from "features/Highscore";
import { HiArrowRight } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
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
          height="50vh"
          marginTop="8"
        >
          <HighScore />
          <Spacer />
          <Heading size="lg">Color Dash</Heading>
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
            <Button size="lg" colorScheme={"teal"} rightIcon={<HiArrowRight />}>
              PLAY
            </Button>
          </Link>
          <Spacer />
        </Flex>
      </main>
    </>
  );
}
