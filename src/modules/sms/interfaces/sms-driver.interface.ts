export interface SmsResult {
  success: boolean;
  messageId?: string;
  isDev?: boolean;
  message?: string;
}

export interface ISmsDriver {
  readonly id: string;
  readonly title: string;
  sendSimple(to: string, message: string): Promise<SmsResult>;
  sendPattern(to: string, patternCodeOrName: string, params: Record<string, string>): Promise<SmsResult>;
}

export interface SmsProviderConfig {
  apiKey?: string;
  username?: string;
  password?: string;
  sender?: string;
}
