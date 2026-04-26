import { useRef } from "react";
import { GameContext } from "contexts";
import { Box, Flex, Icon, List, ListItem } from "@chakra-ui/react";
import { BsTrophyFill } from "react-icons/bs";
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

import { CancelButton } from "components/CancelButton";
import { SCORING_RULES } from "game/constants";

export function GameoverModal() {
  const { state: gameData, startGame, reset } = useContext(GameContext);
  const isOpen = gameData.timeUp;
  const initialRef = useRef(null);

  const onClose = () => {
    const mode = gameData.mode;
    if (!mode) return;
    reset();
    startGame(mode);
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
                as={BsTrophyFill}
                w={8}
                h={8}
                color="yellow.500"
                mr={4}
              />
              <Text>Game Over</Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="lg">
              You got{" "}
              <Box
                as="span"
                color={"black"}
                fontWeight={"semibold"}
                display={"inline"}
              >
                {gameData.correctColors}
              </Box>{" "}
              correct color{gameData.correctColors > 1 ? "s" : ""} with a score
              of <br />
              <Box
                as="span"
                fontSize={"3xl"}
                color={"black"}
                fontWeight={"semibold"}
                display={"inline"}
              >
                {" "}
                {gameData.score.points}
              </Box>{" "}
              / {gameData.score.total}
              {gameData.isNewHighscore && (
                <Badge colorScheme="green" variant="solid" ml="3">
                  New
                </Badge>
              )}
            </Text>
            <br />
            <Text fontSize="lg">
              Points per correct guess depend on how many tries you used:
            </Text>
            <List fontSize={"lg"}>
              {SCORING_RULES.map((rule) => (
                <ListItem key={rule.triesLeft}>
                  {rule.label}: {rule.points} point{rule.points !== 1 ? "s" : ""}
                </ListItem>
              ))}
            </List>
            <br />
            <Text fontSize="lg">
              The score is calculated by dividing the total points earned by the
              maximum possible points.
            </Text>
          </ModalBody>
          <ModalFooter bgColor={"white"} bgImg={"none"}>
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
