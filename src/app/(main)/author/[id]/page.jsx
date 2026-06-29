"use client";

import { useParams } from "next/navigation";
import ProfilePage from "../../dashboard/profile/page";

const AuthorPage = () => {
  const { id } = useParams();

  return <ProfilePage userId={id} />;
};
export default AuthorPage;
