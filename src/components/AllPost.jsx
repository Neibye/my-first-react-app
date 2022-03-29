import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonItem,
  useIonAlert,
  useIonActionSheet,
  useIonModal,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";

import { Toast } from "@capacitor/toast";
import PostUpdateModal from "./PostUpdateModal";
import { remove } from "@firebase/database";
import { getPostRef, storage } from "../firebase-config";
import { ref, deleteObject } from "@firebase/storage";
import { format, parseISO } from "date-fns";
import { getAuth } from "@firebase/auth";
import { useEffect, useState } from "react";
import { ellipsisVertical, ellipsisVerticalOutline } from "ionicons/icons";

export default function AllPost({ post }) {
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [presentActionSheet] = useIonActionSheet();
  const [presentDeleteDialog] = useIonAlert();
  const [presentUpdateModal, dismissUpdateModal] = useIonModal(
    <PostUpdateModal post={post} dismiss={handleDismissUpdateModal} />
  );

  function showActionSheet(event) {
    event.preventDefault();
    presentActionSheet({
      buttons: [
        { text: "Edit", handler: presentUpdateModal },
        { text: "Delete", role: "destructive", handler: showDeleteDialog },
        { text: "Cancel", role: "cancel" },
      ],
    });
  }

  function showDeleteDialog() {
    presentDeleteDialog({
      header: "Delete Post",
      message: "Do you want to delete post?",
      buttons: [
        { text: "No" },
        { text: "Yes", role: "destructive", handler: deletePost },
      ],
    });
  }

  function handleDismissUpdateModal() {
    dismissUpdateModal();
  }

  async function deletePost() {
    let imageName = post.image.split("/").pop();
    imageName = imageName.split("?alt")[0];
    const imageRef = ref(storage, imageName);
    await deleteObject(imageRef);
    remove(getPostRef(post.id));

    await Toast.show({
      text: "Post deleted!",
      position: "center",
    });
  }

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth.currentUser, user]);

  function ShowImage() {
    if (post.image) {
      return <IonImg className="post-img" src={post.image} />;
    }
  }

  if (post) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const postDate = new Date(post.date);

    const yesterdayTimestamp = yesterday.getTime();
    const postDateTimestamp = postDate.getTime();

    if (postDateTimestamp <= yesterdayTimestamp) {
      deletePost();
      console.log("Post expired");
    }
  }

  function Post() {
    return (
      <IonCard id="boxborder">
        <IonItem lines="none">
          <IonAvatar slot="start">
            <IonImg src={post.user.image} />
          </IonAvatar>
          <IonLabel>
            <h2>{post.user.name}</h2>
            <p>{post.user.position}</p>
          </IonLabel>
          <IonButton fill="clear" onClick={showActionSheet}>
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
        </IonItem>
        <ShowImage />
        <IonCardHeader className="titlepadding">
          {format(parseISO(post.date), "H:mm - d MMMM, yyyy")}
          <IonCardTitle>
            <h4>{post.title}</h4>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>{post.message}</IonCardContent>
      </IonCard>
    );
  }

  return <Post />;
}
