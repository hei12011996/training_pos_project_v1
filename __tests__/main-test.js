'use strict';

const main = require('../main/main');
const fixtures = require('../main/fixtures');
const parseQuantityFromBarcode = main.parseQuantityFromBarcode;
const parseBoughtItemsCodeListToCodeAndQuantity = main.parseBoughtItemsCodeListToCodeAndQuantity;
const getBoughtItemsListByBarcodes = main.getBoughtItemsListByBarcodes;
const getSubTotalWithBuyTwoGetOneFree = main.getSubTotalWithBuyTwoGetOneFree;
const isPromotedItem = main.isPromotedItem;
const getSubTotalByPromotions = main.getSubTotalByPromotions;
const constructQuantityString = main.constructQuantityString;
const getReceiptInfoWithPromotion = main.getReceiptInfoWithPromotion;
const getReceiptByReceiptInfo = main.getReceiptByReceiptInfo;
const loadAllItems = fixtures.loadAllItems;
const loadPromotions = fixtures.loadPromotions;

describe('parseQuantityFromBarcode', () => {
  let standardBarcode = 'ITEM000000';
  let weightedBarcode = 'ITEM000000-2';
  let weightedDecimalBarcode = 'ITEM000001-22.7';

  it ('Given a standard barcode when pass to parseQuantityFromBarcode(), then return quantity as 1.', () => {
    expect(parseQuantityFromBarcode(standardBarcode)).toBe(1);
  });

  it ('Given a weighted barcode when pass to parseQuantityFromBarcode(), then return quantity as the proper weight.', () => {
    expect(parseQuantityFromBarcode(weightedBarcode)).toBe(2);
  });

  it ('Given a weighted decimal barcode when pass to parseQuantityFromBarcode(), then return quantity as the proper weight.', () => {
    expect(parseQuantityFromBarcode(weightedDecimalBarcode)).toBe(22.7);
  });
});

describe('parseBoughtItemsCodeListToCodeAndQuantity', () => {
  let input_1 = ['ITEM000000', 'ITEM000000', 'ITEM000001'];
  let input_2 = ['ITEM000000', 'ITEM000000-5.3', 'ITEM000001-2.0', 'ITEM000003-2.7'];

  it ('Given a barcode list as [\'ITEM000000\', \'ITEM000000\', \'ITEM000001\'] when pass to parseBoughtItemsCodeListToCodeAndQuantity(), then should return a map containing corresponding quantities of each item.', () => {
    expect(parseBoughtItemsCodeListToCodeAndQuantity(input_1)).toEqual({'ITEM000000': 2, 'ITEM000001': 1});
  });

  it ('Given a barcode list as [\'ITEM000000\', \'ITEITEM000000-5.3\', \'ITEM000001-2.0\', \'ITEM000003-2.7\'] when pass to parseBoughtItemsCodeListToCodeAndQuantity(), then should return a map containing corresponding quantities of each item.', () => {
    expect(parseBoughtItemsCodeListToCodeAndQuantity(input_2)).toEqual({'ITEM000000': 6.3, 'ITEM000001': 2, 'ITEM000003': 2.7});
  });
});

describe('getBoughtItemsListByBarcodes', () => {
  let input_1 = ['ITEM000000'];
  let input_2 = [
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000002',
                  'ITEM000002',
                  'ITEM000002-1.3',
                  'ITEM000005-2',
                ];

  let expected_output_1 = [
                            {
                              item: {
                                      barcode: 'ITEM000000',
                                      name: 'Coca-Cola',
                                      unit: 'bottle',
                                      price: 3.00
                                    },
                              quantity: 1
                            }
                          ];

  let expected_output_2 = [
                            {
                              item: {
                                      barcode: 'ITEM000001',
                                      name: 'Sprite',
                                      unit: 'bottle',
                                      price: 3.00
                                    },
                              quantity: 5
                            },
                            {
                              item: {
                                      barcode: 'ITEM000002',
                                      name: 'Apple',
                                      unit: 'kg',
                                      price: 5.50
                                    },
                              quantity: 3.3
                            },
                            {
                              item: {
                                      barcode: 'ITEM000005',
                                      name: 'Noodles',
                                      unit: 'bag',
                                      price: 4.50
                                    },
                              quantity: 2
                            },
                          ];

  it ('Given a barcode of item when pass to getBoughtItemsListByBarcodes(), then return the item info with quantity as 1', () => {
    expect(getBoughtItemsListByBarcodes(input_1, loadAllItems())).toEqual(expected_output_1);
  });

  it ('Given a barcode list of items when pass to getBoughtItemsListByBarcodes(), then return those item info with corresponding quantity', () => {
    expect(getBoughtItemsListByBarcodes(input_2, loadAllItems())).toEqual(expected_output_2);
  });
});

