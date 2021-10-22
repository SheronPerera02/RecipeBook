import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @Input() appDropdown;

  openState = 'block';

  constructor(private renderer: Renderer2, private element: ElementRef) {
  }

  @HostListener('click') click(): void {
    this.renderer.setStyle(this.appDropdown, 'display', this.openState);
    this.openState = this.openState === 'block' ? 'none' : 'block';
  }

  @HostListener('document:click', ['$event']) documentClicked(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.renderer.setStyle(this.appDropdown, 'display', 'none');
      this.openState = 'block';
    }
  }
}
