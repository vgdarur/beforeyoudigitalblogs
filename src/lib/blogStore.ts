import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface StoredBlog {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    authorId?: string | null;
    author?: { name?: string | null; email?: string | null } | null;
    createdAt: string;
    updatedAt: string;
}

const DATA_DIR = process.env.NODE_ENV === 'production'
    ? path.join('/tmp', 'beforeyoudigitalblogs')
    : path.join(process.cwd(), 'data');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');

// Default initial articles seeded if file does not exist
const INITIAL_BLOGS: StoredBlog[] = [
    {
        id: 'initial-zero-interchange-prd',
        title: 'Zero-Interchange POS & Alternative Payment Rails: Complete Product Specification',
        slug: 'zero-interchange-pos-alternative-payments',
        content: `
            <h2>Executive Summary: Eliminating the 2.5% to 3.5% Card Interchange Tax</h2>
            <p>Traditional payment processing costs US merchants billions annually in interchange fees. This comprehensive architecture outlines how modern merchant POS systems can eliminate card network fees through direct non-card rails: Venmo, Cash App, Zelle, Plaid-free bank-to-bank FedNow/instant ACH, and Check 21 mobile OCR.</p>
            
            <h3>Key Direct Rails Supported</h3>
            <ul>
                <li><strong>Venmo & Cash App Pay:</strong> Direct digital wallet scanning with zero percentage processing fees for merchant-direct accounts.</li>
                <li><strong>FedNow & Instant ACH:</strong> Micro-deposit-free direct clearing via the Federal Reserve FedNow Service.</li>
                <li><strong>Check 21 OCR:</strong> Real-time MICR line scanning and deposit verification compliant with federal Check 21 clearing standards.</li>
                <li><strong>Zelle Business:</strong> Real-time bank transfer notification integrated into point-of-sale checkout screens.</li>
            </ul>

            <div style="margin: 2rem 0; padding: 1.5rem; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 6px;">
                <h4 style="margin-top:0; color: #1e40af;">Interactive Requirements Document</h4>
                <p>The interactive product requirements and technical architecture can be explored live in the <a href="/payment-prd" style="color: #2563eb; font-weight: 600;">Payment PRD Portal</a>.</p>
            </div>

            <p>Explore our curated deals below while learning more about merchant optimization and digital commerce.</p>
        `,
        published: true,
        authorId: 'admin-master',
        author: { name: 'Editorial Team', email: 'vgdarur@gmail.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

function ensureDataFile(): StoredBlog[] {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(BLOGS_FILE)) {
            fs.writeFileSync(BLOGS_FILE, JSON.stringify(INITIAL_BLOGS, null, 2), 'utf-8');
            return INITIAL_BLOGS;
        }
        const raw = fs.readFileSync(BLOGS_FILE, 'utf-8');
        return JSON.parse(raw) as StoredBlog[];
    } catch (e) {
        console.warn('Error reading blogs.json:', e);
        return INITIAL_BLOGS;
    }
}

function writeDataFile(blogs: StoredBlog[]): void {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
    } catch (e) {
        console.warn('Error writing blogs.json:', e);
    }
}

/**
 * Retrieve all blogs, prioritizing database but gracefully falling back to file storage
 */