describe('getSubTotalWithBuyTwoGetOneFree', () => {
  let item = {
              barcode: 'ITEM000000',
              name: 'Coca-Cola',
              unit: 'bottle',
              price: 3.00
             };

  it ('Given an item and the quantity of it when pass to getSubTotalWithBuyTwoGetOneFree(), then return its subtotal price under buy two get one free promotion.', () => {
    expect(getSubTotalWithBuyTwoGetOneFree(item, 10)).toBe(21);
  });
});

describe('isPromotedItem', () => {
  let promotedItem = {
                      barcode: 'ITEM000000',
                      name: 'Coca-Cola',
                      unit: 'bottle',
                      price: 3.00
                    };
  let notPrmotedItem = {
                        barcode: 'ITEM000004',
                        name: 'Battery',
                        unit: 'box',
                        price: 2.00
                       };

  it ('Given a promoted item when pass to isPromotedItem(), then return true.', () => {
    expect(isPromotedItem(promotedItem, loadPromotions()[0].barcodes)).toBe(true);
  });

  it ('Given a not promoted item when pass to isPromotedItem(), then return false.', () => {
    expect(isPromotedItem(notPrmotedItem, loadPromotions()[0].barcodes)).toBe(false);
  });  
});

describe('getSubTotalByPromotions', () => {
  let promotedItem = {
                      barcode: 'ITEM000000',
                      name: 'Coca-Cola',
                      unit: 'bottle',
                      price: 3.00
                    };
  let notPrmotedItem = {
                        barcode: 'ITEM000004',
                        name: 'Battery',
                        unit: 'box',
                        price: 2.00
                       };

  it ('Given a promoted item when pass to getSubTotalByPromotions(), then return its subtotal price under promotion.', () => {
    expect(getSubTotalByPromotions(promotedItem, 10, loadPromotions())).toBe(21);
  });

  it ('Given a not promoted item when pass to getSubTotalByPromotions(), then return its subtotal price under promotion.', () => {
    expect(getSubTotalByPromotions(notPrmotedItem, 10, loadPromotions())).toBe(20);
  });  
})

describe('getSubTotalByPromotions', () => {
  it ('Given a countable unit and quantity as 1 when pass to getSubTotalByPromotions(), then return the quantity string without s', () => {
    expect(constructQuantityString(1.00, 'bottle')).toBe('1 bottle');
  });

  it ('Given a countable unit and quantity as 3 when pass to getSubTotalByPromotions(), then return the quantity string with s', () => {
    expect(constructQuantityString(3, 'bottle')).toBe('3 bottles');
  });

  it ('Given unit as box and quantity as 3 when pass to getSubTotalByPromotions(), then return the quantity string with es', () => {
    expect(constructQuantityString(3, 'box')).toBe('3 boxes');
  });

  it ('Given an uncountable unit and quantity as 1 when pass to getSubTotalByPromotions(), then return the quantity string without s', () => {
    expect(constructQuantityString(1, 'kg')).toBe('1 kg');
  });

  it ('Given an uncountable unit and quantity as 3.25 when pass to getSubTotalByPromotions(), then return the quantity string without s', () => {
    expect(constructQuantityString(3.25, 'kg')).toBe('3.25 kg');
  });
})

