'use strict';
const fixtures = require('../main/fixtures');
const loadAllItems = fixtures.loadAllItems;
const loadPromotions = fixtures.loadPromotions;

function printReceipt(boughtItemsCodeList){
	let allItemsList = loadAllItems();
	return 1;
}

function getBoughtItemsListByBarcodes(boughtItemsCodeList, allItemsList){
	let boughtItemsCodeAndQuantityMap = parseBoughtItemsCodeListToCodeAndQuantity(boughtItemsCodeList);
	return Object.keys(boughtItemsCodeAndQuantityMap).map(barcode => {
		let parsedBarcode = barcode.split('-')[0];
		return {'item': allItemsList.find(item => item.barcode === parsedBarcode), 'quantity': boughtItemsCodeAndQuantityMap[parsedBarcode]};
	});
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

function getReceiptInfoWithPromotion(boughtItemsList, promotionsInfo){
	let total = 0;
	let save = 0;
	boughtItemsList = boughtItemsList.map(element => {
		let item = element.item;
		let quantity = element.quantity;
		let subTotal = getSubTotalByPromotions(item, quantity, promotionsInfo);
		total += subTotal;
		save += item.price * quantity - subTotal;
		return {
							name: item.name,
							quantity: constructQuantityString(quantity, item.unit),
							unitPrice: item.price,
							subTotal: subTotal
					 };
	})
	return {boughtItemsInfo: boughtItemsList, total: total, save: save};
}

function constructQuantityString(quantity, unit){
	if (unit === 'bottle' || unit === 'bag'){
		return quantity > 1 ? quantity + ' ' + unit + 's' : quantity + ' ' + unit;
	}
	return quantity + ' ' + unit;
}

function getSubTotalByPromotions(item, quantity, promotionsInfo){
	let subTotal = 0;

	promotionsInfo.forEach(promotionInfo => {
		if (isPromotedItem(item, promotionInfo.barcodes) && promotionInfo.type === 'BUY_TWO_GET_ONE_FREE'){
			subTotal = getSubTotalWithBuyTwoGetOneFree(item, quantity);
		} else {
			subTotal = item.price * quantity;
		}
	});

	return subTotal;
}

function getSubTotalWithBuyTwoGetOneFree(item, quantity){
	let actualQuantity = quantity - parseInt(quantity / 3);
	return item.price * actualQuantity;
}

function isPromotedItem(item, promotionBarcodesList){
	return promotionBarcodesList.includes(item.barcode);
}

function getReceiptByReceiptInfo(receiptInfo){
}

module.exports = {
	printReceipt,
	parseQuantityFromBarcode,
	parseBoughtItemsCodeListToCodeAndQuantity,
	getBoughtItemsListByBarcodes,
	getSubTotalWithBuyTwoGetOneFree,
	isPromotedItem,
	getSubTotalByPromotions,
	constructQuantityString,
	getReceiptInfoWithPromotion,
	getReceiptByReceiptInfo
};