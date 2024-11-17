const Furniture = require('../models/Furniture');
const Wood = require('../models/Wood');

exports.calculateTotalPrice = async (items) => {
  let total = 0;
  
  for (const item of items) {
    const furniture = await Furniture.findById(item.furniture);
    const wood = await Wood.findById(item.woodType);
    
    const itemPrice = furniture.basePrice * wood.priceMultiplier * item.quantity;
    total += itemPrice;
    item.price = itemPrice;
  }
  
  return total;
};