import { auth, googleAuthProvider } from '../lib/firebase'
import { signInWithPopup } from 'firebase/auth';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { firestore } from '../lib/firebase';
import debounce from 'lodash.debounce';
import { collection, doc, getDocs, set, writeBatch } from "firebase/firestore";
import { useRouter } from 'next/dist/client/router';



export default  function Enter({}) {
    const { user, username } = useContext(UserContext);

    return (
        <div>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </div>
    )
}

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'}  /> Sign in with Google
        </button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);
    
    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        };
       
    }
     // Hit the db for username after each debounced change
        // useCallback is required for debounce to work 
        const checkUsername = useCallback(debounce(async (username) => {
            if (username.length >= 3) {
                // const ref = firestore.doc(`usernames/${username}`);
                const querySnapshot = await getDocs(collection(firestore, "usernames"));
                console.log(querySnapshot);
                const exists = querySnapshot.forEach((doc) => {
                    let data = doc.id;
                    console.log(data);
                    return data ? username === data : '';
                })
                console.log('Firestore red executed');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
            []
        );

    const onSubmit = async (e) => {
        e.preventDefault();
        const userDoc = doc(firestore, "users", `${user.uid}`);
        const usernameDoc = doc(firestore, "usernames", `${formValue}`)


        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    }


    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input type="text" name="username" placeholder="Username" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
        )
}

function SignOutButton() {
    return (
        <button className="btn-google">
            Sign Out
        </button>
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-sucess">{username} is available</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That user name is taken</p>
    } else {
        return <p></p>
    }
}