import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamps } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { collection, query,orderBy, setDoc, getDocs, doc as dc,where, limit } from 'firebase/firestore';

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
//   const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
//   const query = ref.orderBy('createdAt');
    let posts = [];
    const data = async () => {

        const querys = query(collection(firestore, 'users', `${auth.currentUser.uid}`, 'posts'), orderBy('createdAt'));
        const querySnapshot = await getDocs(querys);
        querySnapshot.forEach((doc) => posts.push(doc.data()));
        return posts;

    }
    const post = data();
    console.log(posts);
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    // const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
      const ref = dc(firestore, 'users', `${uid}`, 'posts', `${slug}`);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username:username.username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamps,
      updatedAt: serverTimestamps,
      heartCount: 0,
    };

    // await ref.set(data);
      await setDoc(ref, data);
    

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}