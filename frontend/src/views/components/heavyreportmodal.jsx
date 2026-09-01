import React, { useState, useMemo } from 'react';
import { Modal } from './modal.jsx';
import { Button } from './button.jsx';
import { Download, Cpu, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

/**
 * HeavyReportModal demonstrates Component-Level Dynamic Code Splitting.
 * In an optimized architecture, this heavy component and its data processing algorithms
 * are only downloaded over the wire when the user actually requests an audit report.
 */
export const HeavyReportModal = ({ isOpen, onClose, datasetName = 'Tasks & Projects' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate heavy report calculations & hash creation
      const mockMetrics = [];
      for (let i = 0; i < 500; i++) {
        mockMetrics.push({
          id: `REC-${1000 + i}`,
          hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          score: (Math.random() * 100).toFixed(2),
          category: ['System Core', 'Network Protocol', 'Database Index', 'UI Layer'][i % 4],
          status: ['Optimal', 'Warning', 'Compliant'][i % 3],
        });
      }

      setGeneratedReport({
        timestamp: new Date().toISOString(),
        totalItemsProcessed: mockMetrics.length,
        averageHealthScore: (
          mockMetrics.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / mockMetrics.length
        ).toFixed(2),
        items: mockMetrics.slice(0, 10),
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleDownloadJSON = () => {
    if (!generatedReport) return;
    const blob = new Blob([JSON.stringify(generatedReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 Enterprise Architecture & Audit Report Generator" maxWidth="750px">
      <div>
        <div style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            <Cpu size={18} />
            <span>Component-Level Code Splitting Demonstration</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            This heavy modal with mock analytics engines and export generators is <strong>dynamically chunked</strong>. In optimized mode, its JavaScript chunk was fetched over the network <em>only when you clicked the button</em>.
          </p>
        </div>

        {!generatedReport && !isGenerating && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Generate System Audit for {datasetName}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Computes cryptographic checksums, integrity validations, and metrics distribution across dataset entities.
            </p>
            <Button variant="primary" onClick={generateReport} leftIcon={<RefreshCw size={16} />}>
              Run Heavy Audit Engine
            </Button>
          </div>
        )}

        {isGenerating && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <RefreshCw size={36} className="spin-animation" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Processing 500 Records & Checksums...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Computing dataset integrity matrices</p>
          </div>
        )}

        {generatedReport && !isGenerating && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-success, #10b981)', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              <span>Audit Complete — {generatedReport.totalItemsProcessed} Records Analyzed</span>
            </div>

            <div className="grid-2-col" style={{ marginBottom: '1.25rem' }}>
              <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Average Health Score</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                  {generatedReport.averageHealthScore}%
                </div>
              </div>
              <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Generated Timestamp</span>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  {new Date(generatedReport.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Sample Hash Verification Log</h4>
            <div style={{ maxHeight: '160px', overflowY: 'auto', background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {generatedReport.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span>{item.id} [{item.category}]</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.hash.substring(0, 16)}...</span>
                  <span style={{ color: item.status === 'Optimal' ? '#10b981' : '#f59e0b' }}>{item.status}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="secondary" onClick={generateReport} leftIcon={<RefreshCw size={15} />}>
                Re-Run
              </Button>
              <Button variant="primary" onClick={handleDownloadJSON} leftIcon={<Download size={15} />}>
                Download Audit JSON
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HeavyReportModal;
