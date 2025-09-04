// lib/auth/2fa.ts
import { authenticator } from 'otplib';

export interface TOTPConfig {
  secret: string;
  issuer: string;
  label: string;
  algorithm: string;
  digits: number;
  period: number;
}

export interface RecoveryCode {
  code: string;
  used: boolean;
  usedAt?: Date;
}

export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes: RecoveryCode[];
  lastUsed?: Date;
}

export class TwoFactorManager {
  private static instance: TwoFactorManager;

  static getInstance(): TwoFactorManager {
    if (!TwoFactorManager.instance) {
      TwoFactorManager.instance = new TwoFactorManager();
    }
    return TwoFactorManager.instance;
  }

  // Generate TOTP secret
  generateSecret(userId: string, email: string): string {
    return authenticator.generateSecret();
  }

  // Generate QR code URL for authenticator apps
  generateQRCode(secret: string, email: string): string {
    const otpauth = authenticator.keyuri(email, 'Rightly', secret);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
  }

  // Verify TOTP token
  verifyToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }

  // Generate recovery codes
  generateRecoveryCodes(count: number = 10): RecoveryCode[] {
    const codes: RecoveryCode[] = [];
    
    for (let i = 0; i < count; i++) {
      codes.push({
        code: this.generateRecoveryCode(),
        used: false
      });
    }
    
    return codes;
  }

  // Generate single recovery code
  private generateRecoveryCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Verify recovery code
  verifyRecoveryCode(code: string, backupCodes: RecoveryCode[]): boolean {
    const recoveryCode = backupCodes.find(rc => rc.code === code && !rc.used);
    
    if (recoveryCode) {
      recoveryCode.used = true;
      recoveryCode.usedAt = new Date();
      return true;
    }
    
    return false;
  }

  // Check if 2FA is required for user
  isRequired(userId: string): boolean {
    // Check user settings or admin policy
    return false; // Default to optional
  }

  // Enable 2FA for user
  async enable2FA(userId: string, secret: string): Promise<TwoFactorAuth> {
    const backupCodes = this.generateRecoveryCodes();
    
    const twoFactorAuth: TwoFactorAuth = {
      enabled: true,
      secret,
      backupCodes,
      lastUsed: new Date()
    };

    // Save to database
    await this.save2FASettings(userId, twoFactorAuth);
    
    return twoFactorAuth;
  }

  // Disable 2FA for user
  async disable2FA(userId: string): Promise<void> {
    const twoFactorAuth: TwoFactorAuth = {
      enabled: false,
      backupCodes: []
    };

    // Save to database
    await this.save2FASettings(userId, twoFactorAuth);
  }

  // Get 2FA settings for user
  async get2FASettings(userId: string): Promise<TwoFactorAuth | null> {
    try {
      // Fetch from database
      const response = await fetch(`/api/auth/2fa/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get 2FA settings:', error);
      return null;
    }
  }

  // Save 2FA settings to database
  private async save2FASettings(userId: string, settings: TwoFactorAuth): Promise<void> {
    try {
      await fetch(`/api/auth/2fa/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Failed to save 2FA settings:', error);
      throw new Error('Failed to save 2FA settings');
    }
  }

  // Validate 2FA for login
  async validate2FA(userId: string, token: string): Promise<boolean> {
    try {
      const settings = await this.get2FASettings(userId);
      
      if (!settings || !settings.enabled || !settings.secret) {
        return false;
      }

      // Check if it's a recovery code
      if (token.length === 8 && /^[A-Z0-9]+$/.test(token)) {
        return this.verifyRecoveryCode(token, settings.backupCodes);
      }

      // Verify TOTP token
      return this.verifyToken(token, settings.secret);
    } catch (error) {
      console.error('2FA validation error:', error);
      return false;
    }
  }

  // Get remaining backup codes
  getRemainingBackupCodes(backupCodes: RecoveryCode[]): RecoveryCode[] {
    return backupCodes.filter(code => !code.used);
  }

  // Regenerate backup codes
  async regenerateBackupCodes(userId: string): Promise<RecoveryCode[]> {
    const newCodes = this.generateRecoveryCodes();
    
    const settings = await this.get2FASettings(userId);
    if (settings) {
      settings.backupCodes = newCodes;
      await this.save2FASettings(userId, settings);
    }
    
    return newCodes;
  }

  // Check if user has 2FA enabled
  async is2FAEnabled(userId: string): Promise<boolean> {
    const settings = await this.get2FASettings(userId);
    return settings?.enabled || false;
  }

  // Get 2FA setup status
  async get2FAStatus(userId: string): Promise<{
    enabled: boolean;
    setupComplete: boolean;
    backupCodesRemaining: number;
  }> {
    const settings = await this.get2FASettings(userId);
    
    if (!settings) {
      return {
        enabled: false,
        setupComplete: false,
        backupCodesRemaining: 0
      };
    }

    return {
      enabled: settings.enabled,
      setupComplete: settings.enabled && settings.secret && settings.backupCodes.length > 0,
      backupCodesRemaining: this.getRemainingBackupCodes(settings.backupCodes).length
    };
  }
}

// Export singleton instance
export const twoFactorManager = TwoFactorManager.getInstance();
