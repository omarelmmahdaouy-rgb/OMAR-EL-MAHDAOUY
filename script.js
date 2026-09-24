// البيانات المبدئية
const defaultUserData = {
    username: "admin",
    password: "123",
    fullname: "عمر المهداوي",
    fullnameFr: "Omar El Mahdaoui",
    dob: "2002-05-15",
    pob: "المغرب",
    nationality: "مغربية",
    marital: "أعزب",
    cin: "A1234567",
    job: "طالب / مستخدم",
    phone: "+212 600-000000",
    email: "omar@example.com",
    address: "المغرب",
    city: "الرباط",
    notes: "حساب إدارة البيانات الشخصية والأكاديمية",
    university: "جامعة محمد الخامس",
    faculty: "كلية العلوم",
    department: "الفيزياء / القانون",
    major: "علوم شريعة / تقنية",
    level: "الإجازة",
    academicYear: "2025/2026",
    avatar: "",
    uniLogo: ""
};

let userData = JSON.parse(localStorage.getItem('omar_user_data')) || defaultUserData;
let dbItems = JSON.parse(localStorage.getItem('omar_db_items')) || [];
let subjects = JSON.parse(localStorage.getItem('omar_subjects')) || [];
let filesList = JSON.parse(localStorage.getItem('omar_files')) || [];

let excelGridData = JSON.parse(localStorage.getItem('omar_excel_grid')) || [
    ["العنوان", "النوع", "المبلغ / النقطة", "ملاحظات"],
    ["سجل 1", "مصاريف", "1500", "تم الدفع"],
    ["سجل 2", "دراسة", "18/20", "ممتاز"]
];

let deleteCallback = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAuth();
    initSettingsForm();
    renderAllData();
    renderExcelTable();
});

function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn[data-tab]');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });
            const target = document.getElementById(`sec-${tab}`);
            if (target) target.classList.add('active');
        });
    });
}

function initAuth() {
    const loginBtn = document.getElementById('login-btn-submit');
    const logoutBtn = document.getElementById('logout-btn');

    loginBtn.addEventListener('click', () => {
        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;

        if ((u === userData.username || u === userData.email) && p === userData.password) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-dashboard').classList.remove('hidden');
        } else {
            alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
        }
    });

    logoutBtn.addEventListener('click', () => {
        document.getElementById('app-dashboard').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    });
}

