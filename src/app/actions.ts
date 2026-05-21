'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Reusable Helper to Upload Files to Supabase Storage
async function uploadToSupabase(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) return '';
  try {
    const buffer = await file.arrayBuffer();
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('mibank-uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });
      
    if (error) {
      console.error("Gagal mengunggah file ke Supabase Storage:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('mibank-uploads')
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadToSupabase:", error);
    return '';
  }
}

// ==========================================
// 1. PROMOS ACTIONS
// ==========================================
export async function getPromos() {
  try {
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Error getting promos:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function addPromo(formData: FormData) {
  const imageFile = formData.get('promo_image') as File;
  let imagePath = "/images/promo1.png"; // Default fallback
  
  if (imageFile && imageFile.size > 0) {
    try {
      imagePath = await uploadToSupabase(imageFile, 'promos');
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
  
  const { error } = await supabase.from('promos').insert(newPromo);
  if (error) {
    console.error('Error adding promo:', error);
  }
  revalidatePath('/');
}

export async function deletePromo(id: number) {
  const { error } = await supabase.from('promos').delete().eq('id', id);
  if (error) {
    console.error('Error deleting promo:', error);
  }
  revalidatePath('/');
}

export async function updatePromo(formData: FormData) {
  const id = Number(formData.get('id'));
  
  // Get current promo to check existing image
  const { data: promo, error: fetchErr } = await supabase
    .from('promos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (fetchErr || !promo) return { error: 'Promo not found' };

  let imagePath = promo.image;
  const imageFile = formData.get('promo_image') as File;
  
  if (imageFile && imageFile.size > 0) {
    try {
      imagePath = await uploadToSupabase(imageFile, 'promos');
    } catch (err) {
      console.error("Gagal mengunggah gambar promo:", err);
    }
  }

  const { error } = await supabase
    .from('promos')
    .update({
      title_id: formData.get('title_id') as string,
      desc_id: formData.get('desc_id') as string,
      image: imagePath
    })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating promo:', error);
    return { error: 'Gagal memperbarui promo' };
  }
  revalidatePath('/');
  return { success: true };
}

// ==========================================
// 2. USERS ACTIONS (AUTHENTICATION)
// ==========================================
export async function getUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error getting users:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function adminAddUser(formData: FormData) {
  const email = formData.get('email') as string;
  const users = await getUsers();

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

  const { error } = await supabase.from('users').insert(newUser);
  if (error) {
    console.error('Error adding user:', error);
    return { error: 'Gagal menambahkan user' };
  }
  revalidatePath('/admin');
  return { success: true };
}

export async function adminUpdateUserRole(formData: FormData) {
  const id = formData.get('id') as string;
  const newRole = formData.get('role') as string;

  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating user role:', error);
    return { error: 'User not found' };
  }
  revalidatePath('/admin');
  return { success: true };
}

export async function adminDeleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    console.error('Error deleting user:', error);
  }
  revalidatePath('/admin');
}

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const users = await getUsers();

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

  const { error } = await supabase.from('users').insert(newUser);
  if (error) {
    console.error("Gagal mendaftarkan user:", error);
    return { error: 'Gagal mendaftar' };
  }
  redirect('/login');
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error || !user) {
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

// ==========================================
// 3. SUBMISSIONS ACTIONS (HUBUNGI KAMI)
// ==========================================
export async function getSubmissions() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) {
      console.error('Error getting submissions:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function submitForm(formData: FormData) {
  const newSubmission = {
    id: Date.now(),
    name: formData.get('name') as string,
    nik: formData.get('nik') as string,
    phone: formData.get('phone') as string,
    type: formData.get('type') as string,
    status: 'Pending',
    date: new Date().toLocaleDateString('id-ID')
  };
  
  const { error } = await supabase.from('submissions').insert(newSubmission);
  if (error) {
    console.error('Error submitting form:', error);
    return { error: 'Gagal mengirim formulir' };
  }
  return { success: true };
}

// ==========================================
// 4. SETTINGS ACTIONS (GLOBAL WEB SETTINGS)
// ==========================================
export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
      return {
        hero: { title_id: "", desc_id: "" },
        about: { visi_id: "", misi_id: "" },
        images: { hero: "/images/hero.png", about: "/images/company.jpg" },
        contact: { address: "", phone: "", email: "" }
      };
    }
    return data;
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
    
    // Handle Hero Image Upload
    const heroImageFile = formData.get('hero_image') as File;
    let heroImagePath = currentSettings.images?.hero || "/images/hero.png";
    
    if (heroImageFile && heroImageFile.size > 0) {
      heroImagePath = await uploadToSupabase(heroImageFile, 'settings');
    }

    // Handle About Image Upload
    const aboutImageFile = formData.get('about_image') as File;
    let aboutImagePath = currentSettings.images?.about || "/images/company.jpg";
    
    if (aboutImageFile && aboutImageFile.size > 0) {
      aboutImagePath = await uploadToSupabase(aboutImageFile, 'settings');
    }

    const settings = {
      id: 'global',
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
    
    const { error } = await supabase.from('settings').upsert(settings);
    if (error) throw error;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Update settings error:", error);
    return { error: "Gagal memperbarui pengaturan." };
  }
}

// ==========================================
// 5. CAREER APPLICATIONS ACTIONS
// ==========================================
function mapAppToCamel(dbApp: any) {
  if (!dbApp) return null;
  return {
    id: dbApp.id,
    date: dbApp.date,
    status: dbApp.status,
    position: dbApp.position,
    name: dbApp.name,
    nik: dbApp.nik,
    birthPlace: dbApp.birth_place,
    birthDate: dbApp.birth_date,
    gender: dbApp.gender,
    religion: dbApp.religion,
    maritalStatus: dbApp.marital_status,
    address: dbApp.address,
    phone: dbApp.phone,
    phoneAlt: dbApp.phone_alt,
    email: dbApp.email,
    eduUniv: dbApp.edu_univ,
    eduFaculty: dbApp.edu_faculty,
    eduMajor: dbApp.edu_major,
    eduYears: dbApp.edu_years,
    eduGpa: dbApp.edu_gpa,
    achievements: dbApp.achievements,
    experience: dbApp.experience,
    willingPlacement: dbApp.willing_placement,
    noFamilyRelation: dbApp.no_family_relation,
    motivation: dbApp.motivation,
    cv: dbApp.cv,
    ktpScan: dbApp.ktp_scan,
    ijazahScan: dbApp.ijazah_scan,
    pasFoto: dbApp.pas_foto,
    fotoBadan: dbApp.foto_badan
  };
}

export async function getJobApplications() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) {
      console.error('Error getting applications:', error);
      return [];
    }
    return (data || []).map(mapAppToCamel);
  } catch (err) {
    return [];
  }
}

