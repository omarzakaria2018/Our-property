let properties = [];
let currentView = 'cards';
let currentCountry = null;
let currentProperty = null;
let filterStatus = null;

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة القائمة المنسدلة للجوال
    initMobileMenu();
    
    // تحميل البيانات
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            properties = data;
            initializeApp();
        })
        .catch(error => {
            console.error('خطأ في تحميل البيانات:', error);
        });
});

// تهيئة القائمة المنسدلة للجوال
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const menuOverlay = document.getElementById('menuOverlay');
    
    // فتح القائمة
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // إغلاق القائمة
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // إغلاق القائمة عند النقر على الخلفية
    menuOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // أزرار القائمة المنسدلة
    document.getElementById('mobile-country-btn').addEventListener('click', function() {
        showCountrySelection();
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    document.getElementById('mobile-property-btn').addEventListener('click', function() {
        toggleSidebar();
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    document.getElementById('mobile-filter-btn').addEventListener('click', function() {
        showStatusFilter();
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    document.getElementById('mobile-view-btn').addEventListener('click', function() {
        showViewToggle();
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// عرض اختيار المدينة
function showCountrySelection() {
    const countries = getUniqueCountries();
    let html = '<div class="modal-overlay" style="display:flex;"><div class="modal-box"><button class="close-modal" onclick="closeModal()">×</button>';
    html += '<h3>اختر المدينة</h3><div class="country-selection">';
    
    countries.forEach(country => {
        html += `<button onclick="selectCountry('${country}'); closeModal();" class="${currentCountry === country ? 'active' : ''}">${country}</button>`;
    });
    
    html += '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
    
    // إضافة حدث إغلاق للمودال
    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // توسيع منطقة إغلاق النافذة حول X
    const closeBtn = document.querySelector('.modal-overlay:last-child .close-modal');
    if (closeBtn) {
        closeBtn.style.padding = '15px';
        closeBtn.style.margin = '-15px';
    }
}

// عرض فلتر الحالة
function showStatusFilter() {
    // أضف "الفارغ" إلى قائمة الحالات
    const statuses = ['جاري', 'منتهى', 'على وشك', 'فارغ'];
    let html = '<div class="modal-overlay" style="display:flex;"><div class="modal-box"><button class="close-modal" onclick="closeModal()">×</button>';
    html += '<h3>فلتر الحالة</h3><div class="status-filter">';
    
    html += `<button onclick="setStatusFilter(null); closeModal();" class="${filterStatus === null ? 'active' : ''}">الكل</button>`;
    statuses.forEach(status => {
        html += `<button onclick="setStatusFilter('${status}'); closeModal();" class="${filterStatus === status ? 'active' : ''}">${status}</button>`;
    });
    
    html += '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
    
    // إضافة حدث إغلاق للمودال
    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // توسيع منطقة إغلاق النافذة حول X
    const closeBtn = document.querySelector('.modal-overlay:last-child .close-modal');
    if (closeBtn) {
        closeBtn.style.padding = '15px';
        closeBtn.style.margin = '-15px';
    }
}

// عرض تبديل طريقة العرض
function showViewToggle() {
    let html = '<div class="modal-overlay" style="display:flex;"><div class="modal-box"><button class="close-modal" onclick="closeModal()">×</button>';
    html += '<h3>طريقة العرض</h3><div class="view-selection">';
    
    html += `<button onclick="toggleView('table'); closeModal();" class="${currentView === 'table' ? 'active' : ''}"><i class="fas fa-table"></i> جدول</button>`;
    html += `<button onclick="toggleView('cards'); closeModal();" class="${currentView === 'cards' ? 'active' : ''}"><i class="fas fa-th-large"></i> بطاقات</button>`;
    
    html += '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
    
    // إضافة حدث إغلاق للمودال
    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // توسيع منطقة إغلاق النافذة حول X
    const closeBtn = document.querySelector('.modal-overlay:last-child .close-modal');
    if (closeBtn) {
        closeBtn.style.padding = '15px';
        closeBtn.style.margin = '-15px';
    }
}

// تهيئة التطبيق
function initializeApp() {
    // معالجة الحالات الفارغة تلقائياً
    properties.forEach(property => {
        // إذا كان اسم المستأجر أو المالك فارغ، اجعل الحالتين فارغتين
        if (!property['اسم المستأجر'] || !property['المالك']) {
            property['الحالة النهائية'] = '';
            property['الحالة الجديدة'] = '';
            return;
        }

        // إذا كانت الحالة النهائية أو الجديدة فارغة
        if (!property['الحالة النهائية'] || !property['الحالة الجديدة']) {
            const today = new Date();
            // تحويل تاريخ البداية من نص إلى كائن تاريخ
            const endDateStr = property['تاريخ النهاية'];
            if (!endDateStr) {
                property['الحالة النهائية'] = '';
                property['الحالة الجديدة'] = '';
                return;
            }
            // دعم الصيغ dd/mm/yyyy أو dd-mm-yyyy
            const parts = endDateStr.split(/[\/\-]/);
            if (parts.length !== 3) {
                property['الحالة النهائية'] = '';
                property['الحالة الجديدة'] = '';
                return;
            }
            // ترتيب اليوم والشهر والسنة حسب الصيغة
            const [day, month, year] = parts.map(Number);
            const endDate = new Date(year, month - 1, day);

            // حساب الفرق بالأيام
            const diffDays = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
            // قبل النهاية بشهرين = 60 يوم
            if (diffDays < 0) {
                property['الحالة النهائية'] = 'منتهى';
                property['الحالة الجديدة'] = `منتهي منذ ${Math.abs(diffDays)} يوم`;
            } else if (diffDays <= 60) {
                property['الحالة النهائية'] = 'على وشك';
                property['الحالة الجديدة'] = `سينتهي بعد ${diffDays} يوم`;
            } else {
                property['الحالة النهائية'] = 'جاري';
                property['الحالة الجديدة'] = 'فعال';
            }
        }
    });

    // تهيئة أزرار المدينةان
    initCountryButtons();
    
    // تهيئة قائمة العقارات
    initPropertyList();
    
    // تهيئة فلتر الحالة
    initStatusFilter();
    
    // تهيئة البحث العام
    initGlobalSearch();
    
    // تهيئة البحث في العقارات
    initPropertySearch();
    
    // عرض البيانات الأولية
    renderData();
    
    // إضافة زر إخفاء السايدبار
    const sidebar = document.getElementById('sidebar');
    const hideBtn = document.querySelector('.hide-sidebar-btn');
    if (!hideBtn) {
        const btn = document.createElement('button');
        btn.className = 'hide-sidebar-btn';
        btn.textContent = 'إخفاء القائمة';
        btn.onclick = function() {
            toggleSidebar();
        };
        sidebar.appendChild(btn);
    }
}

// الحصول على المدينةان الفريدة
function getUniqueCountries() {
    const countries = new Set();
    properties.forEach(property => {
        if (property.المدينة) {
            countries.add(property.المدينة);
        }
    });
    return ['الكل', ...Array.from(countries)];
}

// الحصول على العقارات الفريدة
function getUniqueProperties() {
    const uniqueProperties = new Set();
    properties.forEach(property => {
        if (property['اسم العقار']) {
            uniqueProperties.add(property['اسم العقار']);
        }
    });
    return Array.from(uniqueProperties);
}

// تهيئة أزرار المدينةان
function initCountryButtons() {
    const countries = getUniqueCountries();
    const container = document.getElementById('countryButtons');
    container.innerHTML = '';
    
    countries.forEach(country => {
        const button = document.createElement('button');
        button.textContent = country;
        button.onclick = () => selectCountry(country === 'الكل' ? null : country);
        if ((currentCountry === null && country === 'الكل') || currentCountry === country) {
            button.classList.add('active');
        }
        container.appendChild(button);
    });
}

// تهيئة قائمة العقارات
function initPropertyList(selectedCountry = null) {
    // الحصول على العقارات حسب المدينة المحدد
    let filteredProperties = properties;
    if (selectedCountry) {
        filteredProperties = properties.filter(property => property.المدينة === selectedCountry);
    }
    
    // استخراج أسماء العقارات الفريدة من العقارات المفلترة
    const propertyNames = [...new Set(filteredProperties.map(property => property['اسم العقار']))];
    
    // تحديث قائمة العقارات في الـ sidebar
    const container = document.getElementById('propertyList');
    container.innerHTML = '';
    
    propertyNames.forEach(propertyName => {
        const div = document.createElement('div');
        div.textContent = propertyName;
        div.onclick = () => selectProperty(propertyName);
        if (currentProperty === propertyName) {
            div.classList.add('active');
        }
        // إضافة تأثير حركي للظهور
        div.style.animation = 'slideIn 0.3s ease-out forwards';
        container.appendChild(div);
    });

    // إضافة رسالة إذا لم تكن هناك عقارات
    if (propertyNames.length === 0) {
        const noProperties = document.createElement('div');
        noProperties.className = 'no-properties';
        noProperties.textContent = 'لا توجد عقارات في هذا المدينة';
        noProperties.style.textAlign = 'center';
        noProperties.style.padding = '1rem';
        noProperties.style.color = '#666';
        container.appendChild(noProperties);
    }
}

// تهيئة فلتر الحالة
function initStatusFilter() {
    const container = document.getElementById('headerFilters');
    container.innerHTML = '';
    
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-filter"></i> فلتر الحالة';
    button.onclick = showStatusFilter;
    container.appendChild(button);
}

// تهيئة البحث العام
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', renderData);
}

// تهيئة البحث في العقارات
function initPropertySearch() {
    const searchInput = document.getElementById('propertySearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const propertyItems = document.querySelectorAll('#propertyList div');
        
        propertyItems.forEach(item => {
            const propertyName = item.textContent.toLowerCase();
            if (propertyName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// اختيار بلد
function selectCountry(country) {
    // عند اختيار "الكل" أزل كل الفلاتر
    if (!country || country === 'الكل') {
        currentCountry = null;
        currentProperty = null;
    } else {
        // إذا تم اختيار بلد جديد أزل فلتر العقار
        if (currentCountry !== country) {
            currentCountry = country;
            currentProperty = null;
        } else {
            // إذا تم الضغط على نفس المدينة مرة أخرى أزل فلتر العقار فقط
            currentProperty = null;
        }
    }
    initCountryButtons();
    initPropertyList(currentCountry);
    renderData();
}

// اختيار عقار
function selectProperty(propertyName) {
    // إذا تم اختيار نفس العقار أزل الفلتر
    if (currentProperty === propertyName) {
        currentProperty = null;
    } else {
        currentProperty = propertyName;
    }
    renderData();
    // إخفاء السايدبار تلقائياً بعد اختيار عقار
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
}

// تعيين فلتر الحالة
function setStatusFilter(status) {
    filterStatus = status;
    renderData();
}

// تبديل طريقة العرض
function toggleView(view) {
    currentView = view;
    
    const tableBtn = document.getElementById('table-btn');
    const cardsBtn = document.getElementById('cards-btn');
    
    if (view === 'table') {
        tableBtn.classList.add('active');
        cardsBtn.classList.remove('active');
    } else {
        tableBtn.classList.remove('active');
        cardsBtn.classList.add('active');
    }
    
    renderData();
}

// تبديل عرض الشريط الجانبي
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    
    sidebar.classList.toggle('active');
    
    // تعديل هامش المحتوى الرئيسي فقط على الشاشات الكبيرة
    if (window.innerWidth > 900) {
        if (sidebar.classList.contains('active')) {
            main.classList.add('with-sidebar');
        } else {
            main.classList.remove('with-sidebar');
        }
    }
}

// عرض البيانات
function renderData() {
    // تصفية البيانات
    let filteredData = properties;
    
    // تصفية حسب المدينة
    if (currentCountry) {
        filteredData = filteredData.filter(property => property.المدينة === currentCountry);
    }
    
    // تصفية حسب العقار
    if (currentProperty) {
        filteredData = filteredData.filter(property => property['اسم العقار'] === currentProperty);
    }
    
    // تصفية حسب الحالة
    if (filterStatus) {
        filteredData = filteredData.filter(property => {
            const status = calculateStatus(property);
            return status.final === filterStatus;
        });
    }
    
    // تصفية حسب البحث العام
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
    if (searchTerm) {
        filteredData = filteredData.filter(property => {
            return Object.values(property).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            );
        });
    }
    
    // عرض الإحصائيات
    renderTotals(filteredData);
    renderMobileTotals(filteredData);
    
    // عرض البيانات حسب طريقة العرض
    if (currentView === 'table') {
        renderTable(filteredData);
    } else {
        renderCards(filteredData);
    }
    
    // تحديث عدادات القائمة المتنقلة
    updateMobileMenuCounts(filteredData);
}

// تحديث عدادات القائمة المتنقلة
function updateMobileMenuCounts(data) {
    // عدد المدينةان
    const countries = new Set();
    properties.forEach(property => {
        if (property.المدينة) {
            countries.add(property.المدينة);
        }
    });
    document.getElementById('countryCount').textContent = countries.size;
    
    // عدد العقارات
    const uniqueProperties = new Set();
    data.forEach(property => {
        if (property['اسم العقار']) {
            uniqueProperties.add(property['اسم العقار']);
        }
    });
    document.getElementById('propertyCount').textContent = uniqueProperties.size;
    
    // عدد الفلاتر النشطة
    let filterCount = 0;
    if (currentCountry) filterCount++;
    if (currentProperty) filterCount++;
    if (filterStatus) filterCount++;
    document.getElementById('filterCount').textContent = filterCount || '';
}

// عرض الإحصائيات
function renderTotals(data) {
    const container = document.getElementById('totalContainer');
    container.innerHTML = '';

    // الإحصائيات الأساسية دائماً
    const totalUnits = data.length;
    addTotalItem(container, 'عدد الوحدات', totalUnits, 'units-stat');

    // تجميع العقود الفريدة
    const uniqueContracts = {};
    data.forEach(property => {
        if (property['رقم العقد'] && property['اسم العقار']) {
            const key = `${property['رقم العقد']}_${property['اسم العقار']}`;
            if (!uniqueContracts[key]) uniqueContracts[key] = property;
        }
    });
    const uniqueList = Object.values(uniqueContracts);

    // باقي الإحصائيات كما هي...
    const tenantsCount = uniqueList.filter(p => p['اسم المستأجر']).length;
    addTotalItem(container, 'عدد المستأجرين', tenantsCount, 'tenants-stat');

    const emptyCount = uniqueList.filter(property => !property['اسم المستأجر'] || !property['المالك']).length;

    const activeCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'جاري';
    }).length;
    addTotalItem(container, 'الجاري', activeCount, 'active-stat');

    const expiredCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'منتهى';
    }).length;
    addTotalItem(container, 'المنتهي', expiredCount, 'expired-stat');

    addTotalItem(container, 'الفارغ', emptyCount, 'empty-stat');

    const pendingCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'على وشك';
    }).length;
    addTotalItem(container, 'على وشك', pendingCount, 'pending-stat');

    // ==== الحسابات الضريبية الجديدة ====
    // مبلغ تجاري (ضريبي)
    const commercialTotal = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'ضريبي' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + parseFloat(property['الاجمالى']);
        }
        return sum;
    }, 0);

    // مبلغ قبل الضريبة (الخاضع)
    const commercialTaxable = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'ضريبي' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + (parseFloat(property['الاجمالى']) / 1.15);
        }
        return sum;
    }, 0);

    // مبلغ الضريبة
    const commercialTax = commercialTotal - commercialTaxable;

    // مبلغ سكني
    const residentialTotal = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'سكني' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + parseFloat(property['الاجمالى']);
        }
        return sum;
    }, 0);

    // الاجمالي الجديد = مبلغ قبل الضريبة + مبلغ سكني
    const newGrandTotal = commercialTaxable + residentialTotal;

    // عرض البنود الجديدة
    addTotalItem(container, 'مبلغ تجاري (شامل الضريبة)', commercialTotal.toLocaleString() + ' ريال', 'commercial-total');
    addTotalItem(container, 'مبلغ قبل ضريبة', commercialTaxable.toLocaleString() + ' ريال', 'commercial-taxable');
    addTotalItem(container, 'ضريبة', commercialTax.toLocaleString() + ' ريال', 'commercial-tax');
    addTotalItem(container, 'مبلغ سكني', residentialTotal.toLocaleString() + ' ريال', 'residential-total');

    // الاجمالي الجديد مع توضيح
    const grandTotalItem = document.createElement('div');
    grandTotalItem.className = 'total-item grand-total';
    grandTotalItem.innerHTML = `<span class="total-label">الاجمالي (قبل الضريبة + السكني):</span>
        <span class="total-value">${newGrandTotal.toLocaleString()} ريال</span>
        <div style="font-size:0.95em;color:#e67e22;margin-top:4px;">تم خصم قيمة الضريبة من الإجمالي</div>`;
    container.appendChild(grandTotalItem);

    // إضافة معلومات الفلتر الحالي كما هي...
    let filterInfo = '';
    if (currentCountry) filterInfo += `المدينة: ${currentCountry} | `;
    if (currentProperty) filterInfo += `العقار: ${currentProperty} | `;
    if (filterStatus) filterInfo += `الحالة: ${filterStatus} | `;
    if (filterInfo) {
        filterInfo = filterInfo.slice(0, -3);
        const filterInfoItem = document.createElement('div');
        filterInfoItem.className = 'filter-info';
        filterInfoItem.innerHTML = `<span>الفلتر الحالي: ${filterInfo}</span>`;
        container.appendChild(filterInfoItem);
    }
}

