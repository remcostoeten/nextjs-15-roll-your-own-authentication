import React from 'react';
// Import the validated environment object
// Adjust the path '../env' if your env/index.ts is located elsewhere
import { env } from '../env';

/**
 * A simple component demonstrating how to access validated
 * environment variables within a React component.
 */
const EnvDisplay: React.FC = () => {
  // Access the JWT_SECRET from the validated env object.
  // Since it's marked as .required() in the schema, TypeScript
  // knows it should be a string here. If the validation failed
  // on startup, this component likely wouldn't render anyway.
  const jwtSecretValue = env.JWT_SECRET;

  // You could also access optional variables and handle their potential undefined state:
  const adminEmail = env.ADMIN_EMAIL; // Type: string | undefined
  const redisUrl = env.REDIS_URL;     // Type: string | undefined

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>Environment Variable Demonstration</h2>
      <p>
        This component shows how environment variables are accessed after being validated
        by the system in <code>src/env/index.ts</code>.
      </p>
      <hr style={{ margin: '15px 0' }} />
      <div>
        <strong>JWT_SECRET:</strong>
        {/* Displaying secrets directly in the frontend is generally insecure!
            This is purely for demonstrating access. In a real app,
            you'd use this secret on the server-side. */}
        <pre style={{
          backgroundColor: '#eee',
          padding: '10px',
          borderRadius: '4px',
          wordBreak: 'break-all', // Prevent long secrets from overflowing
          whiteSpace: 'pre-wrap'  // Allow wrapping
         }}>
          {jwtSecretValue ? jwtSecretValue : 'SECRET NOT SET (Should not happen for required vars if validation passed!)'}
        </pre>
        <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>
          Warning: Never expose sensitive secrets like JWT_SECRET directly in your frontend code or UI in a real application!
        </small>
      </div>
      <hr style={{ margin: '15px 0' }} />
      <div>
        <strong>ADMIN_EMAIL (Optional):</strong>
        <pre style={{ backgroundColor: '#eee', padding: '5px', borderRadius: '4px' }}>
          {adminEmail ? adminEmail : 'Not Provided'}
        </pre>
      </div>
      <div>
        <strong>REDIS_URL (Optional):</strong>
        <pre style={{ backgroundColor: '#eee', padding: '5px', borderRadius: '4px' }}>
          {redisUrl ? redisUrl : 'Not Provided'}
        </pre>
      </div>
    </div>
  );
};

export default EnvDisplay;

/*
// How to use this component in another part of your app (e.g., a page):
// import EnvDisplay from './components/EnvDisplay';
//
// function MyPage() {
//   return (
//     <div>
//       <h1>My Application Page</h1>
//       <EnvDisplay />
//       {/* ... other content ... *\/}
//     </div>
//   );
// }
*/
