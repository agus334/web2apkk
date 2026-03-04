const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'users.json');

class UserService {
    constructor() {
        this.users = new Set();
        this.loadDatabase();
        this.autoBackupInterval = null;
    }

    loadDatabase() {
        if (fs.existsSync(DB_PATH)) {
            try {
                const data = fs.readFileSync(DB_PATH, 'utf8');
                this.users = new Set(JSON.parse(data));
                console.log(`ðŸ“‚ Database loaded: ${this.users.size} users`);
            } catch (e) {
                console.error('Failed to load user database:', e.message);
            }
        }
    }

    saveUser(chatId, bot) {
        if (!chatId) return false;

        if (!this.users.has(chatId)) {
            this.users.add(chatId);
            this.persist();
            console.log(`âœ… New user registered: ${chatId}`);

            // Send backup to owner when new user registers
            if (bot && process.env.ADMIN_IDS) {
                this.sendBackupToOwner(bot, chatId, 'new_user');
            }
            return true;
        }
        return false;
    }

    removeUser(chatId) {
        if (this.users.has(chatId)) {
            this.users.delete(chatId);
            this.persist();
            console.log(`ðŸ—‘ï¸ User removed: ${chatId}`);
        }
    }

    persist() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify([...this.users]));
        } catch (e) {
            console.error('Failed to save database:', e.message);
        }
    }

    /**
     * Kirim backup database ke owner
     * @param {object} bot - Telegram bot instance
     * @param {string|null} triggeredBy - Info trigger (chatId user / 'auto' / 'build' / 'manual')
     * @param {string} reason - 'new_user' | 'build' | 'auto' | 'manual'
     */
    async sendBackupToOwner(bot, triggeredBy = null, reason = 'manual') {
        const ownerId = process.env.ADMIN_IDS?.split(',')[0];
        if (!ownerId || !fs.existsSync(DB_PATH)) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

            const reasonLabels = {
                new_user: 'ðŸ‘¤ User Baru Bergabung',
                build: 'ðŸ”¨ Setelah User Build',
                auto: 'â° Auto Backup (1 Jam)',
                manual: 'ðŸ– Manual /backup'
            };

            const reasonLabel = reasonLabels[reason] || 'ðŸ“¦ Backup';

            let triggerInfo = '';
            if (triggeredBy && reason !== 'auto') {
                triggerInfo = `\nðŸ”” <b>Trigger:</b> <code>${triggeredBy}</code>`;
            }

            const caption = `
ðŸ’¾ <b>DATABASE BACKUP</b>
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ“Œ <b>Alasan:</b> ${reasonLabel}${triggerInfo}
ðŸ‘¥ <b>Total Users:</b> <code>${this.users.size}</code>
ðŸ“… <b>Waktu:</b> ${timestamp}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”`.trim();

            await bot.sendDocument(ownerId, DB_PATH, {
                caption: caption,
                parse_mode: 'HTML'
            });

            console.log(`ðŸ“¤ Backup sent to owner (${reason})`);
        } catch (e) {
            console.error('Failed to send backup:', e.message);
        }
    }

    /**
     * Mulai auto backup setiap 1 jam
     * @param {object} bot - Telegram bot instance
     */
    startAutoBackup(bot) {
        if (this.autoBackupInterval) {
            clearInterval(this.autoBackupInterval);
        }

        const ONE_HOUR = 60 * 60 * 1000; // 1 jam dalam milliseconds

        this.autoBackupInterval = setInterval(async () => {
            console.log('â° Running auto backup (1 hour interval)...');
            await this.sendBackupToOwner(bot, null, 'auto');
        }, ONE_HOUR);

        console.log('â° Auto backup started (every 1 hour)');
    }

    /**
     * Stop auto backup
     */
    stopAutoBackup() {
        if (this.autoBackupInterval) {
            clearInterval(this.autoBackupInterval);
            this.autoBackupInterval = null;
            console.log('â° Auto backup stopped');
        }
    }

    getBroadcastList() {
        return [...this.users];
    }

    getCount() {
        return this.users.size;
    }

    hasUser(chatId) {
        return this.users.has(chatId);
    }
}

module.exports = new UserService();            return true;
        }
        return false;
    }

    removeUser(chatId) {
        if (this.users.has(chatId)) {
            this.users.delete(chatId);
            this.persist();
            console.log(`🗑️ User removed: ${chatId}`);
        }
    }

    persist() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify([...this.users]));
        } catch (e) {
            console.error('Failed to save database:', e.message);
        }
    }

    /**
     * Kirim backup database ke owner
     * @param {object} bot - Telegram bot instance
     * @param {string|null} triggeredBy - Info trigger (chatId user / 'auto' / 'build' / 'manual')
     * @param {string} reason - 'new_user' | 'build' | 'auto' | 'manual'
     */
    async sendBackupToOwner(bot, triggeredBy = null, reason = 'manual') {
        const ownerId = process.env.ADMIN_IDS?.split(',')[0];
        if (!ownerId || !fs.existsSync(DB_PATH)) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

            const reasonLabels = {
                new_user: '👤 User Baru Bergabung',
                build: '🔨 Setelah User Build',
                auto: '⏰ Auto Backup (1 Jam)',
                manual: '🖐 Manual /backup'
            };

            const reasonLabel = reasonLabels[reason] || '📦 Backup';

            let triggerInfo = '';
            if (triggeredBy && reason !== 'auto') {
                triggerInfo = `\n🔔 <b>Trigger:</b> <code>${triggeredBy}</code>`;
            }

            const caption = `
💾 <b>DATABASE BACKUP</b>
━━━━━━━━━━━━━━━━━━
📌 <b>Alasan:</b> ${reasonLabel}${triggerInfo}
👥 <b>Total Users:</b> <code>${this.users.size}</code>
📅 <b>Waktu:</b> ${timestamp}
━━━━━━━━━━━━━━━━━━`.trim();

            await bot.sendDocument(ownerId, DB_PATH, {
                caption: caption,
                parse_mode: 'HTML'
            });

            console.log(`📤 Backup sent to owner (${reason})`);
        } catch (e) {
            console.error('Failed to send backup:', e.message);
        }
    }

    /**
     * Mulai auto backup setiap 1 jam
     * @param {object} bot - Telegram bot instance
     */
    startAutoBackup(bot) {
        if (this.autoBackupInterval) {
            clearInterval(this.autoBackupInterval);
        }

        const ONE_HOUR = 60 * 60 * 1000; // 1 jam dalam milliseconds

        this.autoBackupInterval = setInterval(async () => {
            console.log('⏰ Running auto backup (1 hour interval)...');
            await this.sendBackupToOwner(bot, null, 'auto');
        }, ONE_HOUR);

        console.log('⏰ Auto backup started (every 1 hour)');
    }

    /**
     * Stop auto backup
     */
    stopAutoBackup() {
        if (this.autoBackupInterval) {
            clearInterval(this.autoBackupInterval);
            this.autoBackupInterval = null;
            console.log('⏰ Auto backup stopped');
        }
    }

    getBroadcastList() {
        return [...this.users];
    }

    getCount() {
        return this.users.size;
    }

    hasUser(chatId) {
        return this.users.has(chatId);
    }
}

module.exports = new UserService();
