// حالة بيانات النظام
const appState = {
    user: {
        username: 'omar',
        pass: '123456',
        fullname: 'عمر المهداوي',
        fullnameFr: 'EL MAHDAOUI OMAR',
        dob: '',
        pob: '',
        age: '',
        nationality: 'مغربية',
        marital: '',
        cin: '',
        job: '',
        phone: '',
        email: 'omar@example.com',
        address: '',
        city: 'مراكش',
        notes: '',
        avatar: '',
        university: 'جامعة القاضي عياض',
        faculty: 'كلية اللغة العربية',
        department: '',
        major: '',
        level: '',
        academicYear: '',
        uniLogo: ''
    },
    dbEntries: [],
    subjects: [],
    files: [],
    pendingDeleteIndex: null,
    pendingDeleteType: null
};

// تشغيل النظام والتصحيح عند الجاهزية
document.addEventListener('DOMContentLoaded', () => {

    // 1. معالجة زر تسجيل الدخول بطريقة سريعة ومباشرة
    const loginSubmitBtn = document.getElementById('login-btn-submit');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', handleUserLogin);
    }

    // السماح بالضغط على زر Enter داخل الحقول
    const passInput = document.getElementById('login-password');
    const userInput = document.getElementById('login-username');

    if (passInput) passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserLogin(); });
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserLogin(); });

    // 2. تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            document.getElementById('app-dashboard').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
        });
    }

    // 3. زر الطباعة
    const printBtn = document.getElementById('print-full-btn');
    if (printBtn) {
        printBtn.addEventListener('click', generateAndPrintReport);
    }

    // 4. التنقل بين أقسام اللوحة
    const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            const activeSec = document.getElementById(`sec-${tabTarget}`);
            if (activeSec) activeSec.classList.add('active');
        });
    });

    setupFileInputs();
    setupForms();
});

// دالة تسجيل الدخول المضبوطة
function handleUserLogin() {
    const userField = document.getElementById('login-username');
    const passField = document.getElementById('login-password');

    if (!userField || !passField) return;

    const userInput = userField.value.trim();
    const passInput = passField.value.trim();

    // التحقق المباشر
    if (userInput.toLowerCase() === appState.user.username.toLowerCase() && passInput === appState.user.pass) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-dashboard').classList.remove('hidden');
        renderAllViews();
    } else {
        alert('⚠️ اسم المستخدم أو كلمة المرور غير صحيحة!');
    }
}

