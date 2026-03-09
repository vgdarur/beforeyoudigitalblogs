import styles from '../../deals/new/page.module.css';

export default function NewUserPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Add New Admin User</h1>
                <p className={styles.subtitle}>Create a new administrator account.</p>
            </div>

            <div className={styles.formCard}>
                <form action="/api/admin/users" method="POST" className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Name</label>
                        <input type="text" name="name" required placeholder="John Doe" className={styles.input} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Email Address *</label>
                        <input type="email" name="email" required placeholder="admin@example.com" className={styles.input} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Password *</label>
                        <input type="password" name="password" required className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Role *</label>
                        <select name="role" required className={styles.select}>
                            <option value="ADMIN">Administrator</option>
                            <option value="USER">Standard User</option>
                        </select>
                    </div>

                    <div className={`${styles.actions} ${styles.fullWidth}`}>
                        <a href="/admin/users" className={styles.btnCancel}>Cancel</a>
                        <button type="submit" className={styles.btnSubmit}>Create User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
