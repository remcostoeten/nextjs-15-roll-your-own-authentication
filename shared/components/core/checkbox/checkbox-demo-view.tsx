'use client'

import React from 'react'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'
import styles from './checkbox-demo.module.css'

export default function CheckboxDemo() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Checkbox Component Demo</h1>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Square Checkboxes</h2>
				<div className={styles.demoRow}>
					<div className={styles.demoItem}>
						<Checkbox label="Default" />
						<code className={styles.code}>
							&lt;Checkbox label="Default" /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Checked"
							checked
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Checked" checked /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Required"
							required
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Required" required /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Disabled"
							disabled
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Disabled" disabled /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Checked Disabled"
							checked
							disabled
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Checked Disabled" checked
							disabled /&gt;
						</code>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Round Checkboxes</h2>
				<div className={styles.demoRow}>
					<div className={styles.demoItem}>
						<Checkbox
							label="Round"
							round
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Round" round /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Round Checked"
							round
							checked
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Round Checked" round checked
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Round Required"
							round
							required
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Round Required" round required
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Round Disabled"
							round
							disabled
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Round Disabled" round disabled
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Round Checked Disabled"
							round
							checked
							disabled
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Round Checked Disabled" round
							checked disabled /&gt;
						</code>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Custom Colors</h2>
				<div className={styles.demoRow}>
					<div className={styles.demoItem}>
						<Checkbox
							label="Default Color"
							checked
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Default Color" checked /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Blue"
							checked
							color="#2196f3"
							hoverColor="#42a5f5"
							activeColor="#1976d2"
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Blue" checked color="#2196f3"
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Red"
							checked
							color="#f44336"
							hoverColor="#ef5350"
							activeColor="#d32f2f"
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Red" checked color="#f44336"
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							round
							label="Purple Round"
							checked
							color="#9c27b0"
							hoverColor="#ab47bc"
							activeColor="#7b1fa2"
						/>
						<code className={styles.code}>
							&lt;Checkbox round label="Purple Round" checked
							color="#9c27b0" /&gt;
						</code>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Custom Sizes</h2>
				<div className={styles.demoRow}>
					<div className={styles.demoItem}>
						<Checkbox
							label="Small (16px)"
							checked
							size={16}
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Small" checked size={16} /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Medium (24px)"
							checked
							size={24}
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Medium" checked size={24} /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Large (32px)"
							checked
							size={32}
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Large" checked size={32} /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							round
							label="Round Large (32px)"
							checked
							size={32}
						/>
						<code className={styles.code}>
							&lt;Checkbox round label="Round Large" checked size=
							{32} /&gt;
						</code>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Animation Duration</h2>
				<div className={styles.demoRow}>
					<div className={styles.demoItem}>
						<Checkbox
							label="Fast (100ms)"
							animationDuration={100}
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Fast" animationDuration={100}{' '}
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox label="Default (250ms)" />
						<code className={styles.code}>
							&lt;Checkbox label="Default" /&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							label="Slow (500ms)"
							animationDuration={500}
						/>
						<code className={styles.code}>
							&lt;Checkbox label="Slow" animationDuration={500}{' '}
							/&gt;
						</code>
					</div>

					<div className={styles.demoItem}>
						<Checkbox
							round
							label="Very Slow (1000ms)"
							animationDuration={1000}
						/>
						<code className={styles.code}>
							&lt;Checkbox round label="Very Slow"
							animationDuration={1000} /&gt;
						</code>
					</div>
				</div>
			</section>
		</div>
	)
}
