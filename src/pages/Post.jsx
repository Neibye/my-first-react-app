import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { postsRef, usersRef } from "../firebase-config";
import { onValue, get } from "firebase/database";
import "./Home.css";
import AllPost from "../components/AllPost";
import { add } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getAuth } from "@firebase/auth";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const auth = getAuth();
  const [user, setUser] = useState({});
  const history = useHistory();

  async function getUsers() {
    const snapshot = await get(usersRef);
    const usersArray = [];
    snapshot.forEach((postSnapshot) => {
      const id = postSnapshot.key;
      const data = postSnapshot.val();
      const user = {
        id,
        ...data,
      };

      usersArray.push(user);
    });
    return usersArray;
  }

  useEffect(() => {
    setUser(auth.currentUser);
    async function listenOnChange() {
      onValue(postsRef, async (snapshot) => {
        const users = await getUsers();

        const postsArray = [];
        snapshot.forEach((postSnapshot) => {
          const id = postSnapshot.key;
          const data = postSnapshot.val();

          let post = {
            id,
            ...data,
            user: users.find((user) => user.uid == data.uid),
          };

          postsArray.push(post);
        });
        setPosts(postsArray.reverse());
      });
    }

    listenOnChange();
  }, [auth.currentUser, user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-text-center ion-text-justify">
          <IonTitle className="fckblue">Overview</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonTitle color="primary" className="MyAc">
            My Posts
          </IonTitle>
        </IonToolbar>
        {posts.map((post) => {
          if (post.uid == user.uid) {
            return (
              <IonList className="changepad">
                <AllPost post={post} key={post.id} />
              </IonList>
            );
          }
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink={`add`}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
