import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonItem,
  IonAvatar,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Toast } from "@capacitor/toast";

import { remove } from "@firebase/database";
import { getPostRef, storage } from "../firebase-config";
import { ref, deleteObject } from "@firebase/storage";
import { format, parseISO } from "date-fns";

export default function TeamPost({ post }) {
  const history = useHistory();

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

  function goToUserDetailView() {
    history.push(`user/${post.uid}`);
  }
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
    if (post.person == "all") {
      return (
        <IonCard id="boxborder">
          <IonItem lines="none">
            <IonAvatar slot="start" onClick={goToUserDetailView}>
              <IonImg src={post.user.image} />
            </IonAvatar>
            <IonLabel onClick={goToUserDetailView}>
              <h2>{post.user.name}</h2>
              <p>{post.user.position ? post.user.position : post.user.title}</p>
            </IonLabel>
          </IonItem>
          <ShowImage />

          <IonCardHeader className="titlepadding">
            {format(parseISO(post.date), "H:mm - d MMMM, yyyy")}
            <IonCardTitle>
              <h4>{post.title}</h4>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent onClick={goToUserDetailView}>
            {post.message}
          </IonCardContent>
        </IonCard>
      );
    } else {
      return <></>;
    }
  }

  return <Post />;
}
