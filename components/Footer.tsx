import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

interface ILink {
  name: string;
  link: string;
}
const links: ILink[] = [
  {
    name: "About",
    link: "about",
  },
  {
    name: "How To Play",
    link: "howtoplay",
  },
  {
    name: "Tips & Tricks",
    link: "tips",
  },

  {
    name: "Contribute",
    link: "contribute",
  },
];
export function Footer() {
  return (
    <footer>
      <Flex direction={["column", "row"]} gap={6} mx={12} mt={30}>
        {links.map(({ name, link }, index) => {
          return (
            <Text
              decoration={"underline"}
              fontSize="lg"
              color={"gray.600"}
              key={index}
              _hover={{
                color: "gray.900",
              }}
            >
              <Link href={link}>{name}</Link>
            </Text>
          );
        })}
      </Flex>

      <div></div>
    </footer>
  );
}

export default Footer;
