'use client';

import { signOut } from 'next-auth/react';
import styles from './page.module.css';

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
        </button>
    );
}