export async function submitJobApplication(formData: FormData) {
  try {
    const cvFile = formData.get('cv') as File;
    const ktpFile = formData.get('ktpScan') as File;
    const ijazahFile = formData.get('ijazahScan') as File;
    const pasFotoFile = formData.get('pasFoto') as File;
    const fotoBadanFile = formData.get('fotoBadan') as File;

    const cvPath = cvFile && cvFile.size > 0 ? await uploadToSupabase(cvFile, 'career/cv') : '';
    const ktpPath = ktpFile && ktpFile.size > 0 ? await uploadToSupabase(ktpFile, 'career/ktp') : '';
    const ijazahPath = ijazahFile && ijazahFile.size > 0 ? await uploadToSupabase(ijazahFile, 'career/ijazah') : '';
    const pasFotoPath = pasFotoFile && pasFotoFile.size > 0 ? await uploadToSupabase(pasFotoFile, 'career/pasfoto') : '';
    const fotoBadanPath = fotoBadanFile && fotoBadanFile.size > 0 ? await uploadToSupabase(fotoBadanFile, 'career/fotobadan') : '';

    const newApplication = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Pending',
      position: formData.get('position') as string,
      name: formData.get('name') as string,
      nik: formData.get('nik') as string,
      birth_place: formData.get('birthPlace') as string,
      birth_date: formData.get('birthDate') as string,
      gender: formData.get('gender') as string,
      religion: formData.get('religion') as string,
      marital_status: formData.get('maritalStatus') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      phone_alt: formData.get('phoneAlt') as string,
      email: formData.get('email') as string,
      edu_univ: formData.get('eduUniv') as string,
      edu_faculty: formData.get('eduFaculty') as string,
      edu_major: formData.get('eduMajor') as string,
      edu_years: formData.get('eduYears') as string,
      edu_gpa: formData.get('eduGpa') as string,
      achievements: formData.get('achievements') as string,
      experience: formData.get('experience') as string,
      willing_placement: formData.get('willingPlacement') as string,
      no_family_relation: formData.get('noFamilyRelation') as string,
      motivation: formData.get('motivation') as string,
      cv: cvPath,
      ktp_scan: ktpPath,
      ijazah_scan: ijazahPath,
      pas_foto: pasFotoPath,
      foto_badan: fotoBadanPath
    };

    const { error } = await supabase.from('applications').insert(newApplication);
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting job application:", error);
    return { error: "Gagal mengirimkan lamaran." };
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui status." };
  }
}

