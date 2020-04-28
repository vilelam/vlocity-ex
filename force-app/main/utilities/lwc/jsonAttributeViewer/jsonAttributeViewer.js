import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const columns = [
    { label: 'Code', fieldName: 'code', sortable: true },
    { label: 'Name', fieldName: 'name', sortable: true },
    { label: 'Value', fieldName: 'value', sortable: true },
    { label: 'Category', fieldName: 'category_name', sortable: true }
    // { label: 'Website', fieldName: 'website', type: 'url' },
    // { label: 'Phone', fieldName: 'phone', type: 'phone' },
    // { label: 'Balance', fieldName: 'amount', type: 'currency' },
    // { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class JsonAttributeViewer extends LightningElement {
    @api recordId;
    @api objectApiName;

    @track jsonAttributeField;
    @track attributes;
    @track columns = columns;
    @track record;

    // jsonAttribute;

    connectedCallback() {
        if(this.objectApiName==='QuoteLineItem') {
            this.jsonAttributeField = 'QuoteLineItem.vlocity_cmt__JSONAttribute__c';
        } else if(this.objectApiName==='OpportunityLineItem') {
            this.jsonAttributeField = 'OpportunityLineItem.vlocity_cmt__JSONAttribute__c';
        } else if(this.objectApiName==='OrderItem') {
            this.jsonAttributeField = 'OrderItem.vlocity_cmt__JSONAttribute__c';
        }    
    }
    @wire(getRecord, { recordId: '$recordId', fields: '$jsonAttributeField' })
    getJSONAttribute( { error, data }) {
        if (error) {
            // TODO
            console.log('Error');
        } else if (data) {
            this.record = data;
            var attributesByCategory = JSON.parse(this.record.fields.vlocity_cmt__JSONAttribute__c.value);
            //debugger;
            this.attributes = [];
            for (var categoryCode in attributesByCategory) {
                var myAttributes = attributesByCategory[categoryCode];
                for (var i = 0; i < myAttributes.length; i++) {
                    var myAttribute = myAttributes[i];

                    var attribute = {
                        name: myAttribute.attributedisplayname__c,
                        code: myAttribute.attributeuniquecode__c,
                        category_name: myAttribute.categoryname__c,
                        category_code: myAttribute.categorycode__c,
                        active: myAttribute.isactive__c,
                        readonly: myAttribute.isreadonly__c,
                        is_picklist: false,
                        is_text: false,
                        is_checkbox: false
                    };

                    var myRuntimeInfo = myAttribute.attributeRunTimeInfo;
                    attribute.data_type = myRuntimeInfo.dataType;
                    if (myRuntimeInfo.dataType === "Picklist") {
                        attribute.value = Object.keys(myRuntimeInfo.selectedItem).length === 0 ? null : myRuntimeInfo.selectedItem.displayText;
                        attribute.options = [];
                        for (var j = 0; j < myRuntimeInfo.values.length; j++) {
                            attribute.options.push( {
                                label: myRuntimeInfo.values[j].displayText,
                                value: myRuntimeInfo.values[j].value
                            });
                        }
                        attribute.is_picklist = true;
                    } else {
                        if (myRuntimeInfo.dataType === "Checkbox") {
                            attribute.is_checkbox = true;
                            attribute.options = [{
                                label: "true",
                                value: "true"
                                },{
                                    label: "false",
                                    value: "false"
                                }
                            ];
                            attribute.value = myRuntimeInfo.value + "";
                        } else {
                            attribute.is_text = true;
                            attribute.value = myRuntimeInfo.value;
                        }
                        
                    }
                    this.attributes.push(attribute);
                }

            }
        }
    }

    get jsonAttribute() {
        if (this.record)
            return this.record.fields.vlocity_cmt__JSONAttribute__c.value;
        else
            return 'Record not found';
    }
}