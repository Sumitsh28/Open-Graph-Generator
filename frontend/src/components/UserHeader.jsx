import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  useToast,
  Button,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtoms from "../../atoms/UserAtoms";
import { Link, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtoms);
  const [isHovered, setIsHovered] = useState(false);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      console.log(data);

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex alignItems={"start"} flexDir={"column"} gap={2}>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              bg={useColorModeValue("gray.300", "gray.dark")}
              color={"gray.light"}
              p={2}
              borderRadius={"full"}
              _hover={{ color: "#FF9900" }}
            >
              @{user.username}
            </Text>
          </Flex>
        </Flex>
        <Box cursor={"pointer"}>
          {user.profilePic && (
            <>
              <Avatar
                name={user.name}
                src={user.profilePic}
                size={{
                  base: "lg",
                  md: "xl",
                }}
                boxShadow={
                  isHovered
                    ? "0 0 5px 5px #ff9900d7, 0 0 10px 10px #ff990076, 0 0 1px 1px #ff990058"
                    : "md"
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onOpen}
              />

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent
                  bg={useColorModeValue("#0000000", "#0000000")}
                  h="400px"
                  display={"flex"}
                >
                  <ModalCloseButton _hover={{ color: "#FF9900" }} />
                  <ModalBody
                    pb={6}
                    mt={20}
                    display="flex"
                    justifyContent="center"
                  >
                    <Image
                      name={user.name}
                      src={user.profilePic}
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "lg",
                md: "xl",
              }}
              boxShadow={
                isHovered
                  ? "0 0 5px 5px #ff9900d7, 0 0 10px 10px #ff990076, 0 0 1px 1px #ff990058"
                  : "md"
              }
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          )}
        </Box>
      </Flex>
      <Text> {user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button
            size={"sm"}
            _hover={{ color: "#FF9900" }}
            bg={useColorModeValue("gray.300", "gray.dark")}
          >
            Update Profile
          </Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button
          size={"sm"}
          onClick={handleFollowUnfollow}
          isLoading={updating}
          _hover={{ color: "#FF9900" }}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>{user.following.length} following</Text>
        </Flex>
      </Flex>

      <Flex w={"full"} mt={5}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid #FF9900"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