function renderAllData() {
    // تحديث النصوص المعروضة
    document.getElementById('header-fullname').innerText = userData.fullname;
    document.getElementById('side-fullname').innerText = userData.fullname;
    document.getElementById('side-job').innerText = userData.job;
    document.getElementById('dash-welcome-name').innerText = userData.fullname;

    // تحديث الصور ومعاينتها
    if (userData.avatar) {
        document.getElementById('sidebar-avatar').src = userData.avatar;
        document.getElementById('sidebar-avatar').classList.remove('hidden');
        document.getElementById('sidebar-avatar-placeholder').classList.add('hidden');

        document.getElementById('header-avatar').src = userData.avatar;
        document.getElementById('header-avatar').classList.remove('hidden');
        document.getElementById('header-avatar-placeholder').classList.add('hidden');

        document.getElementById('dash-profile-img').src = userData.avatar;
        document.getElementById('dash-profile-img').classList.remove('hidden');
        document.getElementById('dash-avatar-placeholder').classList.add('hidden');

        document.getElementById('settings-avatar-preview').src = userData.avatar;
        document.getElementById('settings-avatar-preview').classList.remove('hidden');
        document.getElementById('settings-avatar-ph').classList.add('hidden');
    } else {
        document.getElementById('sidebar-avatar').classList.add('hidden');
        document.getElementById('sidebar-avatar-placeholder').classList.remove('hidden');

        document.getElementById('header-avatar').classList.add('hidden');
        document.getElementById('header-avatar-placeholder').classList.remove('hidden');

        document.getElementById('dash-profile-img').classList.add('hidden');
        document.getElementById('dash-avatar-placeholder').classList.remove('hidden');

        document.getElementById('settings-avatar-preview').classList.add('hidden');
        document.getElementById('settings-avatar-ph').classList.remove('hidden');
    }

    if (userData.uniLogo) {
        document.getElementById('study-uni-logo').src = userData.uniLogo;
        document.getElementById('study-uni-logo').classList.remove('hidden');
        document.getElementById('study-logo-placeholder').classList.add('hidden');

        document.getElementById('settings-unilogo-preview').src = userData.uniLogo;
        document.getElementById('settings-unilogo-preview').classList.remove('hidden');
        document.getElementById('settings-unilogo-ph').classList.add('hidden');
    } else {
        document.getElementById('study-uni-logo').classList.add('hidden');
        document.getElementById('study-logo-placeholder').classList.remove('hidden');

        document.getElementById('settings-unilogo-preview').classList.add('hidden');
        document.getElementById('settings-unilogo-ph').classList.remove('hidden');
    }

    // بطاقة المعلومات الرئيسية
    const grid = document.getElementById('dash-details-grid');
    grid.innerHTML = `
        <div class="detail-item"><strong>الاسم الكامل:</strong> ${userData.fullname} (${userData.fullnameFr})</div>
        <div class="detail-item"><strong>رقم البطاقة الوطنية:</strong> ${userData.cin}</div>
        <div class="detail-item"><strong>تاريخ ومكان الازدياد:</strong> ${userData.dob} - ${userData.pob}</div>
        <div class="detail-item"><strong>الهاتف:</strong> ${userData.phone}</div>
        <div class="detail-item"><strong>البريد الإلكتروني:</strong> ${userData.email}</div>
        <div class="detail-item"><strong>المدينة والعنوان:</strong> ${userData.city} - ${userData.address}</div>
        <div class="detail-item"><strong>الجامعة والكلية:</strong> ${userData.university} - ${userData.faculty}</div>
        <div class="detail-item"><strong>المستوى والتخصص:</strong> ${userData.level} (${userData.major})</div>
    `;

    // اللوحة الدراسية (تفاصيل معلومات الدراسة)
    const studyGrid = document.getElementById('study-details-grid');
    studyGrid.innerHTML = `
        <div class="detail-item"><strong>الجامعة:</strong> ${userData.university || '-'}</div>
        <div class="detail-item"><strong>الكلية:</strong> ${userData.faculty || '-'}</div>
        <div class="detail-item"><strong>الشعبة:</strong> ${userData.department || '-'}</div>
        <div class="detail-item"><strong>المسلك / التخصص:</strong> ${userData.major || '-'}</div>
        <div class="detail-item"><strong>المستوى الدراسي:</strong> ${userData.level || '-'}</div>
        <div class="detail-item"><strong>السنة الجامعية:</strong> ${userData.academicYear || '-'}</div>
    `;

    renderDBTable();
    renderSubjects();
    renderFilesTable();
}

// Excel Table Functions
function renderExcelTable() {
    const table = document.getElementById('excel-grid-table');
    table.innerHTML = '';

    excelGridData.forEach((row, rIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cellValue, cIndex) => {
            const cell = rIndex === 0 ? document.createElement('th') : document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = cellValue;
            input.onchange = (e) => {
                excelGridData[rIndex][cIndex] = e.target.value;
            };
            cell.appendChild(input);
            tr.appendChild(cell);
        });
        table.appendChild(tr);
    });
}

function addExcelRow() {
    const colsCount = excelGridData[0] ? excelGridData[0].length : 4;
    excelGridData.push(new Array(colsCount).fill(""));
    renderExcelTable();
}

function addExcelCol() {
    excelGridData.forEach((row, idx) => {
        row.push(idx === 0 ? `عمود ${row.length + 1}` : "");
    });
    renderExcelTable();
}

function saveExcelData() {
    localStorage.setItem('omar_excel_grid', JSON.stringify(excelGridData));
    alert('تم حفظ كافة التغييرات بجدول إكسيل بنجاح!');
}

function exportExcelCSV() {
    const ws = XLSX.utils.aoa_to_sheet(excelGridData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "بيانات_عمر_المهداوي.xlsx");
}

