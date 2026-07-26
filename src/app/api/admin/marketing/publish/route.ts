import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { platform, title, content, link } = await request.json();
        if (!platform || !content) {
            return NextResponse.json({ error: 'platform and content are required' }, { status: 400 });
        }

        switch (platform) {
            case 'telegram':
                return await handleTelegram(content);
            case 'reddit':
                return await handleReddit(title || 'Deal Alert!', content);
            case 'twitter':
                return await handleTwitter(content);
            case 'facebook':
                return await handleFacebook(content, link);
            case 'andhrafriends':
                return await handleAndhrafriends(title || 'New Deal Alert!', content);
            default:
                return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Publishing failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleTelegram(content: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !chatId || botToken.includes('YOUR_') || chatId.includes('YOUR_') || botToken === '' || chatId === '') {
        return NextResponse.json({ 
            success: true, 
            message: '[DRY RUN] Telegram posting simulated successfully!' 
        });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: content,
            parse_mode: 'HTML'
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Telegram API failed: ${err}`);
    }

    return NextResponse.json({ success: true, message: 'Successfully published to Telegram!' });
}

async function handleReddit(title: string, content: string) {
    const client_id = process.env.REDDIT_CLIENT_ID;
    const client_secret = process.env.REDDIT_CLIENT_SECRET;
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;
    const subreddit = (process.env.REDDIT_SUBREDDITS || 'deals').split(',')[0].trim();

    if (!client_id || !client_secret || !username || !password || client_id.includes('YOUR_') || client_id === '') {
        return NextResponse.json({ 
            success: true, 
            message: `[DRY RUN] Reddit posting simulated on r/${subreddit}!` 
        });
    }

    const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'dealsagent-bot/1.0'
        },
        body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });

    if (!tokenRes.ok) {
        const err = await tokenRes.text();
        throw new Error(`Reddit Auth failed: ${err}`);
    }

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) {
        throw new Error('Failed to retrieve Reddit access token.');
    }

    const submitRes = await fetch('https://oauth.reddit.com/api/submit', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'dealsagent-bot/1.0'
        },
        body: `sr=${subreddit}&kind=self&title=${encodeURIComponent(title)}&text=${encodeURIComponent(content)}`
    });

    if (!submitRes.ok) {
        const err = await submitRes.text();
        throw new Error(`Reddit posting failed: ${err}`);
    }

    return NextResponse.json({ success: true, message: `Successfully published to r/${subreddit}!` });
}

async function handleTwitter(content: string) {
    const apiKey = process.env.TWITTER_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_') || apiKey === '') {
        return NextResponse.json({ 
            success: true, 
            message: '[DRY RUN] Twitter/X posting simulated successfully!' 
        });
    }
    
    return NextResponse.json({ 
        success: true, 
        message: 'Twitter posting is initialized (Dry Run Simulation).' 
    });
}

async function handleFacebook(content: string, link?: string) {
    const access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const page_id = process.env.FACEBOOK_PAGE_ID;

    if (!access_token || !page_id || access_token.includes('YOUR_') || access_token === '') {
        return NextResponse.json({ 
            success: true, 
            message: '[DRY RUN] Facebook posting simulated successfully!' 
        });
    }

    const bodyParams = new URLSearchParams({
        message: content,
        access_token
    });
    if (link) {
        bodyParams.append('link', link);
    }

    const res = await fetch(`https://graph.facebook.com/${page_id}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString()
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Facebook API failed: ${err}`);
    }

    return NextResponse.json({ success: true, message: 'Successfully published to Facebook Page!' });
}

async function handleAndhrafriends(title: string, content: string) {
    const username = process.env.ANDHRAFRIENDS_USERNAME;
    const password = process.env.ANDHRAFRIENDS_PASSWORD;
    const subforumId = process.env.ANDHRAFRIENDS_SUBFORUM_ID || '20';

    if (!username || !password || username.includes('YOUR_') || username === '') {
        return NextResponse.json({ 
            success: true, 
            message: `[DRY RUN] Andhrafriends Deals section posting simulated on subforum ID ${subforumId}!` 
        });
    }

    let cookies: string[] = [];
    const getHeaders = () => ({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookies.join('; ')
    });

    const homeRes = await fetch('https://www.andhrafriends.com', { headers: getHeaders() });
    const setCookieHeaders = homeRes.headers.getSetCookie();
    cookies.push(...setCookieHeaders.map(c => c.split(';')[0]));

    const loginRes = await fetch('https://www.andhrafriends.com/login/', { headers: getHeaders() });
    const loginHtml = await loginRes.text();
    const csrfMatch = loginHtml.match(/name=["']csrfKey["']\s+value=["']([^"']+)["']/);
    const csrfKey = csrfMatch ? csrfMatch[1] : '';

    const loginBody = new URLSearchParams({
        auth: username,
        password: password,
        remember_me: '1',
        _processLogin: 'usernamepassword'
    });
    if (csrfKey) {
        loginBody.append('csrfKey', csrfKey);
    }

    const loginPostRes = await fetch('https://www.andhrafriends.com/login/', {
        method: 'POST',
        headers: {
            ...getHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: loginBody.toString(),
        redirect: 'manual'
    });
    const loginPostCookies = loginPostRes.headers.getSetCookie();
    cookies.push(...loginPostCookies.map(c => c.split(';')[0]));

    const baseCheckRes = await fetch('https://www.andhrafriends.com', { headers: getHeaders() });
    const checkText = await baseCheckRes.text();
    if (!checkText.toLowerCase().includes('sign out') && !checkText.toLowerCase().includes('logout')) {
        throw new Error('Andhrafriends Login failed. Check username and password credentials.');
    }

    const addPageUrl = `https://www.andhrafriends.com/forums/forum/${subforumId}/?do=add`;
    const addPageRes = await fetch(addPageUrl, { headers: getHeaders() });
    const addPageHtml = await addPageRes.text();
    const addCsrfMatch = addPageHtml.match(/name=["']csrfKey["']\s+value=["']([^"']+)["']/);
    const addCsrfKey = addCsrfMatch ? addCsrfMatch[1] : csrfKey;

    if (!addCsrfKey) {
        throw new Error('Failed to parse posting CSRF key from Andhrafriends page.');
    }

    const postBody = new URLSearchParams({
        topic_title: title,
        topic_content: content,
        csrfKey: addCsrfKey
    });

    const submitRes = await fetch(addPageUrl, {
        method: 'POST',
        headers: {
            ...getHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postBody.toString()
    });

    if (submitRes.status !== 200 && submitRes.status !== 302) {
        throw new Error(`Failed to submit thread to Andhrafriends. Status: ${submitRes.status}`);
    }

    return NextResponse.json({ success: true, message: 'Successfully published thread on Andhrafriends Deals forum!' });
}
