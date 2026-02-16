import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                guide: 'guide.html',
                about: 'about.html',
                privacy: 'privacy.html',
                terms: 'terms.html'
            }
        }
    }
});