export async function getAllBlogs(onlyPublished = false): Promise<StoredBlog[]> {
    const fileBlogs = ensureDataFile();
    let dbBlogs: any[] = [];

    try {
        dbBlogs = await prisma.blog.findMany({
            where: onlyPublished ? { published: true } : undefined,
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (dbErr) {
        // Database offline or quota exceeded
    }

    if (dbBlogs && dbBlogs.length > 0) {
        // Merge DB blogs with file blogs (deduplicated by slug)
        const slugMap = new Map<string, StoredBlog>();
        
        // Add file blogs first
        fileBlogs.forEach(b => {
            if (!onlyPublished || b.published) {
                slugMap.set(b.slug, b);
            }
        });

        // Overlay with database blogs
        dbBlogs.forEach(b => {
            slugMap.set(b.slug, {
                id: b.id,
                title: b.title,
                slug: b.slug,
                content: b.content,
                published: b.published,
                authorId: b.authorId,
                author: b.author ? { name: b.author.name, email: b.author.email } : null,
                createdAt: b.createdAt.toISOString(),
                updatedAt: b.updatedAt.toISOString(),
            });
        });

        return Array.from(slugMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return onlyPublished ? fileBlogs.filter(b => b.published) : fileBlogs;
}

/**
 * Retrieve a single blog by slug, resilient to database failure
 */
export async function getBlogBySlug(slug: string, onlyPublished = true): Promise<StoredBlog | null> {
    const decoded = decodeURIComponent(slug).toLowerCase();
    
    // 1. Try database first
    try {
        const dbBlog = await prisma.blog.findFirst({
            where: {
                slug: { in: [slug, decoded] },
                ...(onlyPublished ? { published: true } : {})
            },
            include: { author: true }
        });

        if (dbBlog) {
            return {
                id: dbBlog.id,
                title: dbBlog.title,
                slug: dbBlog.slug,
                content: dbBlog.content,
                published: dbBlog.published,
                authorId: dbBlog.authorId,
                author: dbBlog.author ? { name: dbBlog.author.name, email: dbBlog.author.email } : null,
                createdAt: dbBlog.createdAt.toISOString(),
                updatedAt: dbBlog.updatedAt.toISOString(),
            };
        }
    } catch (e) {
        // Database offline or quota exceeded
    }

    // 2. Fall back to local file store
    const fileBlogs = ensureDataFile();
    const found = fileBlogs.find(b => {
        const matchesSlug = b.slug.toLowerCase() === slug.toLowerCase() || b.slug.toLowerCase() === decoded;
        return matchesSlug && (!onlyPublished || b.published);
    });

    return found || null;
}

/**
 * Save or update a blog in both file store and database (if available)
 */
export async function saveBlog(data: {
    id?: string | null;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    authorId?: string | null;
}): Promise<StoredBlog> {
    const fileBlogs = ensureDataFile();
    const cleanSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    let targetId = data.id || `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const existingIndex = fileBlogs.findIndex(b => (data.id && b.id === data.id) || b.slug === cleanSlug);

    const newBlog: StoredBlog = {
        id: targetId,
        title: data.title,
        slug: cleanSlug,
        content: data.content,
        published: data.published,
        authorId: data.authorId || null,
        author: { name: 'Administrator', email: 'vgdarur@gmail.com' },
        createdAt: existingIndex >= 0 ? fileBlogs[existingIndex].createdAt : now,
        updatedAt: now,
    };

    if (existingIndex >= 0) {
        newBlog.id = fileBlogs[existingIndex].id;
        fileBlogs[existingIndex] = newBlog;
    } else {
        fileBlogs.unshift(newBlog);
    }

    writeDataFile(fileBlogs);

    // Attempt to persist to PostgreSQL if available, silently handling quota error
    try {
        const authorIdToUse = data.authorId && data.authorId !== 'admin-master' ? data.authorId : null;
        
        if (data.id) {
            await prisma.blog.upsert({
                where: { id: data.id },
                update: {
                    title: data.title,
                    slug: cleanSlug,
                    content: data.content,
                    published: data.published,
                },
                create: {
                    id: data.id,
                    title: data.title,
                    slug: cleanSlug,
                    content: data.content,
                    published: data.published,
                    ...(authorIdToUse ? { authorId: authorIdToUse } : {})
                }
            });
        } else {
            await prisma.blog.create({
                data: {
                    title: data.title,
                    slug: cleanSlug,
                    content: data.content,
                    published: data.published,
                    ...(authorIdToUse ? { authorId: authorIdToUse } : {})
                }
            });
        }
    } catch (e) {
        console.warn('Database write bypassed (quota or connection issue). Saved to resilient local store successfully:', (e as any)?.message);
    }

    return newBlog;
}

/**
 * Delete a blog from both file store and database
 */
export async function deleteBlog(id: string): Promise<boolean> {
    const fileBlogs = ensureDataFile();
    const updated = fileBlogs.filter(b => b.id !== id);
    writeDataFile(updated);

    try {
        await prisma.blog.delete({
            where: { id }
        });
    } catch (e) {
        // Silently handle if not in DB or DB down
    }

    return true;
}
