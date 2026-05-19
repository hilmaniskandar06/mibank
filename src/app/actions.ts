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
const APPLICATIONS_PATH = path.join(process.cwd(), 'src/data/applications.json');


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
  
  const imageFile = formData.get('promo_image') as File;
  let imagePath = "/images/promo1.png"; // Default fallback
  
  if (imageFile && imageFile.size > 0) {
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `promo_${Date.now()}.png`;
      const imagesDir = path.join(process.cwd(), 'public/images');
      await fs.mkdir(imagesDir, { recursive: true });
      const filePath = path.join(imagesDir, fileName);
      await fs.writeFile(filePath, buffer);
      imagePath = `/images/${fileName}`;
    } catch (err) {
      console.error("Gagal mengunggah gambar promo:", err);
    }
  }

  const newPromo = {
    id: Date.now(),
    title_id: formData.get('title_id') as string,
    desc_id: formData.get('desc_id') as string,
    image: imagePath
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

export async function updatePromo(formData: FormData) {
  const data = await getPromos();
  const id = Number(formData.get('id'));
  
  const promoIndex = data.findIndex((p: any) => p.id === id);
  if (promoIndex === -1) return { error: 'Promo not found' };

  let imagePath = data[promoIndex].image;
  const imageFile = formData.get('promo_image') as File;
  
  if (imageFile && imageFile.size > 0) {
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `promo_${Date.now()}.png`;
      const imagesDir = path.join(process.cwd(), 'public/images');
      await fs.writeFile(path.join(imagesDir, fileName), buffer);
      imagePath = `/images/${fileName}`;
    } catch (err) {
      console.error("Gagal mengunggah gambar promo:", err);
    }
  }

  data[promoIndex] = {
    ...data[promoIndex],
    title_id: formData.get('title_id') as string,
    desc_id: formData.get('desc_id') as string,
    image: imagePath
  };
  
  await fs.writeFile(PROMOS_PATH, JSON.stringify(data, null, 2));
  revalidatePath('/');
  return { success: true };
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

export async function adminAddUser(formData: FormData) {
  const users = await getUsers();
  const email = formData.get('email') as string;

  if (users.find((u: any) => u.email === email)) {
    return { error: 'Email already registered' };
  }

  const newUser = {
    id: Date.now().toString(),
    name: formData.get('name') as string,
    email: email,
    phone: formData.get('phone') as string || '',
    password: formData.get('password') as string,
    role: formData.get('role') as string || 'user'
  };

  users.push(newUser);
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  revalidatePath('/admin');
  return { success: true };
}

export async function adminUpdateUserRole(formData: FormData) {
  const users = await getUsers();
  const id = formData.get('id') as string;
  const newRole = formData.get('role') as string;

  const userIndex = users.findIndex((u: any) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex].role = newRole;
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
    revalidatePath('/admin');
    return { success: true };
  }
  return { error: 'User not found' };
}

