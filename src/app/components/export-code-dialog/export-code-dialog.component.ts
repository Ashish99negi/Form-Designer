import { Component, Inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-export-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    ClipboardModule,
    MatIconModule,
    MatTooltipModule,
    JsonPipe
  ],
  templateUrl: './export-code-dialog.component.html',
  styleUrls: ['./export-code-dialog.component.scss']
})
export class ExportCodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { componentCode: string, templateCode: string },
    private _snackBar: MatSnackBar
  ) { }

  onCopy(): void {
    this._snackBar.open('Code copied to clipboard!', 'Dismiss', {
      duration: 3000,
    });
  }
}
