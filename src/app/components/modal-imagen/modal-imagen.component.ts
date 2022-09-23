import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imagenTemp: any;

  constructor( public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(evento: any): any {

    const imagen = evento.target?.files[0];

    if (evento) {
      if (!imagen) {
        return this.imagenTemp = null;
      }
      this.imagenSubir = imagen;
      const reader = new FileReader();
      reader.readAsDataURL(imagen);

      reader.onloadend = () => {
        this.imagenTemp = reader.result;
      }


    }

  }


  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id || '')
      .then(img => {
        Swal.fire('Imagen', 'Imagen actualizada correctamente', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch(err => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

}
