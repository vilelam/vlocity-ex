public with sharing class vCpqService {
    public Boolean postCartsItems_preInvoke(Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {
        System.debug('inputMap: ' + JSON.serialize(inputMap));
        Id cartId = (Id)inputMap.get('cartId');
        if (cartId.getSobjectType() == Schema.Quote.SObjectType) {            
            Map<String, Object> itemToAdd = (Map<String, Object>)((List<Object>)inputMap.get('items'))[0];
            Map<String, Object> attributesToUpdate = (Map<String, Object>)itemToAdd.get('attributesToUpdate');            
            if (attributesToUpdate != null && attributesToUpdate.size() > 0) {
                vCpqCartContext.addMessage('setXLIAttributes', new Map<String, Object> {
                    'itemId' => itemToAdd.get('itemId'),
                    'parentId' => itemToAdd.get('parentId'),
                    'attributesToUpdate' => attributesToUpdate
                });
            }
        }
        return true;
    }

    public void xLI_beforeInsert(SObject[] xLIs) {
        System.debug('xLIs: ' + JSON.serialize(xLIs));
        
        if (xLIs != null && xLIs.size() > 0) {
            SObjectType xLIType = xLIs[0].getSObjectType();
            Map<String, Object> setAttrsMsg = vCpqCartContext.getMessage('setXLIAttributes');
            if (setAttrsMsg != null &&
                (xLIType == OpportunityLineItem.SObjectType ||
                xLIType == QuoteLineItem.SObjectType ||
                xLIType == OrderItem.SObjectType)) {
                for (SObject xLI : xLIs) {
                    Id pbeId = (Id)xLI.get('PricebookEntryId');
                    if (pbeId == (Id)setAttrsMsg.get('itemId')) {
                        Map<String, Object> attrValMap = (Map<String, Object>)setAttrsMsg.get('attributesToUpdate');
                        String modifiedJSON = vHelper.setJSONAttributes((String)xLI.get('vlocity_cmt__JSONAttribute__c'), '{}', attrValMap);
                        xLI.put('vlocity_cmt__JSONAttribute__c', modifiedJSON);
                    }
                }
            }
        }
    }
}


