import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  productId: string = ""
  product: any = {}
  starRatingContainer:any = ''
  reviewContainer:any = ''
  constructor(private viewActivatedroute: ActivatedRoute, private api: ApiService) {

  }
  ngOnInit(): void {
    // get path parameters from compt route
    this.viewActivatedroute.params.subscribe((data: any) => {
      console.log(data.id);
      this.productId = data.id
    })
    // api call to get product detail
    this.api.viewProduct(this.productId).subscribe((result: any) => {
      // for 200
      console.log(result.rating);
      this.product = result
      // Here's how you can use the Typescript function to generate the star rating HTML
      const ratingValue = this.product.rating['rate'];
      const starRatingHtml = this.generateStarRating(ratingValue);
      const reviewCount:any = this.product.rating['count']
      // Now insert the star rating HTML into the DOM
      this.starRatingContainer = document.querySelector('.star-rating');
      this.starRatingContainer.innerHTML = starRatingHtml;
      // inserting how many people reviewed
      this.reviewContainer = document.querySelector('.review-count');
      this.reviewContainer.innerHTML = reviewCount

    },
      (result: any) => {
        // for 400 
        console.log(result.error);

      })
  }

  generateStarRating(rating: number): string {
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const halfStars = Math.round(rating - fullStars);
  const emptyStars = maxRating - fullStars - halfStars;

  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }

  for (let i = 0; i < halfStars; i++) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }

  return starsHtml;
}


addtoWishlist(product: any) {
  this.api.addtoWishlist(product).subscribe((result: any) => {
    alert(result)
  },
    (result: any) => {
      alert(result.error)
    })
}

addtoCart(product: any) {
  // add quantity to product object as it is not there
  // product['quantity']= 1
  Object.assign(product, { quantity: 1 })
  this.api.addtoCart(product).subscribe((result: any) => {
    this.api.cartCount()
    alert(result)
  },
    (result: any) => {
      alert(result.error)
    })
}

}
