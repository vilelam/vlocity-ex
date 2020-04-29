import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const actions = [
    { label: 'Details', name: 'show_details' }
];
const columns = [
    // { label: 'Code', fieldName: 'code', sortable: true },
    { label: 'Name', fieldName: 'name', sortable: true },
    { label: 'Value', fieldName: 'value', sortable: true },
    { label: 'Code', fieldName: 'code', sortable: true },
    { label: 'Category', fieldName: 'category_name', sortable: true },
    {
        type: 'button-icon',
        typeAttributes: { iconName: 'utility:edit', iconClass: "slds-button__icon", name: 'edit', variant: 'bare' },
        fixedWidth:30,
    }

];

export default class JsonAttributeViewer extends LightningElement {
    @api recordId;
    @api objectApiName;

    @track record;
    @track jsonAttributeField;
    // Attribute List
    @track attributes;
    
    // Attribute Info
    @track attribute;

    @track columns = columns;
 
    tablePanelSize = 6;
    infoPanelSize = 6;

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
                        is_input: false,
                        is_number: false,
                        is_checkbox: false,
                        is_combobox: false,
                    };

                    var myRuntimeInfo = myAttribute.attributeRunTimeInfo;
                    attribute.data_type = myRuntimeInfo.dataType;
                    if (myRuntimeInfo.dataType === "Currency" ||
                        myRuntimeInfo.dataType === "Percent" ||
                        myRuntimeInfo.dataType === "Number") {
                        attribute.input_type = 'number';
                        attribute.is_number = true;
                        attribute.value = myRuntimeInfo.value + "";
                    } else if (myRuntimeInfo.dataType === "Text" || 
                        myRuntimeInfo.dataType === "Lookup") {
                        attribute.input_type = 'text';
                        attribute.is_input = true;
                        attribute.value = myRuntimeInfo.value;
                    } else if (myRuntimeInfo.dataType === "Checkbox") {
                        attribute.input_type = 'checkbox';                        
                        attribute.is_checkbox = true;
                        attribute.value = myRuntimeInfo.value + "";
                    } else if (myRuntimeInfo.dataType === "Date") {
                        attribute.input_type = 'date';
                        attribute.is_input = true;
                        attribute.value = myRuntimeInfo.value + "";
                    } else if (myRuntimeInfo.dataType === "Datetime") {
                        attribute.input_type = 'datetime';
                        attribute.is_input = true;
                        attribute.value = myRuntimeInfo.value + "";
                    } else if (myRuntimeInfo.dataType === "Picklist") {
                        attribute.is_combobox = true;
                        attribute.value = Object.keys(myRuntimeInfo.selectedItem).length === 0 ? null : myRuntimeInfo.selectedItem.displayText;
                        attribute.options = [];
                        for (var j = 0; j < myRuntimeInfo.values.length; j++) {
                            attribute.options.push( {
                                label: myRuntimeInfo.values[j].displayText,
                                value: myRuntimeInfo.values[j].value
                            });
                        }
                        
                    } else if (myRuntimeInfo.dataType === "Multi Picklist") {
                        attribute.input_type = 'text';
                        attribute.is_input = true;
                        attribute.value = myRuntimeInfo.value ;//+ "";
                    } else {
                        attribute.input_type = 'text';
                        attribute.is_input = true;
                        attribute.value = myRuntimeInfo.value ;//+ "";
                    }
                    // attribute.value = myRuntimeInfo.value ;//+ "";

                    this.attributes.push(attribute);
                }

            }

            console.log(this.attributes);
        }
    }

    get jsonAttribute() {
        if (this.record)
            return this.record.fields.vlocity_cmt__JSONAttribute__c.value;
        else
            return 'Record not found';
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.attribute = event.detail.row;
        console.log(row);
        switch (actionName) {
            case 'delete':
                // alert('delete');
                break;
            case 'show_details':
                // alert('details');
                break;
            default:
        }
    }
}