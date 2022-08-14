import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  async open<T>(component: ComponentType<T>) {
    if (this.hasDialog(component)) {
      return;
    }

    return this.dialog.open(component)
      .afterClosed()
      .toPromise();
  }

  private hasDialog<T>(component: ComponentType<T>): boolean {
    return this.dialog.openDialogs
      .some(x => x.componentInstance.constructor.name == component.name)
  }
  private closeDialog<T>(component: ComponentType<T>) {
    const dialog = this.dialog.openDialogs.find(x => x.componentInstance.constructor.name == component.name);
    dialog?.close();
  }
}
