// lib/usageTracking.ts
export interface UsageLimits {
  apiCalls: number;
  exports: number;
  teamMembers: number;
  storage: number;
  reports: number;
}

export interface UsageMetrics {
  current: UsageLimits;
  limits: UsageLimits;
  percentage: UsageLimits;
}

export interface UpgradeTrigger {
  type: 'api_limit' | 'export_limit' | 'team_limit' | 'storage_limit' | 'report_limit';
  current: number;
  limit: number;
  percentage: number;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class UsageTracker {
  private static instance: UsageTracker;
  private currentUsage: UsageLimits = {
    apiCalls: 0,
    exports: 0,
    teamMembers: 1,
    storage: 0,
    reports: 0
  };

  private limits: UsageLimits = {
    apiCalls: 1000, // Free plan limit
    exports: 5,
    teamMembers: 1,
    storage: 100, // MB
    reports: 3
  };

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  // Track API calls
  trackApiCall(): void {
    this.currentUsage.apiCalls++;
    this.checkTriggers();
  }

  // Track exports
  trackExport(): void {
    this.currentUsage.exports++;
    this.checkTriggers();
  }

  // Track team member addition
  trackTeamMember(): void {
    this.currentUsage.teamMembers++;
    this.checkTriggers();
  }

  // Track storage usage
  trackStorage(mb: number): void {
    this.currentUsage.storage += mb;
    this.checkTriggers();
  }

  // Track report generation
  trackReport(): void {
    this.currentUsage.reports++;
    this.checkTriggers();
  }

  // Get current usage metrics
  getUsageMetrics(): UsageMetrics {
    const percentage: UsageLimits = {
      apiCalls: (this.currentUsage.apiCalls / this.limits.apiCalls) * 100,
      exports: (this.currentUsage.exports / this.limits.exports) * 100,
      teamMembers: (this.currentUsage.teamMembers / this.limits.teamMembers) * 100,
      storage: (this.currentUsage.storage / this.limits.storage) * 100,
      reports: (this.currentUsage.reports / this.limits.reports) * 100
    };

    return {
      current: this.currentUsage,
      limits: this.limits,
      percentage
    };
  }

  // Check for upgrade triggers
  private checkTriggers(): UpgradeTrigger[] {
    const triggers: UpgradeTrigger[] = [];
    const metrics = this.getUsageMetrics();

    // API calls trigger
    if (metrics.percentage.apiCalls >= 80) {
      triggers.push({
        type: 'api_limit',
        current: this.currentUsage.apiCalls,
        limit: this.limits.apiCalls,
        percentage: metrics.percentage.apiCalls,
        message: `You've used ${metrics.percentage.apiCalls.toFixed(0)}% of your API calls. Upgrade to Pro for unlimited calls.`,
        priority: metrics.percentage.apiCalls >= 95 ? 'critical' : 'high'
      });
    }

    // Export trigger
    if (metrics.percentage.exports >= 80) {
      triggers.push({
        type: 'export_limit',
        current: this.currentUsage.exports,
        limit: this.limits.exports,
        percentage: metrics.percentage.exports,
        message: `You've used ${this.currentUsage.exports} of ${this.limits.exports} exports. Upgrade to Pro for unlimited exports.`,
        priority: metrics.percentage.exports >= 100 ? 'critical' : 'high'
      });
    }

    // Team member trigger
    if (this.currentUsage.teamMembers > 1) {
      triggers.push({
        type: 'team_limit',
        current: this.currentUsage.teamMembers,
        limit: this.limits.teamMembers,
        percentage: metrics.percentage.teamMembers,
        message: `You've added ${this.currentUsage.teamMembers} team members. Upgrade to Pro for unlimited team collaboration.`,
        priority: 'medium'
      });
    }

    // Storage trigger
    if (metrics.percentage.storage >= 80) {
      triggers.push({
        type: 'storage_limit',
        current: this.currentUsage.storage,
        limit: this.limits.storage,
        percentage: metrics.percentage.storage,
        message: `You've used ${metrics.percentage.storage.toFixed(0)}% of your storage. Upgrade to Pro for unlimited storage.`,
        priority: metrics.percentage.storage >= 95 ? 'critical' : 'high'
      });
    }

    // Report trigger
    if (metrics.percentage.reports >= 80) {
      triggers.push({
        type: 'report_limit',
        current: this.currentUsage.reports,
        limit: this.limits.reports,
        percentage: metrics.percentage.reports,
        message: `You've generated ${this.currentUsage.reports} of ${this.limits.reports} reports. Upgrade to Pro for unlimited reports.`,
        priority: metrics.percentage.reports >= 100 ? 'critical' : 'high'
      });
    }

    return triggers;
  }

  // Get active triggers
  getActiveTriggers(): UpgradeTrigger[] {
    return this.checkTriggers();
  }

  // Check if user should see upgrade prompt
  shouldShowUpgrade(): boolean {
    const triggers = this.getActiveTriggers();
    return triggers.some(trigger => trigger.priority === 'high' || trigger.priority === 'critical');
  }

  // Get the most critical trigger
  getCriticalTrigger(): UpgradeTrigger | null {
    const triggers = this.getActiveTriggers();
    const critical = triggers.find(t => t.priority === 'critical');
    const high = triggers.find(t => t.priority === 'high');
    return critical || high || null;
  }

  // Reset usage (for testing)
  resetUsage(): void {
    this.currentUsage = {
      apiCalls: 0,
      exports: 0,
      teamMembers: 1,
      storage: 0,
      reports: 0
    };
  }

  // Set custom limits (for different plans)
  setLimits(limits: Partial<UsageLimits>): void {
    this.limits = { ...this.limits, ...limits };
  }

  // Load usage from storage
  loadUsage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('usage-metrics');
      if (saved) {
        this.currentUsage = JSON.parse(saved);
      }
    }
  }

  // Save usage to storage
  saveUsage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usage-metrics', JSON.stringify(this.currentUsage));
    }
  }
}

// Export singleton instance
export const usageTracker = UsageTracker.getInstance();
