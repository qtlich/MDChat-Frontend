import {ViewChild}   from '@angular/core';
import {Table}       from 'primeng-lts';
import {BaseClone}   from './base.clone';
import {TableColumn} from './table.columns.model';

export abstract class BaseTableColumn extends BaseClone
{
  public cols: TableColumn[] = [];
  @ViewChild('dt') dataTable: Table;
  public selectedColumns: TableColumn[] = this.cols;
  public useTableFilter: boolean = true;

  protected constructor()
  {
    super();
  }

  protected setTableColumns(columns: TableColumn[]): void
  {
    this.cols = [...columns];
    this.selectedColumns = this.cols;
  }
}
