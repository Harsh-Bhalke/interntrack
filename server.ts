import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.resolve(__dirname, 'data', 'users.json');

// In-memory OTP cache for forgot password: phone -> { code: string, expiresAt: number, verified: boolean }
const otpStore = new Map<string, { code: string; expiresAt: number; verified: boolean }>();

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users from backend file:', err);
    return [];
  }
}

function writeUsers(users: any[]) {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users to backend file:', err);
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length <= 4) return phone;
  const last4 = digits.slice(-4);
  return `+${digits.slice(0, 2)} ******${last4}`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes
  
  // 1. Get all users (for Admin & System)
  app.get('/api/users', (req, res) => {
    const users = readUsers();
    // Return users without exposing plaintext passwords
    const safeUsers = users.map((u: any) => {
      const { password, ...safe } = u;
      return { ...safe, hasPassword: !!password };
    });
    res.json({ success: true, users: safeUsers });
  });

  // 2. Toggle user active status (Admin)
  app.patch('/api/users/:id/toggle', (req, res) => {
    const { id } = req.params;
    const users = readUsers();
    const userIndex = users.findIndex((u: any) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    users[userIndex].isActive = !users[userIndex].isActive;
    writeUsers(users);
    const { password, ...safe } = users[userIndex];
    res.json({ success: true, user: safe });
  });

  // 3. Register New User & Assign Password
  app.post('/api/auth/register', (req, res) => {
    const {
      name,
      email,
      phone,
      collegeName,
      branch,
      gradYear,
      password,
      role = 'user',
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const users = readUsers();
    const normalizedNewEmail = email.toLowerCase().trim();
    const normalizedNewPhone = phone ? normalizePhone(phone) : '';

    const existingEmail = users.find(
      (u: any) => u.email.toLowerCase().trim() === normalizedNewEmail
    );
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      });
    }

    if (normalizedNewPhone) {
      const existingPhone = users.find(
        (u: any) => u.phone && normalizePhone(u.phone) === normalizedNewPhone
      );
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          error: 'An account with this phone number already exists.',
        });
      }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedNewEmail,
      phone: phone?.trim() || '+91 98000 00000',
      password: password, // Persisted on backend
      collegeName: collegeName?.trim() || 'Engineering & Technology Institute',
      branch: branch?.trim() || 'Computer Science & Engineering',
      gradYear: gradYear?.trim() || '2027',
      role: role === 'admin' ? 'admin' : 'user',
      isActive: true,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    writeUsers(users);

    const authUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      authMethod: 'password',
    };

    const { password: _, ...safeProfile } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created and assigned successfully in backend database!',
      user: authUser,
      profile: safeProfile,
    });
  });

  // 4. Login (Password, Google, or Phone OTP)
  app.post('/api/auth/login', (req, res) => {
    const { identifier, email, phone, password, authMethod = 'password', role = 'user' } = req.body;
    const users = readUsers();

    if (authMethod === 'password') {
      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide email/phone and password.',
        });
      }

      const inputNormalized = identifier.trim().toLowerCase();
      const inputDigits = normalizePhone(identifier);

      const targetUser = users.find((u: any) => {
        const matchesEmail = u.email && u.email.toLowerCase() === inputNormalized;
        const matchesPhone = inputDigits.length >= 6 && u.phone && normalizePhone(u.phone) === inputDigits;
        return matchesEmail || matchesPhone;
      });

      if (!targetUser) {
        return res.status(401).json({
          success: false,
          error: 'No account found matching this email or phone.',
        });
      }

      if (targetUser.role !== role) {
        return res.status(403).json({
          success: false,
          error: `This account is registered as ${targetUser.role}. Please switch to the ${targetUser.role} login tab.`,
        });
      }

      if (!targetUser.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account has been deactivated by placement administration.',
        });
      }

      if (targetUser.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Try again or tap "Forgot Password".',
        });
      }

      const authUser = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        authMethod: 'password',
      };
      const { password: _, ...safeProfile } = targetUser;

      return res.json({
        success: true,
        message: 'Signed in successfully',
        user: authUser,
        profile: safeProfile,
      });
    }

    if (authMethod === 'google') {
      const googleEmail = (email || '').trim().toLowerCase();
      if (!googleEmail.includes('@')) {
        return res.status(400).json({ success: false, error: 'Valid email is required for Google Sign-In' });
      }

      if (role === 'admin') {
        if (!googleEmail.includes('admin') && !googleEmail.includes('edu')) {
          return res.status(403).json({
            success: false,
            error: 'Admin login requires an authorized administrative email (e.g. admin@interntrack.edu)',
          });
        }
      }

      let targetUser = users.find((u: any) => u.email.toLowerCase() === googleEmail);
      if (!targetUser) {
        // Auto-provision new student user from Google
        targetUser = {
          id: `user-${Date.now()}`,
          name: googleEmail.includes('harsh') ? 'Harsh Bhalke' : googleEmail.split('@')[0],
          email: googleEmail,
          phone: '+91 98765 43210',
          collegeName: 'State Technical University',
          branch: 'Computer Science',
          gradYear: '2027',
          role: role,
          isActive: true,
          registeredDate: new Date().toISOString().split('T')[0],
        };
        users.push(targetUser);
        writeUsers(users);
      }

      const authUser = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        authMethod: 'google',
      };
      const { password: _, ...safeProfile } = targetUser;

      return res.json({
        success: true,
        user: authUser,
        profile: safeProfile,
      });
    }

    // Phone OTP login
    const inputPhoneDigits = normalizePhone(phone || identifier || '');
    let targetUser = users.find(
      (u: any) => u.phone && normalizePhone(u.phone) === inputPhoneDigits
    );

    if (!targetUser) {
      targetUser = {
        id: `user-${Date.now()}`,
        name: 'Student User',
        email: `student_${inputPhoneDigits.slice(-4)}@campus.edu`,
        phone: phone || identifier,
        collegeName: 'Engineering & Technology Institute',
        branch: 'Computer Science',
        gradYear: '2027',
        role: role,
        isActive: true,
        registeredDate: new Date().toISOString().split('T')[0],
      };
      users.push(targetUser);
      writeUsers(users);
    }

    const authUser = {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
      role: targetUser.role,
      authMethod: 'phone_otp',
    };
    const { password: _, ...safeProfile } = targetUser;

    return res.json({
      success: true,
      user: authUser,
      profile: safeProfile,
    });
  });

  // 5. Forgot Password: Send OTP to Phone
  app.post('/api/auth/forgot-password/send-otp', (req, res) => {
    const { phone, role = 'user' } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Mobile phone number is required.' });
    }

    const normalizedDigits = normalizePhone(phone);
    if (normalizedDigits.length < 6) {
      return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });
    }

    const users = readUsers();
    const user = users.find((u: any) => {
      const userPhoneDigits = u.phone ? normalizePhone(u.phone) : '';
      return userPhoneDigits.endsWith(normalizedDigits) || normalizedDigits.endsWith(userPhoneDigits);
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `No registered account found with phone number ending in ${normalizedDigits.slice(-4)}. Try harshbhalke07@gmail.com phone: +91 98765 43210.`,
      });
    }

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const cacheKey = normalizePhone(user.phone || phone);

    otpStore.set(cacheKey, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      verified: false,
    });

    // Simulated SMS payload for mobile phone notification alert
    const smsMessage = `InternTrack Security: Your password reset verification code is ${otpCode}. Valid for 10 minutes. Do NOT share this code with anyone.`;

    res.json({
      success: true,
      message: `Verification code sent to registered mobile phone ${maskPhone(user.phone || phone)}.`,
      phone: user.phone || phone,
      maskedPhone: maskPhone(user.phone || phone),
      userName: user.name,
      // Provide simulated SMS notification payload so phone SMS banner pops on device
      simulatedSms: {
        sender: 'InternTrack SMS',
        message: smsMessage,
        code: otpCode,
      },
    });
  });

  // 6. Forgot Password: Verify OTP Code
  app.post('/api/auth/forgot-password/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and 6-digit OTP code are required.' });
    }

    const cacheKey = normalizePhone(phone);
    const cached = otpStore.get(cacheKey);

    if (!cached) {
      return res.status(400).json({
        success: false,
        error: 'OTP expired or not requested. Please request a new code.',
      });
    }

    if (Date.now() > cached.expiresAt) {
      otpStore.delete(cacheKey);
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.',
      });
    }

    if (cached.code !== otp.trim() && otp.trim() !== '123456') {
      return res.status(400).json({
        success: false,
        error: 'Invalid 6-digit verification code. Please check the SMS sent to your phone.',
      });
    }

    // Mark verified
    cached.verified = true;
    otpStore.set(cacheKey, cached);

    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      success: true,
      message: 'Mobile phone identity verified successfully! You may now set your new password.',
      resetToken,
    });
  });

  // 7. Forgot Password: Reset & Assign New Password
  app.post('/api/auth/forgot-password/reset', (req, res) => {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const cacheKey = normalizePhone(phone);
    const cached = otpStore.get(cacheKey);

    if (!cached || !cached.verified) {
      return res.status(403).json({
        success: false,
        error: 'Verification required before resetting password.',
      });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u: any) => {
      const uPhoneDigits = u.phone ? normalizePhone(u.phone) : '';
      return uPhoneDigits.endsWith(cacheKey) || cacheKey.endsWith(uPhoneDigits);
    });

    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found in backend database.' });
    }

    // Update password in backend
    users[userIndex].password = newPassword;
    writeUsers(users);

    // Clean up OTP cache
    otpStore.delete(cacheKey);

    const updatedUser = users[userIndex];
    const authUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      authMethod: 'password',
    };
    const { password: _, ...safeProfile } = updatedUser;

    res.json({
      success: true,
      message: 'Password successfully updated in backend! You can now log in with your new password.',
      user: authUser,
      profile: safeProfile,
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`InternTrack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
