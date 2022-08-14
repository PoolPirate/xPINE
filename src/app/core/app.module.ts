import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';
import { AppRoutingModule } from '../app-routing.module';
import { WalletService } from './services/wallet.service';
import { WalletConnectorComponent } from './components/wallet-connector/wallet-connector.component';
import { SharedModule } from '../shared/shared.module';
import { HomePage } from './pages/home/home.page';
import { DialogService } from './services/dialog.service';
import { SetupPage } from './pages/setup/setup.page';
import { NetworkPage } from './pages/network/network.page';

@NgModule({
  declarations: [
    WalletConnectorComponent,
    AppComponent,
    HomePage,
    SetupPage,
    NetworkPage
  ],
  imports: [
    BrowserModule,
    SharedModule,

    AppRoutingModule,
    BrowserAnimationsModule,

    Web3ModalModule
  ],
  providers: [
    {
      provide: Web3ModalService,
      useFactory: () => new Web3ModalService(undefined)
    },
    WalletService,
    DialogService,

    {
      provide: APP_INITIALIZER,
      deps: [WalletService],
      useFactory: (walletService: WalletService) =>
        async () => {
          await walletService.reconnect();
        },
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
