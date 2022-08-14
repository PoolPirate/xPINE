import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs";
import { IERC20, XPINE } from "../../../../../types/web3-v1-contracts";
import { BaseComponent } from "../../../shared/component/base.component";
import { WalletService } from "../../services/wallet.service";

import xPINEAbi from "../../../../../app/src/contracts/xPINE.json"
import iERC20Abi from "../../../../../app/src/contracts/IERC20.json"
import { AbstractControl, FormControl, ValidationErrors, Validators } from "@angular/forms";

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage extends BaseComponent {
  private xPINE: XPINE;
  private usdc: IERC20;

  approvedBalance: number | null = null;
  usdcBalance: number | null = null;

  xPineBalance: number | null = null;
  decimals: number = 6;

  get adjustedApprovedBalance() {
    if (this.approvedBalance == null) {
      return null;
    }

    return this.approvedBalance / Math.pow(10, this.decimals);
  }

  get adjustedUsdcBalance() {
    if (this.usdcBalance == null) {
      return null;
    }

    return this.usdcBalance / Math.pow(10, this.decimals);
  }

  get adjustedxPineBalance() {
    if (this.xPineBalance == null) {
      return null;
    }

    return this.xPineBalance / Math.pow(10, this.decimals);
  }

  get maxMint() {
    if (this.adjustedApprovedBalance == null || this.adjustedUsdcBalance == null) {
      return 0;
    }
    return Math.min(this.adjustedApprovedBalance, this.adjustedUsdcBalance);
  }
  get maxBurn() {
    if (this.adjustedxPineBalance == null) {
      return 0;
    }
    return this.adjustedxPineBalance;
  }

  mintInput: FormControl;
  burnInput: FormControl;

  validateMaxMint(control: AbstractControl, maxMint: number): ValidationErrors | null {
    if (control.value > maxMint) {
      return { "max": "Must be lower than your USDC balance : " + maxMint };
    }
    return null;
  }
  validateMaxBurn(control: AbstractControl, maxBurn: number): ValidationErrors | null {
    if (control.value > maxBurn) {
      return { "max": "Must be lower than your xPINE balance " + maxBurn };
    }
    return null;
  }

  constructor(private walletService: WalletService, private router: Router) {
    super();
    walletService.onWalletChanged.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (!walletService.isConnected) {
          router.navigateByUrl("connect");
        }
        else {
          if (this.xPINE == null && this.usdc == null) {
            return;
          }

          this.xPINE.defaultAccount = this.walletService.currentAccount;
          this.xPINE.options.from = this.walletService.currentAccount;
          this.usdc.defaultAccount = this.walletService.currentAccount;
          this.usdc.options.from = this.walletService.currentAccount;

          this.reset();
          this.loadDefaults();
        }
      });

    walletService.onChainIdChanged.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (walletService.isConnected && !walletService.isSupportedNetwork) {
          this.router.navigateByUrl("network");
        }
      });

    this.xPINE = new this.walletService.provider.eth.Contract(xPINEAbi.abi as any, "0x855493CdD77Bb77b0109f370e48618888a0C1DC4", {
      from: this.walletService.currentAccount
    }) as any as XPINE;
    this.usdc = new this.walletService.provider.eth.Contract(iERC20Abi.abi as any, "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", {
      from: this.walletService.currentAccount
    }) as any as IERC20;

    this.mintInput = new FormControl(0, [Validators.min(0.0001), x => this.validateMaxMint(x, this.maxMint)]);
    this.burnInput = new FormControl(0, [Validators.min(0.0001), x => this.validateMaxBurn(x, this.maxBurn)]);

    this.reset();
    this.loadDefaults(); //Unawaited on purpose
  }

  private reset() {
    this.approvedBalance = null;
    this.usdcBalance = null;
    this.xPineBalance = null;
  }
  private async loadDefaults() {
    this.xPineBalance = Number.parseInt(await this.xPINE.methods.balanceOf(this.walletService.currentAccount).call());
    this.approvedBalance = Number.parseInt(await this.usdc.methods.allowance(this.walletService.currentAccount, "0x855493CdD77Bb77b0109f370e48618888a0C1DC4").call());
    this.usdcBalance = Number.parseInt(await this.usdc.methods.balanceOf(this.walletService.currentAccount).call());
  }

  public async approve() {
    await this.usdc.methods.approve("0x855493CdD77Bb77b0109f370e48618888a0C1DC4", 100000 * 100000000) //10 M
      .send();
  }

  public async mint() {
    if (this.mintInput.invalid) {
      this.mintInput.markAllAsTouched();
      this.mintInput.setValue(0);
      return;
    }
    await this.xPINE.methods.deposit(this.mintInput.value * Math.pow(10, this.decimals))
      .send({ gas: undefined, gasPrice: undefined, maxFeePerGas: undefined, maxPriorityFeePerGas: undefined });
  }

  public async burn() {
    if (this.burnInput.invalid) {
      this.burnInput.markAllAsTouched();
      this.burnInput.setValue(0);
      return;
    }
    await this.xPINE.methods.withdraw(this.burnInput.value * Math.pow(10, this.decimals))
      .send({ gas: undefined, gasPrice: undefined, maxFeePerGas: undefined, maxPriorityFeePerGas: undefined });
  }
}
