import { InfobarContext } from "features/Infobar";
import { Flex, Icon } from "@chakra-ui/react";
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
import { HighscoreContext } from "features/Highscore";

export function GameoverModal() {
  const router = useRouter();
  const [infobarData, infobarDispatch] = useContext(InfobarContext);
  const [highscoreData] = useContext(HighscoreContext);
  const isOpen = infobarData.timeUp;
  const onClose = () => {
    infobarDispatch({ type: "RESET" });
    router.reload();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
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
              Score: {infobarData.score}
              {/** The previous highscore refers to the previous highscore stored since the current highscore will be
               * updated as soon as time is up!
               */}
              {infobarData.score > highscoreData.previous && (
                <Badge colorScheme="green" variant="solid" ml="3">
                  New
                </Badge>
              )}
            </Text>
            <Text fontSize="lg">
              Correct colors: {infobarData.correctColors}
            </Text>
          </ModalBody>
          <ModalFooter>
            <CancelButton />
            <Button colorScheme="teal" onClick={onClose} ml={3}>
              Play Again
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
