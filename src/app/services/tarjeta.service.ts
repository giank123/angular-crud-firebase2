import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { TarjetaCredito } from '../models/tarjeta-credito.model';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  //todo los que se suscribas a esta variable van a obtener la tarjeta que emita ListarTarjeta
  private tarjeta$ = new Subject<any>();

  constructor(private firestore: AngularFirestore) { }

  guardarTarjeta(tarjeta: TarjetaCredito): Promise<any> {
    return this.firestore.collection('tarjetas').add(tarjeta);
  }
  
  obtenerTarjetas(): Observable<any>{
    //para obtener los datos , se crea un string de datos sincronizados a diferencia del get
    //ref  :   Para ordenar para que la haya un orden en la lista cuando se crea uno nuevo.
    return this.firestore.collection('tarjetas', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  eliminarTarjeta(id: string): Promise<any> {
    return this.firestore.collection('tarjetas').doc(id).delete();
  }

  editarTarjeta(id: string, tarjeta: any): Promise<any> {
    return this.firestore.collection('tarjetas').doc(id).update(tarjeta);
  }

  //*******2 Metodos que se necesita para Transmitir datos entre componentes********************************
  addTarjetaEdit(tarjeta: TarjetaCredito){
    //next: Emitir este nuevo valor que me esta lllegando de tarjeta
    this.tarjeta$.next(tarjeta);
  }

  getTarjetaEdit(): Observable<TarjetaCredito>{
    return this.tarjeta$.asObservable();
  }
}