export async function adminDeleteUser(id: string) {
  let users = await getUsers();
  users = users.filter((u: any) => u.id !== id);
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  revalidatePath('/admin');
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
    phone: formData.get('phone') as string || '',
    password: formData.get('password') as string,
    role: 'user'
  };

  users.push(newUser);
  try {
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.warn("Could not write to users.json (likely in production/read-only environment).");
  }
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
      hero: { title_id: "", desc_id: "" },
      about: { visi_id: "", misi_id: "" },
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
        desc_id: formData.get('hero_desc_id') as string,
      },
      about: {
        visi_id: formData.get('visi_id') as string,
        misi_id: formData.get('misi_id') as string,
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

export async function getJobApplications() {
  try {
    const data = await fs.readFile(APPLICATIONS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function submitJobApplication(formData: FormData) {
  try {
    const applications = await getJobApplications();
    
    // Helper to upload files safely
    const uploadFile = async (fileKey: string, prefix: string) => {
      const file = formData.get(fileKey) as File;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || '.pdf';
        const fileName = `${prefix}_${Date.now()}${ext}`;
        const dir = path.join(process.cwd(), 'public/uploads/career');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, fileName), buffer);
        return `/uploads/career/${fileName}`;
      }
      return "";
    };

    const cvPath = await uploadFile('cv', 'cv');
    const ktpPath = await uploadFile('ktpScan', 'ktp');
    const ijazahPath = await uploadFile('ijazahScan', 'ijazah');
    const pasFotoPath = await uploadFile('pasFoto', 'pasfoto');
    const fotoBadanPath = await uploadFile('fotoBadan', 'fotobadan');

    const newApplication = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Pending',
      position: formData.get('position') as string,
      
      // Personal Data
      name: formData.get('name') as string,
      nik: formData.get('nik') as string,
      birthPlace: formData.get('birthPlace') as string,
      birthDate: formData.get('birthDate') as string,
      gender: formData.get('gender') as string,
      religion: formData.get('religion') as string,
      maritalStatus: formData.get('maritalStatus') as string,
      address: formData.get('address') as string,
      
      // Contacts
      phone: formData.get('phone') as string,
      phoneAlt: formData.get('phoneAlt') as string,
      email: formData.get('email') as string,
      
      // Education
      eduUniv: formData.get('eduUniv') as string,
      eduFaculty: formData.get('eduFaculty') as string,
      eduMajor: formData.get('eduMajor') as string,
      eduYears: formData.get('eduYears') as string,
      eduGpa: formData.get('eduGpa') as string,
      
      // Achievements & Experience
      achievements: formData.get('achievements') as string,
      experience: formData.get('experience') as string,
      
      // Statements
      willingPlacement: formData.get('willingPlacement') as string,
      noFamilyRelation: formData.get('noFamilyRelation') as string,
      motivation: formData.get('motivation') as string,
      
      // Files
      cv: cvPath,
      ktpScan: ktpPath,
      ijazahScan: ijazahPath,
      pasFoto: pasFotoPath,
      fotoBadan: fotoBadanPath
    };

    applications.push(newApplication);
    await fs.mkdir(path.dirname(APPLICATIONS_PATH), { recursive: true });
    await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(applications, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting job application:", error);
    return { error: "Gagal mengirimkan lamaran." };
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const applications = await getJobApplications();
    const index = applications.findIndex((app: any) => app.id === id);
    if (index !== -1) {
      applications[index].status = status;
      await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(applications, null, 2));
      revalidatePath('/admin');
      return { success: true };
    }
    return { error: "Lamaran tidak ditemukan." };
  } catch (error) {
    return { error: "Gagal memperbarui status." };
  }
}

const SAVINGS_PATH = path.join(process.cwd(), 'src/data/savings.json');

export async function getSavingsSettings() {
  try {
    const data = await fs.readFile(SAVINGS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      title_id: "Layanan Buka Rekening Simpanan Partner",
      desc_id: "Mitra Perbankan memudahkan Anda untuk membandingkan dan membuka rekening simpanan/tabungan langsung di berbagai bank terkemuka di Indonesia. Silakan pilih bank partner kami di bawah ini untuk menuju halaman pembukaan rekening resmi.",
      banks: [
        { "name": "Bank Central Asia (BCA)", "code": "BCA", "url": "https://www.bca.co.id/id/individu/produk/simpanan/Tahapan-BCA" },
        { "name": "Bank Mandiri", "code": "MANDIRI", "url": "https://join.bankmandiri.co.id" },
        { "name": "Bank Rakyat Indonesia (BRI)", "code": "BRI", "url": "https://bukarekening.bri.co.id" },
        { "name": "Bank Negara Indonesia (BNI)", "code": "BNI", "url": "https://www.bni.co.id/id-id/individu/simpanan-kartu/buka-rekening-digital" },
        { "name": "Bank Syariah Indonesia (BSI)", "code": "BSI", "url": "https://www.bankbsi.co.id" },
        { "name": "Bank Tabungan Negara (BTN)", "code": "BTN", "url": "https://www.btn.co.id" },
        { "name": "Bank CIMB Niaga", "code": "CIMB", "url": "https://www.cimbniaga.co.id" },
        { "name": "Bank Danamon", "code": "DANAMON", "url": "https://www.danamon.co.id" },
        { "name": "Permata Bank", "code": "PERMATA", "url": "https://www.permatabank.com" },
        { "name": "Maybank Indonesia", "code": "MAYBANK", "url": "https://www.maybank.co.id" },
        { "name": "Bank Mega", "code": "MEGA", "url": "https://www.bankmega.com" },
        { "name": "OCBC Indonesia", "code": "OCBC", "url": "https://www.ocbc.id" }
      ]
    };
  }
}

