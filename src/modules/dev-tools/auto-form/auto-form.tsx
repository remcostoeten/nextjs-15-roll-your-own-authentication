/**
 * @author remco stoeten
 * @description Development utility for auto-filling form fields with random user data
 */

'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { generateRandomName, generateRandomEmail } from './helpers/generators';
import type { FormFields, Position } from './types';

interface AutoFormFillerProps {
    enabled?: boolean;
}

export const AutoFormFiller = ({ enabled = process.env.NODE_ENV === 'development' }: AutoFormFillerProps) => {
    const [position, setPosition] = useState<Position>({ x: 20, y: 20 });

    const fillFormFields = useCallback(() => {
        try {
            const firstName = generateRandomName();
            const lastName = generateRandomName();
            const email = generateRandomEmail(firstName, lastName);
            const password = process.env.NEXT_PUBLIC_DEVELOPMENT_PASSWORD;

            if (!password) {
                console.error('Development password not found in environment variables');
                return;
            }

            // Target form fields
            const fields: FormFields = {
                firstName: document.querySelector('input[name="firstName"]'),
                lastName: document.querySelector('input[name="lastName"]'),
                email: document.querySelector('input[name="email"]'),
                password: document.querySelector('input[name="password"]'),
                confirmPassword: document.querySelector('input[name="confirmPassword"]'),
                terms: document.querySelector('input[type="checkbox"][name="terms"]'),
            };

            // Fill form fields
            if (fields.firstName) fields.firstName.value = firstName;
            if (fields.lastName) fields.lastName.value = lastName;
            if (fields.email) fields.email.value = email;
            if (fields.password) fields.password.value = password;
            if (fields.confirmPassword) fields.confirmPassword.value = password;
            if (fields.terms) fields.terms.checked = true;

            // Trigger input events for form validation
            Object.values(fields).forEach((field) => {
                if (field) {
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // Copy credentials to clipboard
            navigator.clipboard.writeText(`${email},${password}`).then(
                () => console.log('Credentials copied to clipboard'),
                (err) => console.error('Failed to copy credentials:', err)
            );
        } catch (error) {
            console.error('Error filling form:', error);
        }
    }, []);

    if (!enabled) return null;

    return (
        <motion.button
            drag
            dragMomentum={false}
            initial={position}
            className="fixed z-50 p-2 text-xs font-mono text-white bg-purple-600 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            onClick={fillFormFields}
            onDragEnd={(_, info) => {
                setPosition({ x: info.point.x, y: info.point.y });
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            Fill Form
        </motion.button>
    );
}; 