import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems:any = []
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.getAllWishlistItems().subscribe((result:any)=>{
      console.log(result);
      this.wishlistItems = result
      
    },
    (result:any)=>{
      console.log(result.error);
      
    })
  }

  // remove wishlist items
  removeWishlistItem(id:any){
    this.api.removeWishlistItem(id).subscribe((result:any)=>{
      this.wishlistItems = result
    },
    (result:any)=>{
      console.log(result.error);
    })
  }

  addtoCart(product: any) {
    // add quantity to product object as it is not there
    // product['quantity']= 1
    Object.assign(product, { quantity: 1 })
    this.api.addtoCart(product).subscribe((result: any) => {
      this.api.cartCount()
      this.removeWishlistItem(product.id)
      alert(result)
    },
      (result: any) => {
        alert(result.error)
      })
  }

}
