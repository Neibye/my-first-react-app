import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonImg,
  IonIcon,
  IonInput,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { usersRef } from "../firebase-config";
import { get } from "firebase/database";
import { camera } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";

export default function PostForm({ post, handleSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [imageFile, setImageFile] = useState({});
  const [date, setDate] = useState("");

  useEffect(() => {
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
    if (post) {
      setTitle(post.title);
      setMessage(post.message);
      setDate(post.date);
      setImage(post.image);
    }
    getUsers();
  }, [post]);

  function submitEvent(event) {
    event.preventDefault();
    const formData = {
      title: title,
      message: message,
      person: selectedUser,
      date: date,
      image: imageFile,
    };
    handleSubmit(formData);
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

  return (
    <form onSubmit={submitEvent}>
      <IonItem className="--padding-bottom">
        <IonLabel position="stacked">Person</IonLabel>
        <IonSelect
          multiple
          value={selectedUser}
          onIonChange={(e) => setSelectedUser(e.detail.value)}
          placeholder="Choose a person"
        >
          <IonSelectOption value="all">Team</IonSelectOption>
          {users.map((user) => (
            <>
              <IonSelectOption value={user}>
                {user.number ? "#" + user.number : user.title} - {user.name}
              </IonSelectOption>
            </>
          ))}
        </IonSelect>
      </IonItem>
      <div className="ion-padding-vertical">
        <IonItem>
          <IonDatetime
            value={date}
            placeholder="Choose a date and time"
            onIonChange={(e) => setDate(e.target.value)}
          />
        </IonItem>
      </div>
      <IonItem>
        <IonLabel position="stacked">Title</IonLabel>
        <IonInput
          value={title}
          placeholder="Title of the activity"
          onIonChange={(e) => setTitle(e.target.value)}
        />
      </IonItem>
      <div className="ion-padding-vertical">
        <IonItem>
          <IonLabel position="stacked">Desciption</IonLabel>
          <IonInput
            value={message}
            placeholder="Write description of the activity here"
            onIonChange={(e) => setMessage(e.target.value)}
          />
        </IonItem>
      </div>

      <IonItem onClick={takePicture}>
        <IonLabel>Choose Image</IonLabel>
        <IonButton>
          <IonIcon slot="icon-only" icon={camera} />
        </IonButton>
      </IonItem>
      {image && (
        <IonImg className="ion-padding" src={image} onClick={takePicture} />
      )}
      {image && title && message && selectedUser && date && image ? (
        <div className="ion-padding ion-text-center">
          <IonText color="danger">REMEMBER TO CHOOSE A PERSON</IonText>
          <IonButton type="submit" expand="block">
            Submit
          </IonButton>
        </div>
      ) : (
        <div className="ion-padding">
          <IonButton type="submit" expand="block" disabled>
            Submit
          </IonButton>
        </div>
      )}
    </form>
  );
}
