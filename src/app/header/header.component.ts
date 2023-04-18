import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  totalItemcount:number = 0
  constructor(private api:ApiService) {}

  ngOnInit(): void {
    this.api.cartItemscount.subscribe((result:any)=>{
      this.totalItemcount = result
    })
  }
  // assigning user entered values to brehav subj using next method
  search(event:any){
    this.api.searchTerm.next(event.target.value)
  }
}
