import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import { BsClipboard, BsThreeDots } from "react-icons/bs";
import postsAtom from "../../atoms/PostsAtom";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");

        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  if (!user) return null;

  const postMenu = (e) => {
    e.preventDefault();
  };

  const copyURL = () => {
    const copy = `${window.location.origin}/${user.username}/post/${post._id}`;

    navigator.clipboard.writeText(copy).then(() => {
      showToast("Copied", "Post link copied", "success");
    });
  };

  const handleDeletePost = async (e) => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Flex gap={3} mb={4} py={5}>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar
          size="md"
          name={user.name}
          src={user?.profilePic}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${user.username}`);
          }}
        />
      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"} gap={2}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user?.username}
            </Text>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </Text>

            <Menu placement="bottom">
              <MenuButton _hover={{ color: "#FF9900" }}>
                <BsThreeDots />
              </MenuButton>

              <MenuList bg="#000000" minWidth="60px">
                <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                  <Flex gap={2} alignItems={"center"}>
                    <Text
                      display={"flex"}
                      alignItems={"center"}
                      gap={2}
                      onClick={copyURL}
                    >
                      <BsClipboard size={20} />
                      <Text>Copy URL</Text>
                    </Text>
                  </Flex>
                </MenuItem>
                {currentUser?._id === user._id && (
                  <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                    <Flex gap={2} alignItems={"center"}>
                      <Text
                        onClick={handleDeletePost}
                        display={"flex"}
                        alignItems={"center"}
                        gap={2}
                      >
                        <DeleteIcon size={20} />
                        <Text>Delete</Text>
                      </Text>
                    </Flex>
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Link to={`/${user.username}/post/${post._id}`}>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
        </Link>

        <Flex gap={3} my={1}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Post;
