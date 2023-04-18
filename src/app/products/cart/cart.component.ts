import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  cartItems: any = []
  cartTotalPrice: number = 0
  offerStatus: boolean = false
  offerTag: boolean = true
  finalPrice: number = 0
  paymentBtn: boolean = false
  makePaymentstatus: boolean = false
  showSuccess: boolean = false
  showCancel: boolean = false
  showError: boolean = false
  paypalStatus: boolean = false

  user: any = {}
  addressForm = this.fb.group({
    username: [''],
    addr1: [''],
    addr2: [''],
    state: ['']
  })
  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCart()
    this.initConfig()
  }

  getCart() {
    this.api.getAllCart().subscribe((result: any) => {
      console.log(result);
      this.cartItems = result
      let total = 0
      this.cartItems.forEach((item: any) => {
        total += item.grandTotal
        this.cartTotalPrice = Math.ceil(total)
        this.finalPrice = this.cartTotalPrice
      })

    },
      (result: any) => {
        console.log(result.error);

      })

  }

  // playAudio() {
  //   let audio = new Audio();
  //   audio.src = "../../../assets/mixkit-doorbell-single-press-333.wav";
  //   audio.load();
  //   audio.play();
  // }

  addCartNumber(product: any) {
    this.api.addtoCart(product).subscribe((result: any) => {
      // this.playAudio()
      this.getCart()
      // alert("Item quantity has been increased")
    },
      (result: any) => {
        alert(result.error)
      })
  }

  removeCartquantity(product: any) {
    this.api.removeCartquantity(product).subscribe((result: any) => {
      this.getCart()
      // to change cartcount
      this.api.cartCount()
      console.log(result.message);
    },
      (result: any) => {
        console.log(result.error);
      })

  }

  removeCartItem(id: any) {
    this.api.removeCartItem(id).subscribe((result: any) => {
      // here we have passed an object in controller with allItems and msg
      // so no seperate msg needed here.. all from backend
      // but here to update total price u may need to call getcart()
      // this.cartItems = result.allItems
      // above commenetd coz getcart will take care of it
      this.getCart()
      // to change cartcount
      this.api.cartCount()
      console.log(result.message);

      // get total price so 
      // alert("Item removed from cart")
    },
      (result: any) => {
        console.log(result.error);

      })
  }

  emptyCart() {
    this.api.getAllCart().subscribe((result: any) => {
      console.log(result);
      this.cartItems = result
      this.cartItems.forEach((item: any) => {
        let itemId = item.id
        this.removeCartItem(itemId)
      })
    })
  }

  viewOffers() {
    this.offerStatus = true
  }

  discount10() {
    this.finalPrice = Math.ceil(this.cartTotalPrice * 0.9)
    this.offerStatus = false
    this.offerTag = false
  }

  discount50() {
    this.finalPrice = Math.ceil(this.cartTotalPrice * 0.5)
    this.offerStatus = false
    this.offerTag = false
  }

  submit() {
    if (this.addressForm.valid) {
      this.paymentBtn = true
      this.user.username = this.addressForm.value.username
      this.user.addr1 = this.addressForm.value.addr1
      this.user.addr2 = this.addressForm.value.addr2
      this.user.state = this.addressForm.value.state
    }
    else {
      alert('Invalid form')
    }
  }

  makepayment() {
    this.makePaymentstatus = true
    this.paypalStatus = true
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        this.paypalStatus = false
        this.emptyCart()
        // this.paymentBtn = false

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;
        this.makePaymentstatus = false

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
        this.makePaymentstatus = false

      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      }
    };
  }

  modalClose() {
    this.addressForm.reset()
    this.paymentBtn = false
    this.makePaymentstatus = false
    this.showCancel = false
    this.showError = false
    this.showSuccess = false
  }
}