// ==========================================
// 6. SAVINGS PARTNERS ACTIONS
// ==========================================
export async function getSavingsSettings() {
  try {
    const { data, error } = await supabase
      .from('savings_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
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
    return data;
  } catch (err) {
    return {
      title_id: "Layanan Buka Rekening Simpanan Partner",
      desc_id: "Mitra Perbankan memudahkan Anda untuk membandingkan dan membuka rekening simpanan/tabungan langsung di berbagai bank terkemuka di Indonesia. Silakan pilih bank partner kami di bawah ini untuk menuju halaman pembukaan rekening resmi.",
      banks: []
    };
  }
}

export async function updateSavingsSettings(settings: any) {
  try {
    const { error } = await supabase.from('savings_settings').upsert({
      id: 'global',
      title_id: settings.title_id,
      desc_id: settings.desc_id,
      banks: settings.banks
    });
    if (error) throw error;
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
    const logoPath = await uploadToSupabase(file, 'logos');
    return { success: true, path: logoPath };
  } catch (error) {
    console.error("Error uploading bank logo:", error);
    return { error: "Gagal mengunggah berkas logo." };
  }
}

// ==========================================
// 7. CREDIT CARD PARTNERS ACTIONS
// ==========================================
export async function getCreditSettings() {
  try {
    const { data, error } = await supabase
      .from('credit_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
      return {
        title_id: "Layanan Pengajuan Kartu Kredit Partner",
        desc_id: "Temukan dan bandingkan berbagai produk kartu kredit terbaik dari bank mitra kami di Indonesia. Ajukan langsung di tautan resmi masing-masing bank partner di bawah ini.",
        banks: []
      };
    }
    return data;
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
    const { error } = await supabase.from('credit_settings').upsert({
      id: 'global',
      title_id: settings.title_id,
      desc_id: settings.desc_id,
      banks: settings.banks
    });
    if (error) throw error;
    revalidatePath('/produk/kartu-kredit');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating credit settings:", error);
    return { error: "Gagal memperbarui pengaturan kartu kredit." };
  }
}

// ==========================================
// 8. LOANS PARTNERS ACTIONS
// ==========================================
export async function getLoanSettings() {
  try {
    const { data, error } = await supabase
      .from('loan_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
      return {
        title_id: "Layanan Pengajuan Pinjaman Partner",
        desc_id: "Bandingkan dan pilih produk pinjaman perbankan terbaik, mulai dari KPR, KTA, hingga kredit kendaraan bermotor langsung di bank partner resmi pilihan Anda.",
        banks: []
      };
    }
    return data;
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
    const { error } = await supabase.from('loan_settings').upsert({
      id: 'global',
      title_id: settings.title_id,
      desc_id: settings.desc_id,
      banks: settings.banks
    });
    if (error) throw error;
    revalidatePath('/produk/pinjaman');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating loan settings:", error);
    return { error: "Gagal memperbarui pengaturan pinjaman." };
  }
}

// ==========================================
// 9. DIGITAL BANKING PARTNERS ACTIONS
// ==========================================
export async function getDigitalSettings() {
  try {
    const { data, error } = await supabase
      .from('digital_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
      return {
        title_id: "Layanan Buka Akun Digital Banking Partner",
        desc_id: "Nikmati kemudahan layanan perbankan digital generasi terbaru. Bandingkan dan buka rekening bank digital terkemuka di Indonesia secara instan di bawah ini.",
        banks: []
      };
    }
    return data;
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
    const { error } = await supabase.from('digital_settings').upsert({
      id: 'global',
      title_id: settings.title_id,
      desc_id: settings.desc_id,
      banks: settings.banks
    });
    if (error) throw error;
    revalidatePath('/produk/digital-banking');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating digital settings:", error);
    return { error: "Gagal memperbarui pengaturan digital banking." };
  }
}

// ==========================================
// 10. CAREERS VACANCIES ACTIONS
// ==========================================
export async function getCareersSettings() {
  try {
    const { data, error } = await supabase
      .from('careers_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
      
    if (error || !data) {
      return {
        title_id: "Bangun Karir Bersama Kami",
        title_en: "Build Your Career With Us",
        desc_id: "Temukan berbagai peluang karir menarik dan tumbuh bersama salah satu mitra perbankan terpercaya di Indonesia.",
        desc_en: "Find various attractive career opportunities and grow together with one of the trusted banking partners in Indonesia.",
        vacancies: []
      };
    }
    return data;
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
    const { error } = await supabase.from('careers_settings').upsert({
      id: 'global',
      title_id: settings.title_id,
      title_en: settings.title_en,
      desc_id: settings.desc_id,
      desc_en: settings.desc_en,
      vacancies: settings.vacancies
    });
    if (error) throw error;
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
    const imagePath = await uploadToSupabase(file, 'careers');
    return { success: true, path: imagePath };
  } catch (error) {
    console.error("Error uploading career image:", error);
    return { error: "Gagal mengunggah berkas gambar." };
  }
}

// ==========================================
// 11. SMILE UMKM SUBMISSIONS ACTIONS
// ==========================================
export async function getSmileUmkmSubmissions() {
  try {
    const { data, error } = await supabase
      .from('smile_umkm_submissions')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) {
      console.error('Error getting UMKM submissions:', error);
      return [];
    }
    return (data || []).map((sub: any) => ({
      id: sub.id,
      date: sub.date,
      status: sub.status,
      name: sub.name,
      address: sub.address,
      phone: sub.phone,
      email: sub.email,
      businessName: sub.business_name,
      businessActivity: sub.business_activity,
      businessAddress: sub.business_address,
      frontPhoto: sub.front_photo,
      productPhoto: sub.product_photo,
      paymentMethod: sub.payment_method,
      bank: sub.bank,
      nmid: sub.nmid,
      monthlyRevenue: Number(sub.monthly_revenue),
      monthlyBalance: Number(sub.monthly_balance),
      verifiedData: sub.verified_data,
      termsAccepted: sub.terms_accepted
    }));


export async function submitSmileUmkm(formData: FormData) {
  try {
    const frontPhotoFile = formData.get('frontPhoto') as File;
    const productPhotoFile = formData.get('productPhoto') as File;

    const frontPhotoPath = frontPhotoFile && frontPhotoFile.size > 0 ? await uploadToSupabase(frontPhotoFile, 'smile-umkm/front') : '';
    const productPhotoPath = productPhotoFile && productPhotoFile.size > 0 ? await uploadToSupabase(productPhotoFile, 'smile-umkm/product') : '';

    const newSubmission = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Pending',
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      business_name: formData.get('businessName') as string,
      business_activity: formData.get('businessActivity') as string,
      business_address: formData.get('businessAddress') as string,
      front_photo: frontPhotoPath,
      product_photo: productPhotoPath,
      payment_method: formData.get('paymentMethod') as string,
      bank: formData.get('bank') as string,
      nmid: formData.get('nmid') as string,
      monthly_revenue: Number(formData.get('monthlyRevenue')) || 0,
      monthly_balance: Number(formData.get('monthlyBalance')) || 0,
      verified_data: formData.get('verifiedData') === 'on',
      terms_accepted: formData.get('termsAccepted') === 'on'
    };

    const { error } = await supabase.from('smile_umkm_submissions').insert(newSubmission);
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting Smile UMKM:", error);
    return { error: "Gagal memproses pengajuan Smile UMKM." };
  }
}

export async function updateSmileUmkmStatus(id: number, status: string) {
  try {
    const { error } = await supabase
      .from('smile_umkm_submissions')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui status pengajuan." };
  }
}
