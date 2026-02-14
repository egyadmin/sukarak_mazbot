import { BASE_URL } from '../api/config';

const DB_PREFIX = 'sukarak_v3_';

class DataService {
    // ============ LOCAL STORAGE ============
    static getLocal(key) {
        try {
            const data = localStorage.getItem(DB_PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    static setLocal(key, data) {
        try {
            localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
            localStorage.setItem(DB_PREFIX + key + '_updated', new Date().toISOString());
        } catch (e) { console.warn('localStorage full:', e); }
    }

    static getLocalTimestamp(key) {
        return localStorage.getItem(DB_PREFIX + key + '_updated');
    }

    // ============ PENDING QUEUE (offline writes) ============
    static getPendingQueue() {
        return this.getLocal('_pending_queue') || [];
    }

    static addToPendingQueue(entry) {
        const queue = this.getPendingQueue();
        queue.push({ ...entry, timestamp: new Date().toISOString(), id: Date.now() + Math.random() });
        this.setLocal('_pending_queue', queue);
    }

    static clearPendingItem(id) {
        const queue = this.getPendingQueue().filter(item => item.id !== id);
        this.setLocal('_pending_queue', queue);
    }

    // ============ FETCH WITH CACHE ============
    static async fetchWithCache(url, cacheKey, options = {}) {
        const { forceRefresh = false, maxAge = 5 * 60 * 1000 } = options; // 5 min default

        // Check cache first
        if (!forceRefresh) {
            const cached = this.getLocal(cacheKey);
            const timestamp = this.getLocalTimestamp(cacheKey);
            if (cached && timestamp) {
                const age = Date.now() - new Date(timestamp).getTime();
                if (age < maxAge) return { data: cached, fromCache: true };
            }
        }

        // Try API
        try {
            const absoluteUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
            console.log(`[DataService] Fetching: ${absoluteUrl}`);
            const res = await fetch(absoluteUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.setLocal(cacheKey, data);
            return { data, fromCache: false };
        } catch (err) {
            // Offline - return cached data
            const cached = this.getLocal(cacheKey);
            if (cached) return { data: cached, fromCache: true, offline: true };
            throw err;
        }
    }

    // ============ POST WITH OFFLINE SUPPORT ============
    static async postWithSync(url, body, cacheKey = null) {
        try {
            const absoluteUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
            console.log(`[DataService] Posting: ${absoluteUrl}`);
            const res = await fetch(absoluteUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // Refresh cache if applicable
            if (cacheKey) {
                const cached = this.getLocal(cacheKey) || [];
                cached.unshift({ ...body, ...data, created_at: new Date().toISOString(), _synced: true });
                this.setLocal(cacheKey, cached);
            }
            return { data, synced: true };
        } catch (err) {
            // Offline - save locally and queue for sync
            this.addToPendingQueue({ url, method: 'POST', body });
            if (cacheKey) {
                const cached = this.getLocal(cacheKey) || [];
                cached.unshift({ ...body, id: Date.now(), created_at: new Date().toISOString(), _synced: false });
                this.setLocal(cacheKey, cached);
            }
            return { data: body, synced: false, queued: true };
        }
    }

    // ============ DELETE WITH OFFLINE SUPPORT ============
    static async deleteWithSync(url, cacheKey = null, itemId = null) {
        try {
            const absoluteUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
            const res = await fetch(absoluteUrl, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (cacheKey && itemId) {
                const cached = (this.getLocal(cacheKey) || []).filter(i => i.id !== itemId);
                this.setLocal(cacheKey, cached);
            }
            return { synced: true };
        } catch (err) {
            this.addToPendingQueue({ url, method: 'DELETE' });
            if (cacheKey && itemId) {
                const cached = (this.getLocal(cacheKey) || []).filter(i => i.id !== itemId);
                this.setLocal(cacheKey, cached);
            }
            return { synced: false, queued: true };
        }
    }

    // ============ AUTO SYNC ============
    static async syncPending() {
        const queue = this.getPendingQueue();
        if (queue.length === 0) return;

        let synced = 0;
        for (const item of queue) {
            try {
                const res = await fetch(item.url, {
                    method: item.method,
                    headers: item.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
                    body: item.method === 'POST' ? JSON.stringify(item.body) : undefined,
                });
                if (res.ok) {
                    this.clearPendingItem(item.id);
                    synced++;
                }
            } catch {
                // Still offline, stop trying
                break;
            }
        }
        if (synced > 0) console.log(`✅ Synced ${synced} pending operations`);
        return synced;
    }

    // ============ HEALTH DATA SHORTCUTS ============
    static async getSugarReadings(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/sugar', 'sugar_readings', { forceRefresh });
    }

    static async addSugarReading(reading, testType) {
        return this.postWithSync('/api/v1/health/sugar', { reading, test_type: testType }, 'sugar_readings');
    }

    static async getInsulinRecords(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/insulin', 'insulin_readings', { forceRefresh });
    }

    static async getMeals(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/meals', 'meals_records', { forceRefresh });
    }

    static async getMealRecords(forceRefresh = false) {
        return this.getMeals(forceRefresh);
    }

    static async getExerciseRecords(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/exercise', 'exercise_records', { forceRefresh });
    }

    static async getDrugRecords(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/drugs', 'drugs_records', { forceRefresh });
    }

    static async getDrugs(forceRefresh = false) {
        return this.getDrugRecords(forceRefresh);
    }

    static async getFoods() {
        return this.fetchWithCache('/api/v1/health/foods', 'foods_db', { maxAge: 24 * 60 * 60 * 1000 }); // Cache 24h
    }

    static async getSports() {
        return this.fetchWithCache('/api/v1/health/sports', 'sports_db', { maxAge: 24 * 60 * 60 * 1000 });
    }

    static async getAppointments(forceRefresh = false) {
        return this.fetchWithCache('/api/v1/health/appointments', 'appointments', { forceRefresh });
    }

    static async getNotifications() {
        return this.fetchWithCache('/api/v1/admin/cms/notifications', 'notifications', { maxAge: 60 * 1000 }); // 1 min cache
    }

    static async getBanners() {
        return this.fetchWithCache('/api/v1/admin/cms/banners', 'banners', { maxAge: 10 * 60 * 1000 });
    }

    // ============ NOTIFICATION HELPERS ============
    static getReadNotifications() {
        return this.getLocal('read_notifications') || [];
    }

    static markNotificationRead(id) {
        const read = this.getReadNotifications();
        if (!read.includes(id)) {
            read.push(id);
            this.setLocal('read_notifications', read);
        }
    }

    static getUnreadCount(notifications) {
        const read = this.getReadNotifications();
        return notifications.filter(n => n.active && !read.includes(n.id)).length;
    }
}

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('🔄 Back online - syncing...');
        DataService.syncPending();
    });
    // Periodic sync every 30 seconds
    setInterval(() => {
        if (navigator.onLine) {
            DataService.syncPending();
        }
    }, 30000);
}

export default DataService;
