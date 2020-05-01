import { Directive, HostListener,ElementRef, Renderer2, HostBinding, Input, OnInit} from '@angular/core';
@Directive({
  selector: '[cftHighlight]'
})
export class HighlightDirective implements OnInit{

  @HostListener('mouseenter') OnMouseOver(){
    this.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave') OnMouseLeave(){
    this.backgroundColor = this.defaultColor
  }

  @HostBinding('style.backgroundColor') backgroundColor : string 

  @Input() defaultColor: string = 'white';

  // @Input() highlightColor: string = 'yellow';

  @Input('cftHighlight') highlightColor: string = 'yellow';

  constructor() { }

  ngOnInit(): void {
    this.backgroundColor = this.defaultColor;
  }

}
