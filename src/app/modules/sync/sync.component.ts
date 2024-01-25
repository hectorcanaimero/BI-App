import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {
  accounts$: Observable<any[]>;
  dtOptions: DataTables.Settings = {};
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: DataService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.getData();
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  getData() {
    this.accounts$ = this.http.getData('accounts');
    this.accounts$.subscribe(res => console.log(res));
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.http.postData('accounts/create', this.form.value).subscribe((res: any) => {
      this.getData();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'A conta de Power BI foi adicionadas com sucesso!',
        icon: 'success'
      });
    })
  }

  onSync() {
    this.http.postData('reports/syncronize', {}).subscribe((res: any) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'As contas de BI estão senda sincronizada!',
        icon: 'success'
      });
    })
  }

  onTrash(id: string) {
    this.http.delete('accounts/remove/' + id, this.form.value).subscribe(() => {
      this.getData();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'A conta foi apagada!',
        icon: 'success'
      });
    })
  }

  loadForm() {
    this.form = this.fb.group({
      nameAccount: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email]],
      pass: ['',Validators.required],
      clientId: ['', Validators.required],
      clientSecret: ['',  Validators.required],
      tenantId:['',  Validators.required],
    })
    console.log(this.form);
  }
}