// عرض الإحصائيات للجوال
function renderMobileTotals(data) {
    const container = document.getElementById('mobileTotals');
    container.innerHTML = '';

    const totalUnits = data.length;
    addTotalItem(container, 'عدد الوحدات', totalUnits, 'units-stat');

    // تجميع العقود الفريدة
    const uniqueContracts = {};
    data.forEach(property => {
        if (property['رقم العقد'] && property['اسم العقار']) {
            const key = `${property['رقم العقد']}_${property['اسم العقار']}`;
            if (!uniqueContracts[key]) uniqueContracts[key] = property;
        }
    });
    const uniqueList = Object.values(uniqueContracts);

    // عدد المستأجرين
    const tenantsCount = uniqueList.filter(p => p['اسم المستأجر']).length;
    addTotalItem(container, 'عدد المستأجرين', tenantsCount, 'tenants-stat');

    // الفارغ
    const emptyCount = uniqueList.filter(property => !property['اسم المستأجر'] || !property['المالك']).length;

    // الجاري
    const activeCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'جاري';
    }).length;
    addTotalItem(container, 'الجاري', activeCount, 'active-stat');

    // المنتهي
    const expiredCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'منتهى';
    }).length;
    addTotalItem(container, 'المنتهي', expiredCount, 'expired-stat');

    // الفارغ
    addTotalItem(container, 'الفارغ', emptyCount, 'empty-stat');

    // على وشك
    const pendingCount = uniqueList.filter(property => {
        const status = calculateStatus(property);
        return status.final === 'على وشك';
    }).length;
    addTotalItem(container, 'على وشك', pendingCount, 'pending-stat');

    // ==== الحسابات الضريبية الجديدة ====
    // مبلغ تجاري (ضريبي)
    const commercialTotal = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'ضريبي' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + parseFloat(property['الاجمالى']);
        }
        return sum;
    }, 0);

    // مبلغ قبل الضريبة (الخاضع)
    const commercialTaxable = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'ضريبي' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + (parseFloat(property['الاجمالى']) / 1.15);
        }
        return sum;
    }, 0);

    // مبلغ الضريبة
    const commercialTax = commercialTotal - commercialTaxable;

    // مبلغ سكني
    const residentialTotal = uniqueList.reduce((sum, property) => {
        if (property['نوع العقد'] === 'سكني' && property['الاجمالى'] && !isNaN(parseFloat(property['الاجمالى']))) {
            return sum + parseFloat(property['الاجمالى']);
        }
        return sum;
    }, 0);

    // الاجمالي الجديد = مبلغ قبل الضريبة + مبلغ سكني
    const newGrandTotal = commercialTaxable + residentialTotal;

    // عرض البنود الجديدة
    addTotalItem(container, 'مبلغ تجاري (شامل الضريبة)', commercialTotal.toLocaleString() + ' ريال', 'commercial-total');
    addTotalItem(container, 'مبلغ قبل ضريبة', commercialTaxable.toLocaleString() + ' ريال', 'commercial-taxable');
    addTotalItem(container, 'ضريبة', commercialTax.toLocaleString() + ' ريال', 'commercial-tax');
    addTotalItem(container, 'مبلغ سكني', residentialTotal.toLocaleString() + ' ريال', 'residential-total');

    // الاجمالي الجديد مع توضيح
    const grandTotalItem = document.createElement('div');
    grandTotalItem.className = 'total-item grand-total';
    grandTotalItem.innerHTML = `<span class="total-label">الاجمالي (قبل الضريبة + السكني):</span>
        <span class="total-value">${newGrandTotal.toLocaleString()} ريال</span>
        <div style="font-size:0.95em;color:#e67e22;margin-top:4px;">تم خصم قيمة الضريبة من الإجمالي</div>`;
    container.appendChild(grandTotalItem);

    // إضافة معلومات الفلتر الحالي
    let filterInfo = '';
    if (currentCountry) filterInfo += `المدينة: ${currentCountry} | `;
    if (currentProperty) filterInfo += `العقار: ${currentProperty} | `;
    if (filterStatus) filterInfo += `الحالة: ${filterStatus} | `;
    if (filterInfo) {
        filterInfo = filterInfo.slice(0, -3);
        const filterInfoItem = document.createElement('div');
        filterInfoItem.className = 'filter-info';
        filterInfoItem.innerHTML = `<span>الفلتر الحالي: ${filterInfo}</span>`;
        container.appendChild(filterInfoItem);
    }
}

