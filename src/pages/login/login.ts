import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public afAuth: AngularFireAuth,
              public alertCtrl: AlertController,
              public storage: Storage) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    })
  }

  submitLogin() {
    this.afAuth.auth
      .signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then((response) => {
        this.storage.set('user', response.user.uid)
        .then(() => {
          this.navCtrl.setRoot('menu-page')
        })
      })
      .catch(error => {
        if (error.code == 'auth/user-disabled') {
          this.presentAlert('Erro', 'Usuário desabilitado')
        } else {
          if (error.code == 'auth/user-not-found') {
            this.presentAlert('Erro', 'Usuário informado não Existe')
          } else {
            if (error.code == 'auth/wrong-password') {
              this.presentAlert('Erro', 'Senha Incorreta, digite novamente')
            }
          }
        }
        this.loginForm.controls['password'].setValue(null);
      })
  }

  presentAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewCanEnter() {
    this.storage.get('user')
    .then((resolve) => {
      if (resolve.length > 0) {
        this.navCtrl.setRoot('page-menu')
      } else {
        return true;
      }
    }).catch(err => {
      return true;
    })
  }
}