export async function updateSavingsSettings(settings: any) {
  try {
    await fs.mkdir(path.dirname(SAVINGS_PATH), { recursive: true });
    await fs.writeFile(SAVINGS_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/produk/simpanan');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating savings settings:", error);
    return { error: "Gagal memperbarui pengaturan simpanan." };
  }
}

export async function uploadBankLogo(formData: FormData) {
  try {
    const file = formData.get('logo') as File;
    if (!file || file.size === 0) return { error: "Berkas logo tidak ditemukan." };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads/logos');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.png';
    const fileName = `logo_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);
    return { success: true, path: `/uploads/logos/${fileName}` };
  } catch (error) {
    console.error("Error uploading bank logo:", error);
    return { error: "Gagal mengunggah berkas logo." };
  }
}

const CREDIT_PATH = path.join(process.cwd(), 'src/data/credit-card.json');
const LOANS_PATH = path.join(process.cwd(), 'src/data/loans.json');
const DIGITAL_PATH = path.join(process.cwd(), 'src/data/digital-banking.json');

export async function getCreditSettings() {
  try {
    const data = await fs.readFile(CREDIT_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      title_id: "Layanan Pengajuan Kartu Kredit Partner",
      desc_id: "Temukan dan bandingkan berbagai produk kartu kredit terbaik dari bank mitra kami di Indonesia. Ajukan langsung di tautan resmi masing-masing bank partner di bawah ini.",
      banks: []
    };
  }
}

export async function updateCreditSettings(settings: any) {
  try {
    await fs.mkdir(path.dirname(CREDIT_PATH), { recursive: true });
    await fs.writeFile(CREDIT_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/produk/kartu-kredit');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating credit settings:", error);
    return { error: "Gagal memperbarui pengaturan kartu kredit." };
  }
}

export async function getLoanSettings() {
  try {
    const data = await fs.readFile(LOANS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      title_id: "Layanan Pengajuan Pinjaman Partner",
      desc_id: "Bandingkan dan pilih produk pinjaman perbankan terbaik, mulai dari KPR, KTA, hingga kredit kendaraan bermotor langsung di bank partner resmi pilihan Anda.",
      banks: []
    };
  }
}

export async function updateLoanSettings(settings: any) {
  try {
    await fs.mkdir(path.dirname(LOANS_PATH), { recursive: true });
    await fs.writeFile(LOANS_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/produk/pinjaman');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating loan settings:", error);
    return { error: "Gagal memperbarui pengaturan pinjaman." };
  }
}

export async function getDigitalSettings() {
  try {
    const data = await fs.readFile(DIGITAL_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      title_id: "Layanan Buka Akun Digital Banking Partner",
      desc_id: "Nikmati kemudahan layanan perbankan digital generasi terbaru. Bandingkan dan buka rekening bank digital terkemuka di Indonesia secara instan di bawah ini.",
      banks: []
    };
  }
}

export async function updateDigitalSettings(settings: any) {
  try {
    await fs.mkdir(path.dirname(DIGITAL_PATH), { recursive: true });
    await fs.writeFile(DIGITAL_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/produk/digital-banking');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating digital settings:", error);
    return { error: "Gagal memperbarui pengaturan digital banking." };
  }
}

const CAREERS_PATH = path.join(process.cwd(), 'src/data/careers.json');

export async function getCareersSettings() {
  try {
    const data = await fs.readFile(CAREERS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      title_id: "Bangun Karir Bersama Kami",
      title_en: "Build Your Career With Us",
      desc_id: "Temukan berbagai peluang karir menarik dan tumbuh bersama salah satu mitra perbankan terpercaya di Indonesia.",
      desc_en: "Find various attractive career opportunities and grow together with one of the trusted banking partners in Indonesia.",
      vacancies: []
    };
  }
}

export async function updateCareersSettings(settings: any) {
  try {
    await fs.mkdir(path.dirname(CAREERS_PATH), { recursive: true });
    await fs.writeFile(CAREERS_PATH, JSON.stringify(settings, null, 2));
    revalidatePath('/karir');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating careers settings:", error);
    return { error: "Gagal memperbarui pengaturan karir." };
  }
}

export async function uploadCareerImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    if (!file || file.size === 0) return { error: "Berkas gambar tidak ditemukan." };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads/careers');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.png';
    const fileName = `career_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);
    return { success: true, path: `/uploads/careers/${fileName}` };
  } catch (error) {
    console.error("Error uploading career image:", error);
    return { error: "Gagal mengunggah berkas gambar." };
  }
}

