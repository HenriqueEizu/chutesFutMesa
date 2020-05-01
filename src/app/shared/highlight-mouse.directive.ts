import { Directive, HostListener,ElementRef, Renderer2, HostBinding} from '@angular/core';

@Directive({
  selector: '[cftHighlightMouse]'
})
export class HighlightMouseDirective {

  @HostListener('mouseenter') OnMouseOver(){
    // console.log("jjjjjjjjjjjjjjjj");
    // this._renderer.setStyle(this._elementRef.nativeElement,'background-color','yellow'); --solução 1
    this.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave') OnMouseLeave(){
    // this._renderer.setStyle(this._elementRef.nativeElement,'background-color','white'); --solução 1
    this.backgroundColor = 'white';
  }

  // @HostBinding('style.backgroundColor') backgroundColor : string --solução 2

  @HostBinding('style.backgroundColor') get setColor(){
    return this.backgroundColor;
  }

  private backgroundColor: string; //solução 3

  // constructor(private _elementRef: ElementRef, --solução 1
  //             private _renderer : Renderer2) { } --solução 1

}
