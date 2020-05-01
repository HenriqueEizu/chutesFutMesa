import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cft-exemplos-pipe',
  templateUrl: './exemplos-pipe.component.html',
  styleUrls: ['./exemplos-pipe.component.css']
})
export class ExemplosPipeComponent implements OnInit {

  titulo : string = "HenrIque Eizu Morais"
  data : Date = new Date();
  preco : string = "2222,23"

  constructor() { }

  ngOnInit(): void {
  }

}
