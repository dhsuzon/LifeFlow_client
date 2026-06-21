import { getLoggedSessionUser } from "@/lib/actions/session";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
  const user = await getLoggedSessionUser();
  return <NavbarClient InitialUser={user} />;
};

export default Navbar;
