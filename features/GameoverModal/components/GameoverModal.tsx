import { useRef } from "react";
import { InfobarContext } from "features/Infobar";
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
  const [infobarData, infobarDispatch] = useContext(InfobarContext);
  const isOpen = infobarData.timeUp;
  const initialRef = useRef(null);

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
                {infobarData.correctColors}
              </Text>{" "}
              correct color{infobarData.correctColors > 0 ? "s" : ""} with a
              score of <br />
              <Text
                fontSize={"3xl"}
                color={"black"}
                fontWeight={"semibold"}
                display={"inline"}
              >
                {" "}
                {infobarData.score.points}
              </Text>{" "}
              / {infobarData.score.total}
              {infobarData.isNewHighscore && (
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
