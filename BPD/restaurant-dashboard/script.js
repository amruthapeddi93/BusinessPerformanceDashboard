/* ============================================================
   RasoiPro — Restaurant Performance Dashboard
   script.js
   Sample data, Chart.js configs, counters, dark mode,
   sidebar, search, and UI interactions.
   ============================================================ */

'use strict';

/* ---------- SAMPLE DATA ---------- */
const dashboardData = {
  orders: [
    { id: '#ORD-7841', customer: 'Priya Sharma', item: 'Chicken Biryani', amount: 280, status: 'Delivered' },
    { id: '#ORD-7842', customer: 'Rahul Verma', item: 'Margherita Pizza', amount: 350, status: 'Preparing' },
    { id: '#ORD-7843', customer: 'Ananya Reddy', item: 'Classic Burger', amount: 199, status: 'Ready' },
    { id: '#ORD-7844', customer: 'Vikram Singh', item: 'Pasta Alfredo', amount: 320, status: 'Delivered' },
    { id: '#ORD-7845', customer: 'Meera Iyer', item: 'Fried Rice', amount: 220, status: 'Cancelled' },
    { id: '#ORD-7846', customer: 'Aditya Nair', item: 'Chicken Biryani', amount: 280, status: 'Preparing' },
    { id: '#ORD-7847', customer: 'Sneha Patel', item: 'BBQ Pizza', amount: 399, status: 'Delivered' },
    { id: '#ORD-7848', customer: 'Rohan Gupta', item: 'Cheese Burger', amount: 249, status: 'Ready' },
    { id: '#ORD-7849', customer: 'Kavya Desai', item: 'Veg Pasta', amount: 290, status: 'Delivered' },
    { id: '#ORD-7850', customer: 'Arjun Malhotra', item: 'Special Fried Rice', amount: 250, status: 'Preparing' }
  ],

  menu: [
    { name: 'Chicken Biryani', rating: 4.9, price: 280, sold: 342, icon: '🍛', class: 'biryani' },
    { name: 'Margherita Pizza', rating: 4.7, price: 350, sold: 298, icon: '🍕', class: 'pizza' },
    { name: 'Classic Burger', rating: 4.6, price: 199, sold: 275, icon: '🍔', class: 'burger' },
    { name: 'Pasta Alfredo', rating: 4.8, price: 320, sold: 231, icon: '🍝', class: 'pasta' },
    { name: 'Fried Rice', rating: 4.5, price: 220, sold: 210, icon: '🍚', class: 'rice' }
  ],

  inventory: [
    { name: 'Rice', icon: 'fa-wheat-awn', level: 85 },
    { name: 'Chicken', icon: 'fa-drumstick-bite', level: 62 },
    { name: 'Oil', icon: 'fa-bottle-droplet', level: 45 },
    { name: 'Cheese', icon: 'fa-cheese', level: 28 },
    { name: 'Vegetables', icon: 'fa-carrot', level: 73 }
  ],

  charts: {
    revenue: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      data: [125000, 158000, 142000, 189000, 221000, 256000, 193500]
    },
    dishes: {
      labels: ['Chicken Biryani', 'Pizza', 'Burger', 'Pasta', 'Fried Rice'],
      data: [342, 298, 275, 231, 210]
    },
    categories: {
      labels: ['Main Course', 'Snacks', 'Desserts', 'Beverages'],
      data: [42, 25, 18, 15]
    },
    payments: {
      labels: ['UPI', 'Cash', 'Card', 'Wallet'],
      data: [45, 20, 25, 10]
    },
    peakHours: {
      labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
      data: [65, 145, 88, 172]
    }
  }
};

/* ---------- CHART COLOR HELPERS ---------- */
function getChartColors() {
  const isDark = document.body.classList.contains('dark');
  return {
    text: isDark ? '#9AA0A6' : '#636E72',
    grid: isDark ? '#2F3540' : '#E8ECF1',
    primary: '#FF7A00',
    primarySoft: 'rgba(255, 122, 0, 0.15)',
    palette: ['#FF7A00', '#3498DB', '#27AE60', '#9B59B6', '#E74C3C', '#F39C12']
  };
}

/* Store chart instances for theme updates */
const chartInstances = {};

