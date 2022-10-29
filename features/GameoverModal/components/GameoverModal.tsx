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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export function GameoverModal() {
  const router = useRouter();
  const [infobarData, infobarDispatch] = useContext(InfobarContext);
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
              <Text> Game Over</Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="lg">Score: {infobarData.score}</Text>
            <Text fontSize="lg">
              Correct colors: {infobarData.correctColors}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                infobarDispatch({ type: "RESET" });
                router.push("/");
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={onClose}>
              Play Again
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
