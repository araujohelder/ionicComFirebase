import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage';

@IonicPage({
  name:'listar-page'
})
@Component({
  selector: 'page-listar',
  templateUrl: 'listar.html',
})
export class ListarPage {

  uid: string;
  pacientesDb;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public storage: Storage,
              public db: AngularFireDatabase ) {
    this.pacientesDb = [];
  }

  ionViewDidLoad() {
    this.storage.get('user')
    .then((resolve) => {
      this.uid = resolve
      this.pegarDadosFirebase()
    })

  }

  pegarDadosFirebase() {
    console.log(`https://fir-login-7a316.firebaseio.com/pacientes/${this.uid}.json`)
    this.http.get(`https://fir-login-7a316.firebaseio.com/pacientes/${this.uid}.json`)
    .map(res => res.json())
    .subscribe(data => {
      if (data !== null && data !== undefined) {
        this.trataDados(data)
      }
    })
  }

  trataDados(dados) {
    this.pacientesDb = Object.keys(dados).map(i => dados[i]);
    console.log(this.pacientesDb)
  }

  //https://fir-login-7a316.firebaseio.com/pacientes/1N9ZvbDmJjPCTqD7hOu9XmyUiBQ2




}
