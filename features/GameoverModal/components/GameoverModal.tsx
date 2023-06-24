import { useRef } from "react";
import { GameContext } from "contexts";
import { Flex, Icon, List, ListItem } from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useContext } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CancelButton } from "components/CancelButton";

export function GameoverModal() {
  const router = useRouter();
  const [gameData, gameDispatch] = useContext(GameContext);
  const isOpen = gameData.timeUp;
  const initialRef = useRef(null);

  const onClose = () => {
    gameDispatch({ type: "RESET" });
    router.reload();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex>
              <Icon
                as={BsCheckCircleFill}
                w={8}
                h={8}
                color="green.500"
                mr={4}
              />
              <Text>Game Over</Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="lg">
              You got{" "}
              <Text color={"black"} fontWeight={"semibold"} display={"inline"}>
                {gameData.correctColors}
              </Text>{" "}
              correct color{gameData.correctColors > 0 ? "s" : ""} with a score
              of <br />
              <Text
                fontSize={"3xl"}
                color={"black"}
                fontWeight={"semibold"}
                display={"inline"}
              >
                {" "}
                {gameData.score.points}
              </Text>{" "}
              / {gameData.score.total}
              {gameData.isNewHighscore && (
                <Badge colorScheme="green" variant="solid" ml="3">
                  New
                </Badge>
              )}
              <br />
              <br />
              Remember, each correct guess earns points based on the number of
              tries taken:
              <List>
                <ListItem>First try: 10 points</ListItem>
                <ListItem>Second try: 5 points</ListItem>
                <ListItem> Third try: 2 points</ListItem>
              </List>
              <br />
              The score is calculated by dividing the total points earned by the
              maximum possible points.
            </Text>
          </ModalBody>
          <ModalFooter>
            <CancelButton />
            <Button
              colorScheme="teal"
              onClick={onClose}
              ml={3}
              ref={initialRef}
              size={["md", "lg"]}
            >
              Replay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
