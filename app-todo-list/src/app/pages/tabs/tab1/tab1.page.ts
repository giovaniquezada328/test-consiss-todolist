import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskI } from '../../../interfaces/taskInterface';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { EditTaskComponent } from './edit-task/edit-task.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  task: TaskI[] = [];

  constructor(
    private taskService: TaskService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,) {}

  ngOnInit() {
    this.fillTasks();
  }

  ionViewWillEnter(){
    this.fillTasks();
  }

  async addTask(id:string, option:string){
    const modal = await this.modalController.create({
      component: EditTaskComponent,
      componentProps:{
        id,
        option,
      }
    });
    modal.onDidDismiss().then(()=>{
      this.ngOnInit();
    });
    return await modal.present();
  }

  fillTasks() {
    this.taskService.list('pendiente')
    .subscribe(
      {
        next: (res) => {
         console.log(res.body);
         this.task = res.body;
         console.log(this.task);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  async presentActionSheet(id: string, item: TaskI) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Elige una Acción',
      mode:"ios",
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteTask(id);
        }
      },{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          this.openDialogTask(id, 'edit');

        }
      },
      {
        text: 'Completar',
        role: 'selected',
        icon: 'checkmark-outline',
        handler: () => {
          this.checkTask(id, item);
        }
      }
      , {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

  async  deleteTask(id:string){
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Información",
      message: "Deseas eliminar la tarea?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel:");
          },
        },
        {
          text: "Aceptar",
          handler: () => {
            this.taskService.remove(id)
            .subscribe(
              {
                next: (res) => {
                  this.presentToast('Eliminado Correctamente');
                  this.ngOnInit()
                },
                error: (error) => {
                  console.log(error);
                  this.presentToast(error);
                }
              }
            );
          },
        },
      ],
    });
    await alert.present();
    }

  async checkTask(id:string, item: TaskI){
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Información",
      message: "Deseas completar la tarea?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel:");
          },
        },
        {
          text: "Aceptar",
          handler: () => {
            item.status = 'completado';
            this.taskService.update(item, id)
            .subscribe(
              {
                next: (res) => {
                  this.presentToast('Actualizado Correctamente');
                  this.ngOnInit()
                },
                error: (error) => {
                  console.log(error);
                  this.presentToast(error);
                }
              }
            );
          },
        },
      ],
    });
    await alert.present();
    }

  async openDialogTask(id:string, option:string){
    const modal = await this.modalController.create({
      component: EditTaskComponent,
      componentProps:{
        id,
        option,
      }
    });
    modal.onDidDismiss().then(()=>{
      this.ngOnInit();
    });
    return await modal.present();
  }

  async presentToast(msn: string) {
    const toast = await this.toastController.create({
      message: msn,
      duration: 2000
    });
    toast.present();
  }

}
