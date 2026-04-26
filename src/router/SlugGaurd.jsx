import { useParams, Navigate } from "react-router-dom";
import { getSlug } from "../utils/pathHelper";

export default function SlugGuard({ children }) {
  const { slug } = useParams();
  const storedSlug = getSlug();

  if (slug !== storedSlug) {
    return <Navigate to={`/${storedSlug}/home`} />;
  }

  return children;
}