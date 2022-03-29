import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { postsRef, usersRef } from "../firebase-config";
import { onValue, get } from "firebase/database";
import "./Home.css";
import PersonalPost from "../components/PersonalPost";
import TeamPost from "../components/TeamPost";
import { add } from "ionicons/icons";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
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
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-text-center ion-text-justify">
          <IonImg
            slot="start"
            id="logosize"
            src="https://www.fck.dk/sites/default/files/fck_rgb.png"
          ></IonImg>
          <IonTitle className="fckblue">Overview</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonTitle color="primary" className="MyAc">
            My Activities
          </IonTitle>
        </IonToolbar>
        {posts.map((post) => {
          if (post.person[0] !== "all") {
            return (
              <>
                <IonList className="changepad">
                  <PersonalPost post={post} key={post.id} />
                </IonList>
              </>
            );
          }
        })}
        <IonToolbar>
          <IonTitle color="primary" className="MyAc">
            Team Activities
          </IonTitle>
        </IonToolbar>
        {posts.map((post) => {
          if (post.person[0] == "all") {
            return (
              <>
                <IonList>
                  <TeamPost post={post} key={post.id} />
                </IonList>
              </>
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
