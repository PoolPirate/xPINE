import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../shared/component/base.component";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: 'network-page',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss']
})
export class NetworkPage extends BaseComponent {
  constructor(walletService: WalletService, router: Router) {
    super();
    walletService.onChainIdChanged.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (walletService.isSupportedNetwork) {
          router.navigateByUrl("");
        }
      });
  }
}
