import { Injectable } from "@angular/core";
import { Web3ModalService } from "@mindsorg/web3modal-angular";
import { provider } from 'web3-core';
import Web3 from "web3";
import { Subject } from "rxjs";
import { shareReplay } from "rxjs";
import { NgZone } from "@angular/core";
import { NonPayableTx } from "../../../../types/web3-v1-contracts/types";

@Injectable()
export class WalletService {
  private connectedChain: number | null = null;
  private web3: Web3 | null = null;

  private walletSubject = new Subject<void>();
  public onWalletChanged = this.walletSubject.asObservable().pipe(shareReplay(1));

  private chainIdSubjet = new Subject<void>();
  public onChainIdChanged = this.chainIdSubjet.asObservable().pipe(shareReplay(1));

  constructor(private modalService: Web3ModalService, private ngZone: NgZone) {
    const providerOptions = {
      //Add support for more wallets here
    };

    const modalServiceConfiguration = {
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
      disableInjectedProvider: false
    };

    this.modalService.setConfiguration(modalServiceConfiguration);
  }

  startConnection() {
    console.info("Opening wallet dialog...");
    this.modalService.open()
      .then(async web3Provider => {
        if (web3Provider == null) {
          console.warn("Connecting wallet failed!");
          this.disconnect();
          return;
        }

        await this.connect(web3Provider as provider);
      })
      .catch(e => {
        this.disconnect();
        console.error(e);
        console.warn("Connecting wallet failed!");
      })
  }

  async reconnect() {
    if (localStorage.getItem("isWalletConnected") != "true") {
      return;
    }

    await this.reloadConnection();
  }

  async reloadConnection() {
    const provider = ('ethereum' in window) ? (window as any).ethereum : Web3.givenProvider;

    if (provider == null) {
      return;
    }

    console.debug("Restoring Wallet Connection");
    await this.connect(provider);
  }

  private async connect(provider: provider) {
    this.web3 = new Web3(provider);

    await this.reloadAccountInfo();
    import("../../../polyfills/polyfillsjs").then(randomFile => {
      randomFile.HookAccountsChanged(() => this.ngZone.run(() => this.reloadAccountInfo()));
    })
  }

  private async reloadAccountInfo() {
    if (this.web3 == null) {
      return;
    }

    const provider = this.web3!;
    const accounts = await provider.eth.getAccounts();

    if (accounts.length == 0) {
      this.disconnect();
      return;
    }

    const account = accounts[0];
    const chainId = await provider.eth.net.getId();

    const changedAccount = account != provider.eth.defaultAccount;
    const changedChainid = chainId != this.connectedChain;

    provider.eth.defaultAccount = account;
    this.connectedChain = chainId;

    if (changedAccount) {
      console.debug("Connected to address " + account);
      this.walletSubject.next();
    }
    if (changedChainid) {
      console.debug("Connected to chain " + chainId);
      this.chainIdSubjet.next();
    }

    localStorage.setItem("isWalletConnected", "true")
  }

  get isConnected() {
    return this.web3 != null &&
      this.web3.eth.defaultAccount != null &&
      this.connectedChain != null;
  }

  get currentAccount() {
    if (!this.isConnected) {
      throw new DOMException("No wallet connected!");
    }

    return this.provider.eth.defaultAccount!;
  }

  get isSupportedNetwork() {
    return this.isConnected && this.chainId == 137;
  }
  
  get provider(): Web3 {
    if (!this.isConnected) {
      throw new DOMException("No wallet connected!");
    }

    return this.web3!;
  }

  get chainId() {
    if (!this.isConnected) {
      throw new DOMException("No wallet connected!");
    }

    return this.connectedChain!;
  }

  get txOptions(): NonPayableTx {
    if (!this.isConnected) {
      throw new DOMException("No wallet connected!");
    }

    return { from: this.currentAccount, maxFeePerGas: null!, maxPriorityFeePerGas: null! };
  }

  disconnect() {
    if (this.isConnected) {
      console.debug("Disconnecting from " + this.currentAccount);
    }

    this.web3 = null;
    this.connectedChain = null;
    this.walletSubject.next();
    this.chainIdSubjet.next();
    localStorage.setItem("isWalletConnected", "false")
  }
}
