import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import ProcedureStepper from '@/features-user/procedure/components/ProcedureStepper.tsx';
import ProcedureDetailTable from '@/features-user/procedure/components/ProcedureDetailTable.tsx';
import ChatBot from '@/components/ChatBot.tsx';
import { width } from '@mui/system';

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
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="py-4 px-6">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link underline="none" color="inherit" href="/" className="flex items-center gap-1">
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Link underline="none" color="inherit" href="/procedures">Tra cứu thủ tục</Link>
        <Typography color="#2563eb" fontWeight={600}>Công tác phí trong nước</Typography>
      </Breadcrumbs>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Phần nội dung chính - bên trái */}
        <div style={{ width: '68%' }}>
          <ProcedureStepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
          <div style={{ background: '#fff', borderRadius: 8, marginTop: 20, minHeight: 300, padding: '24px 0px 0px 0px' }}>
            {stepContents[activeStep].map((line, idx) => (
              <Typography key={idx} variant="body2" color="text.secondary">{line}</Typography>
            ))}
            <ProcedureDetailTable data={tableData} />
          </div>
        </div>
        
        {/* Phần chatbot - bên phải */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ChatBot />
        </div>
      </div>
    </div>
  );
} 