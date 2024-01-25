import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { DataService } from '@core/services/data.service';
import { User } from '@core/interfacers/user.interface';
import { Observable, Subject, delay, tap } from 'rxjs';
import { Account } from '@core/interfacers/account.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('accountUser', { static: false }) accountUser: ElementRef;
  items$!: Observable<User[]>;
  accounts$!: Observable<Account[]>;
  formUser: FormGroup;
  load: boolean = false;
  button: any = { name: 'Cadastrar', color: 'btn-primary' };
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: DataService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.getData();
    this.formUser = this.loadForm();
  }

  ngAfterViewInit(): void {
    this.dtOptions = { pagingType: 'full_numbers' };
    this.renderer.setProperty(this.accountUser.nativeElement, 'disabled', true);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getData() {
    this.items$ = this.http.getData('users/all').pipe(
      tap((res) =>  this.dtTrigger.next(res))
    );
    this.accounts$ = this.http.getData('accounts');
    this.items$.subscribe(res => console.log(res));
  }

  onSubmit() {
    if (this.formUser.invalid) return;
    this.load = true;
    if (this.formUser.value.id) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }

  onCreate() {
    this.http.postData('users/create', this.formUser.value)
    .pipe(delay(1000))
    .subscribe(
      (res: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Usuário adicionado com sucesso!',
          icon: 'success'
        });
        this.formUser.reset();
        this.getData();
        this.load = false;
      },
      (error) => this.load = false
    )
  }

  onUpdate() {
    this.http.postData('users/update', this.formUser.value)
    .pipe(delay(1000))
    .subscribe(
      (res: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Usuário adicionado com sucesso!',
          icon: 'success'
        });
        this.formUser.reset();
        this.getData();
        this.load = false;
      },
      (error) => this.load = false
    )
  }

  onEdit(user: any) {
    this.button = { name: 'Atualizar', color: 'btn-warning' };
    if (user.role === 'user') {
      this.renderer.setProperty(this.accountUser.nativeElement, 'disabled', false);
      this.accounts$.subscribe((res: any) => {
        const email: any = res.filter((row: any) => row._id === user.accountID[0])[0];
        this.formUser.patchValue({ accountUser: email.email });
      })
    }
    this.formUser.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.role
    })
  }

  onTrash(user: any) {
    Swal.fire({
      title: `Deseja apagar o usuário \n ${user.name}?`,
      text: "Você não será capaz de reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`users/delete/${user.id}`).subscribe(() => {
          this.getData();
          Swal.fire(
            'Apagado!',
            'O usuário foi apagado',
            'success'
          );
        })
      }
    })
  }

  onLock(ev: any) {
    const value = ev.target.value;
    if (value === 'user') {
      this.renderer.setProperty(this.accountUser.nativeElement, 'disabled', false);
    } else {
      this.renderer.setProperty(this.accountUser.nativeElement, 'disabled', true);
    }
  }

  onRegister(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/']);
    }
  }

  loadForm(): FormGroup<any> {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      accountUser: [''],
      id: ['']
    });
  }

}
