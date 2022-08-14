import { Component } from "@angular/core";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: 'wallet-connector',
  templateUrl: './wallet-connector.component.html',
  styleUrls: ['./wallet-connector.component.scss']
})
export class WalletConnectorComponent {
  constructor(public walletService: WalletService) { }

  connect() {
    this.walletService.startConnection();
  }

  disconnect() {
    this.walletService.disconnect();
  }
}
