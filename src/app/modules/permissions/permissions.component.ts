import { Component, OnInit } from '@angular/core';
import { DataService } from '@core/services/data.service';
import { Observable, filter, from, map, mergeMap, switchMap, timer } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  user: string;
  form!: FormGroup;
  load: boolean = false;
  user$!: Observable<any>;
  users$!: Observable<any[]>;
  workspaces$!: Observable<any[]>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: DataService,
  ) {
    this.form = this.fb.group({
      reportIdPB: this.fb.array([]),
      groupIdPB: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getData();
  }

  onSubmit() {
    const reportIdPB = this.form.value.reportIdPB;
    if (this.user) {
      if (reportIdPB.length > 0) {
        const data = {
          reportIdPB: this.form.value.reportIdPB,
        }
        this.http.patchData(`users/reports/${this.user}`, data).subscribe((res: any) => {
          console.log('RES', res);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: 'Permissões adicionadas com sucesso!',
            icon: 'success'
          });
          this.router.navigate(['dashboard']);
        });
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Você não tem nenhuma permissão atribuída',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } else {
      Swal.fire({
        title: 'Erro!',
        text: 'É necessario selecionar um usuário',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  getData() {
    this.users$ = this.http.getData('users/all').pipe(
      map((users: any) => users.filter((row: any) => row.role === 'user'))
    );
  }

  getUser(ev: any) {
    const user = ev.target.value;
    this.user = user;
    this.user$ = this.users$.pipe(
      map((data: any) => data.filter((row: any) => row._id === user)[0])
    );
    this.user$.subscribe(res => console.log(res));
    this.getWorkspace();
    this.reportIdPB(user);
  }

  getWorkspace() {
    this.workspaces$ = this.user$.pipe(
      switchMap((user: any) => this.http.getData(`groups/all/${user.accountID[0]._id || user.accountID[0]}`)
        .pipe(map((res: any) => res.groups))
      )
    );
  }

  reportIdPB(user: string) {
    const reportIdPB: FormArray = this.form.get('reportIdPB') as FormArray;
    timer(500).subscribe(() => {
      this.http.getData(`users/id/${user}`).subscribe((res: any) => {
        if (res.report.length > 0) {
          res.report.forEach((el: any) => {
            const checked: HTMLElement | null = document.getElementById(el.reportIdPB);
            checked?.setAttribute('checked', 'checked');
            reportIdPB.push(new FormControl(el.reportIdPB));
          });
        }
      })
    })
  }

  onCheckboxChange(e: any) {
    const reportIdPB: FormArray = this.form.get('reportIdPB') as FormArray;
    if (e.target.checked) {
      reportIdPB.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      reportIdPB.controls.forEach((item: any): void => {
        if (item.value == e.target.value) {
          reportIdPB.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
