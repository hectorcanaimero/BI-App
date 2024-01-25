import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, firstValueFrom, tap, timer } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  message!: string;
  load: boolean = false;
  form!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storage: StorageMap,
    private http: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.load = true;
    this.http.postData('users/login', this.form.value)
    .pipe(delay(1000))
    .subscribe(
      (res: any) => {
        this.storage.set('oToken', res.access_token).subscribe(() => '');
        this.http.getData('users').subscribe((user) => {
          this.storage.set('oUser', user).subscribe(() => '');
        });
        this.load = false;
        this.router.navigate(['dashboard']);
      },
      (error) => {
        this.load = false;
        this.message = error.error.message;
      },
      (() => console.log('Complete'))
    );
  }

  private loadForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    })
  }

  forgotPassword() {
    Swal.fire({
      title: 'Informe seu email da conta',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Resetar a senha',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return firstValueFrom(this.http.patchData(`users/forget/pass/${login}`, {}))
        .then(response => {
            return response;
          })
          .catch(error => {
            Swal.showValidationMessage(`${error.error.message}`)
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: `Sua nova senha foi enviada para seu email` })
      }
    })
  }
}
