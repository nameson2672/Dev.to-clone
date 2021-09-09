import PostFeed from '@components/PostFeed';
import Metatags from '@components/Metatags';
import Loader from '@components/Loader';
import { firestore, fromMillis, postToJSON } from '@lib/firebase';
import { useState } from 'react';
import Link from "next/link";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title="Home Page" description="Get the latest posts on our site" />
      <div className="FeedWarp">
        <div className="left">
          <div className="info"><h2>DEV 2.0 Community is a community of some amazing developers 😂😂😂</h2>
            <p> We're a place where coders share, stay up-to-date and grow their careers.</p>
          </div>
          <div className="markdown_learn">
            <div className="img"><img src="/l.jpg" alt="Learn markdown" /></div>
            <div className="text_privacy">
              <div className="center">
                <Link href="https://www.markdownguide.org/getting-started/" >
                  <a className="mark-learn">Learn Markdown</a>
                </Link>
              </div>
              <div className="scrool">
                <p>Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. Created by John Gruber in 2004, Markdown is now one of the world’s most popular markup languages.</p>
                <p>Using Markdown is different than using a WYSIWYG editor. In an application like Microsoft Word, you click buttons to format words and phrases, and the changes are visible immediately. Markdown isn’t like that. When you create a Markdown-formatted file, you add Markdown syntax to the text to indicate which words and phrases should look different.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="feeds">
          <PostFeed posts={posts} />
        </div>
        <div>
        <div className="privacy">
          <img src="/p.jpg" alt="Privacy policy and rules" />
            <div className="text_privacy scrool">
              <h2>Privacy Policy for Dev 2.0</h2>
              <p>At dev-to-clone, accessible from <a href="https://dev-to-clone-woad.vercel.app/"> site </a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by dev-to-clone and how we use it.</p>
              <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
              <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in dev-to-clone. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the TermsFeed Privacy Policy Generator.</p>
              <p></p>
            </div>
            <div >
              
            </div>
          </div> 
        </div>   
      </div>
     

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
