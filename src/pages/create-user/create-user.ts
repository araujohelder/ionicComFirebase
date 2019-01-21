import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ValidateConfirmPassword } from '../../validators/confirmPassword';

import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController } from 'ionic-angular';



@IonicPage({
  name: 'create-user'
})
@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {


  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController ) {

      this.registerForm = formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(5)]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(6), ValidateConfirmPassword]],
      },{validator: this.checkIfMatchingPassword('password','confirmPassword')})
  }

checkIfMatchingPassword(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let passwordInput = group.controls[passwordKey],
            passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
            return passwordConfirmationInput.setErrors({notEquivalent: true})
        }
        else {
            return passwordConfirmationInput.setErrors(null);
        }
    }
  }

  submitForm() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
      .then(response => {
        this.presentAlert('Usuário', 'Usuário cadastrado com sucesso.')
        this.navCtrl.setRoot('menu-page')
        console.log('Usuário criado com sucesso.')
      })
      .catch( error => {
        if (error.code == 'auth/email-already-in-use') {
          this.presentAlert('Erro', 'E-mail já cadastrado.')
        }
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


}
