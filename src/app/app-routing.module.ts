import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePage} from './core/pages/home/home.page';
import {WalletGuard} from './shared/guards/wallet.guard';
import { NetworkGuard } from './shared/guards/network.guard';
import { SetupPage } from './core/pages/setup/setup.page';
import { NetworkPage } from './core/pages/network/network.page';

export const routes: Routes = [
  {
    path: "", pathMatch: "full", component: HomePage,
    canActivate: [WalletGuard, NetworkGuard], data: {
      requireWallet: true, walletFailRedirect: "connect",
      requireSupportedNetwork: true, networkFailRedirect: "network",
    }
  },
  {
    path: "connect", component: SetupPage,
    canActivate: [WalletGuard], data: {
      requireWallet: false, walletFailRedirect: "",
    }
  },
  {
    path: "network", component: NetworkPage,
    canActivate: [WalletGuard, NetworkGuard], data: {
      requireWallet: true, walletFailRedirect: "connect",
      requireSupportedNetwork: false, networkFailRedirect: "",
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
