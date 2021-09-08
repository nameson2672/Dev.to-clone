import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { firestore, postToJSON } from '../lib/firebase';
import { query, collectionGroup, getDocs, where, limit, orderBy, startAfter,Timestamp } from 'firebase/firestore';
import { useState } from 'react'
import PostFeed from '../components/PostFeed';

// Limti post
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));
  console.log(postQuery)

  const posts = (await getDocs(postQuery)).docs.map(postToJSON);
  console.log(posts);

  return {
    props:{posts}
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    
    const querys = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), startAfter(cursor), limit(LIMIT));

    const newPosts = (await getDocs(querys)).docs.map((doc) => doc.data());
    
    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }

  }

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <buttons className='btn' onClick={getMorePosts}>Load more</buttons>}

      <Loader show={loading} />

      {postsEnd && 'you have reached the end'}
        
    
    </main>
  )
}
