import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { BsClipboard, BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState, useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useShowToast from "../../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../../atoms/PostsAtom";
import { Helmet } from "react-helmet";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
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
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  const copy = `${window.location.origin}/api/og-image/${currentPost._id}`;
  const cop = `${window.location.origin}/${user.username}/post/${currentPost._id}`;

  const copyURL = () => {
    navigator.clipboard.writeText(copy).then(() => {
      showToast("Copied", "Post link copied", "success");
    });
  };

  if (!currentPost) return null;
  return (
    <>
      <Helmet>
        <title>{user.username} - Squad HUB</title>
        <meta property="og:title" content={currentPost.text} />
        <meta
          property="og:description"
          content={`Posted by @${user.username} on Squad HUB`}
        />
        <meta property="og:image" content={copy} />
        <meta property="og:url" content={cop} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Squad Hub" />
      </Helmet>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Sumit" />
          <Flex w={"full"} gap={2} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
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

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
