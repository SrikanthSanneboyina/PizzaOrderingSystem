import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PizzaOrderingService } from '../pizza-ordering.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
  styleUrls: ['./order-entry.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
})
export class OrderEntryComponent implements OnInit {
  orderForm: FormGroup;
  pizzaSizes = [
    { name: 'Small', price: 5 },
    { name: 'Medium', price: 7 },
    { name: 'Large', price: 8 },
    { name: 'Extra Large', price: 9 },
  ];
  toppingCategories = [
    { name: 'Veg Toppings', toppings: [
      { name: 'Tomatoes', price: 1.00 },
      { name: 'Onions', price: 0.50 },
      { name: 'Bell pepper', price: 1.00 },
      { name: 'Mushrooms', price: 1.20 },
      { name: 'Pineapple', price: 0.75 },
    ]},
    { name: 'Non Veg Toppings', toppings: [
      { name: 'Sausage', price: 1.00 },
      { name: 'Pepperoni', price: 2.00 },
      { name: 'Barbecue chicken', price: 3.00 },
    ]}
  ];
  offers = [
    { description: '1 Medium Pizza with 2 toppings = $5', size: 'Medium', toppingCount: 2 },
    { description: '2 Medium Pizzas with 4 toppings each = $9', size: 'Medium', toppingCount: 8 },
    { description: '1 Large with 4 toppings - 50% discount', size: 'Large', toppingCount: 4 }
  ];
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private pizzaService: PizzaOrderingService
  ) {
    this.orderForm = this.fb.group({});
   }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.orderForm = this.fb.group({});
    for (let size of this.pizzaSizes) {
      for (let category of this.toppingCategories) {
        for (let topping of category.toppings) {
          this.orderForm.addControl(this.getControlName(topping.name, size.name), this.fb.control(false));
        }
      }
    }
    for (let offer of this.offers) {
      for (let size of this.pizzaSizes) {
        this.orderForm.addControl(this.getOfferControlName(offer.description, size.name), this.fb.control(false));
      }
    }
    this.updateTotal();
  }

  getControlName(topping: string, size: string): string {
    return `${topping}_${size}`;
  }

  getOfferControlName(offer: string, size: string): string {
    return `${offer}_${size}`;
  }

  isOfferEligible(offer: any): boolean {
    const sizeToppings: { [key: string]: number } = {};
    for (let size of this.pizzaSizes) {
      sizeToppings[size.name] = 0;
      for (let category of this.toppingCategories) {
        for (let topping of category.toppings) {
          if (this.orderForm.get(this.getControlName(topping.name, size.name))?.value) {
            sizeToppings[size.name]++;
          }
        }
      }
    }
    return sizeToppings[offer.size] >= offer.toppingCount;
  }

  updateTotal() {
    const selectedToppings = [];
    for (let size of this.pizzaSizes) {
      for (let category of this.toppingCategories) {
        for (let topping of category.toppings) {
          if (this.orderForm.get(this.getControlName(topping.name, size.name))?.value) {
            selectedToppings.push({ topping: topping.name, size: size.name });
          }
        }
      }
    }
    const selectedOffers = this.offers.filter(offer => {
      return this.orderForm.get(this.getOfferControlName(offer.description, offer.size))?.value;
    }).map(offer => offer.description);
    this.total = this.pizzaService.calculateTotal(selectedToppings, selectedOffers);
  }

  onSubmit() {
    console.log("Order Submitted", this.orderForm.value);
  }
}

