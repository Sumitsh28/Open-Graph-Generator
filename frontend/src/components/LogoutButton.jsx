import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import useShowToast from "../../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";
import { useColorModeValue } from "@chakra-ui/react";
const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
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

      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"20px"}
      bg={useColorModeValue("gray.300", "gray.dark")}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
      _hover={{ color: "#FF9900" }}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
