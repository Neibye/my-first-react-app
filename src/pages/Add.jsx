import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import PostForm from "../components/PostForm";
import { Toast } from "@capacitor/toast";
import { auth, postsRef, storage } from "../firebase-config";
import { push, set } from "firebase/database";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import "./Add.css";
import { chevronBack } from "ionicons/icons";

export default function Add() {
  const history = useHistory();
  const [showLoader, dismissLoader] = useIonLoading();

  async function handleSubmit(post) {
    showLoader();
    post.uid = auth.currentUser.uid;

    const postRef = push(postsRef);
    const newPostKey = postRef.key;
    const imageUrl = await uploadImage(post.image, newPostKey);
    post.image = imageUrl;
    await set(postRef, post);

    history.replace("/home");

    await Toast.show({
      text: "New post created!",
      position: "center",
    });
    dismissLoader();
  }

  async function uploadImage(imageFile, postKey) {
    const imageRef = ref(storage, `${postKey}.${imageFile.format}`);
    await uploadString(imageRef, imageFile.dataUrl, "data_url");
    const url = await getDownloadURL(imageRef);
    return url;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle id="addheader" color="primary">
            Add New Post
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonTitle color="primary">Add</IonTitle>
        </IonToolbar>

        <PostForm handleSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}
