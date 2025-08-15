import { Component, DOCUMENT, Inject, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {
  private auth: AuthService = inject(AuthService);
  private doc: Document = inject(DOCUMENT);

  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage = sessionStorage;

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe(
      (authenticated: boolean) => (this.isAuthenticated = authenticated)
    );
    this.auth.user$.subscribe((user) => {
      this.userEmail = user?.email;
      this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}