// تحديث جميع الشاشات
function renderAllViews() {
    const u = appState.user;

    document.getElementById('side-fullname').textContent = u.fullname || '---';
    document.getElementById('side-job').textContent = u.job || '---';
    document.getElementById('header-fullname').textContent = u.fullname || '---';
    document.getElementById('dash-welcome-name').textContent = u.fullname || '---';

    updateImageElements(u.avatar, ['sidebar-avatar', 'header-avatar', 'dash-profile-img', 'settings-avatar-preview'], 
                         ['sidebar-avatar-placeholder', 'header-avatar-placeholder', 'dash-avatar-placeholder', 'settings-avatar-ph']);

    updateImageElements(u.uniLogo, ['study-uni-logo', 'settings-unilogo-preview'], ['study-logo-placeholder', 'settings-unilogo-ph']);

    document.getElementById('dash-details-grid').innerHTML = `
        <div class="detail-item"><strong>الاسم الكامل:</strong> ${u.fullname || '---'}</div>
        <div class="detail-item"><strong>الاسم بالفرنسية:</strong> ${u.fullnameFr || '---'}</div>
        <div class="detail-item"><strong>تاريخ الازدياد:</strong> ${u.dob || '---'}</div>
        <div class="detail-item"><strong>مكان الازدياد:</strong> ${u.pob || '---'}</div>
        <div class="detail-item"><strong>السن:</strong> ${u.age || '---'}</div>
        <div class="detail-item"><strong>الجنسية:</strong> ${u.nationality || '---'}</div>
        <div class="detail-item"><strong>رقم CIN:</strong> ${u.cin || '---'}</div>
        <div class="detail-item"><strong>المهنة:</strong> ${u.job || '---'}</div>
        <div class="detail-item"><strong>الهاتف:</strong> ${u.phone || '---'}</div>
        <div class="detail-item"><strong>البريد:</strong> ${u.email || '---'}</div>
        <div class="detail-item"><strong>العنوان:</strong> ${u.address || '---'} - ${u.city || '---'}</div>
        <div class="detail-item"><strong>الجامعة والكلية:</strong> ${u.university || '---'} (${u.faculty || '---'})</div>
    `;

    document.getElementById('study-uni-details').innerHTML = `
        <h3>🎓 ${u.university || 'اسم الجامعة لم يحدد بعد'}</h3>
        <p><strong>الكلية:</strong> ${u.faculty || '---'} | <strong>الشعبة:</strong> ${u.department || '---'}</p>
        <p><strong>المسلك:</strong> ${u.major || '---'} | <strong>المستوى:</strong> ${u.level || '---'} (${u.academicYear || '---'})</p>
    `;

    renderDbTable();
    renderSubjectsGrid();
    renderFilesTable();

    document.getElementById('set-username').value = u.username;
    document.getElementById('set-fullname').value = u.fullname;
    document.getElementById('set-fullname-fr').value = u.fullnameFr;
    document.getElementById('set-dob').value = u.dob;
    document.getElementById('set-pob').value = u.pob;
    document.getElementById('set-age').value = u.age;
    document.getElementById('set-nationality').value = u.nationality;
    document.getElementById('set-marital').value = u.marital;
    document.getElementById('set-cin').value = u.cin;
    document.getElementById('set-job').value = u.job;
    document.getElementById('set-phone').value = u.phone;
    document.getElementById('set-email').value = u.email;
    document.getElementById('set-address').value = u.address;
    document.getElementById('set-city').value = u.city;
    document.getElementById('set-notes').value = u.notes;
    document.getElementById('set-university').value = u.university;
    document.getElementById('set-faculty').value = u.faculty;
    document.getElementById('set-department').value = u.department;
    document.getElementById('set-major').value = u.major;
    document.getElementById('set-level').value = u.level;
    document.getElementById('set-academic-year').value = u.academicYear;
}

function updateImageElements(src, imgIds, phIds) {
    if (src) {
        imgIds.forEach(id => { const el = document.getElementById(id); if (el) { el.src = src; el.classList.remove('hidden'); } });
        phIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
    } else {
        imgIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
        phIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); });
    }
}

function setupFileInputs() {
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => { appState.user.avatar = evt.target.result; renderAllViews(); };
                reader.readAsDataURL(file);
            }
        });
    }

    const unilogoInput = document.getElementById('unilogo-input');
    if (unilogoInput) {
        unilogoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => { appState.user.uniLogo = evt.target.result; renderAllViews(); };
                reader.readAsDataURL(file);
            }
        });
    }

    document.getElementById('remove-avatar-btn').addEventListener('click', () => { appState.user.avatar = ''; renderAllViews(); });
    document.getElementById('remove-unilogo-btn').addEventListener('click', () => { appState.user.uniLogo = ''; renderAllViews(); });
    document.getElementById('set-dob').addEventListener('change', autoCalculateAge);
}

function autoCalculateAge() {
    const dobVal = document.getElementById('set-dob').value;
    if (!dobVal) return;
    const bDay = new Date(dobVal);
    const today = new Date();
    let age = today.getFullYear() - bDay.getFullYear();
    const m = today.getMonth() - bDay.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDay.getDate())) age--;
    const ageStr = age > 0 ? `${age} سنة` : '---';
    document.getElementById('set-age').value = ageStr;
    appState.user.age = ageStr;
}

