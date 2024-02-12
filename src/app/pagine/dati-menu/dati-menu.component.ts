import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MenuService } from 'src/app/servizi/menu.service';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';




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

isUpdatePopUpVisible : boolean = false;
updatePiattoJson :any = {};

submitted: boolean = false;



  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,

  ){
    this.supabaseService.checkAuth();

  }

  async ngOnInit(){
    this.loading = true
    this.menuJson = await this.supabaseService.getPiatti()
    this.categorie = this.servizioMenu.getCategorie();
    this.loading = false

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
  this.updatePiattoJson = piatto;
  console.log(this.updatePiattoJson);
  
}
/*
update() {
  this.submitted = true;

  if (this.product.name?.trim()) {
      if (this.product.id) {
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
          this.product.id = this.createId();
          this.product.image = 'product-placeholder.svg';
          this.products.push(this.product);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
  }
}

*/
openNew() {
  console.log('nowopeen');
  
  this.updatePiattoJson = {};
  this.submitted = false;
  this.isUpdatePopUpVisible = true;
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
}
