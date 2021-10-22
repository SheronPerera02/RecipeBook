import {NgModule} from '@angular/core';
import {AlertComponent} from './alert/alert.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {DropdownDirective} from './dropdown.directive';
import {HostContainerDirective} from './host-container.directive';
import {CommonModule} from '@angular/common';
import {LoggingService} from '../logging.service';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    HostContainerDirective
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    DropdownDirective,
    HostContainerDirective,
    LoadingSpinnerComponent
  ],
  providers: [LoggingService]
})
export class SharedModule {
}
