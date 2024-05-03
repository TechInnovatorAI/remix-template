export abstract class DatabaseWebhookVerifierService {
  abstract verifySignatureOrThrow(request: Request): Promise<boolean>;
}