// Database logic
function renderDBTable() {
    const tbody = document.getElementById('db-table-body');
    tbody.innerHTML = '';
    dbItems.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td><span class="badge">${item.cat}</span></td>
                <td>${item.desc || '-'}</td>
                <td>${item.fileName ? '📄 ' + item.fileName : 'لا يوجد'}</td>
                <td>${item.date}</td>
                <td style="text-align:center;">
                    <button class="action-icon-btn" onclick="viewDBItem(${index})">👁️</button>
                    <button class="action-icon-btn" onclick="confirmDelete(() => deleteDBItem(${index}))">🗑️</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById('add-db-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('db-file-input');
    const file = fileInput.files[0];

    const newItem = {
        title: document.getElementById('db-title').value,
        cat: document.getElementById('db-cat').value,
        desc: document.getElementById('db-desc').value,
        details: document.getElementById('db-details').value,
        date: document.getElementById('db-date').value,
        fileName: file ? file.name : '',
        fileData: ''
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            newItem.fileData = evt.target.result;
            dbItems.push(newItem);
            localStorage.setItem('omar_db_items', JSON.stringify(dbItems));
            renderDBTable();
            closeModal('add-db-modal');
        };
        reader.readAsDataURL(file);
    } else {
        dbItems.push(newItem);
        localStorage.setItem('omar_db_items', JSON.stringify(dbItems));
        renderDBTable();
        closeModal('add-db-modal');
    }
});

function deleteDBItem(index) {
    dbItems.splice(index, 1);
    localStorage.setItem('omar_db_items', JSON.stringify(dbItems));
    renderDBTable();
}

function viewDBItem(index) {
    const item = dbItems[index];
    document.getElementById('view-title').innerText = item.title;
    document.getElementById('view-body').innerHTML = `
        <p><strong>التصنيف:</strong> ${item.cat}</p>
        <p><strong>التاريخ:</strong> ${item.date}</p>
        <p><strong>الوصف:</strong> ${item.desc}</p>
        <p><strong>التفاصيل:</strong> ${item.details}</p>
    `;

    const area = document.getElementById('file-preview-area');
    const link = document.getElementById('file-download-link');
    area.innerHTML = '';

    if (item.fileData) {
        link.style.display = 'inline-flex';
        link.href = item.fileData;
        area.innerHTML = `<iframe src="${item.fileData}" style="width:100%; height:100%; border:none;"></iframe>`;
    } else {
        link.style.display = 'none';
        area.innerHTML = '<p style="color:#fff;">لا يوجد ملف مرفق معاين</p>';
    }
    openModal('view-modal');
}

// Subjects logic
function renderSubjects() {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';
    subjects.forEach((sub, i) => {
        container.innerHTML += `
            <div class="card">
                <h4>${sub.title}</h4>
                <p>الأستاذ: ${sub.prof}</p>
                <p>السنة: ${sub.year}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width:${sub.progress}%"></div>
                </div>
                <small>${sub.progress}% مراجعة</small>
            </div>
        `;
    });
}

document.getElementById('add-subject-form').addEventListener('submit', (e) => {
    e.preventDefault();
    subjects.push({
        title: document.getElementById('sub-title').value,
        prof: document.getElementById('sub-prof').value,
        year: document.getElementById('sub-year').value,
        progress: document.getElementById('sub-progress').value
    });
    localStorage.setItem('omar_subjects', JSON.stringify(subjects));
    renderSubjects();
    closeModal('add-subject-modal');
});