/* ---------- INITIALIZE CHARTS ---------- */
function initCharts() {
  const colors = getChartColors();

  /* 1. Revenue Trend — Line Chart */
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    chartInstances.revenue = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: dashboardData.charts.revenue.labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: dashboardData.charts.revenue.data,
          borderColor: colors.primary,
          backgroundColor: colors.primarySoft,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2D3436',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 12 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Poppins', size: 11 }, color: colors.text }
          },
          y: {
            grid: { color: colors.grid, drawBorder: false },
            ticks: {
              font: { family: 'Poppins', size: 11 },
              color: colors.text,
              callback: (v) => '₹' + (v / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  /* 2. Top Selling Dishes — Bar Chart */
  const dishesCtx = document.getElementById('dishesChart');
  if (dishesCtx) {
    chartInstances.dishes = new Chart(dishesCtx, {
      type: 'bar',
      data: {
        labels: dashboardData.charts.dishes.labels,
        datasets: [{
          label: 'Orders',
          data: dashboardData.charts.dishes.data,
          backgroundColor: [
            '#FF7A00',
            '#FF9A3D',
            '#FFB366',
            '#FFC98F',
            '#FFDFB8'
          ],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2D3436',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 12 },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Poppins', size: 10 }, color: colors.text }
          },
          y: {
            grid: { color: colors.grid, drawBorder: false },
            ticks: { font: { family: 'Poppins', size: 11 }, color: colors.text }
          }
        }
      }
    });
  }

  /* 3. Sales by Category — Pie Chart */
  const categoryCtx = document.getElementById('categoryChart');
  if (categoryCtx) {
    chartInstances.category = new Chart(categoryCtx, {
      type: 'pie',
      data: {
        labels: dashboardData.charts.categories.labels,
        datasets: [{
          data: dashboardData.charts.categories.data,
          backgroundColor: ['#FF7A00', '#3498DB', '#27AE60', '#9B59B6'],
          borderWidth: 3,
          borderColor: document.body.classList.contains('dark') ? '#242830' : '#FFFFFF',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateRotate: true, duration: 1500 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Poppins', size: 11 },
              color: colors.text,
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#2D3436',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 12 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  }

  /* 4. Payment Methods — Doughnut Chart */
  const paymentCtx = document.getElementById('paymentChart');
  if (paymentCtx) {
    chartInstances.payment = new Chart(paymentCtx, {
      type: 'doughnut',
      data: {
        labels: dashboardData.charts.payments.labels,
        datasets: [{
          data: dashboardData.charts.payments.data,
          backgroundColor: ['#FF7A00', '#27AE60', '#3498DB', '#F39C12'],
          borderWidth: 3,
          borderColor: document.body.classList.contains('dark') ? '#242830' : '#FFFFFF',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        animation: { animateRotate: true, duration: 1500 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Poppins', size: 11 },
              color: colors.text,
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#2D3436',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 12 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  }

  /* 5. Peak Order Hours — Horizontal Bar Chart */
  const peakCtx = document.getElementById('peakHoursChart');
  if (peakCtx) {
    chartInstances.peak = new Chart(peakCtx, {
      type: 'bar',
      data: {
        labels: dashboardData.charts.peakHours.labels,
        datasets: [{
          label: 'Orders',
          data: dashboardData.charts.peakHours.data,
          backgroundColor: [
            'rgba(255, 122, 0, 0.5)',
            'rgba(255, 122, 0, 0.7)',
            'rgba(255, 122, 0, 0.55)',
            '#FF7A00'
          ],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 28
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        layout: {
          padding: { left: 8, right: 8 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2D3436',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 12 },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid, drawBorder: false },
            ticks: { font: { family: 'Poppins', size: 11 }, color: colors.text }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: 'Poppins', size: 12, weight: '500' },
              color: colors.text,
              padding: 10,
              crossAlign: 'far'
            },
            afterFit(scale) {
              /* Keep full labels visible (e.g. "Breakfast") */
              scale.width = Math.max(scale.width, 90);
            }
          }
        }
      }
    });
  }
}

/* Update chart colors when theme changes */
function updateChartsTheme() {
  const colors = getChartColors();
  const borderColor = document.body.classList.contains('dark') ? '#242830' : '#FFFFFF';

  Object.values(chartInstances).forEach((chart) => {
    if (!chart) return;

    /* Update axis colors */
    if (chart.options.scales) {
      Object.keys(chart.options.scales).forEach((axis) => {
        if (chart.options.scales[axis].ticks) {
          chart.options.scales[axis].ticks.color = colors.text;
        }
        if (chart.options.scales[axis].grid && chart.options.scales[axis].grid.color) {
          chart.options.scales[axis].grid.color = colors.grid;
        }
      });
    }

    /* Update legend colors */
    if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
      chart.options.plugins.legend.labels.color = colors.text;
    }

    /* Update pie/doughnut borders */
    if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
      chart.data.datasets[0].borderColor = borderColor;
    }

    /* Update line chart fill */
    if (chart.config.type === 'line') {
      chart.data.datasets[0].backgroundColor = colors.primarySoft;
    }

    chart.update('none');
  });
}

/* ---------- RENDER ORDERS TABLE ---------- */
function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = dashboardData.orders.map((order) => {
    const statusClass = 'status-' + order.status.toLowerCase();
    return `
      <tr>
        <td><span class="order-id">${order.id}</span></td>
        <td>${order.customer}</td>
        <td>${order.item}</td>
        <td><span class="amount">₹${order.amount.toLocaleString('en-IN')}</span></td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
      </tr>
    `;
  }).join('');
}

/* ---------- RENDER MENU CARDS ---------- */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  grid.innerHTML = dashboardData.menu.map((dish, i) => `
    <div class="menu-card" style="animation-delay: ${i * 100}ms">
      <div class="menu-img ${dish.class}">
        <div class="food-placeholder">${dish.icon}</div>
      </div>
      <div class="menu-body">
        <h4>${dish.name}</h4>
        <div class="menu-meta">
          <div class="menu-rating">
            <i class="fas fa-star"></i> ${dish.rating}
          </div>
          <div class="menu-price">₹${dish.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="menu-sold">
          <i class="fas fa-shopping-bag"></i> ${dish.sold} orders sold
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- RENDER INVENTORY ---------- */
function renderInventory() {
  const list = document.getElementById('inventoryList');
  if (!list) return;

  list.innerHTML = dashboardData.inventory.map((item) => {
    let levelClass = 'high';
    if (item.level < 40) levelClass = 'low';
    else if (item.level < 60) levelClass = 'medium';

    return `
      <div class="inventory-item">
        <div class="inventory-top">
          <div class="inventory-name">
            <i class="fas ${item.icon}"></i>
            ${item.name}
          </div>
          <span class="inventory-percent ${levelClass}">${item.level}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${levelClass}" data-width="${item.level}"></div>
        </div>
      </div>
    `;
  }).join('');

  /* Animate progress bars after a short delay */
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.progress-fill').forEach((bar) => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 300);
  });
}

/* ---------- ANIMATED COUNTERS ---------- */
function animateCounter(el, target, duration, prefix, suffix, decimals) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    /* Ease-out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;

    const display = decimals > 0
      ? current.toFixed(decimals)
      : Math.floor(current).toLocaleString('en-IN');

    el.textContent = prefix + display + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      const final = decimals > 0
        ? target.toFixed(decimals)
        : target.toLocaleString('en-IN');
      el.textContent = prefix + final + suffix;
    }
  }

  requestAnimationFrame(update);
}

function initCounters() {
  /* KPI value counters */
  document.querySelectorAll('.kpi-value').forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    animateCounter(el, target, 2000, prefix, suffix, decimals);
  });

  /* Review / general counters */
  document.querySelectorAll('.counter, .rating-num').forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    animateCounter(el, target, 1800, '', '', decimals);
  });
}

/* ---------- DARK / LIGHT MODE ---------- */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const settingsToggle = document.getElementById('settingsDarkToggle');
  const saved = localStorage.getItem('rasoipro-theme');

  if (saved === 'dark') {
    document.body.classList.add('dark');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
    if (settingsToggle) settingsToggle.checked = true;
  }

  function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('rasoipro-theme', isDark ? 'dark' : 'light');

    if (themeIcon) {
      themeIcon.classList.toggle('fa-moon', !isDark);
      themeIcon.classList.toggle('fa-sun', isDark);
    }
    if (settingsToggle) settingsToggle.checked = isDark;

    updateChartsTheme();
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setTheme(!document.body.classList.contains('dark'));
    });
  }

  if (settingsToggle) {
    settingsToggle.addEventListener('change', () => {
      setTheme(settingsToggle.checked);
    });
  }
}

/* ---------- SIDEBAR NAVIGATION ---------- */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const navLinks = document.querySelectorAll('.nav-link');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* Active menu + smooth scroll */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const sectionId = link.getAttribute('href');
      const section = document.querySelector(sectionId);

      if (section) {
        const headerOffset = 90;
        const top = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }

      /* Close mobile sidebar after click */
      if (window.innerWidth <= 992) {
        closeSidebar();
      }

      /* Update header title */
      const titleEl = document.querySelector('.header-title h1');
      if (titleEl) {
        titleEl.textContent = link.querySelector('span').textContent;
      }
    });
  });

  /* Highlight active nav on scroll */
  const sections = document.querySelectorAll('section[id], #dashboard');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.pageYOffset >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ---------- SEARCH BAR ---------- */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('focus', () => {
    document.getElementById('searchBar').classList.add('focused');
  });

  searchInput.addEventListener('blur', () => {
    document.getElementById('searchBar').classList.remove('focused');
  });

  /* Filter orders table as user types */
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#ordersTableBody tr');

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ---------- CHIP TOGGLE (Week / Month) ---------- */
function initChips() {
  document.querySelectorAll('.card-actions').forEach((group) => {
    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        /* Demo: swap revenue data for Month view */
        if (chartInstances.revenue) {
          if (chip.textContent.trim() === 'Month') {
            chartInstances.revenue.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            chartInstances.revenue.data.datasets[0].data = [520000, 610000, 580000, 720000];
          } else {
            chartInstances.revenue.data.labels = dashboardData.charts.revenue.labels;
            chartInstances.revenue.data.datasets[0].data = dashboardData.charts.revenue.data;
          }
          chartInstances.revenue.update();
        }
      });
    });
  });
}

/* ---------- INTERSECTION OBSERVER (re-trigger animations) ---------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ---------- BOOTSTRAP APP ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  renderMenu();
  renderInventory();
  initTheme();
  initSidebar();
  initSearch();
  initChips();
  initScrollAnimations();

  /* Charts need Chart.js loaded — slight delay for CDN */
  if (typeof Chart !== 'undefined') {
    initCharts();
  } else {
    console.warn('Chart.js not loaded yet, retrying...');
    setTimeout(initCharts, 500);
  }

  /* Start counters after a brief delay for visual polish */
  setTimeout(initCounters, 200);
});
