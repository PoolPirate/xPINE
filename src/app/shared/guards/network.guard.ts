import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { WalletService } from "../../core/services/wallet.service";

@Injectable()
export class NetworkGuard implements CanActivate {
  requireSupportedNetwork: boolean = true;
  contractFailRedirect: string = "/setup/network";

  constructor(private walletService: WalletService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.data["requireSupportedNetwork"] != null) {
      this.requireSupportedNetwork = route.data["requireSupportedNetwork"];
    }
    if (route.data["networkFailRedirect"] != null) {
      this.contractFailRedirect = route.data["networkFailRedirect"];
    }

    if (!this.walletService.isConnected) {
      return true;
    }

    if (this.walletService.isSupportedNetwork != this.requireSupportedNetwork) {
      this.router.navigateByUrl(this.contractFailRedirect);
    }

    return this.walletService.isSupportedNetwork == this.requireSupportedNetwork;
  }
}
