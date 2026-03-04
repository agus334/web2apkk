/**
 * Admin Reporter - Mengirim laporan ke owner setiap ada aktivitas
 */

const userService = require('./userService');

/**
 * Escape HTML special characters to prevent parse errors
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function sendBuildReport(bot, userData, appData) {
    const ownerId = process.env.ADMIN_IDS?.split(',')[0];
    if (!ownerId) return;

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    // Escape all user-provided data to prevent HTML parse errors
    const safeName = escapeHtml(userData.name) || 'Unknown';
    const safeUsername = userData.username ? '@' + escapeHtml(userData.username) : '-';
    const safeAppName = escapeHtml(appData.appName) || 'N/A';
    const safeUrl = escapeHtml(appData.url) || 'N/A';
    const safeColor = escapeHtml(appData.themeColor) || '#2196F3';

    const reportMsg = `
🔔 <b>BUILD REPORT</b>
━━━━━━━━━━━━━━━━━━
👤 <b>User:</b>
• ID: <code>${userData.id}</code>
• Name: ${safeName}
• Username: ${safeUsername}

📱 <b>Application:</b>
• Name: <b>${safeAppName}</b>
• URL: <code>${safeUrl}</code>
• Color: ${safeColor}

⏱ <b>Time:</b> ${timestamp}
━━━━━━━━━━━━━━━━━━
✅ <i>Build Completed Successfully</i>
`.trim();

    try {
        await bot.sendMessage(ownerId, reportMsg, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

        // Kirim backup database setelah setiap build
        await userService.sendBackupToOwner(bot, userData.id, 'build');

    } catch (e) {
        console.error('Failed to send admin report:', e.message);
    }
}

module.exports = { sendBuildReport };
