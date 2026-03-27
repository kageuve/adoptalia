export interface User {
  name: string;
  email: string;
  password: string;
  userType: 'adoptante' | 'protectora';

  // opcionales (solo protectora)
  organization?: string;
  phone?: string;
}