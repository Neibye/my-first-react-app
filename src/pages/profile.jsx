import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonInput,
  IonIcon,
  IonImg,
  useIonLoading,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getUserRef } from "../firebase-config";
import { get, update } from "@firebase/database";
import { Camera, CameraResultType } from "@capacitor/camera";
import { camera } from "ionicons/icons";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase-config";
import { Toast } from "@capacitor/toast";
import "./profile.css";

export default function ProfilePage() {
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [showLoader, dismissLoader] = useIonLoading();

  useEffect(() => {
    setUser(auth.currentUser);

    async function getUserDataFromDB() {
      const snapshot = await get(getUserRef(user.uid));

      const userData = snapshot.val();
      if (userData) {
        setName(userData.name);
        setTitle(userData.title);
        setPhone(userData.phone);
        setImage(userData.image);
      }
    }

    if (auth.currentUser.uid) getUserDataFromDB();
  }, [auth.currentUser, user]);

  function handleSignOut() {
    signOut(auth);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    showLoader();

    const userToUpdate = {
      name: name,
      title: title,
      phone: phone,
    };

    if (imageFile.dataUrl) {
      const imageUrl = await uploadImage();
      userToUpdate.image = imageUrl;
    }

    if (getUserRef(user.uid)) {
      await update(getUserRef(user.uid), userToUpdate);
      dismissLoader();
      await Toast.show({
        text: "User Profile saved!",
        position: "top",
      });
    } else {
      await update(getUserRef(user.uid), userToUpdate);
      dismissLoader();
      await Toast.show({
        text: "User Profile saved!",
        position: "top",
      });
    }
  }

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

  async function uploadImage() {
    const newImageRef = ref(storage, `${user.uid}.${imageFile.format}`);
    await uploadString(newImageRef, imageFile.dataUrl, "data_url");
    const url = await getDownloadURL(newImageRef);
    return url;
  }

  return (
    <>
      <IonPage className="posts-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle className="profiletext" color="primary">
              Profile Page
            </IonTitle>
            <IonButtons slot="primary">
              <IonButton
                className="profiletext"
                color="primary"
                onClick={handleSignOut}
              >
                Sign Out
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItem>
            <IonLabel position="stacked">Mail:</IonLabel>
            {user?.email}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Phone:</IonLabel>
            <IonInput
              value={phone}
              type="number"
              placeholder="Type your number"
              onIonChange={(e) => setPhone(e.target.value)}
            />
          </IonItem>
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={name}
                type="text"
                placeholder="Type your name"
                onIonChange={(e) => setName(e.target.value)}
              />
            </IonItem>
            {user.title ? (
              <IonItem>
                <IonLabel position="stacked">Position:</IonLabel>
                {user?.position}
              </IonItem>
            ) : (
              <IonItem>
                <IonLabel position="stacked">Title</IonLabel>
                <IonInput
                  value={title}
                  type="text"
                  placeholder="Type your title"
                  onIonChange={(e) => setTitle(e.target.value)}
                />
              </IonItem>
            )}

            <IonItem onClick={takePicture} lines="none">
              <IonLabel>Choose Image</IonLabel>
              <IonButton>
                <IonIcon slot="icon-only" icon={camera} />
              </IonButton>
            </IonItem>
            {image && (
              <IonImg
                className="ion-padding"
                src={image}
                onClick={takePicture}
              />
            )}
            <div className="ion-padding">
              <IonButton type="submit" expand="block">
                Save User
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonPage>
    </>
  );
}
