import {
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { mail, phonePortraitSharp } from "ionicons/icons";

export default function UserCard({ user }) {
  return (
    <IonCard>
      <IonImg src={user.image} />
      <IonCardHeader>
        <IonCardTitle>{user.name}</IonCardTitle>
        <IonCardSubtitle>{user.title}</IonCardSubtitle>
        <IonCardSubtitle>{user.number}</IonCardSubtitle>
      </IonCardHeader>

      <IonItem href={`mailto:${user.mail}`}>
        <IonIcon icon={mail} slot="start" />
        <IonLabel>{user.mail}</IonLabel>
      </IonItem>

      <IonItem href={`tel:${user.phone}`}>
        <IonIcon icon={phonePortraitSharp} slot="start" />
        <IonLabel>{user.phone}</IonLabel>
      </IonItem>
    </IonCard>
  );
}
