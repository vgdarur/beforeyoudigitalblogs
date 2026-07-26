import styles from './page.module.css';

export default function SupplierOutreachPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1>Amazon FBA Wholesale & Supplier Outreach</h1>
                <p>AI Deals of America is expanding product discovery, wholesale sourcing, and Amazon FBA operations by partnering with trusted brands, distributors, and manufacturers.</p>
            </section>

            <main>
                {/* Business Goal */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Business Goal</h2>
                    <p style={{ margin: '0 0 1rem 0', color: '#334155' }}>
                        The goal is to build a safe and scalable Amazon FBA resale business by purchasing products directly from authorized brands, distributors, and wholesalers instead of relying on risky retail arbitrage or unknown suppliers.
                    </p>
                    <p style={{ margin: 0, color: '#334155' }}>
                        This model focuses on proper invoices, brand permission, compliant sourcing, repeatable inventory, and long-term supplier relationships.
                    </p>
                </section>

                {/* Recommended Supplier Targets */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Recommended Beginner-Friendly Supplier Targets</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Supplier / Platform</th>
                                    <th>Focus Area</th>
                                    <th>Beginner Fit</th>
                                    <th>Website</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Faire</strong></td>
                                    <td>Small brands, home, gifts, kitchen, beauty, pet, eco products</td>
                                    <td><span className={styles.badge}>Very Good</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Low minimums and many small brands.</span></td>
                                    <td><a href="https://www.faire.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>faire.com</a></td>
                                </tr>
                                <tr>
                                    <td><strong>Nation Distribution</strong></td>
                                    <td>Grocery, health, beauty, household products</td>
                                    <td><span className={styles.badge}>Good</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Useful for Amazon wholesale and small testing orders.</span></td>
                                    <td><a href="https://nationdistribution.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>nationdistribution.com</a></td>
                                </tr>
                                <tr>
                                    <td><strong>EN Wholesale LLC</strong></td>
                                    <td>Wholesale inventory, Amazon invoices, ungating support</td>
                                    <td><span className={styles.badge}>Good</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Useful for sellers needing invoice history.</span></td>
                                    <td><a href="https://enwholesalellc.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>enwholesalellc.com</a></td>
                                </tr>
                                <tr>
                                    <td><strong>Wholesale Central</strong></td>
                                    <td>Supplier directory, closeouts, wholesale products</td>
                                    <td><span className={styles.badge}>Good</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Good place to discover smaller distributors.</span></td>
                                    <td><a href="https://www.wholesalecentral.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>wholesalecentral.com</a></td>
                                </tr>
                                <tr>
                                    <td><strong>ASD Market Week</strong></td>
                                    <td>Trade show for wholesale, retail, and consumer products</td>
                                    <td><span className={styles.badge}>Good</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Best for networking directly with brands.</span></td>
                                    <td><a href="https://asdonline.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>asdonline.com</a></td>
                                </tr>
                                <tr>
                                    <td><strong>Infinity Distribution LLC</strong></td>
                                    <td>Amazon FBA inventory, pallets, cases, wholesale lots</td>
                                    <td><span className={styles.badge} style={{ background: '#fee2e2', color: '#991b1b' }}>Moderate</span><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Research pricing and permissions before ordering.</span></td>
                                    <td><a href="https://infinitydistributionllc.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0b3d91', fontWeight: 'bold' }}>infinitydistributionllc.com</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Categories */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Best Product Categories to Start With</h2>
                    <div className={styles.grid}>
                        <div className={styles.miniCard}>
                            <h3>Indian & Ethnic Products</h3>
                            <p>Snacks, masalas, pickles, pooja items, steel kitchenware, and regional grocery items. This is a strong fit because of community knowledge and demand.</p>
                        </div>
                        <div className={styles.miniCard}>
                            <h3>Home & Kitchen</h3>
                            <p>Storage products, kitchen accessories, cleaning tools, reusable household items, and practical everyday products.</p>
                        </div>
                        <div className={styles.miniCard}>
                            <h3>Lawn & Outdoor</h3>
                            <p>Small lawn accessories, sprinkler parts, gardening tools, outdoor maintenance products, and turf-care related items.</p>
                        </div>
                        <div className={styles.miniCard}>
                            <h3>Consumables</h3>
                            <p>Products that people reorder regularly. Repeat purchase behavior can help build stable replenishment inventory.</p>
                        </div>
                    </div>
                </section>

                {/* Strategy */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Supplier Approval Strategy</h2>
                    <p style={{ margin: '0 0 1rem 0', color: '#334155' }}>Do not position the business as a new Amazon seller. Position it as a professional marketplace and product promotion partner.</p>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8 }}>
                        <li>Ask for wholesale catalog first.</li>
                        <li>Ask whether Amazon resale is allowed.</li>
                        <li>Start with small orders to test product movement.</li>
                        <li>Use proper business invoices, not retail receipts.</li>
                        <li>Build long-term relationships with replenishable brands.</li>
                        <li>Avoid asking for exclusivity in the beginning.</li>
                    </ul>
                </section>

                {/* Documents */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Documents to Keep Ready</h2>
                    <div className={styles.grid}>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>LLC / Business registration</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>EIN</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Resale certificate</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Professional business email</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Amazon seller account</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Business website</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Shipping / FBA plan</div>
                        <div className={styles.miniCard} style={{ textAlign: 'center', fontWeight: 'bold' }}>Capability statement</div>
                    </div>
                </section>

                {/* Warning */}
                <section className={`${styles.section} ${styles.warning}`}>
                    <h2 className={styles.sectionTitle}>Important Warning</h2>
                    <p style={{ margin: '0 0 1rem 0', color: '#7c2d12' }}>
                        Avoid “done-for-you Amazon automation,” “guaranteed profit,” and “we manage your store” companies. Many of these models can be risky, overpriced, or non-compliant with Amazon policies.
                    </p>
                    <p style={{ margin: 0, color: '#7c2d12' }}>
                        Start small, verify suppliers, confirm Amazon resale permission, and only scale after product performance is proven.
                    </p>
                </section>

                {/* Cover Letter */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Supplier / Brand Cover Letter</h2>
                    <div className={styles.letter}>
{`Dear Wholesale Partner,

My name is Venu Darur and I represent Before You Digital LLC based in Georgia, USA.

We are currently expanding our wholesale and Amazon FBA operations and are looking to establish long-term relationships with trusted brands, distributors, and manufacturers.

In addition to Amazon marketplace operations, we also promote products through our growing platform, AI Deals of America (aidealsofamerica.com), where we feature trending deals, consumer products, and emerging brands for a growing online audience.

Our focus areas include:
• Amazon FBA fulfillment and inventory management
• Marketplace-compliant product representation
• Brand visibility and online promotions
• Long-term wholesale purchasing relationships
• Repeat replenishment inventory models

We are especially interested in:
• Small to medium-sized brands
• Authorized reseller opportunities
• Low or moderate MOQ partnerships
• Amazon-friendly distributors and suppliers

We would appreciate the opportunity to review your wholesale catalog and reseller requirements.

Please let us know:
• Wholesale application process
• MOQ requirements
• Amazon resale policies
• Pricing sheets and catalogs
• Distributor or reseller documentation needed

We look forward to building a professional and long-term partnership.

Thank you,

Venu Darur
Before You Digital LLC
Georgia, USA
AI Deals of America: https://aidealsofamerica.com`}
                    </div>
                </section>

                {/* Action Plan */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>First 60-Day Action Plan</h2>
                    <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8 }}>
                        <li>Open wholesale accounts with 3–5 beginner-friendly suppliers.</li>
                        <li>Request product catalogs and price sheets.</li>
                        <li>Confirm Amazon resale permission in writing.</li>
                        <li>Analyze products for ROI, competition, Buy Box stability, and demand.</li>
                        <li>Place small test orders only.</li>
                        <li>Send inventory to Amazon FBA after inspection and prep.</li>
                        <li>Track sell-through, profit, returns, and supplier reliability.</li>
                        <li>Reorder only proven products.</li>
                    </ol>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <h2>Partner With AI Deals of America</h2>
                    <p>We help brands gain visibility through product discovery, deal promotion, marketplace operations, and Amazon FBA fulfillment.</p>
                    <a href="https://aidealsofamerica.com" target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>Visit AI Deals of America</a>
                </section>
            </main>
        </div>
    );
}
