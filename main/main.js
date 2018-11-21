'use strict';
const fixtures = require('../main/fixtures');
const loadAllItems = fixtures.loadAllItems;
const loadPromotions = fixtures.loadPromotions;

function printReceipt(boughtItemsCodeList){
	let boughtItemsList = getBoughtItemsListByBarcodes(boughtItemsCodeList, loadAllItems());
	let receiptInfo = getReceiptInfoWithPromotion(boughtItemsList, loadPromotions());
	let receipt = getReceiptByReceiptInfo(receiptInfo);
	return receipt;
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
	} else if (unit === 'box'){
		return quantity > 1 ? quantity + ' ' + unit + 'es' : quantity + ' ' + unit;
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
	let receiptString = "***<store earning no money>Receipt ***\n";
	receiptInfo.boughtItemsInfo.forEach(boughtItemInfo => {
		receiptString += `Name: ${boughtItemInfo.name}, Quantity: ${boughtItemInfo.quantity}, Unit price: ${boughtItemInfo.unitPrice.toFixed(2)} (yuan), Subtotal: ${boughtItemInfo.subTotal.toFixed(2)} (yuan)\n`;
	});
	receiptString += "----------------------\n";
	receiptString += `Total: ${receiptInfo.total.toFixed(2)} (yuan)\n`;
	receiptString += `Saving: ${receiptInfo.save.toFixed(2)} (yuan)\n`;
	return receiptString;
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