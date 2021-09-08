import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {getUserWithUsername, postToJSON} from '../../lib/firebase'
import {getDocs, doc, getDoc, collection, limit, orderBy, query as q, where } from "firebase/firestore";
import {firestore, auth} from '../../lib/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { UserContext } from '../../lib/context';
import { useContext } from "react";


export async function getServerSideProps({ query }) {
    const { username } = query;
    const {userDoc, userRef} = await getUserWithUsername(username);
    let user = null;
    let posts = [];
    if (!userDoc) {
        return {
            notFound:true,
        }
    }
    
    if (userDoc) {
        user = userDoc.data();
        // const { users, usernames } = useUserData;
        // console.log(users, usernames);
        
        const docRef = doc(firestore, "usernames", username);
        const docSnap = await getDoc(docRef).then(async (doc) => {
            const data = doc.data();
            const uid = data.uid;
           
            const postsQuery = q(collection(firestore, 'users', `${uid}`, 'posts'), where("published", "==", true), orderBy('createdAt', 'desc'), limit(5));
            let test;

                let post = await getDocs(postsQuery);
            post.forEach((doc) => {
                
                posts.push(postToJSON(doc));
                console.log(doc.data())
            
                })
        });
        
    
    }
    return {
        props: { user, posts }
    };
}




export default function UserProfilePage({ user, posts }) {
    const userse = auth.currentUser;
    
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={ posts}/>
        </main>
    )
}
