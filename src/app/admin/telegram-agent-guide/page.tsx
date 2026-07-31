'use client';

export default function TelegramAgentGuide() {
    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>🤖 Telegram Deals Agent Setup Guide</h1>
            <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
                Follow these instructions to configure and run your automated Telegram bot. This bot fetches deals directly from your live API, uses Claude (Anthropic AI) to curate the top 3 best deals and write punchy captions, and then posts them to your Telegram group on autopilot.
            </p>

            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>1. Initial Setup</h2>
                
                <h3 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Navigate to the Bot Directory</h3>
                <p style={{ marginBottom: '1rem' }}>The agent is built in Python and lives in the <code>telegram-agent</code> folder at the root of your project.</p>
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>cd telegram-agent</code>
                </pre>

                <h3 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Install Dependencies</h3>
                <p style={{ marginBottom: '1rem' }}>Ensure you have Python 3 installed. You can install the required packages using pip:</p>
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>pip install -r requirements.txt</code>
                </pre>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>2. Configure API Keys</h2>
                <p style={{ marginBottom: '1rem' }}>Rename the <code>.env.example</code> file to <code>.env</code> in the <code>telegram-agent</code> folder. Open it and fill in your actual keys:</p>
                
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>ANTHROPIC_API_KEY=your-anthropic-key{'\n'}TELEGRAM_BOT_TOKEN=your-bot-token{'\n'}TELEGRAM_CHAT_ID=-100xxxxxxxxxx{'\n'}DEALS_API_URL=https://aidealsofamerica.com/api/deals</code>
                </pre>

                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', color: '#4b5563' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Anthropic API Key:</strong> Get this from console.anthropic.com.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Telegram Bot Token:</strong> Message @BotFather on Telegram to create a bot and get the token.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Telegram Chat ID:</strong> Add the bot to your group as an admin, then use the getUpdates API method to find your group's Chat ID.</li>
                </ul>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>3. Running the Agent</h2>
                
                <h3 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Dry Run (Testing Mode)</h3>
                <p style={{ marginBottom: '1rem' }}>You can run the bot in dry-run mode to see what Claude picks and what the formatted Telegram messages will look like <em>without</em> actually posting them to your live group.</p>
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>python main.py --dry-run</code>
                </pre>

                <h3 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Live Mode</h3>
                <p style={{ marginBottom: '1rem' }}>Once you are happy with the dry run output, you can run the bot for real. It will fetch deals, have Claude pick the top 3, post them to Telegram, and save their IDs locally so they aren't posted twice.</p>
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>python main.py</code>
                </pre>

                <h3 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Scheduling (Cron Job)</h3>
                <p style={{ marginBottom: '1rem' }}>To automate this completely, set up a cron job on your server to run this script every few hours. For example, to run it every 3 hours:</p>
                <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>0 */3 * * * cd /path/to/amdeals/telegram-agent && python3 main.py</code>
                </pre>
            </div>
        </div>
    );
}
