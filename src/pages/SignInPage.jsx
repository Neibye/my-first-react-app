import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonImg,
  IonToolbar,
} from "@ionic/react";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

import "./SignInPage.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  async function handleLogin(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sign in</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonToolbar>
            {/* <IonTitle id="byenshold">BYENS HOLD</IonTitle> */}
            <IonImg
              id="frontlogo"
              src="https://www.fck.dk/sites/default/files/fck_rgb.png"
            ></IonImg>
          </IonToolbar>

          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Sign in</IonTitle>
            </IonToolbar>
          </IonHeader>
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                value={email}
                type="email"
                placeholder="Your email"
                onIonChange={(e) => setEmail(e.target.value)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Passwords</IonLabel>
              <IonInput
                type="password"
                value={password}
                placeholder="Your password"
                onIonChange={(e) => setPassword(e.target.value)}
              ></IonInput>
            </IonItem>
            <IonButton type="submit" expand="block">
              Sign in
            </IonButton>
            <div className="ion-text-center">
              <IonButton
                fill="white"
                color="light"
                size="small"
                href={`tel:28506080`}
              >
                Need a login?
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonPage>
    </>
  );
}
