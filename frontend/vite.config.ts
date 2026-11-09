import { defineConfig } from 'vite';
export default defineConfig({build:{minify:false},server:{port:5175,proxy:{'/api':'http://127.0.0.1:8085'}}});
