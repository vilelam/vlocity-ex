import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import JSONATTRIB_FIELD from '@salesforce/schema/QuoteLineItem.CreatedDate';

const fields = [JSONATTRIB_FIELD];

export default class JsonAttributeViewer extends LightningElement {
    
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields })
    quoteLineItem;

    get JSONAttribute() {
        // return '';
        return getFieldValue(this.QuoteLineItem.CreatedDate, JSONATTRIB_FIELD);
    }
}