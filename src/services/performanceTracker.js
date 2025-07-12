// src/services/performanceTracker.js

class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
    this.currentOperations = new Map();
    this.listeners = new Set();
  }

  // Start tracking an operation
  startOperation(operationId, type = 'generic', metadata = {}) {
    const startTime = performance.now();
    const operation = {
      id: operationId,
      type,
      startTime,
      metadata,
      steps: [],
      marks: new Map()
    };
    
    this.currentOperations.set(operationId, operation);
    
    // Mark in Performance API
    performance.mark(`${operationId}-start`);
    
    return operation;
  }

  // Add a step to an operation
  addStep(operationId, stepName, metadata = {}) {
    const operation = this.currentOperations.get(operationId);
    if (!operation) return;
    
    const stepTime = performance.now();
    const step = {
      name: stepName,
      timestamp: stepTime,
      duration: stepTime - operation.startTime,
      metadata
    };
    
    operation.steps.push(step);
    performance.mark(`${operationId}-${stepName}`);
    
    // Notify listeners
    this.notifyListeners('step', { operationId, step });
  }

  // Mark a specific point in an operation
  mark(operationId, markName) {
    const operation = this.currentOperations.get(operationId);
    if (!operation) return;
    
    const markTime = performance.now();
    operation.marks.set(markName, markTime);
    performance.mark(`${operationId}-${markName}`);
  }

  // End an operation and calculate metrics
  endOperation(operationId, status = 'success', result = null) {
    const operation = this.currentOperations.get(operationId);
    if (!operation) return null;
    
    const endTime = performance.now();
    operation.endTime = endTime;
    operation.duration = endTime - operation.startTime;
    operation.status = status;
    operation.result = result;
    
    // Mark end in Performance API
    performance.mark(`${operationId}-end`);
    
    // Create performance measure
    try {
      performance.measure(
        `${operation.type}-${operationId}`,
        `${operationId}-start`,
        `${operationId}-end`
      );
    } catch (e) {
      console.warn('Performance measure failed:', e);
    }
    
    // Calculate step durations
    let previousTime = operation.startTime;
    operation.steps.forEach((step, index) => {
      step.stepDuration = step.timestamp - previousTime;
      previousTime = step.timestamp;
    });
    
    // Store completed metric
    this.metrics.set(operationId, operation);
    this.currentOperations.delete(operationId);
    
    // Notify listeners
    this.notifyListeners('complete', operation);
    
    // Clean up performance marks after a delay
    setTimeout(() => {
      this.cleanupPerformanceMarks(operationId);
    }, 60000); // Clean up after 1 minute
    
    return operation;
  }

  // Get metrics for a specific operation
  getMetric(operationId) {
    return this.metrics.get(operationId) || this.currentOperations.get(operationId);
  }

  // Get all metrics of a specific type
  getMetricsByType(type) {
    return Array.from(this.metrics.values()).filter(m => m.type === type);
  }

  // Get average metrics for a type
  getAverageMetrics(type) {
    const metrics = this.getMetricsByType(type);
    if (metrics.length === 0) return null;
    
    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    const successCount = metrics.filter(m => m.status === 'success').length;
    
    return {
      count: metrics.length,
      averageDuration: totalDuration / metrics.length,
      successRate: (successCount / metrics.length) * 100,
      minDuration: Math.min(...metrics.map(m => m.duration)),
      maxDuration: Math.max(...metrics.map(m => m.duration))
    };
  }

  // Get recent metrics (last N minutes)
  getRecentMetrics(minutes = 5) {
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    return Array.from(this.metrics.values()).filter(m => 
      (m.startTime + performance.timeOrigin) > cutoffTime
    );
  }

  // Add a listener for performance events
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Remove a listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error('Performance listener error:', e);
      }
    });
  }

  // Clean up performance marks for an operation
  cleanupPerformanceMarks(operationId) {
    const marks = performance.getEntriesByType('mark');
    marks.forEach(mark => {
      if (mark.name.startsWith(operationId)) {
        performance.clearMarks(mark.name);
      }
    });
    
    const measures = performance.getEntriesByType('measure');
    measures.forEach(measure => {
      if (measure.name.includes(operationId)) {
        performance.clearMeasures(measure.name);
      }
    });
  }

  // Export metrics for analysis
  exportMetrics() {
    const allMetrics = Array.from(this.metrics.values());
    return {
      timestamp: new Date().toISOString(),
      metrics: allMetrics,
      summary: {
        total: allMetrics.length,
        byType: this.getMetricsSummaryByType(),
        averages: this.getAllAverageMetrics()
      }
    };
  }

  // Get summary of metrics grouped by type
  getMetricsSummaryByType() {
    const summary = {};
    Array.from(this.metrics.values()).forEach(metric => {
      if (!summary[metric.type]) {
        summary[metric.type] = {
          count: 0,
          totalDuration: 0,
          successCount: 0
        };
      }
      summary[metric.type].count++;
      summary[metric.type].totalDuration += metric.duration;
      if (metric.status === 'success') {
        summary[metric.type].successCount++;
      }
    });
    return summary;
  }

  // Get average metrics for all types
  getAllAverageMetrics() {
    const types = new Set(Array.from(this.metrics.values()).map(m => m.type));
    const averages = {};
    types.forEach(type => {
      averages[type] = this.getAverageMetrics(type);
    });
    return averages;
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
    this.currentOperations.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }

  // Get network timing info
  getNetworkTiming() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return null;
    
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domProcessing: navigation.domComplete - navigation.domLoading,
      total: navigation.loadEventEnd - navigation.fetchStart
    };
  }

  // Monitor resource loading
  getResourceMetrics() {
    const resources = performance.getEntriesByType('resource');
    return resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      duration: resource.duration,
      size: resource.transferSize,
      cached: resource.transferSize === 0 && resource.decodedBodySize > 0
    }));
  }
}

// Create singleton instance
const performanceTracker = new PerformanceTracker();

// Add global error tracking
window.addEventListener('error', (event) => {
  const errorMetric = {
    type: 'error',
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    timestamp: performance.now()
  };
  
  performanceTracker.notifyListeners('error', errorMetric);
});

// Track long tasks (if supported)
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Long task threshold
          performanceTracker.notifyListeners('longTask', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.warn('Long task monitoring not supported:', e);
  }
}

export default performanceTracker;