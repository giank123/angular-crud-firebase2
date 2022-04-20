import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/tarjeta-credito.model';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
   
  form: FormGroup;

  //iniciamos con false el spinner
  loading = false;

  //Para jugar con los titulos que sea agregar y editar
  titulo = 'Agregar Tarjeta';

  //Almacenar el id de forma global
  id: string | undefined;



  constructor(private fb: FormBuilder,
              private _tarjetaService: TarjetaService,
              private toastr: ToastrService) {
   
      this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })
   }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
     
      //Setear lo que me este llegando como parametro en el id
      this.id = data.id;

      //Cambia el titulo
      this.titulo = 'Editar Tarjeta';

      //Toma el dato seleccionado a editar, y lo rellena en el formulario
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv,
      })
    })
  }

  guardarTarjeta(){

    if(this.id === undefined){
      //creamos una nueva trajeta
      this.agregarTarjeta();

    }else{
      //Editamos la tarjeta
      this.editarTarjeta(this.id);

    }
  }

  editarTarjeta(id: string){
    const TARJETA : any = {
      titular : this.form.value.titular,
      numeroTarjeta : this.form.value.numeroTarjeta,
      fechaExpiracion : this.form.value.fechaExpiracion,
      cvv : this.form.value.cvv,
      fechaActualizacion : new Date(),

    }
    this.loading = true;

    this._tarjetaService.editarTarjeta(id, TARJETA).then(() =>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta';
      this.form.reset();
      this.id = undefined;
      this.toastr.info('La tarjeta fue actualizada con exito!', 'Registro Actualizado');
    }, error =>{
      console.log(error);
    })
  }

  agregarTarjeta(){
    const TARJETA : TarjetaCredito = {
      titular : this.form.value.titular,
      numeroTarjeta : this.form.value.numeroTarjeta,
      fechaExpiracion : this.form.value.fechaExpiracion,
      cvv : this.form.value.cvv,
      fechaCreacion : new Date(),
      fechaActualizacion : new Date(),

    }
    //Para que se muestre el spinner.
    this.loading = true;

    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      this.loading = false;
      console.log('Tarjeta Registrada');
      this.toastr.success("La tarjeta fue registrada con exito!", 'Tarjeta Registrada')
      this.form.reset();
    }, error =>{
      this.loading = false;
      this.toastr.error('Ops... ocurrio un error');
      console.log(error)
    })

  }


}
