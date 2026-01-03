// ============================================
// GLOBAL.JS - Universal Functions
// ============================================

let appState = {
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    theme: localStorage.getItem('theme') || 'light',
    stocksData: [],
    selectedStock: null,
    watchlist: JSON.parse(localStorage.getItem('watchlist')) || [],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    alerts: JSON.parse(localStorage.getItem('alerts')) || [],
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTheme();
    setupEventListeners();
    console.log('✅ Bigul AI Trading Suite Initialized');
});

// ============================================
// DATA MANAGEMENT
// ============================================

async function loadData() {
    try {
        const response = await fetch('data/stocks.json');
        if (response.ok) {
            const data = await response.json();
            appState.stocksData = data.stocks;
            console.log(`✅ Loaded ${data.stocks.length} stocks`);
        }
    } catch (error) {
        console.log('Using local mock data');
        loadMockData();
    }
}

function loadMockData() {
    appState.stocksData = [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850, change: 4.2, sector: 'Energy', pe: 18.5, roe: 21.2, rsi: 68 },
        { symbol: 'HDFC', name: 'HDFC Bank', price: 1620, change: 3.1, sector: 'Banking', pe: 21.3, roe: 18.9, rsi: 65 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3850, change: 2.8, sector: 'IT', pe: 25.8, roe: 19.5, rsi: 62 },
        { symbol: 'INFY', name: 'Infosys', price: 1420, change: 2.1, sector: 'IT', pe: 24.2, roe: 18.1, rsi: 58 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 950, change: 1.8, sector: 'Banking', pe: 19.5, roe: 17.2, rsi: 60 },
        { symbol: 'WIPRO', name: 'Wipro', price: 420, change: -1.2, sector: 'IT', pe: 22.1, roe: 16.8, rsi: 45 },
        { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 1680, change: 2.5, sector: 'Finance', pe: 26.3, roe: 20.1, rsi: 70 },
        { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 3245, change: 3.8, sector: 'Paints', pe: 28.5, roe: 15.3, rsi: 72 },
        { symbol: 'LTMINDTREE', name: 'LTIMindtree', price: 4820, change: 1.5, sector: 'IT', pe: 21.8, roe: 19.2, rsi: 55 },
        { symbol: 'SBIN', name: 'State Bank of India', price: 550, change: 2.2, sector: 'Banking', pe: 15.2, roe: 12.1, rsi: 63 },
    ];
}

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
    if (appState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.style.background = '#000810';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.style.background = '';
    }
}

function toggleTheme() {
    appState.darkMode = !appState.darkMode;
    localStorage.setItem('darkMode', appState.darkMode);
    initTheme();
    showNotification('Theme updated');
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
    });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066ff',
        color: 'white',
        borderRadius: '8px',
        zIndex: '3000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

function formatPercent(num) {
    return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
}

function getStockBySymbol(symbol) {
    return appState.stocksData.find(s => s.symbol === symbol);
}

// ============================================
// WATCHLIST MANAGEMENT
// ============================================

function addToWatchlist(symbol) {
    if (!appState.watchlist.includes(symbol)) {
        appState.watchlist.push(symbol);
        localStorage.setItem('watchlist', JSON.stringify(appState.watchlist));
        showNotification(`${symbol} added to watchlist`);
        return true;
    }
    showNotification(`${symbol} already in watchlist`, 'warning');
    return false;
}

function removeFromWatchlist(symbol) {
    appState.watchlist = appState.watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(appState.watchlist));
    showNotification(`${symbol} removed from watchlist`);
}

function isInWatchlist(symbol) {
    return appState.watchlist.includes(symbol);
}

// ============================================
// ALERT MANAGEMENT
// ============================================

function addAlert(symbol, type, value) {
    const alert = {
        id: Date.now(),
        symbol,
        type, // 'price', 'volume', 'news', 'oi'
        value,
        createdAt: new Date().toISOString()
    };
    appState.alerts.push(alert);
    localStorage.setItem('alerts', JSON.stringify(appState.alerts));
    showNotification(`Alert created for ${symbol}`);
    return alert;
}

function removeAlert(id) {
    appState.alerts = appState.alerts.filter(a => a.id !== id);
    localStorage.setItem('alerts', JSON.stringify(appState.alerts));
}

// ============================================
// PAGE NAVIGATION
// ============================================

function navigateTo(page) {
    window.location.href = page + '.html';
}

// ============================================
// ANIMATIONS
// ============================================

function addAnimation(element, animation, duration = 0.5) {
    gsap.to(element, {
        duration,
        ease: 'power2.out',
        ...(animation === 'slideIn' && { x: 0, opacity: 1 }),
        ...(animation === 'fadeIn' && { opacity: 1 }),
        ...(animation === 'scaleIn' && { scale: 1, opacity: 1 })
    });
}

// ============================================
// CHART HELPERS
// ============================================

function createChart(canvasId, chartType, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: chartType,
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'bottom' },
                filler: { propagate: true }
            },
            scales: chartType !== 'doughnut' && chartType !== 'pie' ? {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            } : {},
            ...options
        }
    });
}

// ============================================
// PERFORMANCE METRICS
// ============================================

function calculateMetrics(holdings) {
    let totalCost = 0, totalCurrent = 0;
    holdings.forEach(h => {
        totalCost += h.quantity * h.avgPrice;
        totalCurrent += h.quantity * h.currentPrice;
    });
    return {
        invested: totalCost,
        current: totalCurrent,
        gain: totalCurrent - totalCost,
        gainPercent: ((totalCurrent - totalCost) / totalCost * 100)
    };
}

// ============================================
// API INTEGRATION READY
// ============================================

async function fetchLiveData(endpoint) {
    try {
        // Replace with real API
        const response = await fetch(`https://api.trading.com/${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

console.log('Global.js loaded ✅');