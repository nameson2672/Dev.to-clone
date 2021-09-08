import { firestore, auth } from '../lib/firebase';
import { collection, doc, writeBatch, increment, getDoc, query, collectionGroup, getDocs } from '@firebase/firestore';
import { useEffect, useState } from 'react';
 

// Allows user to heart or like a post
export default function Heart({ username, slug, uid, heart }) {

  // const getUid = async () => {
  //   const postOwnerRef = doc(firestore, 'usernames', `${username}`);
  //   uid = (await getDoc(postOwnerRef)).data();
  // }



  const heartRef = doc(firestore, 'users', uid, 'posts', slug, 'hearts', auth.currentUser.uid);
  const [heartDoc, setHeartDoc] = useState();
  useEffect(async () => {
    setHeartDoc((await getDoc(heartRef)).data());
  
  }, [heart])
 
  
  const postRef = doc(firestore, 'users', uid, 'posts', slug);

  // const postRef = query(collectionGroup(firestore, 'posts', slug));

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uids = auth.currentUser.uid;
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(1) });
    // const heartRefs = query(collection(firestore, 'users', uid, 'posts', `${slug}`, 'hearts'),doc(auth.currentUser.uid));
    batch.set(heartRef, { uids });
    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?(
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
