import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import MetisMenu from 'metismenujs';

import { ADMIN, MENU } from './menu';
import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { Account } from '@core/interfacers/account.interface';
import { Observable } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;
  menuItems: MenuItem[] = [];
  menuManager: MenuItem[] = [];
  accounts$!: Observable<Account[]>;
  user!: any;
  status: boolean = true;
  constructor(
    private http: DataService,
    private storage: StorageMap,
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
        }
      }
    });
  }

  ngOnInit(): void {
    this.menuItems = MENU;
    this.menuItems.push({
      label: 'Sair do Sistema',
      icon: 'log-out',
      link: 'auth/logout'
    })
    this.getUser();
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addEventListener('change', () => {
      this.iconSidebar(desktopMedium);
    });
    this.iconSidebar(desktopMedium);
  }

  ngAfterViewInit() {
    new MetisMenu(this.sidebarMenu.nativeElement);
    this._activateMenuDropdown();
  }

  getData() {
    this.http.getData('accounts').subscribe((res: any) => {
      res.map((el: any) => {
        const title = { label: el.nameAccount, icon: 'database', subItems: [] };
        this.groupMenu(el._id, title);
      })
    })
  }

  getUser() {
    this.storage.get('oUser').subscribe((res: any) => {
      this.user = res;
      if (res && res.role !== 'user') {
        this.menuItems.push(...ADMIN);
        this.getData();
      } else {
        this.menuItems.push({
          label: 'Contas',
          isTitle: true
        })
        this.groupUserMenu(res);
      }
    })
  }

  groupUserMenu(data: any) {
    if (data) {
      const ws: any = data.group;
      const menu: MenuItem = { label: data.accountID[0].nameAccount, icon: 'database', subItems: [] }
      ws.forEach((el: any): void => {
        if (el.length > 0) {
          menu.subItems.push({ label: el[0].name, link: `/workspace/${el[0].groupIdPB}` });

        } else {
          menu.subItems.push({ label: el.name, link: `/workspace/${el.groupIdPB}` });
        }
      });
      this.menuItems.push(menu);
    }
  }

  groupMenu(id: string, menu: any): void {
    this.http.getData(`groups/all/${id}`).subscribe(({ groups }: any): void => {
      groups.map((el: any): void => {
        menu.subItems.push({ label: el.name, link: `/workspace/${el.groupIdPB}` });
      })
      this.menuItems.push(menu);
    })
    console.log(this.menuItems);
  }


  toggleSidebar(e: Event) {
    this.status = !this.status;
    this.sidebarToggler.nativeElement.classList.toggle('active');
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }

  toggleSettingsSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }

  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')){
      this.document.body.classList.add("open-sidebar-folded");
    }
  }

  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')){
      this.document.body.classList.remove("open-sidebar-folded");
    }
  }

  iconSidebar(mq: MediaQueryList) {
    if (mq.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }

  onSidebarThemeChange(event: Event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add((<HTMLInputElement>event.target).value);
    this.document.body.classList.remove('settings-open');
  }

  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }

  resetMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref');
    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.remove('mm-show');
        }
        const parent3El = parent2El?.parentElement;
        if (parent3El) {
          parent3El.classList.remove('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
            if (firstAnchor) {
              firstAnchor.classList.remove('mm-active');
            }
          }
          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.remove('mm-show');
            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.remove('mm-active');
            }
          }
        }
      }
    }
  };


  /**
   * Toggles the menu items
   */
  activateMenuItems() {

    const links: any = document.getElementsByClassName('nav-link-ref');

    let menuItemEl = null;

    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
        if (window.location.pathname === links[i]['pathname']) {

            menuItemEl = links[i];

            break;
        }
    }

    if (menuItemEl) {
        menuItemEl.classList.add('mm-active');
        const parentEl = menuItemEl.parentElement;

        if (parentEl) {
            parentEl.classList.add('mm-active');

            const parent2El = parentEl.parentElement;
            if (parent2El) {
                parent2El.classList.add('mm-show');
            }

            const parent3El = parent2El.parentElement;
            if (parent3El) {
                parent3El.classList.add('mm-active');

                if (parent3El.classList.contains('side-nav-item')) {
                    const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

                    if (firstAnchor) {
                        firstAnchor.classList.add('mm-active');
                    }
                }

                const parent4El = parent3El.parentElement;
                if (parent4El) {
                    parent4El.classList.add('mm-show');

                    const parent5El = parent4El.parentElement;
                    if (parent5El) {
                        parent5El.classList.add('mm-active');
                    }
                }
            }
        }
    }
  };
}
