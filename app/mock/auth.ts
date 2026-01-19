import { admins, otps } from "./db";

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));
const uuid = () => crypto.randomUUID();



function createOtp(entity_id: string, purpose: string) {
  const otp = "123456";

  otps.push({
    id: uuid(),
    entity_id,
    entity_type: "Admin",
    otp,
    purpose,
    expires_at: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
  });

  console.log(`[MOCK OTP] ${purpose.toUpperCase()} for ${entity_id}:`, otp);

  return otp;
}



export async function mockLoginAdmin(data: {
  email: string;
  password: string;
}) {
  await delay();

  const admin = admins.find(
    (a) => a.email === data.email && a.password === data.password
  );

  if (!admin) throw new Error("Invalid credentials");
  if (!admin.isVerified) throw new Error("Please verify your account");

  createOtp(admin.admin_id, "login");

  return {
    admin_id: admin.admin_id,
    admin_email: admin.email,
  };
}

export async function mockRegisterAdmin(data: {
  full_name: string;
  email: string;
  password: string;
}) {
  await delay();

  if (admins.find((a) => a.email === data.email)) {
    throw new Error("Admin already exists");
  }

  const admin_id = uuid();

  admins.push({
    admin_id,
    full_name: data.full_name,
    email: data.email,
    password: data.password,
    isVerified: false,
  });

  createOtp(admin_id, "register");

  return { admin_id };
}



export async function mockVerifyOtp(data: {
  admin_id: string;
  otp: string;
  purpose: string;
}) {
  await delay();

  const record = otps.find(
    (o) =>
      o.entity_id === data.admin_id &&
      o.entity_type === "Admin" &&
      o.otp === data.otp &&
      o.purpose === data.purpose
  );

  if (!record) throw new Error("Invalid OTP");
  if (record.expires_at < new Date()) throw new Error("OTP expired");

  record.attempts += 1;
  if (record.attempts > 5) throw new Error("Too many attempts");

  const admin = admins.find((a) => a.admin_id === data.admin_id);
  if (!admin) throw new Error("Admin not found");

  if (data.purpose === "register") {
    admin.isVerified = true;
  }

 
  otps.splice(otps.indexOf(record), 1);

  return {
    token: "mock-jwt-token",
  };
}



export async function mockForgotPassword(data: { email: string }) {
  await delay();

  const admin = admins.find((a) => a.email === data.email);
  if (!admin) throw new Error("Admin with this email does not exist");

  createOtp(admin.admin_id, "reset_password");

  return { admin_id: admin.admin_id };
}

export async function mockResetPassword(data: {
  admin_id: string;
  new_password: string;
}) {
  await delay();

  const admin = admins.find((a) => a.admin_id === data.admin_id);
  if (!admin) throw new Error("Admin not found");

  admin.password = data.new_password;

  
  for (let i = otps.length - 1; i >= 0; i--) {
    if (
      otps[i].entity_id === data.admin_id &&
      otps[i].purpose === "reset_password"
    ) {
      otps.splice(i, 1);
    }
  }

  return { success: true };
}
