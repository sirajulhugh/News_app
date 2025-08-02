
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const saveBlogPost = async ({ title, content, tags, summary, seo, image }) => {
  try {
    const postRef = collection(db, 'blogPosts');
    await addDoc(postRef, {
      title,
      content,
      tags,
      summary,
      seo,
      image,
      createdAt: Timestamp.now(),
    });
    console.log('✅ Blog post saved to Firestore');
  } catch (error) {
    console.error('❌ Error saving post:', error);
  }
};
