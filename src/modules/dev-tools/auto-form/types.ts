/**
 * @author remco stoeten
 * @description Type definitions for the auto form filler utility
 */

export type FormFields = {
    firstName: HTMLInputElement | null;
    lastName: HTMLInputElement | null;
    email: HTMLInputElement | null;
    password: HTMLInputElement | null;
    confirmPassword: HTMLInputElement | null;
    terms: HTMLInputElement | null;
};

export type Position = {
    x: number;
    y: number;
}; 