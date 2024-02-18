import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { EnvironmentService } from 'src/app/servizi/environment.service';
import { MenuService } from 'src/app/servizi/menu.service';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'src/app/servizi/message.service';


interface Categoria {
  codice: number;
  nome: string;
}

interface piatto {
  id: string,
  codice: string,
  nome: string,
  categoria :Categoria,
  img:{
    file: string | File
    changed: boolean
  }
}

@Component({
  selector: 'app-dati-menu',
  templateUrl: './dati-menu.component.html',
  styleUrls: ['./dati-menu.component.css']
})

export class DatiMenuComponent {
menuJson :any;
totalRecords : any;
loading: boolean = false;
categorie : any = [];
showPlaceholder: boolean = false;

isUpdatePopUpVisible : boolean = false;
isInsertPopUpVisible : boolean = false;

piattoJson :piatto = {
  id: '',
  codice: '',
  nome: '',
  categoria: {
    codice: Number(''),
    nome: ''
  },
  img:{
    file: '',
    changed: false
  }
};

submitted: boolean = false;

filtroCategorie: Categoria[] | undefined;

//debug: boolean = true;
debug: boolean = !this.EnvironmentService.getIsProd();

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private EnvironmentService: EnvironmentService,
    private MessageService: MessageService,

  ){
    this.supabaseService.checkAuth();

  }

  async ngOnInit(){
    this.loading = true
    this.menuJson = await this.supabaseService.getPiatti()
    console.log(this.menuJson);
    
    this.categorie = this.servizioMenu.getCategorie();
    this.loading = false

    console.log(this.EnvironmentService.getIsProd());
    

    await this.getFiltroCategorieValues()

    console.log(this.menuJson);
    console.log(this.totalRecords);
    console.log(this.menuJson)

  }

  getImgPiatto(codicePiatto : string){

    return this.supabaseService.getPictureURL("immaginiPiatti",codicePiatto)
  }



  clear(table: Table) {
    table.clear();
}



openUpdate(piatto : any){
  this.isUpdatePopUpVisible = !this.isUpdatePopUpVisible
  this.setUpdatePiattoJson(piatto);
  
}

openInsert(){
  this.isInsertPopUpVisible = !this.isInsertPopUpVisible
  this.resetPiattoJson()
  
}


  //Aggiornamento foto profilo
  async onFileSelected(event: any) {
    console.log("onFileSelected");
    
    const imgPiatto = event.target.files[0]
    
    console.log(typeof imgPiatto);
    console.log(imgPiatto);

    if (imgPiatto) {

      const imageUrl = URL.createObjectURL(imgPiatto);

      this.piattoJson = {
        id: this.piattoJson.id,
        codice: this.piattoJson.codice,
        nome: this.piattoJson.nome,
        categoria:{
          codice: Number(this.piattoJson.categoria.codice),
          nome:this.piattoJson.categoria.nome
        },
        img: {
          file: imageUrl,
          changed: true
        }
      }
    }
  }






async getFiltroCategorieValues(){


  this.filtroCategorie = this.filtroCategorie ?? [];
  let data = await this.supabaseService.getListaCategorie();

  if(data == null) return

  data.forEach(categoria => {
    this.filtroCategorie?.push({ codice: categoria.idCategoria, nome: categoria.descrizione }) 
  });


}



update(){

  this.submitted = true;

  this.supabaseService.updatePiatto(this.piattoJson)
  
}


async insert(){

  this.submitted = true;

  if (this.isFormValid()) {
    // Se il form è valido, esegui l'invio dei dati
    let response = await this.supabaseService.insertPiatto(this.piattoJson)

    if(response.success){
      this.close()
      this.MessageService.showMessageSuccess('',response.description)

    }else{
      this.MessageService.showMessageError('',response.description)

    }

  }else{
    this.MessageService.showMessageError('','Riempi tutti i campi')
}
  
}


isFormValid(): boolean {
  // Controlla se tutti i campi obbligatori sono stati compilati
  return !!this.piattoJson.codice && !!this.piattoJson.nome && !!this.piattoJson.categoria.nome && !!this.piattoJson.img.file;
}


close(){
  console.log('modifiche annullate');
  this.isUpdatePopUpVisible = false;
  this.isInsertPopUpVisible = false;
  this.submitted = false;
}


async refresh(){
  this.menuJson = await this.supabaseService.getPiatti()
  
}

/* 
exportPdf() {
  import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
          const doc = new jsPDF.default('p', 'px', 'a4');
          (doc as any).autoTable(this.exportColumns, this.products);
          doc.save('products.pdf');
      });
  });
}

exportExcel() {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
  });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}
 */



resetPiattoJson(){
  this.piattoJson = {
    id: '',
    codice: '',
    nome: '',
    categoria: {
      codice: Number(''),
      nome: ''
    },
    img:{
      file: '',
      changed: false
    }
  };
}



setUpdatePiattoJson(piatto: any){
  this.piattoJson = {
    id: piatto.id,
    codice: piatto.codice,
    nome: piatto.nome,
    categoria:{
      codice: Number(piatto.idcategoria),
      nome:piatto.categoria
    },
    img: {
      file: this.getImgPiatto(piatto.codice),
      changed: false
    }
  }
}

handleImageError() {
  this.showPlaceholder = true;
}

handleDragOver(event: DragEvent) {
  event.preventDefault();
}

handleDrop(event: DragEvent) {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file) {
      // Qui puoi gestire il caricamento dell'immagine
      // Ad esempio, puoi convertirla in un URL Blob e assegnarla a piattoJson.img.file
      const reader = new FileReader();
      reader.onload = (e) => {
          this.piattoJson.img.file = e.target?.result as string;
      };
      reader.readAsDataURL(file);
  }
}


}
