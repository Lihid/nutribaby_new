import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687a7ae12c848dbd788c5bd2",
  serverUrl: 'https://base44.app',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaWhpZGFuYXlAZ21haWwuY29tIiwiZXhwIjoxNzU5MjU3NDU4LCJpYXQiOjE3NTg2NTI2NTh9.HSn3AVTb00f60Jid5oRThnjw0ZrZ_86Qdz_r3KmmHl0',        // Optional, for user authentication
  serviceToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaWhpZGFuYXlAZ21haWwuY29tIiwiZXhwIjoxNzU5MjU3NDU4LCJpYXQiOjE3NTg2NTI2NTh9.HSn3AVTb00f60Jid5oRThnjw0ZrZ_86Qdz_r3KmmHl0', // Optional, for service role authentication
  autoInitAuth: true,
  requiresAuth: true // Ensure authentication is required for all operations
});
