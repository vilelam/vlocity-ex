trigger SampleQLITrigger on QuoteLineItem (before insert) {
    vCpqService service = new vCpqService();
    service.xLI_beforeInsert(Trigger.new);
}