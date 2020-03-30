import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public notifications: any;
  public topics: string[] = ['a1', 'a2', 'a3'];
  public topic: string = "";
  constructor(public navCtrl: NavController,
    private notificationsService: NotificationsService,
    private toastController: ToastController) {

    this.notificationsService.unregister().then(res => {
      console.log('Unregister user: ', res);
      this.presentToast('Unregister user: ' + res);
      this.topics.forEach(t => {
        this.notificationsService.topicSubscription(t);
      });
    });

  }

  ionViewDidEnter() {
    this.notifications = this.notificationsService.onNotifications().subscribe(
      (msg) => {
        this.presentToast(msg.body);
      });
  }

  ionViewDidLeave() {
    this.notifications.unsubscribe();
  }

  subscribe(t) {
    if (t) {
      this.notificationsService.topicSubscription(t);
      this.topics.push(t);
      this.topic = "";
    }
  }

  unsubscribe(t) {
    this.notificationsService.topicUnsubscription(t);
    let index = this.topics.indexOf(t);
    this.topics.splice(index, 1);
  }

  unregister() {
    this.notificationsService.unregister().then(res => {
      console.log('Unregister user: ', res);
      this.presentToast('Unregister user: ' + res);
      this.topics =[];
      this.topic = "";
    });
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
