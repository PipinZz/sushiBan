import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css']
})
export class CarrelloComponent {
  message : string = '';

  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private dialogRef: MatDialogRef<CarrelloComponent>,
    private router: Router,

  ) {}

  ngOnInit(): void {}



  onSubmit() {
    let paramJson = this.servizioMenu.getOrdine();
    this.supabaseService.insertOrdine(paramJson)
      .then((data) => {

        console.log("data : ",data);

        if(data.success){
          console.log("Inserimento riuscito");
          console.log("Animazione:");

          this.dialogRef.close();
          this.router.navigate(['/ordini']);
        }

        else{
          console.error(data.description)
          this.message = data.description;
        // if(data.description = ''){
        //     this.message
        // }else{
        //   this.message = data.description;
        // }
        }
        
      })
      .catch((error) => {
        console.error("Errore durante l'inserimento:", error);
      });
  }
}