// إضافة عنصر إحصائي
function addTotalItem(container, label, value, extraClass = '') {
    const item = document.createElement('div');
    item.className = 'total-item' + (extraClass ? ' ' + extraClass : '');
    item.innerHTML = `<span class="total-label">${label}:</span> <span class="total-value">${value}</span>`;
    container.appendChild(item);
}

// حساب حالة العقار
function calculateStatus(property) {
    // إذا كان اسم المستأجر أو المالك فارغ، اعتبره فارغ
    if (!property['اسم المستأجر'] || !property['المالك']) {
        return { 
            final: 'فارغ',
            display: 'فارغ'
        };
    }
    
    // استخدام الحالة المخزنة إذا كانت موجودة
    if (property['الحالة النهائية'] && property['الحالة الجديدة']) {
        return {
            final: property['الحالة النهائية'],
            display: property['الحالة الجديدة']
        };
    }
    
    return { final: '', display: '' };
}

// عرض البيانات في جدول
function renderTable(data) {
    const container = document.getElementById('content');
    if (data.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">لا توجد بيانات</div>';
        return;
    }

    // تجميع البيانات حسب رقم العقد واسم العقار
    const groupedData = {};
    data.forEach(property => {
        const key = `${property['رقم العقد']}_${property['اسم العقار']}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                ...property,
                units: [property['رقم الوحدة ']],
                meters: [property['رقم عداد الكهرباء']], // إضافة مصفوفة لأرقام العدادات
                totalUnits: 1,
                الاجمالى: property['الاجمالى'],
                totalArea: parseFloat(property['المساحة']) || 0
            };
        } else {
            groupedData[key].units.push(property['رقم الوحدة ']);
            // إضافة رقم العداد إذا كان موجوداً ولم يكن مكرراً
            if (property['رقم عداد الكهرباء'] && !groupedData[key].meters.includes(property['رقم عداد الكهرباء'])) {
                groupedData[key].meters.push(property['رقم عداد الكهرباء']);
            }
            groupedData[key].totalUnits++;
            groupedData[key].totalArea += parseFloat(property['المساحة']) || 0;
        }
    });

    let html = '<div class="table-container"><table>';
    const orderedFields = [
        'رقم الوحدة ',
        'اسم العقار',
        'المدينة',
        'رقم الصك',
        'المساحة',
        'الارتفاع',
        'رقم عداد الكهرباء',
        'اسم المستأجر',
        'رقم العقد',
        'نوع العقد',
        'تاريخ البداية',
        'تاريخ النهاية',
        'المالك',
        'الحالة',
        'الاجمالى',
        'موقع العقار'
    ];
    // لاحظ أننا لم نضف 'مساحة الصك' إلى القائمة

    // رؤوس الأعمدة
    html += '<tr>';
    orderedFields.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '<th>الإجراءات</th>';
    html += '</tr>';

    Object.values(groupedData).forEach((property) => {
        const status = calculateStatus(property);
        let statusClass = '';
        if (status.final === 'جاري') statusClass = 'active-status';
        else if (status.final === 'منتهى') statusClass = 'expired-status';
        else if (status.final === 'على وشك') statusClass = 'pending-status';
        else if (status.final === 'فارغ') statusClass = 'empty-status';

        html += '<tr>';
        orderedFields.forEach(field => {
            if (field === 'رقم الوحدة ') {
                const unitsDisplay = property.units.filter(Boolean).map(unit => 
                    `<span class="unit-link" onclick="showUnitDetails('${unit}', '${property['اسم العقار']}', '${property['رقم العقد']}')">${unit}</span>`
                ).join(' , ') +
                (property.totalUnits > 1 ? `<span class="units-count"> (${property.totalUnits} وحدات)</span>` : '');
                html += `<td>${unitsDisplay}</td>`;
            } else if (field === 'رقم عداد الكهرباء') {
                const metersDisplay = property.meters.filter(Boolean).map(meter => 
                    `<span class="meter-link" onclick="showMeterDetails('${meter}', '${property['اسم العقار']}', '${property['رقم العقد']}')">${meter}</span>`
                ).join(' , ') +
                (property.meters.length > 1 ? `<span class="meters-count">(${property.meters.length} عدادات)</span>` : '');
                html += `<td>${metersDisplay}</td>`;
            } else if (field === 'المساحة') {
                html += `<td>${property.totalArea ? property.totalArea.toLocaleString() : ''}</td>`;
            } else if (field === 'الحالة') {
                html += `<td class="${statusClass}">${status.display || ''}</td>`;
            } else if (field === 'الاجمالى') {
                if (property['نوع العقد'] === 'ضريبي') {
                    const baseAmount = property[field] / 1.15;
                    const vatAmount = property[field] - baseAmount;
                    html += `<td>
                        <div>المبلغ الخاضع: ${parseFloat(baseAmount).toFixed(2).toLocaleString()} ريال</div>
                        <div>الضريبة (15%): ${parseFloat(vatAmount).toFixed(2).toLocaleString()} ريال</div>
                        <div><strong>الإجمالي: ${parseFloat(property[field]).toLocaleString()} ريال</strong></div>
                    </td>`;}
                else {
                    html += `<td>${property[field] ? parseFloat(property[field]).toLocaleString() + ' ريال' : ''}</td>`;
                }
            } else if (field === 'موقع العقار' && property[field]) {
                html += `<td><a href="#" onclick="openLocation('${property[field]}'); return false;" class="location-link">الخريطة <i class="fas fa-map-marker-alt"></i></a></td>`;
            } else {
                html += `<td>${property[field] || ''}</td>`;
            }
        });
        
        // أزرار الإجراءات
        html += `<td>
            <button onclick="showPropertyDetailsByKey('${property['رقم العقد']}', '${property['اسم العقار']}')">
                <i class="fas fa-eye"></i> عرض التفاصيل
            </button>
            <button onclick="showPrintOptions('${property['رقم العقد']}', '${property['اسم العقار']}')" class="table-action-btn"><i class="fas fa-print"></i></button>
            ${property['موقع العقار'] ? `<button onclick="openLocation('${property['موقع العقار']}')" class="table-action-btn"><i class="fas fa-map-marker-alt"></i></button>` : ''}
        </td>`;
        html += '</tr>';
    });

    html += '</table></div>';
    container.innerHTML = html;
}

// عرض البيانات في بطاقات
function renderCards(data) {
    const container = document.getElementById('content');
    
    if (data.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">لا توجد بيانات</div>';
        return;
    }

    const groupedData = {};
    data.forEach(property => {
        const key = `${property['رقم العقد']}_${property['اسم العقار']}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                ...property,
                units: [property['رقم الوحدة ']],
                meters: [property['رقم عداد الكهرباء']], // إضافة مصفوفة لأرقام العدادات
                totalUnits: 1,
                الاجمالى: property['الاجمالى'],
                totalArea: parseFloat(property['المساحة']) || 0
            };
        } else {
            groupedData[key].units.push(property['رقم الوحدة ']);
            // إضافة رقم العداد إذا كان موجوداً ولم يكن مكرراً
            if (property['رقم عداد الكهرباء'] && !groupedData[key].meters.includes(property['رقم عداد الكهرباء'])) {
                groupedData[key].meters.push(property['رقم عداد الكهرباء']);
            }
            groupedData[key].totalUnits++;
            groupedData[key].totalArea += parseFloat(property['المساحة']) || 0;
        }
    });
    
    let html = '<div class="cards-container">';
    Object.values(groupedData).forEach((property) => {  // حذف index من البارامترات
        const status = calculateStatus(property);
        let headerClass = '';
        let badgeClass = '';
        let badgeIcon = '';
        let displayStatus = status.display;
        
        switch(status.final) {
            case 'جاري':
                headerClass = 'active-status';
                badgeClass = 'active-badge';
                badgeIcon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'منتهى':
                headerClass = 'expired-status';
                badgeClass = 'expired-badge';
                badgeIcon = '<i class="fas fa-times-circle"></i>';
                break;
            case 'على وشك':
                headerClass = 'pending-status';
                badgeClass = 'pending-badge';
                badgeIcon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'فارغ':
                headerClass = 'empty-status';
                badgeClass = 'empty-badge';
                badgeIcon = '<i class="fas fa-minus-circle"></i>';
                break;
        }

        // تنسيق التواريخ حسب الحالة
        let startColor = '', endColor = '';
        switch(status.final) {
            case 'جاري':
                startColor = 'background:#e8f7ef;color:#2a4b9b;';
                endColor = 'background:#e8f7ef;color:#2a4b9b;';
                break;
            case 'منتهى':
                startColor = 'background:#fbeee6;color:#e74c3c;';
                endColor = 'background:#fbeee6;color:#e74c3c;';
                break;
            case 'على وشك':
                startColor = 'background:#fffbe6;color:#f39c12;';
                endColor = 'background:#fffbe6;color:#f39c12;';
                break;
            default:
                startColor = 'background:#f6f6f6;color:#333;';
                endColor = 'background:#f6f6f6;color:#333;';
        }
        
        html += `
        <div class="property-card">
            <div class="card-header ${headerClass}">
                <span>${property['اسم العقار'] || ''}</span>
                <span>${property['نوع العقد'] || ''}</span>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">رقم الوحدة:</span>
                    <span class="card-value multiple-units">
                        ${property.units.map(unit => `
                            <span class="unit-link" onclick="showUnitDetails('${unit}', '${property['اسم العقار']}', '${property['رقم العقد']}')">${unit}</span>
                        `).join(' , ')}
                        ${property.totalUnits > 1 ? `<span class="units-count"> (${property.totalUnits} وحدات)</span>` : ''}
                    </span>
                </div>
                <div class="card-row">
                    <span class="card-label">المساحة:</span>
                    <span class="card-value">${property.totalArea ? property.totalArea.toLocaleString() : ''}</span>
                </div>
                ${property['رقم عداد الكهرباء'] ? `
                <div class="card-row electric-meter-row">
                    <span class="card-label"><i class="fas fa-bolt"></i> رقم عداد الكهرباء:</span>
                    <span class="card-value multiple-meters">
                        ${property.meters.filter(Boolean).map(meter => `
                            <span class="meter-link" onclick="showMeterDetails('${meter}', '${property['اسم العقار']}', '${property['رقم العقد']}')">${meter}</span>
                        `).join(' , ')}
                        ${property.meters.length > 1 ? `<span class="meters-count">(${property.meters.length} عدادات)</span>` : ''}
                    </span>
                </div>` : ''}
                <div class="card-row">
                    <span class="card-label">اسم المستأجر:</span>
                    <span class="card-value">${property['اسم المستأجر'] || ''}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">المالك:</span>
                    <span class="card-value">${property['المالك'] || ''}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">رقم العقد:</span>
                    <span class="card-value">${property['رقم العقد'] || ''}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">تاريخ البداية:</span>
                    <span class="card-value" style="${startColor} padding:4px 8px; border-radius:4px;">
                        ${property['تاريخ البداية'] || ''}
                    </span>
                </div>
                <div class="card-row">
                    <span class="card-label">تاريخ النهاية:</span>
                    <span class="card-value" style="${endColor} padding:4px 8px; border-radius:4px;">
                        ${property['تاريخ النهاية'] || ''}
                    </span>
                </div>
                <div class="card-row">
                    <span class="card-label">حالة الوحدة:</span>
                    <span class="status-value ${badgeClass}">
                        ${badgeIcon} ${displayStatus || ''}
                    </span>
                </div>
                <div class="card-row">
                    <span class="card-label">الاجمالى:</span>
                    <span class="card-value">${parseFloat(property.الاجمالى).toLocaleString()} ريال</span>
                </div>
                <div class="card-row">
                    <span class="card-label">المدينة:</span>
                    <span class="card-value">${property['المدينة'] || ''}</span>
                </div>
            </div>
            <div class="card-footer">
                <button onclick="showPropertyDetailsByKey('${property['رقم العقد']}', '${property['اسم العقار']}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button onclick="showPrintOptions('${property['رقم العقد']}', '${property['اسم العقار']}')">
                    <i class="fas fa-print"></i> طباعة
                </button>
                ${property['موقع العقار'] ? 
                    `<button onclick="openLocation('${property['موقع العقار']}')" class="location-btn">
                        <i class="fas fa-map-marker-alt"></i> الموقع
                    </button>` : 
                    ''}
            </div>
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// فتح موقع العقار
function openLocation(location) {
    // تحقق مما إذا كان الموقع يحتوي على رابط URL
    if (location.startsWith('http://') || location.startsWith('https://')) {
        window.open(location, '_blank');
    } else {
        // إذا لم يكن رابطًا، ابحث عنه في خرائط جوجل
        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
        window.open(googleMapsUrl, '_blank');
    }
}

// عرض تفاصيل العقار
function showPropertyDetails(index) {
    const property = properties[index];
    if (!property) return;
    
    const status = calculateStatus(property);
    let statusClass = '';
    let badgeIcon = '';
    
    if (status.final === 'جاري') {
        statusClass = 'active-status';
        badgeIcon = '<i class="fas fa-check-circle"></i>';
    } else if (status.final === 'منتهى') {
        statusClass = 'expired-status';
        badgeIcon = '<i class="fas fa-times-circle"></i>';
    } else if (status.final === 'على وشك') {
        statusClass = 'pending-status';
        badgeIcon = '<i class="fas fa-exclamation-circle"></i>';
    }

    // تجميع الوحدات والمساحة لنفس العقد
    const contractKey = `${property['رقم العقد']}_${property['اسم العقار']}`;
    const related = properties.filter(
        p => `${p['رقم العقد']}_${p['اسم العقار']}` === contractKey
    );
    const allUnits = related.map(p => p['رقم الوحدة ']).filter(Boolean);
    const totalArea = related.reduce((sum, p) => sum + (parseFloat(p['المساحة']) || 0), 0);

    let html = '<div class="modal-overlay" style="display:flex;"><div class="modal-box"><button class="close-modal" onclick="closeModal()">×</button>';
    html += `<h3>${property['اسم العقار'] || ''}</h3>`;
    html += '<div class="property-details">';

    // رقم الوحدة (جميع الوحدات)
    html += `
    <div class="detail-row">
        <span class="detail-label">رقم الوحدة:</span>
        <span class="detail-value">${allUnits.join(' , ')}${allUnits.length > 1 ? ` <span class="units-count">(${allUnits.length} وحدات)</span>` : ''}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">المساحة المجمعة:</span>
        <span class="detail-value">${totalArea ? totalArea.toLocaleString() : '0'} م²</span>
    </div>
    `;

    // باقي الحقول
    Object.entries(property).forEach(([key, value]) => {
        if (key === 'Column1' || key === 'رقم الوحدة ' || key === 'المساحة') return;
        if (!value && value !== 0) return;
        let displayValue = value;
        if (key === 'الاجمالى' && value) {
            displayValue = parseFloat(value).toLocaleString() + ' ريال';
        } else if (key === 'الحالة النهائية' || key === 'الحالة الجديدة') {
            return;
        } else if (key === 'موقع العقار' && value) {
            let url = value;
            if (!url.startsWith('http')) {
                url = `https://www.google.com/maps/search/${encodeURIComponent(url)}`;
            }
            displayValue = `<a href="${url}" target="_blank" class="location-link">الخريطة <i class="fas fa-map-marker-alt"></i></a>`;
        }
        html += `
        <div class="detail-row">
            <span class="detail-label">${key}:</span>
            <span class="detail-value">${displayValue}</span>
        </div>
        `;
    });

    // إضافة الحالة بشكل مخصص
    html += `
    <div class="detail-row ${statusClass}">
        <span class="detail-label">الحالة:</span>
        <span class="detail-value">${badgeIcon} ${status.display || ''}</span>
    </div>
    `;

    // إضافة المبلغ الخاضع للضريبة وقيمة الضريبة
    if (property['الاجمالى']) {
        if (property['نوع العقد'] === 'ضريبي') {
            const baseAmount = property['الاجمالى'] / 1.15;
            const vatAmount = property['الاجمالى'] - baseAmount;
            html += `
            <div class="detail-row">
                <span class="detail-label">المبلغ الخاضع للضريبة:</span>
                <span class="detail-value">${parseFloat(baseAmount).toFixed(2).toLocaleString()} ريال</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">قيمة الضريبة (15%):</span>
                <span class="detail-value">${parseFloat(vatAmount).toFixed(2).toLocaleString()} ريال</span>
            </div>
            <div class="detail-row" style="font-weight: bold;">
                <span class="detail-label">الإجمالي شامل الضريبة:</span>
                <span class="detail-value" style="color: #2a4b9b;">
                    ${parseFloat(property['الاجمالى']).toLocaleString()} ريال
                </span>
            </div>`;
        } else {
            html += `
            <div class="detail-row">
                <span class="detail-label">الإجمالي:</span>
                <span class="detail-value" style="color: #2a4b9b; font-weight: bold;">
                    ${parseFloat(property['الاجمالى']).toLocaleString()} ريال
                </span>
            </div>`;
        }
    }

    // عرض موقع العقار إذا كان متوفراً
    if (property['موقع العقار']) {
        html += `
        <div class="detail-row">
            <span class="detail-label">موقع العقار:</span>
            <span class="detail-value">
                <a href="#" onclick="openLocation('${property['موقع العقار']}'); return false;" 
                   class="location-link">فتح الخريطة <i class="fas fa-map-marker-alt"></i></a>
            </span>
        </div>`;
    }

    html += `</div>`;

    // أزرار الإجراءات
    html += `
    <div class="modal-actions">
        <button onclick="showPrintOptions(${index})" class="modal-action-btn print-btn"><i class="fas fa-print"></i> طباعة</button>
        ${property['موقع العقار'] ? `<button onclick="openLocation('${property['موقع العقار']}')" class="modal-action-btn location-btn"><i class="fas fa-map-marker-alt"></i> فتح الموقع</button>` : ''}
        <button onclick="closeModal()" class="modal-action-btn close-btn"><i class="fas fa-times"></i> إغلاق</button>
    </div>
    `;
    html += '</div></div>';
    document.body.insertAdjacentHTML('beforeend', html);

    // حدث إغلاق المودال
    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // توسيع منطقة إغلاق النافذة حول X
    const closeBtn = document.querySelector('.modal-overlay:last-child .close-modal');
    if (closeBtn) {
        closeBtn.style.padding = '15px';
        closeBtn.style.margin = '-15px';
    }
}

