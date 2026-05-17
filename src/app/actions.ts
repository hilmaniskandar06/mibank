'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const PROMOS_PATH = path.join(process.cwd(), 'src/data/promos.json');
const USERS_PATH = path.join(process.cwd(), 'src/data/users.json');
const SUBMISSIONS_PATH = path.join(process.cwd(), 'src/data/submissions.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');

export async function getPromos() {
  try {
    const data = await fs.readFile(PROMOS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function addPromo(formData: FormData) {
  const data = await getPromos();
  const newPromo = {
    id: Date.now(),
    title_id: formData.get('title_id') as string,
    title_en: formData.get('title_en') as string,
    desc_id: formData.get('desc_id') as string,
    desc_en: formData.get('desc_en') as string,
    image: "/images/promo1.png"
  };
  
  data.push(newPromo);
  await fs.writeFile(PROMOS_PATH, JSON.stringify(data, null, 2));
  revalidatePath('/');
}

export async function deletePromo(id: number) {
  let data = await getPromos();
  data = data.filter((p: any) => p.id !== id);
  await fs.writeFile(PROMOS_PATH, JSON.stringify(data, null, 2));
  revalidatePath('/');
}

// User Actions
export async function getUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function registerUser(formData: FormData) {
  const users = await getUsers();
  const email = formData.get('email') as string;

  if (users.find((u: any) => u.email === email)) {
    return { error: 'Email already registered' };
  }

  const newUser = {
    id: Date.now().toString(),
    name: formData.get('name') as string,
    email: email,
    password: formData.get('password') as string,
    role: 'user'
  };

  users.push(newUser);
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  redirect('/login');
}

export async function loginUser(formData: FormData) {
  const users = await getUsers();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const cookieStore = await cookies();
  cookieStore.set('mibank_session', JSON.stringify({ id: user.id, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('mibank_session');
  redirect('/login');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) return null;
  return JSON.parse(session.value);
}

// Submissions Actions
export async function getSubmissions() {
  try {
    const data = await fs.readFile(SUBMISSIONS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function submitForm(formData: FormData) {
  const data = await getSubmissions();
  const newSubmission = {
    id: Date.now(),
    name: formData.get('name') as string,
    nik: formData.get('nik') as string,
    phone: formData.get('phone') as string,
    type: formData.get('type') as string,
    status: 'Pending',
    date: new Date().toLocaleDateString('id-ID')
  };
  
  data.push(newSubmission);
  await fs.writeFile(SUBMISSIONS_PATH, JSON.stringify(data, null, 2));
  return { success: true };
}

// Settings Actions
export async function getSettings() {
  try {
    const data = await fs.readFile(SETTINGS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      hero: { title_id: "", title_en: "", desc_id: "", desc_en: "" },
      about: { visi_id: "", visi_en: "", misi_id: "", misi_en: "" },
      images: { hero: "/images/hero.png", about: "/images/company.jpg" },
      contact: { address: "", phone: "", email: "" }
    };
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const currentSettings = await getSettings();
    const imagesDir = path.join(process.cwd(), 'public/images');
    
    // Ensure directory exists
    await fs.mkdir(imagesDir, { recursive: true });
    
    // Handle Hero Image Upload
    const heroImageFile = formData.get('hero_image') as File;
    let heroImagePath = currentSettings.images?.hero || "/images/hero.png";
    
    if (heroImageFile && heroImageFile.size > 0) {
      const buffer = Buffer.from(await heroImageFile.arrayBuffer());
      const fileName = `hero_${Date.now()}.png`;
      const filePath = path.join(imagesDir, fileName);
      await fs.writeFile(filePath, buffer);
      heroImagePath = `/images/${fileName}`;
    }

    // Handle About Image Upload
    const aboutImageFile = formData.get('about_image') as File;
    let aboutImagePath = currentSettings.images?.about || "/images/company.jpg";
    
    if (aboutImageFile && aboutImageFile.size > 0) {
      const buffer = Buffer.from(await aboutImageFile.arrayBuffer());
      const fileName = `about_${Date.now()}.png`;
      const filePath = path.join(imagesDir, fileName);
      await fs.writeFile(filePath, buffer);
      aboutImagePath = `/images/${fileName}`;
    }

    const settings = {
      hero: {
        title_id: formData.get('hero_title_id') as string,
        title_en: formData.get('hero_title_en') as string,
        desc_id: formData.get('hero_desc_id') as string,
        desc_en: formData.get('hero_desc_en') as string,
      },
      about: {
        visi_id: formData.get('visi_id') as string,
        visi_en: formData.get('visi_en') as string,
        misi_id: formData.get('misi_id') as string,
        misi_en: formData.get('misi_en') as string,
      },
      images: {
        hero: heroImagePath,
        about: aboutImagePath
      },
      contact: {
        address: formData.get('contact_address') as string,
        phone: formData.get('contact_phone') as string,
        email: formData.get('contact_email') as string
      }
    };
    
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Update settings error:", error);
    return { error: "Gagal memperbarui pengaturan." };
  }
}
