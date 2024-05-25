import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskI } from '../../../interfaces/taskInterface';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  task: TaskI[] = [];
  constructor(
    private taskService: TaskService,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.fillTasks();
  }

  ionViewWillEnter(){
    this.fillTasks();
  }


  fillTasks() {
    this.taskService.list('completado')
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

    async presentToast(msn: string) {
      const toast = await this.toastController.create({
        message: msn,
        duration: 2000
      });
      toast.present();
    }

}
