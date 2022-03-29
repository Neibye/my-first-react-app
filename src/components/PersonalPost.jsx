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

import { remove } from "@firebase/database";
import { getPostRef, storage } from "../firebase-config";
import { ref, deleteObject } from "@firebase/storage";
import { format, parseISO } from "date-fns";
import { getAuth } from "@firebase/auth";
import { useEffect, useState } from "react";

export default function PersonalPost({ post }) {
  const auth = getAuth();
  const [user, setUser] = useState({});
  const history = useHistory();

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth.currentUser, user]);

  async function deletePost() {
    let imageName = post.image.split("/").pop();
    imageName = imageName.split("?alt")[0];
    const imageRef = ref(storage, imageName);
    await deleteObject(imageRef);
    remove(getPostRef(post.id));
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
    if (post.person.find((element) => element.uid === user.uid)) {
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
