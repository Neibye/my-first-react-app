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

export default function PlayerCard({ player }) {
  return (
    <IonCard>
      <IonImg src={player.image} />
      <IonCardHeader>
        <IonCardTitle>{player.name}</IonCardTitle>
        <IonCardSubtitle>{player.title}</IonCardSubtitle>
        <IonCardSubtitle>{player.number}</IonCardSubtitle>
      </IonCardHeader>

      <IonItem href={`mailto:${player.mail}`}>
        <IonIcon icon={mail} slot="start" />
        <IonLabel>{player.mail}</IonLabel>
      </IonItem>

      <IonItem href={`tel:${player.phone}`}>
        <IonIcon icon={phonePortraitSharp} slot="start" />
        <IonLabel>{player.phone}</IonLabel>
      </IonItem>
    </IonCard>
  );
}