function setupForms() {
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = appState.user;
        u.username = document.getElementById('set-username').value.trim();

        const nPass = document.getElementById('set-new-pass').value.trim();
        const cPass = document.getElementById('set-confirm-pass').value.trim();
        if (nPass || cPass) {
            if (nPass === cPass && nPass.length > 0) {
                u.pass = nPass;
                alert('تم تعديل كلمة المرور بنجاح!');
                document.getElementById('set-new-pass').value = '';
                document.getElementById('set-confirm-pass').value = '';
            } else {
                alert('كلمتا المرور غير متطابقتين!');
                return;
            }
        }

        u.fullname = document.getElementById('set-fullname').value;
        u.fullnameFr = document.getElementById('set-fullname-fr').value;
        u.dob = document.getElementById('set-dob').value;
        u.pob = document.getElementById('set-pob').value;
        u.nationality = document.getElementById('set-nationality').value;
        u.marital = document.getElementById('set-marital').value;
        u.cin = document.getElementById('set-cin').value;
        u.job = document.getElementById('set-job').value;
        u.phone = document.getElementById('set-phone').value;
        u.email = document.getElementById('set-email').value;
        u.address = document.getElementById('set-address').value;
        u.city = document.getElementById('set-city').value;
        u.notes = document.getElementById('set-notes').value;
        u.university = document.getElementById('set-university').value;
        u.faculty = document.getElementById('set-faculty').value;
        u.department = document.getElementById('set-department').value;
        u.major = document.getElementById('set-major').value;
        u.level = document.getElementById('set-level').value;
        u.academicYear = document.getElementById('set-academic-year').value;

        alert('تم حفظ البيانات بنجاح!');
        renderAllViews();
    });

    document.getElementById('add-db-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('db-file-input');
        const file = fileInput.files[0];

        const item = {
            title: document.getElementById('db-title').value,
            cat: document.getElementById('db-cat').value,
            desc: document.getElementById('db-desc').value,
            details: document.getElementById('db-details').value,
            date: document.getElementById('db-date').value,
            fileName: file ? file.name : ''
        };

        appState.dbEntries.push(item);
        closeModal('add-db-modal');
        renderAllViews();
    });

    document.getElementById('add-subject-form').addEventListener('submit', (e) => {
        e.preventDefault();
        appState.subjects.push({
            title: document.getElementById('sub-title').value,
            prof: document.getElementById('sub-prof').value,
            year: document.getElementById('sub-year').value,
            progress: parseInt(document.getElementById('sub-progress').value) || 0
        });
        closeModal('add-subject-modal');
        renderAllViews();
    });

    document.getElementById('add-file-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const file = document.getElementById('file-upload-input').files[0];
        if (file) {
            appState.files.push({
                title: document.getElementById('file-title').value,
                type: document.getElementById('file-type').value,
                cat: document.getElementById('file-cat').value,
                date: new Date().toISOString().split('T')[0],
                fileName: file.name
            });
            closeModal('add-file-modal');
            renderAllViews();
        }
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        const t = appState.pendingDeleteType;
        const i = appState.pendingDeleteIndex;
        if (t === 'db') appState.dbEntries.splice(i, 1);
        if (t === 'subject') appState.subjects.splice(i, 1);
        if (t === 'file') appState.files.splice(i, 1);
        closeModal('confirm-modal');
        renderAllViews();
    });
}

function renderDbTable() {
    const tbody = document.getElementById('db-table-body');
    if (!tbody) return;
    tbody.innerHTML = appState.dbEntries.map((item, i) => `
        <tr>
            <td><strong>${item.title}</strong></td>
            <td><span class="detail-item">${item.cat}</span></td>
            <td>${item.desc || '---'}</td>
            <td>${item.fileName ? '📄 ' + item.fileName : 'بدون ملف'}</td>
            <td>${item.date}</td>
            <td style="text-align:center;">
                <button class="action-icon-btn" title="حذف" onclick="askDeleteConfirm('db', ${i})">🗑</button>
            </td>
        </tr>
    `).join('');
}

function renderSubjectsGrid() {
    const container = document.getElementById('subjects-container');
    if (!container) return;
    container.innerHTML = appState.subjects.map((sub, i) => `
        <div class="card">
            <h4>📚 ${sub.title}</h4>
            <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">الأستاذ: ${sub.prof || '---'}</p>
            <div style="margin-top:12px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
                    <span>نسبة المراجعة:</span>
                    <span>${sub.progress}%</span>
                </div>
                <input type="range" min="0" max="100" value="${sub.progress}" style="width:100%; cursor:pointer;" onchange="updateSubjectProgress(${i}, this.value)">
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width:${sub.progress}%;"></div>
                </div>
            </div>
            <div style="margin-top:12px; text-align:left;">
                <button class="action-icon-btn" title="حذف المادة" onclick="askDeleteConfirm('subject', ${i})">🗑</button>
            </div>
        </div>
    `).join('');
}

function updateSubjectProgress(idx, val) {
    appState.subjects[idx].progress = parseInt(val);
    renderAllViews();
}

