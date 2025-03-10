/**
 * @author remco stoeten
 * @description Helper functions for generating random user data
 */

const firstNames = [
    'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia',
    'Oliver', 'Isabella', 'Elijah', 'Charlotte', 'Henry', 'Amelia', 'Lucas',
    'Mia', 'Benjamin', 'Harper', 'Theodore', 'Evelyn'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

/**
 * Generates a random name from predefined lists
 */
export const generateRandomName = (): string => {
    const names = Math.random() > 0.5 ? firstNames : lastNames;
    return names[Math.floor(Math.random() * names.length)];
};

/**
 * Generates a random email using provided first and last names
 */
export const generateRandomEmail = (firstName: string, lastName: string): string => {
    const randomNum = Math.floor(Math.random() * 1000);
    const domain = Math.random() > 0.5 ? 'example.com' : 'test.com';
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
}; 