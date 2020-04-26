public with sharing class vCpqCartContext {
    /*
     * @description Message queue used within CPQ Cart context
     */
    private static Map<String, Map<String, Object>> messageQueue;

    /*
     * @description
     */
    static {
        messageQueue = new Map<String, Map<String, Object>>();
    }

    /*
     * @description Publish message to the CPQ cart message queue
     */
    public static Map<String, Object> addMessage(String messageName, Map<String, Object> messageData) {
        messageData.put('messageName', messageName);
        messageQueue.put(messageName, messageData);

        return messageData;
    }

    /*
     * @description get message from the CPQ cart message queue. It also remove the message from queue
     */
    public static Map<String, Object> getMessage(String messageName) {
        return messageQueue.remove(messageName);
    }

    /*
     * @description get message from the CPQ cart message queue but it does not remove the message from queue
     */
    public static Map<String, Object> peekMessage(String messageName) {
        return messageQueue.get(messageName);
        
    }
}
