import * as fs from 'fs/promises';
import * as path from 'path';
import type { CostState, CostLimitInfo } from '../types/index.js';

/**
 * Cost tracker with session (in-memory) and daily (persistent) tracking
 * Enforces FR-017 ($0.10/session, $0.50/day)
 */
class CostTracker {
  private state: CostState = {
    sessionCosts: new Map<string, number>(),
    dailyCosts: {},
  };

  private readonly SESSION_LIMIT = 0.10; // FR-017
  private readonly DAILY_LIMIT = 0.50; // FR-017
  private readonly COST_FILE = process.env.COST_TRACKING_FILE || './daily-costs.json';

  private initialized = false;

  /**
   * Initializes cost tracker by loading daily costs from file
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await fs.readFile(this.COST_FILE, 'utf-8');
      this.state.dailyCosts = JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, start with empty costs
        this.state.dailyCosts = {};
      } else {
        console.error('Error loading daily costs:', error);
        this.state.dailyCosts = {};
      }
    }

    this.initialized = true;
  }

  /**
   * Persists daily costs to file
   */
  private async saveDailyCosts(): Promise<void> {
    try {
      const dir = path.dirname(this.COST_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.COST_FILE,
        JSON.stringify(this.state.dailyCosts, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving daily costs:', error);
    }
  }

  /**
   * Gets today's date key (YYYY-MM-DD)
   */
  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Gets session cost
   */
  public getSessionCost(sessionId: string): number {
    return this.state.sessionCosts.get(sessionId) || 0;
  }

  /**
   * Gets daily cost for today
   */
  public getDailyCost(): number {
    const today = this.getTodayKey();
    return this.state.dailyCosts[today] || 0;
  }

  /**
   * Checks if adding cost would exceed limits
   */
  public canAddCost(sessionId: string, cost: number): CostLimitInfo {
    const sessionCost = this.getSessionCost(sessionId);
    const dailyCost = this.getDailyCost();

    // Check session limit
    if (sessionCost + cost > this.SESSION_LIMIT) {
      return {
        allowed: false,
        limitType: 'session',
        current: sessionCost,
        limit: this.SESSION_LIMIT,
        remaining: Math.max(0, this.SESSION_LIMIT - sessionCost),
      };
    }

    // Check daily limit
    if (dailyCost + cost > this.DAILY_LIMIT) {
      return {
        allowed: false,
        limitType: 'daily',
        current: dailyCost,
        limit: this.DAILY_LIMIT,
        remaining: Math.max(0, this.DAILY_LIMIT - dailyCost),
      };
    }

    return {
      allowed: true,
      remaining: Math.min(
        this.SESSION_LIMIT - sessionCost,
        this.DAILY_LIMIT - dailyCost
      ),
    };
  }

  /**
   * Adds cost to session and daily totals
   */
  public async addCost(sessionId: string, cost: number): Promise<void> {
    // Update session cost (in-memory)
    const currentSession = this.getSessionCost(sessionId);
    this.state.sessionCosts.set(sessionId, currentSession + cost);

    // Update daily cost (persistent)
    const today = this.getTodayKey();
    const currentDaily = this.getDailyCost();
    this.state.dailyCosts[today] = currentDaily + cost;

    // Persist to file
    await this.saveDailyCosts();
  }

  /**
   * Gets remaining budget info
   */
  public getBudgetInfo(sessionId: string) {
    const sessionCost = this.getSessionCost(sessionId);
    const dailyCost = this.getDailyCost();

    return {
      session: {
        used: sessionCost,
        limit: this.SESSION_LIMIT,
        remaining: Math.max(0, this.SESSION_LIMIT - sessionCost),
      },
      daily: {
        used: dailyCost,
        limit: this.DAILY_LIMIT,
        remaining: Math.max(0, this.DAILY_LIMIT - dailyCost),
      },
    };
  }

  /**
   * Resets session costs (for testing or new sessions)
   */
  public resetSession(sessionId?: string): void {
    if (sessionId) {
      this.state.sessionCosts.delete(sessionId);
    } else {
      this.state.sessionCosts.clear();
    }
  }

  /**
   * Cleans up old daily costs (keeps last 30 days)
   */
  public async cleanupOldCosts(): Promise<void> {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const validKeys = Object.keys(this.state.dailyCosts).filter(dateKey => {
      const date = new Date(dateKey);
      return date >= thirtyDaysAgo;
    });

    const newDailyCosts: { [date: string]: number } = {};
    validKeys.forEach(key => {
      newDailyCosts[key] = this.state.dailyCosts[key];
    });

    this.state.dailyCosts = newDailyCosts;
    await this.saveDailyCosts();
  }
}

// Singleton instance
export const costTracker = new CostTracker();

// Export class for testing
export { CostTracker };