function renderFilesTable() {
    const tbody = document.getElementById('files-table-body');
    if (!tbody) return;
    tbody.innerHTML = appState.files.map((f, i) => `
        <tr>
            <td><strong>📄 ${f.title}</strong></td>
            <td>${f.type}</td>
            <td><span class="detail-item">${f.cat}</span></td>
            <td>${f.date}</td>
            <td style="text-align:center;">
                <button class="action-icon-btn" title="حذف" onclick="askDeleteConfirm('file', ${i})">🗑</button>
            </td>
        </tr>
    `).join('');
}

function askDeleteConfirm(type, index) {
    appState.pendingDeleteType = type;
    appState.pendingDeleteIndex = index;
    openModal('confirm-modal');
}

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// دالة توليد التقرير والطباعة بالهيدر المطلوب
function generateAndPrintReport() {
    const u = appState.user;
    const printContainer = document.getElementById('print-container');
    if (!printContainer) return;

    printContainer.innerHTML = `
        <div class="print-header">
            <div class="print-logo-right">
                <img src="logo.png" alt="شعار الكلية والجامعة">
            </div>
            <div class="print-header-center">
                <h2>المملكة المغربية</h2>
                <h3>جامعة القاضي عياض - مراكش</h3>
                <h3>كلية اللغة العربية</h3>
                <p>قاعدة البيانات والتوجيه الأكاديمي الشخصي</p>
            </div>
            <div class="print-logo-left">
                <img src="logo-fr.jpg" alt="شعار المملكة والوزارة">
            </div>
        </div>

        <hr class="print-divider">

        <div class="print-section">
            <h3 class="print-title">📌 البطاقة التعريفية والمعلومات الشخصية</h3>
            <table class="print-table">
                <tr>
                    <td><strong>الاسم الكامل:</strong> ${u.fullname || 'عمر المهداوي'}</td>
                    <td><strong>الاسم بالفرنسية:</strong> ${u.fullnameFr || 'EL MAHDAOUI OMAR'}</td>
                </tr>
                <tr>
                    <td><strong>تاريخ ومكان الازدياد:</strong> ${u.dob || '---'} (${u.pob || '---'})</td>
                    <td><strong>السن:</strong> ${u.age || '---'}</td>
                </tr>
                <tr>
                    <td><strong>رقم البطاقة الوطنية (CIN):</strong> ${u.cin || '---'}</td>
                    <td><strong>الجنسية / الحالة:</strong> ${u.nationality || 'مغربية'} / ${u.marital || '---'}</td>
                </tr>
                <tr>
                    <td><strong>رقم الهاتف:</strong> ${u.phone || '---'}</td>
                    <td><strong>البريد الإلكتروني:</strong> ${u.email || '---'}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>العنوان السكني:</strong> ${u.address || '---'} - ${u.city || 'مراكش'}</td>
                </tr>
            </table>
        </div>

        <div class="print-section">
            <h3 class="print-title">🎓 المسار الدراسي والأكاديمي</h3>
            <table class="print-table">
                <thead>
                    <tr>
                        <th>المادة / الوحدة</th>
                        <th>الأستاذ المشرف</th>
                        <th>السنة / الفصل</th>
                        <th>نسبة التقدم / المراجعة</th>
                    </tr>
                </thead>
                <tbody>
                    ${appState.subjects.length > 0 ? appState.subjects.map(s => `
                        <tr>
                            <td>${s.title}</td>
                            <td>${s.prof || '---'}</td>
                            <td>${s.year || '---'}</td>
                            <td>${s.progress}%</td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align:center;">لا توجد مواد دراسية مسجلة حالياً</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="print-section">
            <h3 class="print-title">📂 السجلات المسجلة في قاعدة البيانات</h3>
            <table class="print-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>التصنيف</th>
                        <th>التاريخ</th>
                        <th>المرفقات</th>
                    </tr>
                </thead>
                <tbody>
                    ${appState.dbEntries.length > 0 ? appState.dbEntries.map(d => `
                        <tr>
                            <td>${d.title}</td>
                            <td>${d.cat}</td>
                            <td>${d.date}</td>
                            <td>${d.fileName || 'بدون مرفق'}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align:center;">لا توجد بيانات مسجلة في القائمة</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="print-footer">
            <p>حرر بتاريخ: ${new Date().toLocaleDateString('ar-MA')} | نظام إدارة قاعدة البيانات الشخصية - عمر المهداوي</p>
        </div>
    `;

    window.print();
}