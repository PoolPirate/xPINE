import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import Web3 from 'web3';

export class ETHValidators {
  static address(control: AbstractControl): ValidationErrors | null {
    if (Web3.utils.isAddress(control.value)) {
      return null;
    }

    return { "address" : "Invalid address" };
  }
}