describe('getReceiptInfoWithPromotion', () => {
  let expected_input_1 = [
                            {
                              item: {
                                      barcode: 'ITEM000001',
                                      name: 'Sprite',
                                      unit: 'bottle',
                                      price: 3.00
                                    },
                              quantity: 6
                            },
                            {
                              item: {
                                      barcode: 'ITEM000002',
                                      name: 'Apple',
                                      unit: 'kg',
                                      price: 5.50
                                    },
                              quantity: 3.3
                            },
                            {
                              item: {
                                      barcode: 'ITEM000005',
                                      name: 'Noodles',
                                      unit: 'bag',
                                      price: 4.50
                                    },
                              quantity: 2
                            },
                          ];
  let expected_output_1 = {
                            boughtItemsInfo: [{
                                                name: 'Sprite',
                                                quantity: '6 bottles',
                                                unitPrice: 3.00,
                                                subTotal: 12.00
                                              },
                                              {
                                                name: 'Apple',
                                                quantity: '3.3 kg',
                                                unitPrice: 5.50,
                                                subTotal: 18.15
                                              },
                                              {
                                                name: 'Noodles',
                                                quantity: '2 bags',
                                                unitPrice: 4.50,
                                                subTotal: 9.00
                                              }],
                            total: 39.15,
                            save: 6.00
                          };


  it ('Given a promoted item when pass to getReceiptInfoWithPromotion(), then return its subtotal price under promotion.', () => {
    expect(getReceiptInfoWithPromotion(expected_input_1, loadPromotions())).toEqual(expected_output_1);
  });
})

describe('getReceiptByReceiptInfo', () => {
  let simpleReceiptInfo = {
                      boughtItemsInfo: [{
                                          name: 'Sprite',
                                          quantity: '6 bottles',
                                          unitPrice: 3.00,
                                          subTotal: 12.00
                                        }],
                      total: 12.00,
                      save: 6
                    };
  let complicatedReceiptInfo = {
                      boughtItemsInfo: [{
                                          name: 'Sprite',
                                          quantity: '6 bottles',
                                          unitPrice: 3.00,
                                          subTotal: 12.00
                                        },
                                        {
                                          name: 'Apple',
                                          quantity: '3.3 kg',
                                          unitPrice: 5.50,
                                          subTotal: 18.15
                                        },
                                        {
                                          name: 'Noodles',
                                          quantity: '2 bags',
                                          unitPrice: 4.50,
                                          subTotal: 9.00
                                        }],
                      total: 39.15,
                      save: 6.00
                    };

  let expected_receipt_string_1 = "***<store earning no money>Receipt ***\n";
     expected_receipt_string_1 += "Name: Sprite, Quantity: 6 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)\n";
     expected_receipt_string_1 += "----------------------\n";
     expected_receipt_string_1 += "Total: 12.00 (yuan)\n";
     expected_receipt_string_1 += "Saving: 6.00 (yuan)\n";

  let expected_receipt_string_2 = "***<store earning no money>Receipt ***\n";
     expected_receipt_string_2 += "Name: Sprite, Quantity: 6 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)\n";
     expected_receipt_string_2 += "Name: Apple, Quantity: 3.3 kg, Unit price: 5.50 (yuan), Subtotal: 18.15 (yuan)\n";
     expected_receipt_string_2 += "Name: Noodles, Quantity: 2 bags, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)\n";
     expected_receipt_string_2 += "----------------------\n";
     expected_receipt_string_2 += "Total: 39.15 (yuan)\n";
     expected_receipt_string_2 += "Saving: 6.00 (yuan)\n";

  it ('Given a receipt info with only one item when pass to getReceiptByReceiptInfo(), then return the correct receipt string.', () => {
    expect(getReceiptByReceiptInfo(simpleReceiptInfo)).toEqual(expected_receipt_string_1);
  });

  it ('Given a receipt info with multiple items when pass to getReceiptByReceiptInfo(), then return the correct receipt string.', () => {
    expect(getReceiptByReceiptInfo(complicatedReceiptInfo)).toEqual(expected_receipt_string_2);
  });
})