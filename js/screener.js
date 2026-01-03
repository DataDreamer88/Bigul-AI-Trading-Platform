// js/screener.js - AI Stock Screener Logic

class AIScreener {
    constructor() {
        this.filters = {};
        this.results = [];
    }

    // Natural language query processor
    processQuery(query) {
        const lowerQuery = query.toLowerCase();
        const filters = {};

        // PE Ratio filters
        if (lowerQuery.includes('cheap') || lowerQuery.includes('undervalue')) {
            filters.peMax = 20;
        }
        if (lowerQuery.includes('expensive')) {
            filters.peMin = 25;
        }

        // Momentum filters
        if (lowerQuery.includes('momentum') || lowerQuery.includes('breakout')) {
            filters.rsiMin = 60;
        }
        if (lowerQuery.includes('overbought')) {
            filters.rsiMin = 70;
        }
        if (lowerQuery.includes('oversold')) {
            filters.rsiMax = 30;
        }

        // ROE filters
        if (lowerQuery.includes('quality') || lowerQuery.includes('high roe')) {
            filters.roeMin = 18;
        }

        // Sector filters
        const sectors = ['banking', 'it', 'pharma', 'energy', 'paints'];
        for (let sector of sectors) {
            if (lowerQuery.includes(sector)) {
                filters.sector = sector.toUpperCase();
            }
        }

        // Price filters
        if (lowerQuery.includes('gainers') || lowerQuery.includes('up')) {
            filters.changeMin = 0;
        }
        if (lowerQuery.includes('losers') || lowerQuery.includes('down')) {
            filters.changeMax = 0;
        }

        return filters;
    }

    // Apply filters to stock data
    filter(stocks, filters) {
        return stocks.filter(stock => {
            if (filters.peMax && stock.pe > filters.peMax) return false;
            if (filters.peMin && stock.pe < filters.peMin) return false;
            if (filters.rsiMax && stock.rsi > filters.rsiMax) return false;
            if (filters.rsiMin && stock.rsi < filters.rsiMin) return false;
            if (filters.roeMin && stock.roe < filters.roeMin) return false;
            if (filters.roeMax && stock.roe > filters.roeMax) return false;
            if (filters.sector && stock.sector !== filters.sector) return false;
            if (filters.changeMin !== undefined && stock.change < filters.changeMin) return false;
            if (filters.changeMax !== undefined && stock.change > filters.changeMax) return false;
            return true;
        });
    }

    // Calculate AI confidence score
    scoreStock(stock, filters) {
        let score = 50; // Base score

        // PE score
        if (stock.pe < 20) score += 10;
        if (stock.pe < 15) score += 5;

        // ROE score
        if (stock.roe > 18) score += 10;
        if (stock.roe > 25) score += 5;

        // RSI score (balanced is better)
        if (stock.rsi > 40 && stock.rsi < 70) score += 10;

        // Momentum
        if (stock.change > 2) score += 5;

        return Math.min(score, 100);
    }
}

// Export for use
const screener = new AIScreener();