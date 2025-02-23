import "@/ui/global.css";
import User from "@/ui/icons/user.svg";
import Image from "next/image";

const UserButton = () => {
  return (
    <button type="button">
      <Image src={User} alt="utilisateur"></Image>
    </button>
  );
};

export default UserButton;
