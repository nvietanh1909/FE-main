import React from 'react';
import { Box, Typography } from '@mui/material';

interface Step {
  label: string;
  sublabel: string;
}

interface ProcedureStepperProps {
  steps: Step[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

export default function ProcedureStepper({ steps, activeStep, onStepChange }: ProcedureStepperProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, mt: 2 }}>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: 80,
            }}
            onClick={() => onStepChange(idx)}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: idx < activeStep ? '#2563eb' : idx === activeStep ? '#fff' : '#e5e7eb',
                border: idx === activeStep ? '3px solid #2563eb' : '2px solid #e5e7eb',
                color: idx < activeStep ? '#fff' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                mb: 0.5,
                transition: 'all 0.2s',
              }}
            >
              {`0${idx + 1}`}
            </Box>
            <Typography fontWeight={600} fontSize={13} color={idx === activeStep ? '#2563eb' : '#222'}>
              {step.label}
            </Typography>
            <Typography fontSize={12} color="#90a4ae" textAlign={'center'}>
              {step.sublabel}
            </Typography>
          </Box>
          {idx < steps.length - 1 && (
            <Box sx={{ flex: 1, height: 3, background: idx < activeStep ? '#2563eb' : '#e5e7eb', mx: 1, borderRadius: 2, minWidth: 32 }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
} 