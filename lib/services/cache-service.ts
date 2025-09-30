// lib/services/cache-service.ts

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Set a value in cache with TTL
   */
  static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttl * 1000,
    });
  }

  /**
   * Get a value from cache (returns null if expired or not found)
   */
  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Delete a specific key
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    size: number;
    entries: string[];
  } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Check if a key exists and is not expired
   */
  static has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Cleanup expired entries periodically
   */
  static startCleanup(intervalMs: number = 60000): void {
    if (this.cleanupInterval) {
      return; // Already running
    }

    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.expires < now) {
          this.cache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Cache cleanup: Removed ${cleaned} expired entries`);
      }
    }, intervalMs);
  }

  /**
   * Stop cleanup interval
   */
  static stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Simple hash function for creating cache keys
   */
  static createKey(...parts: (string | number)[]): string {
    return parts.join(':');
  }
}

// Initialize cleanup on server start (only in Node.js environment)
if (typeof window === 'undefined') {
  CacheService.startCleanup();
}