'use strict';

const main = require('../main/main');
const fixtures = require('../main/fixtures');
const parseQuantityFromBarcode = main.parseQuantityFromBarcode;
const parseBoughtItemsCodeListToCodeAndQuantity = main.parseBoughtItemsCodeListToCodeAndQuantity;
const getBoughtItemsListByBarcodes = main.getBoughtItemsListByBarcodes;
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

// describe('getBoughtItemsListByBarcodes', () => {
// 	let input_1 = ['ITEM000000'];
// 	let input_3 = [
// 									'ITEM000001',
// 									'ITEM000001',
// 									'ITEM000001',
// 									'ITEM000001',
// 									'ITEM000001',
// 									'ITEM000003-2',
// 									'ITEM000005',
// 									'ITEM000005',
// 									'ITEM000005'
// 								];
// 	let expected_output_1 = [
// 														{
// 															barcode: 'ITEM000000',
// 															name: 'Coca-Cola',
// 															unit: 'bottle',
// 															price: 3.00
// 														}
// 													];
// 	it ('Given an barcode of item when pass to getBoughtItemsListByBarcodes(), then return the item info with quantity as 1', () => {
// 		expect(getBoughtItemsListByBarcodes(input_1, loadAllItems())).toEqual(expected_output_1);
// 	});
// });