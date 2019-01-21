import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';


@IonicPage({
  name:'menu-page'
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  logout() {
    this.storage.remove('user')
    this.navCtrl.setRoot(HomePage)
  }

}
