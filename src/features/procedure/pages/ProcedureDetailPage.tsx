import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import ProcedureStepper from '@/features/procedure/components/ProcedureStepper.tsx';
import ProcedureDetailTable from '@/features/procedure/components/ProcedureDetailTable.tsx';

const steps = [
  { label: 'Bước 1', sublabel: 'Xây dựng dự toán' },
  { label: 'Bước 2', sublabel: 'Sửa dự toán' },
  { label: 'Bước 3', sublabel: 'Phê duyệt dự toán' },
  { label: 'Bước 4', sublabel: 'Thực hiện dự toán' },
];

const stepContents = [
  ['Nội dung bước 1...'],
  ['Nội dung bước 2...'],
  ['Nội dung bước 3...'],
  ['Nội dung bước 4...'],
];

const tableData = [
  { name: 'Table body', desc: '.........', quantity: 1, note: 'Table body' },
  { name: 'Table body', desc: '.........', quantity: 1, note: 'Table body' },
  { name: 'Table body', desc: '.........', quantity: 2, note: 'Table body' },
  { name: 'Table body', desc: '.........', quantity: 1, note: 'Table body' },
  { name: 'Table body', desc: '.........', quantity: 3, note: 'Table body' },
];

export default function ProcedureDetailPage() {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1); // default step 2 as in screenshot

  return (
    <div className="py-4 px-6">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link underline="none" color="inherit" href="/dashboard" className="flex items-center gap-1">
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Link underline="none" color="inherit" href="/procedures">Tra cứu thủ tục</Link>
        <Typography color="#2563eb" fontWeight={600}>Công tác phí trong nước</Typography>
      </Breadcrumbs>
      <ProcedureStepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
      <div style={{ background: '#fff', borderRadius: 8, marginTop: 20, minHeight: 300, padding: '24px 0px 24px 0px' }}>
        {stepContents[activeStep].map((line, idx) => (
          <Typography key={idx} variant="body2" color="text.secondary">{line}</Typography>
        ))}
        <ProcedureDetailTable data={tableData}  />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, margin: '24px 0 0 0' }}>
          <button
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
            disabled={activeStep === 0}
            style={{
              background: '#e5e7eb',
              color: '#222',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: 600,
              fontSize: 15,
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
              marginRight: 8,
            }}
          >
            Quay lại
          </button>
          <button
            onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={activeStep === steps.length - 1}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: 600,
              fontSize: 15,
              cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Xong bước này
          </button>
        </div>
      </div>
    </div>
  );
} 