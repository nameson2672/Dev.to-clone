import { collection, getDoc, query, doc as dc, where, getDocs, collectionGroup, onSnapshot, doc } from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import {PostContent} from '../../components/PostContent'
import styles from '../../styles/Post.module.css';
import AuthCheck from "../../components/AuthCheck";
import HeartButton from '../../components/HeartButton'
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { useState } from 'react';

import Link from "next/link";

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
    let posts;
    let path;
    if (userDoc) {
       const docRef = dc(firestore,'usernames',username);
        const docSnap = await getDoc(docRef).then(async (doc) => {

            const userId = doc.data();

            const postRef = query(collection(firestore, 'users', userId.uid, 'posts'), where('slug', '==', slug));

            const post = await getDocs(postRef);
            post.forEach(each => {
                posts = (postToJSON(each))
            });
            path = `/${username}/${slug}`;
            
        });
        
    }
    return {
        props: { posts, path },
        revalidate:5000
    }
}

export async function getStaticPaths() {
    const sanapshot = await getDocs(query(collectionGroup( firestore ,'posts')))
    const paths = sanapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
       
        return {
            params: { username, slug },
        };
    })
    console.log(paths)
    return {
        paths,
        fallback: 'blocking',
    }
}

export default function Post(props) {

    const username = props.posts.username;
    const slug = props.posts.slug;
    const uid = props.posts.uid
    const ref = doc(firestore, 'users', uid, 'posts', slug);
    
    const [like, setLike] = useState(null);
    const snap = onSnapshot(ref, (doc) => {
        const likes = doc.data();
        //setLike(likes);
        console.log(likes);
        
    })
    const post = like || props.posts;
    // console.log(post)
    return (
        <main className={styles.container}>
            <section> 
                <PostContent posts={post}/>
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount} ❤</strong>
                </p>
                <AuthCheck fallback={
                    <Link href="/enter">
                        <button>🧡 Sign Up</button>
                    </Link>
                 }>
                    <HeartButton username={username} slug={slug} uid={props.posts.uid} heart={ post.heartCount}/>
                </AuthCheck>

            </aside>
        </main>
    );
};