// طباعة العقار
function printProperty(index) {
    const property = properties[index];
    if (!property) return;
    
    const status = calculateStatus(property);
    
    const printWindow = window.open('', '_blank');
    
    let printContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>طباعة العقار - ${property['اسم العقار'] || ''}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
            body {
                font-family: 'Tajawal', sans-serif;
                padding: 20px;
                direction: rtl;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #2a4b9b;
            }
            .property-details {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .property-details th, .property-details td {
                padding: 10px;
                border: 1px solid #ddd;
                text-align: right;
            }
            .property-details th {
                background-color: #333;
                color: white;
                font-weight: bold;
                width: 30%;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9rem;
                color: #777;
            }
            .status-active { color: #28a745; font-weight: bold; }
            .status-expired { color: #e74c3c; font-weight: bold; }
            .status-pending { color: #f39c12; font-weight: bold; }
            .status-empty { color: #666; font-weight: bold; }
            
            @media print {
                .property-details th {
                    background-color: #333 !important;
                    color: white !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>تفاصيل العقار</h1>
            <h2>${property['اسم العقار'] || ''}</h2>
        </div>
        
        <table class="property-details">`;
        
    // إضافة جميع الحقول التي تحتوي على بيانات فقط
    Object.entries(property).forEach(([key, value]) => {
        if (key === 'Column1') return; // تخطي الحقول غير المهمة
        if (!value && value !== 0) return; // تخطي الحقول الفارغة
        
        let displayValue = value;
        
        if (key === 'الاجمالى' && value) {
            displayValue = parseFloat(value).toLocaleString() + ' ريال';
        } else if (key === 'الحالة النهائية' || key === 'الحالة الجديدة') {
            return; // تخطي حقول الحالة لأننا سنعرضها بشكل مخصص
        } else if (key === 'موقع العقار' && value) {
            let url = value;
            if (!url.startsWith('http')) {
                url = `https://www.google.com/maps/search/${encodeURIComponent(url)}`;
            }
            displayValue = `<a href="${url}" target="_blank" class="location-link">الخريطة <i class="fas fa-map-marker-alt"></i></a>`;
        }
        
        printContent += `
            <tr>
                <th>${key}</th>
                <td>${displayValue}</td>
            </tr>`;
    });
    
    // إضافة الحالة
    let statusClass = '';
    if (status.final === 'جاري') {
        statusClass = 'status-active';
    } else if (status.final === 'منتهى') {
        statusClass = 'status-expired';
    } else if (status.final === 'على وشك') {
        statusClass = 'status-pending';
    } else if (status.final === 'فارغ') {
        statusClass = 'status-empty';
    }
    
    printContent += `
            <tr>
                <th>الحالة</th>
                <td class="${statusClass}">${status.display}</td>
            </tr>
        </table>
        
        <div class="footer">
            <p>تمت طباعة هذا المستند من نظام شركة السنيدي العقارية</p>
            <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        <script>
            window.onload = function() {
                window.print();
            }
        </script>
    </body>
    </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// نافذة كلمة المرور مع تأثير blur
document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem('auth_ok')) {
        showPasswordModal();
    }
});

function showPasswordModal() {
    // أضف طبقة البلور والمودال
    const blurDiv = document.createElement('div');
    blurDiv.id = 'blur-overlay';
    blurDiv.innerHTML = `
      <div class="password-modal">
        <h2>الرجاء إدخال كلمة المرور</h2>
        <input type="password" id="passwordInput" placeholder="كلمة المرور" autocomplete="off" />
        <br>
        <button onclick="checkPassword()">دخول</button>
        <div class="error" id="passwordError"></div>
      </div>
    `;
    document.body.appendChild(blurDiv);

    // منع التفاعل مع الصفحة
    document.body.style.overflow = 'hidden';

    // إدخال تلقائي بالفوكس
    setTimeout(() => {
        document.getElementById('passwordInput').focus();
    }, 100);

    // إدخال بالإنتر
    document.getElementById('passwordInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') checkPassword();
    });
}

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorDiv = document.getElementById('passwordError');
    if (input.value === 'sa12345') {
        sessionStorage.setItem('auth_ok', '1');
        document.getElementById('blur-overlay').remove();
        document.body.style.overflow = '';
    } else {
        errorDiv.textContent = 'كلمة المرور غير صحيحة';
        input.value = '';
        input.focus();
    }
}

// إغلاق المودال
function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.remove();
    });
}

// تعديل دالة showPrintOptions
function showPrintOptions(contractNumber, propertyName) {
    // البحث عن العقار المطلوب
    const property = properties.find(p => 
        p['رقم العقد'] === contractNumber && 
        p['اسم العقار'] === propertyName
    );
    
    if (!property) return;
    
    let html = `
    <div class="modal-overlay" style="display:flex;">
        <div class="modal-box">
            <button class="close-modal" onclick="closeModal()">×</button>
            <h3>اختر البيانات المراد طباعتها</h3>
            <div class="print-options">
                <div class="select-actions">
                    <button onclick="selectAllFields()" class="select-btn select-all">
                        <i class="fas fa-check-double"></i>
                        تحديد الكل
                    </button>
                    <button onclick="deselectAllFields()" class="select-btn deselect-all">
                        <i class="fas fa-times"></i>
                        إلغاء التحديد
                    </button>
                </div>
                <div class="fields-container">`;
    
    // إضافة جميع الحقول الممكنة كخيارات
    Object.keys(property).forEach(key => {
        if (key !== 'Column1') {
            html += `
            <label class="field-option">
                <input type="checkbox" name="printFields" value="${key}" checked>
                <span>${key}</span>
            </label>`;
        }
    });
    
    html += `
                </div>
                <div class="print-actions">
                    <button onclick="executePrint('${contractNumber}', '${propertyName}')" class="modal-action-btn print-btn">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                    <button onclick="closeModal()" class="modal-action-btn close-btn">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function selectAllFields() {
    document.querySelectorAll('input[name="printFields"]').forEach(cb => cb.checked = true);
}

function deselectAllFields() {
    document.querySelectorAll('input[name="printFields"]').forEach(cb => cb.checked = false);
}

// تعديل دالة executePrint
function executePrint(contractNumber, propertyName) {
    // البحث عن العقار وجميع الوحدات المرتبطة به
    const related = properties.filter(p => 
        p['رقم العقد'] === contractNumber && 
        p['اسم العقار'] === propertyName
    );
    if (related.length === 0) return;

    const property = related[0];
    const status = calculateStatus(property);
    const printWindow = window.open('', '_blank');

    // الحصول على الحقول المحددة فقط
    const selectedFields = Array.from(document.querySelectorAll('input[name="printFields"]:checked')).map(cb => cb.value);

    if (selectedFields.length === 0) {
        alert('الرجاء تحديد حقل واحد على الأقل للطباعة');
        return;
    }

    let printContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>طباعة العقار - ${property['اسم العقار'] || ''}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
            body {
                font-family: 'Tajawal', sans-serif;
                padding: 20px;
                direction: rtl;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #2a4b9b;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ddd;
                text-align: right;
            }
            th {
                background-color: #333;
                color: white;
                font-weight: bold;
                width: 30%;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9rem;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>تفاصيل العقار</h1>
            <h2>${property['اسم العقار'] || ''}</h2>
        </div>
        <table>`;

    // إذا تم اختيار رقم الوحدة، اعرض جميع الوحدات المرتبطة
    if (selectedFields.includes('رقم الوحدة ')) {
        const allUnits = related.map(p => p['رقم الوحدة ']).filter(Boolean);
        if (allUnits.length > 0) {
            printContent += `
                <tr>
                    <th>رقم الوحدة:</th>
                    <td>${allUnits.join(' , ')}${allUnits.length > 1 ? ` (${allUnits.length} وحدات)` : ''}</td>
                </tr>`;
        }
    }

    // طباعة الحقول المحددة فقط
    selectedFields.forEach(key => {
        if (key === 'رقم الوحدة ') return; // تمت طباعتها أعلاه
        let value = property[key];
        if (!value && value !== 0) return;
        let displayValue = value;
        if (key === 'الاجمالى' && value) {
            displayValue = parseFloat(value).toLocaleString() + ' ريال';
        } else if (key === 'الحالة النهائية' || key === 'الحالة الجديدة') {
            return;
        } else if (key === 'موقع العقار' && value) {
            let url = value;
            if (!url.startsWith('http')) {
                url = `https://www.google.com/maps/search/${encodeURIComponent(url)}`;
            }
            displayValue = `<a href="${url}" target="_blank" class="location-link">الخريطة <i class="fas fa-map-marker-alt"></i></a>`;
        }
        printContent += `
            <tr>
                <th>${key}</th>
                <td>${displayValue}</td>
            </tr>`;
    });

    printContent += `
        </table>
        <div class="footer">
            <p>تمت طباعة هذا المستند من نظام شركة السنيدي العقارية</p>
            <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        <script>
            window.onload = function() {
                window.print();
            }
        </script>
    </body>
    </html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    closeModal();
}

// ابحث عن الوحدة في جميع البيانات
function showUnitDetails(unitNumber, propertyName, contractNumber) {
    const unit = properties.find(p => 
        p['رقم الوحدة '] === unitNumber && 
        p['اسم العقار'] === propertyName &&
        p['رقم العقد'] === contractNumber
    );
    if (!unit) return;

    let html = `<div class="modal-overlay" style="display:flex;">
        <div class="modal-box">
            <button class="close-modal" onclick="closeModal()">×</button>
            <h3>بيانات الوحدة (${unitNumber})</h3>
            <div class="property-details">`;

    // عرض فقط الحقول المطلوبة
    html += `
        <div class="detail-row">
            <span class="detail-label">رقم الوحدة:</span>
            <span class="detail-value">${unit['رقم الوحدة '] || ''}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">رقم عداد الكهرباء:</span>
            <span class="detail-value">${unit['رقم عداد الكهرباء'] || ''}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">المساحة:</span>
            <span class="detail-value">${unit['المساحة'] || ''}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">الارتفاع:</span>
            <span class="detail-value">${unit['الارتفاع'] || ''}</span>
        </div>
    `;

    html += '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);

    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// عرض تفاصيل العداد: فقط المشتركين
function showMeterDetails(meterNumber, propertyName, contractNumber) {
    // البحث عن جميع العقود التي تستخدم نفس رقم العداد
    const relatedProperties = properties.filter(p => 
        p['رقم عداد الكهرباء'] === meterNumber
    );

    let html = `<div class="modal-overlay" style="display:flex;">
        <div class="modal-box">
            <button class="close-modal" onclick="closeModal()">×</button>
            <h3>المشتركين في عداد (${meterNumber})</h3>
            <div class="meter-details">`;

    // عرض العقود المرتبطة بهذا العداد فقط
    if (relatedProperties.length > 0) {
        html += `
        <div class="detail-group shared-meter">
            ${relatedProperties.map(prop => `
                <div class="shared-contract" onclick="showPropertyDetailsByKey('${prop['رقم العقد']}', '${prop['اسم العقار']}')">
                    <div class="contract-info">
                        <div>رقم العقد: ${prop['رقم العقد'] || ''}</div>
                        <div>اسم العقار: ${prop['اسم العقار'] || ''}</div>
                        <div>المستأجر: ${prop['اسم المستأجر'] || 'غير محدد'}</div>
                    </div>
                    <i class="fas fa-chevron-left"></i>
                </div>
            `).join('')}
        </div>`;
    } else {
        html += `<div style="text-align:center;">لا يوجد مشتركين آخرين</div>`;
    }

    html += `</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// تصدير إلى Excel
function exportToExcel() {
    // تحضير البيانات المفلترة الحالية
    const filteredData = getFilteredData();
    
    // تحويل البيانات إلى تنسيق مناسب للتصدير
    const headers = [
        'رقم الوحدة',
        'اسم العقار',
        'المدينة',
        'رقم الصك',
        'المساحة',
        'رقم عداد الكهرباء',
        'اسم المستأجر',
        'رقم العقد',
        'نوع العقد',
        'تاريخ البداية',
        'تاريخ النهاية',
        'المالك',
        'الحالة',
        'الاجمالى'
    ];

    // تجميع البيانات بنفس ترتيب العناوين
    const rows = filteredData.map(item => {
        const status = calculateStatus(item);
        return [
            item['رقم الوحدة '] || '',
            item['اسم العقار'] || '',
            item['المدينة'] || '',
            item['رقم الصك'] || '',
            item['المساحة'] || '',
            item['رقم عداد الكهرباء'] || '',
            item['اسم المستأجر'] || '',
            item['رقم العقد'] || '',
            item['نوع العقد'] || '',
            item['تاريخ البداية'] || '',
            item['تاريخ النهاية'] || '',
            item['المالك'] || '',
            status.display || '',
            item['الاجمالى'] ? Number(item['الاجمالى']).toLocaleString() : ''
        ];
    });

    // إنشاء محتوى ملف Excel
    let csvContent = '\ufeff'; // BOM للدعم العربي
    
    // إضافة العناوين
    csvContent += headers.join(',') + '\n';
    
    // إضافة الصفوف
    rows.forEach(row => {
        csvContent += row.map(cell => {
            // معالجة الخلايا التي تحتوي على فواصل
            if (cell && cell.toString().includes(',')) {
                return `"${cell}"`;
            }
            return cell;
        }).join(',') + '\n';
    });

    // إنشاء ملف للتحميل
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // تحضير اسم الملف مع التاريخ الحالي
    const date = new Date().toLocaleDateString('ar-SA').replace(/\//g, '-');
    const filename = `تقرير_العقارات_${date}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// دالة مساعدة للحصول على البيانات المفلترة
function getFilteredData() {
    let data = properties;
    
    // تطبيق الفلاتر الحالية
    if (currentCountry) {
        data = data.filter(p => p.المدينة === currentCountry);
    }
    if (currentProperty) {
        data = data.filter(p => p['اسم العقار'] === currentProperty);
    }
    if (filterStatus) {
        data = data.filter(p => {
            const status = calculateStatus(p);
            return status.final === filterStatus;
        });
    }
    
    // تطبيق فلتر البحث العام
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
    if (searchTerm) {
        data = data.filter(property => {
            return Object.values(property).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            );
        });
    }
    
    return data;
}

// البحث عن العقار المطلوب
function showPropertyDetailsByKey(contractNumber, propertyName) {
    // البحث عن العقار المطلوب
    const property = properties.find(p => 
        p['رقم العقد'] === contractNumber && 
        p['اسم العقار'] === propertyName
    );
    
    if (!property) return;
    
    const status = calculateStatus(property);
    let statusClass = '';
    let badgeIcon = '';
    
    // تحديد تصنيف الحالة
    switch(status.final) {
        case 'جاري':
            statusClass = 'active-status';
            badgeIcon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'منتهى':
            statusClass = 'expired-status';
            badgeIcon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'على وشك':
            statusClass = 'pending-status';
            badgeIcon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'فارغ':
            statusClass = 'empty-status';
            badgeIcon = '<i class="fas fa-minus-circle"></i>';
            break;
    }

    // حساب جميع الوحدات والمساحة المجمعة لهذا العقد/العقار
    const related = properties.filter(
        p => p['رقم العقد'] === contractNumber && p['اسم العقار'] === propertyName
    );
    const allUnits = related.map(p => p['رقم الوحدة ']).filter(Boolean);
    const totalArea = related.reduce((sum, p) => sum + (parseFloat(p['المساحة']) || 0), 0);

    let html = `<div class="modal-overlay" style="display:flex;">
        <div class="modal-box">
            <button class="close-modal" onclick="closeModal()">×</button>
            <h3>${property['اسم العقار'] || ''}</h3>
            <div class="property-details">`;

    // عرض رقم الوحدة (جميع الوحدات)
    html += `
    <div class="detail-row">
        <span class="detail-label">رقم الوحدة:</span>
        <span class="detail-value">${allUnits.join(' , ')}${allUnits.length > 1 ? ` <span class="units-count">(${allUnits.length} وحدات)</span>` : ''}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">المساحة المجمعة:</span>
        <span class="detail-value">${totalArea ? totalArea.toLocaleString() : '0'} م²</span>
    </div>
    `;

    // باقي الحقول
    const basicInfo = [
        { label: 'رقم العقد', key: 'رقم العقد' },
        { label: 'اسم المستأجر', key: 'اسم المستأجر' },
        { label: 'المالك', key: 'المالك' },
        { label: 'المدينة', key: 'المدينة' },
        { label: 'نوع العقد', key: 'نوع العقد' },
        { label: 'رقم عداد الكهرباء', key: 'رقم عداد الكهرباء' },
        { label: 'الارتفاع', key: 'الارتفاع' },
        { label: 'رقم الصك', key: 'رقم الصك' }
    ];

    basicInfo.forEach(info => {
        if (property[info.key]) {
            html += `
            <div class="detail-row">
                <span class="detail-label">${info.label}:</span>
                <span class="detail-value">${property[info.key]}</span>
            </div>`;
        }
    });

    // عرض التواريخ
    if (property['تاريخ البداية']) {
        html += `
        <div class="detail-row">
            <span class="detail-label">تاريخ البداية:</span>
            <span class="detail-value" style="color: #2a4b9b;">${property['تاريخ البداية']}</span>
        </div>`;
    }

    if (property['تاريخ النهاية']) {
        html += `
        <div class="detail-row">
            <span class="detail-label">تاريخ النهاية:</span>
            <span class="detail-value" style="color: #2a4b9b;">${property['تاريخ النهاية']}</span>
        </div>`;
    }

    // عرض الحالة
    html += `
    <div class="detail-row ${statusClass}">
        <span class="detail-label">الحالة:</span>
        <span class="detail-value">${badgeIcon} ${status.display || ''}</span>
    </div>`;

    // إضافة المبلغ الخاضع للضريبة وقيمة الضريبة
    if (property['الاجمالى']) {
        if (property['نوع العقد'] === 'ضريبي') {
            const baseAmount = property['الاجمالى'] / 1.15;
            const vatAmount = property['الاجمالى'] - baseAmount;
            html += `
            <div class="detail-row">
                <span class="detail-label">المبلغ الخاضع للضريبة:</span>
                <span class="detail-value">${parseFloat(baseAmount).toFixed(2).toLocaleString()} ريال</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">قيمة الضريبة (15%):</span>
                <span class="detail-value">${parseFloat(vatAmount).toFixed(2).toLocaleString()} ريال</span>
            </div>
            <div class="detail-row" style="font-weight: bold;">
                <span class="detail-label">الإجمالي شامل الضريبة:</span>
                <span class="detail-value" style="color: #2a4b9b;">
                    ${parseFloat(property['الاجمالى']).toLocaleString()} ريال
                </span>
            </div>`;
        } else {
            html += `
            <div class="detail-row">
                <span class="detail-label">الإجمالي:</span>
                <span class="detail-value" style="color: #2a4b9b; font-weight: bold;">
                    ${parseFloat(property['الاجمالى']).toLocaleString()} ريال
                </span>
            </div>`;
        }
    }

    // عرض موقع العقار إذا كان متوفراً
    if (property['موقع العقار']) {
        html += `
        <div class="detail-row">
            <span class="detail-label">موقع العقار:</span>
            <span class="detail-value">
                <a href="#" onclick="openLocation('${property['موقع العقار']}'); return false;" 
                   class="location-link">فتح الخريطة <i class="fas fa-map-marker-alt"></i></a>
            </span>
        </div>`;
    }

    html += `</div>`;

    // أزرار الإجراءات
    html += `
    <div class="modal-actions">
        <button onclick="showPrintOptions('${property['رقم العقد']}', '${property['اسم العقار']}')" 
                class="modal-action-btn print-btn">
            <i class="fas fa-print"></i> طباعة
        </button>`;
            
    if (property['موقع العقار']) {
        html += `
            <button onclick="openLocation('${property['موقع العقار']}')" 
                    class="modal-action-btn location-btn">
                <i class="fas fa-map-marker-alt"></i> فتح الموقع
            </button>`;
    }
    
    html += `
        <button onclick="closeModal()" class="modal-action-btn close-btn">
            <i class="fas fa-times"></i> إغلاق
        </button>
    </div>
    </div></div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // إضافة مستمع لإغلاق المودال عند النقر خارجه
    document.querySelector('.modal-overlay:last-child').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// CSS الإضافي
const style = document.createElement('style');
style.textContent = `
@media (max-width: 900px) {
  aside {
    width: 90vw !important;
    max-width: 95vw !important;
    min-width: 270px;
    left: unset;
    right: 0;
  }
}
`;
document.head.appendChild(style);
