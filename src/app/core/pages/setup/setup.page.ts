import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs";
import { BaseComponent } from "../../../shared/component/base.component";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: 'setup-page',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss']
})
export class SetupPage extends BaseComponent {
  constructor(walletService: WalletService, router: Router) {
    super();
    walletService.onWalletChanged.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (walletService.isConnected) {
          router.navigateByUrl("");
        }
      });
  }
}
