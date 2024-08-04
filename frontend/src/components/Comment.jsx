import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

const Comment = ({ reply, lastReply }) => {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text _hover={{ color: "#FF9900" }}></Text>
            </Flex>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
