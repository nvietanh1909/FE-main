import nprogress from 'nprogress';
import '@/assets/styles/nprogress.css';

// Configure nprogress to hide spinner globally
nprogress.configure({ showSpinner: false });

export const useNProgress = () => {
    const startProgress = () => {
        nprogress.start();
    };

    const doneProgress = () => {
        nprogress.done();
    };

    return { startProgress, doneProgress };
}; 