import { BrokerMessage } from "./BrokerMessage";
import { ClientAuthError } from "@azure/msal-common";

export class BrokerHandshakeResponse extends BrokerMessage {
    public version: string;
    public readonly brokerOrigin: string;

    constructor(version: string, brokerOrigin?: string) {
        super("BrokerHandshakeResponse");

        this.version = version;
        this.brokerOrigin = brokerOrigin;
    }

    static validate(message: MessageEvent, trustedBrokerDomains: string[]) {
        // First, validate message type
        message = BrokerMessage.validateMessage(message);
        if (message && message.data.messageType === "BrokerHandshakeResponse" &&
            message.data.version) {
                
            // TODO, verify version compatibility

            if (trustedBrokerDomains.indexOf(message.origin) < 0) {
                // TODO make this a browser Error
                throw new ClientAuthError("untrusted_broker", "The given broker origin is not trusted.");
            }

            return new BrokerHandshakeResponse(message.data.version, message.origin);
        }

        return null;
    }
}