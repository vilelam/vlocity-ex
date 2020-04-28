import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const fields = [
	'QuoteLineItem.vlocity_cmt__JSONAttribute__c'
];


export default class JsonAttributeViewer extends LightningElement {
    @api recordId;
    quantity;
    
    @wire(getRecord, { recordId: '$recordId', fields })
    loadQLI( { error, data }) {
        if (error) {
            // TODO
            console.log('Error');
        } else if (data) {
            console.log(DataTransfer);
            this.quantity = data.fields.vlocity_cmt__JSONAttribute__c.value;
        }
    }

    get jsonAttr() {
        return this.quantity;
    }
}