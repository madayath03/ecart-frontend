import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // create a var as behaviour subject for getting live values from frm searchbar in another compnt

  searchTerm = new BehaviorSubject('')
  // to get count of t=items in cart
  cartItemscount = new BehaviorSubject(0)
  disabledProducts = new BehaviorSubject({})
  // disabledProducts:any = {}
  cartItems:any = []
  id = new BehaviorSubject('')

  // base_url = 'http://localhost:3000'
// deployed node server = https://ecart-xczy.onrender.com
  base_url = 'https://ecart-xczy.onrender.com'
  constructor(private http:HttpClient) {
    this.cartCount()
   }

  // get all products api
  getAllProducts(){
    // call api
    return this.http.get(`${this.base_url}/products/get-all-products`)
  }

  viewProduct(id:any){
    return this.http.get(`${this.base_url}/products/${id}`)
  }

  // for wishlist
  addtoWishlist(product:any){
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image
    }
    return this.http.post(`${this.base_url}/products/add-to-wishlist`,body)
  }

  // for getting all wioshlost items
  getAllWishlistItems(){
    return this.http.get(`${this.base_url}/wishlist/get-all-items`)
  }

  removeWishlistItem(id:any){
    return this.http.delete(`${this.base_url}/wishlist/remove-items/${id}`)
  }

  removeCartquantity(product:any){
    const body = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: product.quantity
    }
    // api call
    return this.http.post(`${this.base_url}/cart/remove-quantity`, body)
  }

  addtoCart(product:any){
    const body = {
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:product.quantity
    }
    // api call
    return this.http.post(`${this.base_url}/products/add-to-cart`, body)
  }

  getAllCart(){
    return this.http.get(`${this.base_url}/cart/get-all-items`)
  }

  // get cart count
  cartCount(){
    this.getAllCart().subscribe((result:any)=>{
      // .next kyunki ye behaviour subject he
      this.cartItemscount.next(result.length)
    })
  }

  // remove cart
  removeCartItem(id: any) {
    return this.http.delete(`${this.base_url}/cart/remove-items/${id}`)
  }

}
