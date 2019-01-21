import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'

@IonicPage({
  name:'cadastro-page'
})
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  pacienteForm: FormGroup
  uid: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public http: Http,
              public storage: Storage,
              public db: AngularFireDatabase,
              public alertCtrl: AlertController,
              ) {
    this.pacienteForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(5)]],
      empresa: [null, [Validators.minLength(3)]],
      telefone: [null, [Validators.required]],
      cep: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      rua: [null, [Validators.required]],
      bairro: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      cidade: [null, [Validators.required]],
      uf: [null, [Validators.required]],
    })
  }

  ionViewDidLoad() {
    this.storage.get('user')
    .then((resolve) => {
      this.uid = resolve
    })
  }

  novoPaciente() {
    this.db.database.ref('/pacientes').child(this.uid).push(this.pacienteForm.value)
    .then(()=> {
      console.log('Salvou')
      this.presentAlert('Paciente', 'Novo paciente cadastrado com sucesso.')
      this.pacienteForm.reset()
    })
  }

    buscaCep() {
      const cepValue = this.pacienteForm.controls['cep'].value;
      const isValid  = this.pacienteForm.controls['cep'].valid;
      if (isValid) {
        this.http.get(`http://viacep.com.br/ws/${cepValue}/json/`)
        .map(res => res.json())
        .subscribe(data => {
          this.inseriValoresEndereco(data)
        })
      }
    }

    inseriValoresEndereco(dados) {
      this.pacienteForm.controls['rua'].setValue(dados.logradouro)
      this.pacienteForm.controls['bairro'].setValue(dados.bairro)
      this.pacienteForm.controls['cidade'].setValue(dados.localidade)
      this.pacienteForm.controls['uf'].setValue(dados.uf)
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
