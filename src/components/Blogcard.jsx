// import at top
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext"; // or however you access the logged-in user

const handleLike = async (blogId, userEmail) => {
  const blogRef = doc(db, "blogs", blogId);

  await updateDoc(blogRef, {
    likesCount: increment(1),
    likedBy: arrayUnion(userEmail)
  });
};
