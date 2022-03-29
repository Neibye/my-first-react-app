import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { get } from "firebase/database";
import { useHistory } from "react-router";
import { usersRef } from "../firebase-config";
import "./Contact.css";
import { getAuth } from "@firebase/auth";

const Contact = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const [user, setUser] = useState({});
  const history = useHistory();

  async function getUsers() {
    const userData = await get(usersRef);
    const userArray = [];
    userData.forEach((userSnapshot) => {
      const id = userSnapshot.key;
      const data = userSnapshot.val();
      const user = {
        id,
        ...data,
      };
      userArray.push(user);
    });
    setUsers(userArray);
  }

  // useEffect allows you to perform side effects in your components.
  useEffect(() => {
    getUsers();
    setUser(auth.currentUser);
  }, [auth.currentUser, user]); // empty array as dependency - makes sure to run only on the first render

  function IfStaff(e) {
    return (
      <IonButton size="small" slot="end" routerLink={`signup`}>
        New user
      </IonButton>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-text-center ion-text-justify">
          <IonTitle className="fckblue">Contact</IonTitle>
          {users.map((person) => {
            if (person.role == "staff" && user.uid == person.uid) {
              return <IfStaff />;
            }
          })}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {users.map((user) => (
            <IonItem
              className="playerborder"
              button
              key={user.id}
              routerLink={`user/${user.uid}`}
            >
              <IonAvatar slot="start">
                <IonImg src={user.image} />
              </IonAvatar>
              <IonLabel>
                <h2>{user.name}</h2>
                <p>{user.position ? user.position : user.title}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Contact;
