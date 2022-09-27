import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private medicosService: MedicoService,
    private modalImagenService: ModalImagenService,
      private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos()

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
     delay(100)
    )
    .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
}

  cargarMedicos(){
    this.cargando = true;

    this.medicosService.cargarHospitales()
    .subscribe( resp => {
      this.cargando = false;
      this.medicos = resp;

    }, error => {
      console.log(error)
      this.cargando = false;
    })
  }


  busquedaMedico( termino: string){

    if( termino.length === 0){
      this.cargarMedicos();
    } else {
      this.busquedaService.buscar('medicos',termino)
        .subscribe( (resp: any) => {
          console.log(resp);

         this.medicos = resp
        }, ( error) => {
          console.log(error);

        })
    }

  }

  abrirModal( medico: Medico){
    this.modalImagenService.abrirModal('medicos',medico._id || '', medico.img);

  }

  borrarMedico(medico: Medico){
    return Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta apunto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.medicosService.eliminarMedico(medico._id)
       .subscribe( resp => {
         Swal.fire(
          'Eliminado',
          `${medico.nombre} eliminado correctamente`,
          'success'
        )
        this.cargarMedicos();
       })
      }
    })

  }

}
