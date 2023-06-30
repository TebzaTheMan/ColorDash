import Head from "next/head";
import { Flex, Heading, Spacer } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { HighScore } from "features/Highscore";
import { HiArrowRight } from "react-icons/hi";
import Link from "next/link";
export default function Home() {
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
          <Link href="/play/rgb" passHref>
            <Button size="lg" colorScheme={"teal"} rightIcon={<HiArrowRight />}>
              PLAY RGB MODE
            </Button>
          </Link>
          <Spacer />
          <Link href="/play/hsl" passHref>
            <Button size="lg" colorScheme={"teal"} rightIcon={<HiArrowRight />}>
              PLAY HSL MODE
            </Button>
          </Link>
        </Flex>
      </main>
    </>
  );
}
