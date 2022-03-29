import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  useIonLoading,
  IonIcon,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { getUserRef, storage } from "../firebase-config";
import { cameraOutline } from "ionicons/icons";
import { set } from "firebase/database";
import { Toast } from "@capacitor/toast";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [showLoader, dismissLoader] = useIonLoading();
  const auth = getAuth();
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");

  async function takePicture() {
    const imageOptions = {
      quality: 80,
      width: 500,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    };
    const image = await Camera.getPhoto(imageOptions);
    setImageFile(image);
    setImage(image.dataUrl);
  }

  async function uploadImage(person) {
    const newImageRef = ref(storage, `${person.uid}.${imageFile.format}`);
    await uploadString(newImageRef, imageFile.dataUrl, "data_url");
    const url = await getDownloadURL(newImageRef);
    return url;
  }

  async function handleSubmit(event) {
    showLoader();
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const imageUrl = await uploadImage(user);
        let userToMake = {
          name: name,
          role: role,
          image: imageUrl,
          phone: phone,
          mail: email,
          uid: user.uid,
        };

        if (role === "player") {
          userToMake.position = position;
          userToMake.number = number;
          await set(getUserRef(user.uid), userToMake);
        } else {
          userToMake.title = title;
          await set(getUserRef(user.uid), userToMake);
        }

        dismissLoader();
        await Toast.show({
          text: "Welcome!",
          position: "top",
        });
        signOut(auth);
      })
      .catch((error) => {
        console.log(error);
        return alert(error);
      });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/contact"></IonBackButton>
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={handleSubmit}>
          <IonCard>
            <IonCardHeader></IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  value={name}
                  type="text"
                  placeholder="Type your name"
                  onIonChange={(e) => setName(e.target.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Phone number</IonLabel>
                <IonInput
                  value={phone}
                  type="text"
                  placeholder="Type your phone number"
                  onIonChange={(e) => setPhone(e.target.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Role</IonLabel>
                <IonSegment
                  required
                  onIonChange={(e) => setRole(e.target.value)}
                >
                  <IonSegmentButton value="player">Player</IonSegmentButton>
                  <IonSegmentButton value="staff">Staff</IonSegmentButton>
                </IonSegment>
              </IonItem>
              <ExtraInfo
                title={title}
                number={number}
                setTitle={setTitle}
                setNumber={setNumber}
                role={role}
                position={position}
                setPosition={setPosition}
              />
              <IonItem onClick={takePicture} lines="none">
                <IonLabel>Choose profile Image</IonLabel>
                <IonButton>
                  <IonIcon slot="icon-only" icon={cameraOutline} />
                </IonButton>
              </IonItem>
              {image && (
                <IonImg
                  className="ion-padding"
                  src={image}
                  onClick={takePicture}
                />
              )}
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <h2 className="headingstyle">Login informations</h2>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  value={email}
                  type="email"
                  placeholder="Type your mail"
                  onIonChange={(e) => setMail(e.target.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  placeholder="Type a 6 digit password"
                  onIonChange={(e) => setPassword(e.target.value)}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div className="ion-text-center">
            <IonText color="danger">
              You will be logged out after sign up
            </IonText>
          </div>
          <div className="ion-padding-horizontal">
            <IonButton type="submit" expand="block">
              Sign up
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
}

function ExtraInfo({
  setPosition,
  setNumber,
  role,
  position,
  number,
  title,
  setTitle,
}) {
  if (role == "player") {
    return (
      <>
        <IonItem>
          <IonLabel position="stacked">Position</IonLabel>
          <IonSegment required onIonChange={(e) => setPosition(e.target.value)}>
            <IonSegmentButton value="Keeper">Keeper</IonSegmentButton>
            <IonSegmentButton value="Defender">Defender</IonSegmentButton>
            <IonSegmentButton value="Midfielder">Midfielder</IonSegmentButton>
            <IonSegmentButton value="Attacker">Attacker</IonSegmentButton>
          </IonSegment>
        </IonItem>
        <IonItem className="ion-padding-bottom">
          <IonLabel position="stacked">Shirt number</IonLabel>
          <IonInput
            value={number}
            type="number"
            placeholder="What is your shirt number?"
            onIonChange={(e) => setNumber(e.target.value)}
          ></IonInput>
        </IonItem>
      </>
    );
  } else if (role == "staff") {
    return (
      <>
        <IonItem>
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput
            value={title}
            type="text"
            placeholder="Type your title"
            onIonChange={(e) => setTitle(e.target.value)}
          />
        </IonItem>
      </>
    );
  } else {
    return (
      <IonItem>
        <h3>You need to choose a role</h3>
      </IonItem>
    );
  }
}
