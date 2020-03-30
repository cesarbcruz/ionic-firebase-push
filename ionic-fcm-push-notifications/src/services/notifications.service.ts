import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform, ToastController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class NotificationsService {

  constructor(private firebase: Firebase,
    private angularFirestore: AngularFirestore,
    private platform: Platform,
    private toastController: ToastController) {

  }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }
    this.saveToken(token);

  }

  private saveToken(token) {
    if (!token) return;
    const devicesDatabaseReference = this.angularFirestore.collection('device-tokens');
    const data = {
      token,
      userId: 'user-' + new Date().toISOString(),
    };
    return devicesDatabaseReference.doc(token).set(data);
  }

  async topicSubscription(topic) {
    this.firebase.subscribe(topic).then((res: any) => {
      console.log('Subscribed to topic: ' + topic, res);
      this.presentToast('Subscribed to topic:  ' + topic);
    });
  }

  topicUnsubscription(topic) {
    this.firebase.unsubscribe(topic).then((res: any) => {
      console.log('Unsubscribed from topic: ' + topic, res);
      this.presentToast('Unsubscribed from topic: ' + topic);
    });
  }

  unregister() {
    return this.firebase.unregister();
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
