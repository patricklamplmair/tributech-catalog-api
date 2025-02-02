import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '@tributech/core';
import { TwinInstanceTableComponent } from './twin-instance-table.component';

@NgModule({
  imports: [CommonModule, TableModule],
  declarations: [TwinInstanceTableComponent],
  exports: [TwinInstanceTableComponent],
})
export class TwinInstanceTableModule {}
