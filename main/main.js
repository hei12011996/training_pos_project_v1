'use strict';
const fixtures = require('../main/fixtures');
const loadAllItems = fixtures.loadAllItems;
const loadPromotions = fixtures.loadPromotions;

function printReceipt(boughtItemsCodeList){
	let allItemsList = loadAllItems();
	return 1;
}

function getBoughtItemsListByBarcodes(boughtItemsCodeList, allItemsList){
	// let boughtItemsCodeAndQuantityMap = parseBoughtItemsCodeListToCodeAndQuantity(boughtItemsCodeList);
	// return Object.keys(boughtItemsCodeAndQuantityMap).map(barcode => {});
}

function parseBoughtItemsCodeListToCodeAndQuantity(boughtItemsCodeList){
	let barcodesOccurenceList = {};

	boughtItemsCodeList.forEach(barcode => {
		let parsedBarcode = barcode.split('-')[0];
		if (barcodesOccurenceList[parsedBarcode]) {
			barcodesOccurenceList[parsedBarcode] += parseQuantityFromBarcode(barcode);
		} else {
			barcodesOccurenceList[parsedBarcode] = parseQuantityFromBarcode(barcode);
		}
	});

	return barcodesOccurenceList;
}

function parseQuantityFromBarcode(barcode){
	return barcode.includes('-') ? Number(barcode.split('-')[1]) : 1;
}

module.exports = {
	printReceipt,
	parseQuantityFromBarcode,
	parseBoughtItemsCodeListToCodeAndQuantity
};