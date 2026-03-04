const { getMainKeyboard } = require('../utils/keyboard');

/**
 * Handle /start command
 */
async function handleStart(bot, msg) {
    const chatId = msg.chat.id;
    const safeName = (msg.from.first_name || 'User')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const welcomeText = `<b>Hello</b>, <b>welcome aboard ${safeName}</b>

<b>I made this bot to convert any website into an Android application instantly.</b>
— Web2Apk Pro

<b><blockquote>[ BOT INFORMATION ]</blockquote></b>

▧ Botname: <b>Web2Apk Pro</b>
▧ Version: <b>3.0.0</b>
▧ Developer: <b>ARR Official</b>
▧ Support: <b>PAPA Queen</b>
▧ Language: <b>JavaScript</b>
▧ Mode: <b>Public</b>


<b><blockquote>[!] DISCLAIMER</blockquote></b>

<b>[IDN]</b> Gunakan bot ini untuk keperluan yang positif dan legal. Kami tidak bertanggung jawab atas penyalahgunaan layanan ini.

<b>[ENG]</b> Use this bot for positive and legal purposes. We are not responsible for any misuse of this service.


<b><blockquote>[!] WHY WEB2APK PRO?</blockquote></b>

Because we make it <b>effortless</b> to turn any website into a real Android app — fast, clean, and ad-free.


<b><blockquote>[ HOW TO USE ]</blockquote></b>

- Ketik <b>/buat</b> untuk mulai buat APK
- Ketik <b>/status</b> untuk cek status pesanan
- Ketik <b>/premium</b> untuk lihat paket premium
- Ketik <b>/bantuan</b> untuk panduan lengkap


<b>Select The Button Below</b>

© Web2Apk Pro`;

    await bot.sendPhoto(chatId, 'https://arr-tourl.pteronet-pro.web.id/uploads/QE8ZlT.jpg', {
        caption: welcomeText,
        parse_mode: 'HTML',
        reply_markup: getMainKeyboard()
    }).catch(async () => {
        await bot.sendMessage(chatId, welcomeText, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
    });
}

module.exports = { handleStart };