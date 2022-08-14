import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { WalletService } from "../../core/services/wallet.service";

@Injectable()
export class WalletGuard implements CanActivate {
  requireWallet: boolean = true;
  walletFailRedirect: string = "/setup/wallet";

  constructor(private walletService: WalletService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (route.data["requireWallet"] != null) {
      this.requireWallet = route.data["requireWallet"];
    }
    if (route.data["walletFailRedirect"] != null) {
      this.walletFailRedirect = route.data["walletFailRedirect"];
    }

    if (this.walletService.isConnected != this.requireWallet) {
      this.router.navigateByUrl(this.walletFailRedirect);
    }

    return this.walletService.isConnected == this.requireWallet;
  }
}
