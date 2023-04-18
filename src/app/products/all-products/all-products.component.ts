import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allProducts: any = []
  searchkey: string = ''
  id: any = ''
  cartItems: any = []
  continueAdd: boolean = false
  wishlistItems:any = []

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {

    // to get all products
    this.getAllproducts()

    // get live values of search from behav subj so subscribe it here
    this.api.searchTerm.subscribe((result: any) => {
      this.searchkey = result
    })

    // getting live id for repeated cart order
    this.api.id.subscribe((result:any)=>{
      this.id = result
    })
  }

  getAllproducts() {
    this.api.getAllProducts().subscribe((result: any) => {
      console.log(result);
      this.allProducts = result
      this.allProducts.forEach((product: any) => {
        Object.assign(product, { inCart: 0 })
        this.api.getAllCart().subscribe((output: any) => {
          this.cartItems = output
          this.cartItems.forEach((item: any) => {
            if (product.id == item.id) {
              product.inCart = 1
            }
          })
        })
        Object.assign(product, { inWishlist: 0 })
        this.api.getAllWishlistItems().subscribe((wish:any)=>{
          this.wishlistItems = wish
          this.wishlistItems.forEach((things:any)=>{
            if (product.id == things.id) {
              product.inWishlist = 1
            }
          })
        })
      })
    },
      (result: any) => {
        console.log(result.error);
      })
  }

  route(productId: any) {
    this.router.navigateByUrl(`products/view/${productId}`)
  }

  addtoWishlist(product: any) {
    this.api.addtoWishlist(product).subscribe((result: any) => {
      // alert(result)
      this.getAllproducts()
    },
      (result: any) => {
        console.log(result.error);
      })
  }

  addtoCart(product: any) {
    // add quantity to product object as it is not there
    // product['quantity']= 1
    Object.assign(product, { quantity: 1 })
    this.api.addtoCart(product).subscribe((result: any) => {
      this.api.cartCount()
      this.getAllproducts()
      // alert(result)
      console.log(result);

    },
      (result: any) => {
        alert(result.error)
      })
  }



  // continueaddtoCart(product: any) {
  //   this.api.getAllCart().subscribe((result: any) => {
  //     this.cartItems = result
  //     this.cartItems.forEach((item: any) => {
  //       if (product.id == item.id) {
  //         this.api.id.next(product.id)
  //       }
  //     })
  //   })
  // }

  // yestoCart(id:any) {
  //   this.api.viewProduct(id).subscribe((result:any)=>{
  //     this.addtoCart(result)
  //   })
  // }

}
