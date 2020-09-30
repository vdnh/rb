import { Component, OnInit } from '@angular/core';
import { Terminal } from 'src/model/model.terminal';

@Component({
  selector: 'app-new-terminal',
  templateUrl: './new-terminal.component.html',
  styleUrls: ['./new-terminal.component.css']
})
export class NewTerminalComponent implements OnInit {

  constructor() { }
  
  terminal:Terminal=new Terminal();

  ngOnInit(): void {
    this.terminal.id
  }

}
