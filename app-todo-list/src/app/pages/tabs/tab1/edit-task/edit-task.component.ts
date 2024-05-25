import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent  implements OnInit {
  @Input() id!: string;
  @Input() option!: string;
  form!: FormGroup;
  nameButton!: string;
  titleModal!: string;
  today = new Date();
  constructor(
    public fb: FormBuilder,
    private datePipe: DatePipe,
    private taskService: TaskService,
    public toastController: ToastController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.id, this.option);
    this.form = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      date: [this.datePipe.transform(this.today, "yyyy-MM-dd hh:mm:ss"), Validators.required],
      status: ["pendiente", Validators.required],
    });
    if (this.option !== "new") this.formEdit();
    this.titleModal = this.option === 'new' ? 'Nueva' : 'Editar';
    this.nameButton  = this.option === 'new' ? 'Guardar' : 'Actualizar';
  }

  closeModal(){
    this.modalController.dismiss();
  }

  onSubmit(){
    console.log(this.form.getRawValue());
    const data = this.form.getRawValue();
    if(this.option === 'new'){
      this.taskService.create(data)
      .subscribe(
        {
          next: (res) => {
           console.log(res.body);
           this.closeModal();
           this.presentToast('Creado Correctamente');
          },
          error: (error) => {
            console.log(error);
          }
        }
      );
    } else {
      this.taskService.update(data, this.id)
      .subscribe(
        {
          next: (res) => {
           console.log(res);
           this.closeModal();
           this.presentToast('Actualizado Correctamente');
          },
          error: (error) => {
            console.log(error);
          }
        }
      );
    }

  }

  formEdit(){
    this.taskService.detail(this.id)
    .subscribe(

      {
        next: (res) => {
         console.log(res.body);
          this.form.patchValue({
            title: res.body!.title,
            description: res.body!.description,
            status:  res.body!.status,
          });
        },
        error: (error) => {
          console.log(error);
          this.presentToast(error);
        }
      }
    );
  }

  async presentToast(msn: string) {
    const toast = await this.toastController.create({
      message: msn,
      duration: 2000
    });
    toast.present();
  }
}
