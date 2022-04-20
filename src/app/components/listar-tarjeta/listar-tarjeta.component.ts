import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/tarjeta-credito.model';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {

  listTarjetas: TarjetaCredito[] = [];
  
  constructor(private _tarjetaService: TarjetaService,
              private toatr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.obtenerTarjetas().subscribe(doc =>{
      
      //se inicia de cero el objeto creado.
      this.listTarjetas = [];

      doc.forEach((element: any) => {

        this.listTarjetas.push({
          
          id: element.payload.doc.id,
          //Se hace una copia del objeto
          ...element.payload.doc.data()
        });
      });
      console.log(this.listTarjetas)
    })
  }

  eliminarTarjeta(id: any){

    this._tarjetaService.eliminarTarjeta(id).then(() => {
      this.toatr.error('La tarjeta fue eliminada con exito!', 'Registro Eliminado')      
    }, error =>{
      this.toatr.error('Ops... ocurrio un error','Error');
      console.log(error);
    })
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this._tarjetaService.addTarjetaEdit(tarjeta);
  }


}