// Smile UMKM Submissions
const SMILE_UMKM_PATH = path.join(process.cwd(), 'src/data/smile-umkm-submissions.json');

export async function getSmileUmkmSubmissions() {
  try {
    const data = await fs.readFile(SMILE_UMKM_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function submitSmileUmkm(formData: FormData) {
  try {
    const submissions = await getSmileUmkmSubmissions();
    const uploadDir = path.join(process.cwd(), 'public/uploads/smile-umkm');
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadFile = async (fileKey: string) => {
      const file = formData.get(fileKey) as File;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = path.extname(file.name) || '.png';
        const fileName = `${fileKey}_${Date.now()}${ext}`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        return `/uploads/smile-umkm/${fileName}`;
      }
      return '';
    };

    const frontPhotoPath = await uploadFile('frontPhoto');
    const productPhotoPath = await uploadFile('productPhoto');

    const newSubmission = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Pending',
      
      // Applicant data
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      
      // Business data
      businessName: formData.get('businessName') as string,
      businessActivity: formData.get('businessActivity') as string,
      businessAddress: formData.get('businessAddress') as string,
      frontPhoto: frontPhotoPath,
      productPhoto: productPhotoPath,
      
      // Payment data
      paymentMethod: formData.get('paymentMethod') as string,
      bank: formData.get('bank') as string,
      nmid: formData.get('nmid') as string,
      monthlyRevenue: Number(formData.get('monthlyRevenue')),
      monthlyBalance: Number(formData.get('monthlyBalance')),
      
      // Verification
      verifiedData: formData.get('verifiedData') === 'on',
      termsAccepted: formData.get('termsAccepted') === 'on'
    };

    submissions.push(newSubmission);
    await fs.writeFile(SMILE_UMKM_PATH, JSON.stringify(submissions, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Error submitting Smile UMKM:", error);
    return { error: "Gagal memproses pengajuan Smile UMKM." };
  }
}

export async function updateSmileUmkmStatus(id: number, status: string) {
  try {
    const submissions = await getSmileUmkmSubmissions();
    const index = submissions.findIndex((sub: any) => sub.id === id);
    if (index !== -1) {
      submissions[index].status = status;
      await fs.writeFile(SMILE_UMKM_PATH, JSON.stringify(submissions, null, 2));
      revalidatePath('/admin');
      return { success: true };
    }
    return { error: "Pengajuan tidak ditemukan." };
  } catch (error) {
    return { error: "Gagal memperbarui status pengajuan." };
  }
}




