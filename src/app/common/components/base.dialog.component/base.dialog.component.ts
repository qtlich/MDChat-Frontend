import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthDataService}                                           from '../../../auth/shared/auth.data.service';
import {GlobalBusService}             from '../../services/global.bus.service';
import {BaseComponent}                from '../base.component/base.component';

@Component({
             selector:    'base-dialog-component',
             templateUrl: './base.dialog.component.html',
             styleUrls:   ['./base.dialog.component.css']
           })
export abstract class BaseDialogComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() displayDialog:boolean = false;
  @Input() modal:boolean = true;
  @Output() onClose:EventEmitter<boolean> = new EventEmitter<boolean>();
  protected constructor(serviceBus: GlobalBusService,
                        authService?: AuthDataService)
  {
    super(serviceBus, authService);
  }
  public onHideDialog():void
  {
    this.closeForm();
  }
  public closeForm(value:boolean = true):void
  {
    this.onCLearData();
    this.displayDialog = !value;
    this.onClose.emit(value);
  }
  protected onCLearData():void
  {}
}
