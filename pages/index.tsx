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
        <title>Guess The Color</title>
        <meta
          name="description"
          content="Guess the color react game, objective of identifying as much colors as you can in the given time"
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
          <Heading size="lg">Guess The Color</Heading>
          <Spacer />
          <Link href="/play" passHref>
            <Button size="lg" colorScheme={"teal"} rightIcon={<HiArrowRight />}>
              PLAY
            </Button>
          </Link>
        </Flex>
      </main>
    </>
  );
}
