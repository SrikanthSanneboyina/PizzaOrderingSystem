import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})  
export class PizzaOrderingService {

  getOffers() {
    return [
      { description: '1 Medium Pizza with 2 toppings = $5' },
      { description: '2 Medium Pizzas with 4 toppings each = $9' },
      { description: '1 Large with 4 toppings - 50% discount' }
    ];
  }

  calculateTotal(toppings: { topping: string, size: string}[], selectedOffers: string[]): number {
    let total = 0;
    const toppingCount: { [key: string]: number } = {};
    const sizeCount: { [key: string]: number } = {};

    const uniqueSizes = Array.from(new Set(toppings.map(t => t.size)));

    const sizeFlags: SizeFlag[] = uniqueSizes.map(size => ({
      flag: false,
      size: size
    }));

    toppings.forEach(topping => {
      const sizePrice = this.getSizePrice(topping.size);
      const toppingPrice = this.getToppingPrice(topping.topping);

      sizeFlags.forEach(sizeFlag => {
        if (!sizeFlag.flag && topping.size == sizeFlag.size) {
          total += sizePrice;
          sizeFlag.flag = true;
        }});

      if (!sizeCount[topping.size]) {
        sizeCount[topping.size] = 0;
      }
      sizeCount[topping.size]++;

      if (!toppingCount[topping.topping]) {
        toppingCount[topping.topping] = 0;
      }
      toppingCount[topping.topping]++;

      total += toppingPrice;
    });

    selectedOffers.forEach(offer => {
      total = this.applyOffer(total, offer, sizeCount, toppingCount);
    });

    return total;
  }

  getSizePrice(size: string): number {
    switch (size) {
      case 'Small': return 5;
      case 'Medium': return 7;
      case 'Large': return 8;
      case 'Extra Large': return 9;
      default: return 0;
    }
  }

  getToppingPrice(topping: string): number {
    switch (topping) {
      case 'Tomatoes': return 1.00;
      case 'Onions': return 0.50;
      case 'Bell pepper': return 1.00;
      case 'Mushrooms': return 1.20;
      case 'Pineapple': return 0.75;
      case 'Sausage': return 1.00;
      case 'Pepperoni': return 2.00;
      case 'Barbecue chicken': return 3.00;
      default: return 0;
    }
  }

  applyOffer(total: number, offer: string, sizeCount: any, toppingCount: any): number {
    switch (offer) {
      case '1 Medium Pizza with 2 toppings = $5':
        if (sizeCount['Medium'] >= 1 && Object.keys(toppingCount).length >= 2) {
          return 5;
        }
        break;
      case '2 Medium Pizzas with 4 toppings each = $9':
        if (sizeCount['Medium'] >= 2 && Object.keys(toppingCount).length >= 8) {
          return 9;
        }
        break;
      case '1 Large with 4 toppings - 50% discount':
        if (sizeCount['Large'] >= 1 && Object.keys(toppingCount).length >= 4) {
          return total * 0.5;
        }
        break;
      default:
        return total;
    }
    return total;
  }

}

interface SizeFlag {
  flag: boolean;
  size: string;
}