function renderFilesTable() {
    const tbody = document.getElementById('files-table-body');
    tbody.innerHTML = '';
    filesList.forEach((f, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${f.title}</td>
                <td>${f.type}</td>
                <td>${f.cat}</td>
                <td>${f.date}</td>
                <td style="text-align:center;">
                    <button class="action-icon-btn" onclick="confirmDelete(() => deleteFile(${i}))">🗑️</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById('add-file-form').addEventListener('submit', (e) => {
    e.preventDefault();
    filesList.push({
        title: document.getElementById('file-title').value,
        type: document.getElementById('file-type').value,
        cat: document.getElementById('file-cat').value,
        date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('omar_files', JSON.stringify(filesList));
    renderFilesTable();
    closeModal('add-file-modal');
});

function deleteFile(i) {
    filesList.splice(i, 1);
    localStorage.setItem('omar_files', JSON.stringify(filesList));
    renderFilesTable();
}

// الإعدادات وتحميل الصور
function initSettingsForm() {
    document.getElementById('set-username').value = userData.username;
    document.getElementById('set-fullname').value = userData.fullname;
    document.getElementById('set-fullname-fr').value = userData.fullnameFr;
    document.getElementById('set-dob').value = userData.dob;
    document.getElementById('set-pob').value = userData.pob;
    document.getElementById('set-nationality').value = userData.nationality;
    document.getElementById('set-marital').value = userData.marital;
    document.getElementById('set-cin').value = userData.cin;
    document.getElementById('set-job').value = userData.job;
    document.getElementById('set-phone').value = userData.phone;
    document.getElementById('set-email').value = userData.email;
    document.getElementById('set-address').value = userData.address;
    document.getElementById('set-city').value = userData.city;
    document.getElementById('set-notes').value = userData.notes;
    document.getElementById('set-university').value = userData.university;
    document.getElementById('set-faculty').value = userData.faculty;
    document.getElementById('set-department').value = userData.department;
    document.getElementById('set-major').value = userData.major;
    document.getElementById('set-level').value = userData.level;
    document.getElementById('set-academic-year').value = userData.academicYear;

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPass = document.getElementById('set-new-pass').value;
        const confirmPass = document.getElementById('set-confirm-pass').value;

        if (newPass) {
            if (newPass !== confirmPass) {
                alert('كلمة المرور غير متطابقة!');
                return;
            }
            userData.password = newPass;
        }

        userData.username = document.getElementById('set-username').value;
        userData.fullname = document.getElementById('set-fullname').value;
        userData.fullnameFr = document.getElementById('set-fullname-fr').value;
        userData.dob = document.getElementById('set-dob').value;
        userData.pob = document.getElementById('set-pob').value;
        userData.nationality = document.getElementById('set-nationality').value;
        userData.marital = document.getElementById('set-marital').value;
        userData.cin = document.getElementById('set-cin').value;
        userData.job = document.getElementById('set-job').value;
        userData.phone = document.getElementById('set-phone').value;
        userData.email = document.getElementById('set-email').value;
        userData.address = document.getElementById('set-address').value;
        userData.city = document.getElementById('set-city').value;
        userData.notes = document.getElementById('set-notes').value;
        userData.university = document.getElementById('set-university').value;
        userData.faculty = document.getElementById('set-faculty').value;
        userData.department = document.getElementById('set-department').value;
        userData.major = document.getElementById('set-major').value;
        userData.level = document.getElementById('set-level').value;
        userData.academicYear = document.getElementById('set-academic-year').value;

        localStorage.setItem('omar_user_data', JSON.stringify(userData));
        renderAllData();
        alert('تم حفظ كل التغييرات بنجاح!');
    });

    // رفع الصورة الشخصية وتحديث المعاينة فوراً
    document.getElementById('avatar-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                userData.avatar = evt.target.result;
                localStorage.setItem('omar_user_data', JSON.stringify(userData));
                renderAllData();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('remove-avatar-btn').addEventListener('click', () => {
        userData.avatar = "";
        localStorage.setItem('omar_user_data', JSON.stringify(userData));
        renderAllData();
    });

    // رفع شعار الكلية وتحديث المعاينة فوراً
    document.getElementById('unilogo-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                userData.uniLogo = evt.target.result;
                localStorage.setItem('omar_user_data', JSON.stringify(userData));
                renderAllData();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('remove-unilogo-btn').addEventListener('click', () => {
        userData.uniLogo = "";
        localStorage.setItem('omar_user_data', JSON.stringify(userData));
        renderAllData();
    });
}

// طباعة التقرير
function printReport() {
    const printArea = document.getElementById('print-container');
    printArea.innerHTML = `
        <div class="print-header-center">
            <h2>تقرير قاعدة البيانات الرسمية - ${userData.fullname}</h2>
        </div>
        <table class="print-table">
            <tr><th>الاسم الكامل</th><td>${userData.fullname} (${userData.fullnameFr})</td></tr>
            <tr><th>رقم البطاقة الوطنية</th><td>${userData.cin}</td></tr>
            <tr><th>تاريخ ومكان الازدياد</th><td>${userData.dob} - ${userData.pob}</td></tr>
            <tr><th>المهنة والصفة</th><td>${userData.job}</td></tr>
            <tr><th>الجامعة والكلية</th><td>${userData.university} - ${userData.faculty}</td></tr>
            <tr><th>التخصص والتأهيل</th><td>${userData.major} - ${userData.level}</td></tr>
            <tr><th>البريد والهاتف</th><td>${userData.email} | ${userData.phone}</td></tr>
        </table>
        <div class="print-footer">تم استخراج هذا المستند تلقائياً من نظام إدارة البيانات</div>
    `;
    window.print();
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function confirmDelete(callback) {
    deleteCallback = callback;
    openModal('confirm-modal');
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (deleteCallback) deleteCallback();
    closeModal('confirm-modal');
});