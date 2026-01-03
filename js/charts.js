// js/charts.js - Chart Creation Utilities

function createChart(canvasId, type, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const chartConfig = {
        type: type,
        data: {
            labels: labels,
            datasets: datasets.map(ds => ({
                ...ds,
                borderWidth: type === 'line' ? 3 : 1,
                pointRadius: type === 'line' ? 5 : 0,
                pointBackgroundColor: 'var(--primary)',
                pointBorderColor: 'white',
                pointBorderWidth: 2
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--text-primary)',
                        font: { size: 14, weight: 500 }
                    }
                }
            },
            scales: type !== 'doughnut' ? {
                y: {
                    ticks: { color: 'var(--text-secondary)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                x: {
                    ticks: { color: 'var(--text-secondary)' },
                    grid: { display: false }
                }
            } : undefined
        }
    };

    // Destroy existing chart
    if (window.chartInstances && window.chartInstances[canvasId]) {
        window.chartInstances[canvasId].destroy();
    }

    if (!window.chartInstances) window.chartInstances = {};
    window.chartInstances[canvasId] = new Chart(ctx, chartConfig);
    return window.chartInstances[canvasId];
}

// Create candle chart data
function getCandleData(ohlc) {
    return {
        labels: ohlc.map((_, i) => `${i + 1}`),
        datasets: [{
            label: 'Price',
            data: ohlc.map(bar => ({
                o: bar.open,
                h: bar.high,
                l: bar.low,
                c: bar.close
            }))
        }]
    };
}

// Format price data for display
function formatPriceData(stock) {
    return {
        symbol: stock.symbol,
        price: `₹${stock.price.toLocaleString()}`,
        change: `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}%`,
        pe: `${stock.pe.toFixed(1)}x`,
        roe: `${stock.roe.toFixed(1)}%`
    };
}